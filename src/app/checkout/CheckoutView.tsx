'use client'

import { FormEvent, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/cart/CartProvider'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { formatTenge, normalizeName, normalizePhone, priceForVolume } from '@/lib/order'
import { formatPhoneMask } from '@/lib/phone-mask'
import { sectionLabel } from '@/lib/labels'
import { AppStrings } from '@/lib/strings'

interface OrderResponse {
  ok: boolean
  orderNumber?: string
  whatsappUrl?: string
  message?: string
}

function CheckoutSuccess({
  orderNumber,
  total,
  whatsappUrl,
}: {
  orderNumber: string
  total: number
  whatsappUrl: string
}) {
  const [hint, setHint] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setHint(true), 1500)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <main className="flex-1 bg-background">
      <div className="container-lumira section-y max-w-xl">
        <h1 className="text-[32px] font-light leading-10 text-stone-900 md:text-[40px]">
          {AppStrings.checkout.successTitle}
        </h1>
        <p className="mt-4 text-sm text-muted">
          {orderNumber} · {formatTenge(total)} · {AppStrings.checkout.kaspiAfter}
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button fullWidth>{AppStrings.checkout.successWhatsApp}</Button>
          </a>
          <Link href="/">
            <Button variant="secondary" fullWidth>
              {AppStrings.checkout.successCatalog}
            </Button>
          </Link>
        </div>
        {hint ? <p className="mt-6 text-sm text-muted">{AppStrings.checkout.successHint}</p> : null}
      </div>
    </main>
  )
}

export default function CheckoutView() {
  const { items, previewTotal, clearCart, newRequestId, openCart } = useCart()
  const router = useRouter()
  const nameRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const offerRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('+7 ')
  const [offer, setOffer] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errors, setErrors] = useState<{ name?: string; phone?: string; offer?: string; form?: string }>(
    {}
  )
  const [success, setSuccess] = useState<{ orderNumber: string; total: number; whatsappUrl: string } | null>(null)
  const ready = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  )

  useEffect(() => {
    if (ready && !success && items.length === 0) {
      router.replace('/')
    }
  }, [ready, items.length, router, success])

  if (success) {
    return (
      <CheckoutSuccess
        orderNumber={success.orderNumber}
        total={success.total}
        whatsappUrl={success.whatsappUrl}
      />
    )
  }

  if (!ready) {
    return (
      <main className="flex-1 bg-background">
        <div className="container-lumira section-y">
          <div className="h-8 w-48 bg-paper" />
        </div>
      </main>
    )
  }

  if (!success && items.length === 0) {
    return (
      <main className="flex-1 bg-background">
        <div className="container-lumira section-y">
          <p className="text-sm text-muted">{AppStrings.checkout.emptyRedirect}</p>
        </div>
      </main>
    )
  }

  const summary = (
    <aside className="border border-stone-200 p-6">
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={`${item.offerId}-${item.volumeMl}`} className="flex justify-between gap-3 text-sm">
            <span>
              {item.brand} {item.name} · {sectionLabel(item.section)} · {item.volumeMl} мл × {item.quantity}
            </span>
            <span className="shrink-0 tabular-nums">
              {formatTenge(priceForVolume(item.previewPricePerMl, item.volumeMl) * item.quantity)}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex justify-between text-base">
        <span>{AppStrings.cart.total}</span>
        <span className="tabular-nums">{formatTenge(previewTotal)}</span>
      </div>
      <p className="mt-2 text-sm text-muted">{AppStrings.cart.payAfter}</p>
    </aside>
  )

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: typeof errors = {}
    if (!name.trim()) {
      nextErrors.name = AppStrings.checkout.nameRequired
    } else if (!normalizeName(name)) {
      nextErrors.name = AppStrings.checkout.nameInvalid
    }
    if (!normalizePhone(phone)) {
      nextErrors.phone = AppStrings.checkout.phoneInvalid
    }
    if (!offer) {
      nextErrors.offer = AppStrings.checkout.offerError
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.name) nameRef.current?.focus()
      else if (nextErrors.phone) phoneRef.current?.focus()
      else offerRef.current?.focus()
      return
    }

    setStatus('loading')
    const requestId = newRequestId()
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientRequestId: requestId,
          customerName: name,
          phone,
          acceptedLegal: true,
          items: items.map((item) => ({
            offerId: item.offerId,
            volumeMl: item.volumeMl,
            quantity: item.quantity,
          })),
        }),
      })
      const payload = (await response.json()) as OrderResponse
      if (!response.ok || !payload.ok || !payload.whatsappUrl || !payload.orderNumber) {
        setStatus('error')
        setErrors({ form: payload.message ?? AppStrings.checkout.error })
        return
      }
      const total = previewTotal
      clearCart()
      setSuccess({
        orderNumber: payload.orderNumber,
        total,
        whatsappUrl: payload.whatsappUrl,
      })
      setStatus('idle')
    } catch {
      setStatus('error')
      setErrors({ form: AppStrings.checkout.error })
    }
  }

  return (
    <main className="flex-1 bg-background">
      <div className="container-lumira pt-6 pb-28 md:section-y md:pb-16">
        <button
          type="button"
          onClick={openCart}
          className="mb-6 text-sm text-muted hover:text-stone-900"
        >
          ← {AppStrings.checkout.backToCart}
        </button>
        <h1 className="mb-8 text-[32px] font-light leading-10 text-stone-900 md:text-[40px]">
          {AppStrings.checkout.title}
        </h1>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">
          <div className="lg:order-2 lg:sticky lg:top-20">{summary}</div>
          <form onSubmit={onSubmit} noValidate className="space-y-5 lg:order-1">
            <Input
              ref={nameRef}
              label={AppStrings.checkout.name}
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={AppStrings.checkout.namePlaceholder}
              error={errors.name}
              autoComplete="name"
            />
            <Input
              ref={phoneRef}
              label={AppStrings.checkout.phone}
              name="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(formatPhoneMask(event.target.value))}
              placeholder={AppStrings.checkout.phonePlaceholder}
              error={errors.phone}
              autoComplete="tel"
            />

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
                {AppStrings.checkout.fulfillment}
              </p>
              <p className="mt-2 text-sm text-stone-900">{AppStrings.checkout.fulfillmentValue}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
                {AppStrings.checkout.payment}
              </p>
              <p className="mt-2 text-sm text-stone-900">{AppStrings.checkout.paymentValue}</p>
              <p className="mt-1 text-sm text-muted">{AppStrings.checkout.paymentHint}</p>
            </div>

            <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm">
              <input
                ref={offerRef}
                type="checkbox"
                checked={offer}
                onChange={(event) => setOffer(event.target.checked)}
                className={`mt-1 h-5 w-5 rounded-[2px] ${errors.offer ? 'border-error outline outline-1 outline-error' : 'border-stone-300'}`}
              />
              <span>
                {AppStrings.checkout.offerPrefix}{' '}
                <Link href="/legal/oferta" className="underline">
                  {AppStrings.checkout.oferta}
                </Link>{' '}
                и{' '}
                <Link href="/legal/privacy" className="underline">
                  {AppStrings.checkout.privacy}
                </Link>
                .
              </span>
            </label>
            {errors.offer ? <p className="text-sm text-error">{errors.offer}</p> : null}
            {errors.form ? <p className="text-sm text-error">{errors.form}</p> : null}

            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-background px-4 py-3 md:static md:border-0 md:bg-transparent md:px-0 md:py-0">
              <Button type="submit" fullWidth disabled={status === 'loading'}>
                {status === 'loading' ? AppStrings.checkout.submitting : AppStrings.checkout.submit}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
