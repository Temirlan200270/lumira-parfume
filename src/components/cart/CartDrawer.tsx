'use client'

import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useCart } from '@/components/cart/CartProvider'
import CheckoutModal from '@/components/cart/CheckoutModal'
import { formatTenge } from '@/lib/order'
import { AppStrings } from '@/lib/strings'

export default function CartDrawer() {
  const {
    items,
    isOpen,
    itemCount,
    previewTotal,
    closeCart,
    openCheckout,
    setQuantity,
    removeItem,
  } = useCart()

  if (!isOpen) return null

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[60] bg-stone-950/40"
        aria-label={AppStrings.cart.close}
        onClick={closeCart}
      />
      <aside className="fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 h-20 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-stone-700" />
            <h2 className="text-sm tracking-[0.2em] uppercase text-stone-900">
              {AppStrings.cart.title}
            </h2>
            {itemCount > 0 && (
              <span className="text-xs text-stone-400">{itemCount}</span>
            )}
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="text-stone-400 hover:text-stone-900"
            aria-label={AppStrings.cart.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {items.length === 0 ? (
            <p className="text-sm text-stone-400 font-light">{AppStrings.cart.empty}</p>
          ) : (
            items.map((item) => (
              <div key={`${item.offerId}-${item.volumeMl}`} className="border-b border-stone-100 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400">{item.brand}</p>
                    <p className="text-sm text-stone-900 font-light">{item.name}</p>
                    <p className="text-[11px] text-stone-400 mt-1">
                      {item.section === 'raspiv' ? 'Распив' : 'Разлив'} · {item.volumeMl} мл
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.offerId, item.volumeMl)}
                    className="text-stone-400 hover:text-stone-900"
                    aria-label={AppStrings.cart.remove}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex items-center border border-stone-200">
                    <button
                      type="button"
                      className="w-8 h-8 flex items-center justify-center text-stone-500"
                      onClick={() => setQuantity(item.offerId, item.volumeMl, item.quantity - 1)}
                      aria-label={AppStrings.cart.quantity}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      className="w-8 h-8 flex items-center justify-center text-stone-500"
                      onClick={() => setQuantity(item.offerId, item.volumeMl, item.quantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-sm text-stone-900">
                    {formatTenge(item.previewPricePerMl * item.volumeMl * item.quantity)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-stone-100 px-6 py-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs tracking-[0.2em] uppercase text-stone-400">
              {AppStrings.cart.total}
            </span>
            <span className="text-lg text-stone-900">{formatTenge(previewTotal)}</span>
          </div>
          <button
            type="button"
            disabled={items.length === 0}
            onClick={openCheckout}
            className="w-full h-12 bg-stone-900 text-white text-[11px] tracking-[0.2em] uppercase disabled:bg-stone-200 disabled:text-stone-400"
          >
            {AppStrings.cart.checkout}
          </button>
        </div>
      </aside>
      <CheckoutModal />
    </>
  )
}
