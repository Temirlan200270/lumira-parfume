'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { Minus, Plus, Trash2, X } from 'lucide-react'
import { useCart } from '@/components/cart/CartProvider'
import ProductPhoto from '@/components/ui/ProductPhoto'
import Button from '@/components/ui/Button'
import VolumeSelector from '@/components/ui/VolumeSelector'
import { formatTenge, priceForVolume } from '@/lib/order'
import { sectionLabel } from '@/lib/labels'
import { AppStrings } from '@/lib/strings'
import { useFocusTrap } from '@/lib/use-focus-trap'

export default function CartDrawer() {
  const {
    items,
    isOpen,
    itemCount,
    previewTotal,
    closeCart,
    setQuantity,
    setVolume,
    removeItem,
  } = useCart()
  const panelRef = useRef<HTMLElement>(null)
  useFocusTrap(isOpen, panelRef, closeCart)

  if (!isOpen) return null

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[60] bg-black/40"
        aria-label={AppStrings.cart.close}
        onClick={closeCart}
      />
      <aside
        ref={panelRef}
        className="fixed inset-x-0 bottom-0 z-[70] flex h-[90vh] w-full flex-col bg-background md:inset-y-0 md:right-0 md:left-auto md:h-full md:w-[400px]"
        style={{ boxShadow: '0 16px 48px #00000026' }}
        role="dialog"
        aria-modal="true"
        aria-label={AppStrings.cart.title}
      >
        <div className="flex h-14 items-center justify-between border-b border-stone-200 px-4 md:h-16 md:px-6">
          <h2 className="text-sm text-stone-900">
            {AppStrings.cart.title}
            {itemCount > 0 ? ` ${itemCount}` : ''}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="flex h-11 w-11 items-center justify-center text-muted hover:text-stone-900"
            aria-label={AppStrings.cart.close}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
          {items.length === 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-muted">{AppStrings.cart.empty}</p>
              <Link href="/catalog" onClick={closeCart}>
                <Button>{AppStrings.cart.toCatalog}</Button>
              </Link>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={`${item.offerId}-${item.volumeMl}`} className="flex gap-3 border-b border-stone-100 pb-4">
                  <div className="aspect-[3/4] w-14 shrink-0 overflow-hidden bg-paper">
                    <ProductPhoto
                      src={item.image ?? ''}
                      alt={`${item.brand} ${item.name}, флакон`}
                      name={item.name}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">{item.brand}</p>
                    <p className="text-sm text-stone-900">{item.name}</p>
                    <p className="mt-1 text-xs text-muted">{sectionLabel(item.section)}</p>
                    <div className="mt-2">
                      <VolumeSelector
                        value={item.volumeMl}
                        onChange={(volume) => setVolume(item.offerId, item.volumeMl, volume)}
                      />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center border border-stone-200">
                        <button
                          type="button"
                          className="flex h-11 w-11 items-center justify-center text-muted"
                          onClick={() => setQuantity(item.offerId, item.volumeMl, item.quantity - 1)}
                          aria-label={AppStrings.cart.decrease}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm tabular-nums">{item.quantity}</span>
                        <button
                          type="button"
                          className="flex h-11 w-11 items-center justify-center text-muted"
                          onClick={() => setQuantity(item.offerId, item.volumeMl, item.quantity + 1)}
                          aria-label={AppStrings.cart.increase}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.offerId, item.volumeMl)}
                        className="flex h-11 w-11 items-center justify-center text-muted hover:text-stone-900"
                        aria-label={AppStrings.cart.remove}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-2 text-sm tabular-nums text-stone-900">
                      {formatTenge(priceForVolume(item.previewPricePerMl, item.volumeMl) * item.quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <div className="space-y-3 border-t border-stone-200 px-4 py-5 md:px-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">{AppStrings.cart.subtotal}</span>
              <span className="tabular-nums text-stone-900">{formatTenge(previewTotal)}</span>
            </div>
            <p className="text-sm text-muted">{AppStrings.cart.delivery}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-900">{AppStrings.cart.total}</span>
              <span className="text-lg tabular-nums text-stone-900">{formatTenge(previewTotal)}</span>
            </div>
            <p className="text-xs text-muted">{AppStrings.cart.payAfter}</p>
            <p className="text-sm text-muted">{AppStrings.cart.kaspiHint}</p>
            <Link href="/checkout" onClick={closeCart}>
              <Button fullWidth>{AppStrings.cart.checkout}</Button>
            </Link>
          </div>
        ) : null}
      </aside>
    </>
  )
}
