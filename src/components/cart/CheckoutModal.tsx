'use client'

import { FormEvent, useState } from 'react'
import { X } from 'lucide-react'
import { useCart } from '@/components/cart/CartProvider'
import { AppStrings } from '@/lib/strings'

interface OrderResponse {
  ok: boolean
  whatsappUrl?: string
  message?: string
}

export default function CheckoutModal() {
  const { checkoutOpen, clientRequestId } = useCart()
  if (!checkoutOpen) return null
  return <CheckoutForm key={clientRequestId} />
}

function CheckoutForm() {
  const { closeCheckout, items, clearCart, closeCart, clientRequestId } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle')
  const [error, setError] = useState('')

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('loading')
    setError('')

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientRequestId,
          customerName: name,
          phone,
          items: items.map((item) => ({
            offerId: item.offerId,
            volumeMl: item.volumeMl,
            quantity: item.quantity,
          })),
        }),
      })
      const payload = (await response.json()) as OrderResponse
      if (!response.ok || !payload.ok || !payload.whatsappUrl) {
        setStatus('error')
        setError(payload.message ?? AppStrings.checkout.error)
        return
      }

      setStatus('success')
      clearCart()
      window.setTimeout(() => {
        closeCheckout()
        closeCart()
        window.location.assign(payload.whatsappUrl ?? '')
      }, 400)
    } catch {
      setStatus('error')
      setError(AppStrings.checkout.error)
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-stone-950/50"
        aria-label={AppStrings.checkout.close}
        onClick={closeCheckout}
      />
      <div className="relative w-full max-w-md bg-white p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm tracking-[0.2em] uppercase text-stone-900">
            {AppStrings.checkout.title}
          </h3>
          <button
            type="button"
            onClick={closeCheckout}
            className="text-stone-400 hover:text-stone-900"
            aria-label={AppStrings.checkout.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block space-y-2">
            <span className="text-[11px] tracking-[0.18em] uppercase text-stone-400">
              {AppStrings.checkout.name}
            </span>
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={AppStrings.checkout.namePlaceholder}
              className="w-full h-12 px-3 border border-stone-200 text-sm font-light focus:outline-none focus:border-stone-900"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-[11px] tracking-[0.18em] uppercase text-stone-400">
              {AppStrings.checkout.phone}
            </span>
            <input
              required
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder={AppStrings.checkout.phonePlaceholder}
              className="w-full h-12 px-3 border border-stone-200 text-sm font-light focus:outline-none focus:border-stone-900"
            />
          </label>

          {status === 'error' && (
            <p className="text-sm text-red-700 font-light">{error}</p>
          )}
          {status === 'success' && (
            <p className="text-sm text-stone-600 font-light">{AppStrings.checkout.success}</p>
          )}

          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="w-full h-12 bg-stone-900 text-white text-[11px] tracking-[0.2em] uppercase disabled:bg-stone-300"
          >
            {status === 'loading' ? AppStrings.checkout.submitting : AppStrings.checkout.submit}
          </button>
        </form>
      </div>
    </div>
  )
}
