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
import { CART_STORAGE_KEY, FIRST_ADD_SESSION_KEY, MAX_CART_ITEMS, MAX_LINE_QUANTITY } from '@/lib/constants'
import { priceForVolume } from '@/lib/order'
import { useToast } from '@/components/ui/Toast'
import type { CartItem, VolumeMl } from '@/lib/types'

interface AddItemResult {
  added: boolean
  limitReached: boolean
}

interface CartContextValue {
  items: CartItem[]
  isOpen: boolean
  clientRequestId: string
  itemCount: number
  previewTotal: number
  openCart: () => void
  closeCart: () => void
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => AddItemResult
  setQuantity: (offerId: string, volumeMl: VolumeMl, quantity: number) => void
  setVolume: (offerId: string, fromMl: VolumeMl, toMl: VolumeMl) => void
  removeItem: (offerId: string, volumeMl: VolumeMl) => void
  clearCart: () => void
  newRequestId: () => string
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

function hasOpenedCartThisSession(): boolean {
  try {
    return sessionStorage.getItem(FIRST_ADD_SESSION_KEY) === '1'
  } catch {
    return false
  }
}

function markCartOpenedThisSession(): void {
  try {
    sessionStorage.setItem(FIRST_ADD_SESSION_KEY, '1')
  } catch {
    /* ignore */
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribeCart, readStoredCart, () => EMPTY_CART)
  const [isOpen, setIsOpen] = useState(false)
  const [clientRequestId, setClientRequestId] = useState('')
  const { toast } = useToast()

  const addItem = useCallback((incoming: Omit<CartItem, 'quantity'> & { quantity?: number }): AddItemResult => {
    const quantity = incoming.quantity ?? 1
    const current = readStoredCart()
    const existing = current.find((item) => sameLine(item, incoming.offerId, incoming.volumeMl))
    if (!existing && current.length >= MAX_CART_ITEMS) {
      toast('В корзине максимум 20 позиций')
      return { added: false, limitReached: true }
    }
    const next = existing
      ? current.map((item) =>
          sameLine(item, incoming.offerId, incoming.volumeMl)
            ? { ...item, quantity: Math.min(MAX_LINE_QUANTITY, item.quantity + quantity) }
            : item
        )
      : [...current, { ...incoming, quantity }]
    writeStoredCart(next)
    toast(`${incoming.name} · ${incoming.volumeMl} мл в корзине`)
    if (!hasOpenedCartThisSession()) {
      setIsOpen(true)
      markCartOpenedThisSession()
    }
    return { added: true, limitReached: false }
  }, [toast])

  const setQuantity = useCallback((offerId: string, volumeMl: VolumeMl, quantity: number) => {
    writeStoredCart(
      readStoredCart().map((item) =>
        sameLine(item, offerId, volumeMl)
          ? { ...item, quantity: Math.min(MAX_LINE_QUANTITY, Math.max(1, quantity)) }
          : item
      )
    )
  }, [])

  const setVolume = useCallback((offerId: string, fromMl: VolumeMl, toMl: VolumeMl) => {
    if (fromMl === toMl) return
    const current = readStoredCart()
    const source = current.find((item) => sameLine(item, offerId, fromMl))
    if (!source) return
    const target = current.find((item) => sameLine(item, offerId, toMl))
    if (target) {
      const merged = Math.min(MAX_LINE_QUANTITY, target.quantity + source.quantity)
      writeStoredCart(
        current
          .filter((item) => !sameLine(item, offerId, fromMl))
          .map((item) => (sameLine(item, offerId, toMl) ? { ...item, quantity: merged } : item))
      )
      return
    }
    writeStoredCart(
      current.map((item) => (sameLine(item, offerId, fromMl) ? { ...item, volumeMl: toMl } : item))
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

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])
  const newRequestId = useCallback(() => {
    const id = crypto.randomUUID()
    setClientRequestId(id)
    return id
  }, [])

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      clientRequestId,
      itemCount,
      previewTotal,
      openCart,
      closeCart,
      addItem,
      setQuantity,
      setVolume,
      removeItem,
      clearCart,
      newRequestId,
    }),
    [
      items,
      isOpen,
      clientRequestId,
      itemCount,
      previewTotal,
      openCart,
      closeCart,
      addItem,
      setQuantity,
      setVolume,
      removeItem,
      clearCart,
      newRequestId,
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
