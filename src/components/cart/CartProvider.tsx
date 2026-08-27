'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import { CART_STORAGE_KEY, MAX_CART_ITEMS, MAX_LINE_QUANTITY } from '@/lib/constants'
import { priceForVolume } from '@/lib/order'
import type { CartItem, VolumeMl } from '@/lib/types'

interface CartContextValue {
  items: CartItem[]
  isOpen: boolean
  checkoutOpen: boolean
  clientRequestId: string
  itemCount: number
  previewTotal: number
  openCart: () => void
  closeCart: () => void
  openCheckout: () => void
  closeCheckout: () => void
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  setQuantity: (offerId: string, volumeMl: VolumeMl, quantity: number) => void
  removeItem: (offerId: string, volumeMl: VolumeMl) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)
const EMPTY_CART: CartItem[] = []
const CART_EVENT = 'lumira-cart-change'

let cachedRaw: string | null | undefined
let cachedItems: CartItem[] = EMPTY_CART

function parseCart(raw: string | null): CartItem[] {
  if (!raw) return EMPTY_CART
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return EMPTY_CART
    const items = parsed.filter((item): item is CartItem => {
      return (
        typeof item === 'object' &&
        item !== null &&
        typeof (item as CartItem).offerId === 'string' &&
        typeof (item as CartItem).volumeMl === 'number'
      )
    })
    return items.length > 0 ? items : EMPTY_CART
  } catch {
    return EMPTY_CART
  }
}

function readStoredCart(): CartItem[] {
  const raw = localStorage.getItem(CART_STORAGE_KEY)
  if (raw === cachedRaw) return cachedItems
  cachedRaw = raw
  cachedItems = parseCart(raw)
  return cachedItems
}

function writeStoredCart(items: CartItem[]): void {
  cachedItems = items.length > 0 ? items : EMPTY_CART
  cachedRaw = JSON.stringify(cachedItems)
  localStorage.setItem(CART_STORAGE_KEY, cachedRaw)
  window.dispatchEvent(new Event(CART_EVENT))
}

function subscribeCart(listener: () => void): () => void {
  window.addEventListener(CART_EVENT, listener)
  window.addEventListener('storage', listener)
  return () => {
    window.removeEventListener(CART_EVENT, listener)
    window.removeEventListener('storage', listener)
  }
}

function sameLine(item: CartItem, offerId: string, volumeMl: VolumeMl): boolean {
  return item.offerId === offerId && item.volumeMl === volumeMl
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribeCart, readStoredCart, () => EMPTY_CART)
  const [isOpen, setIsOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [clientRequestId, setClientRequestId] = useState('')

  const addItem = useCallback((incoming: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const quantity = incoming.quantity ?? 1
    const current = readStoredCart()
    const existing = current.find((item) => sameLine(item, incoming.offerId, incoming.volumeMl))
    const next = existing
      ? current.map((item) =>
          sameLine(item, incoming.offerId, incoming.volumeMl)
            ? { ...item, quantity: Math.min(MAX_LINE_QUANTITY, item.quantity + quantity) }
            : item
        )
      : current.length >= MAX_CART_ITEMS
        ? current
        : [...current, { ...incoming, quantity }]
    writeStoredCart(next)
    setIsOpen(true)
  }, [])

  const setQuantity = useCallback((offerId: string, volumeMl: VolumeMl, quantity: number) => {
    writeStoredCart(
      readStoredCart().map((item) =>
        sameLine(item, offerId, volumeMl)
          ? { ...item, quantity: Math.min(MAX_LINE_QUANTITY, Math.max(1, quantity)) }
          : item
      )
    )
  }, [])

  const removeItem = useCallback((offerId: string, volumeMl: VolumeMl) => {
    writeStoredCart(readStoredCart().filter((item) => !sameLine(item, offerId, volumeMl)))
  }, [])

  const clearCart = useCallback(() => {
    writeStoredCart([])
  }, [])

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  )
  const previewTotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + priceForVolume(item.previewPricePerMl, item.volumeMl) * item.quantity,
        0
      ),
    [items]
  )

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      checkoutOpen,
      clientRequestId,
      itemCount,
      previewTotal,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      openCheckout: () => {
        setClientRequestId(crypto.randomUUID())
        setCheckoutOpen(true)
      },
      closeCheckout: () => setCheckoutOpen(false),
      addItem,
      setQuantity,
      removeItem,
      clearCart,
    }),
    [
      items,
      isOpen,
      checkoutOpen,
      clientRequestId,
      itemCount,
      previewTotal,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
    ]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
