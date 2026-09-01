'use client'

import { useMemo, useRef, useState, useCallback } from 'react'
import { Search } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { ALLOWED_VOLUMES, DEFAULT_VOLUME_ML, MAX_CART_ITEMS, MAX_LINE_QUANTITY } from '@/lib/constants'
import { normalizeSearch } from '@/lib/data'
import { formatTenge, priceForVolume } from '@/lib/order'
import { formatPhoneMask } from '@/lib/phone-mask'
import { sectionLabel } from '@/lib/labels'
import { AppStrings } from '@/lib/strings'
import type { CatalogSection, VolumeMl } from '@/lib/types'
import { createAdminOrder } from './actions'
import AdminSheet from './AdminSheet'
import type { AdminOrder } from './AdminOrderCard'

export interface AdminCatalogPick {
  offerId: string
  brand: string
  name: string
  section: CatalogSection
  pricePerMlTenge: number
}

interface Line {
  offerId: string
  brand: string
  name: string
  section: CatalogSection
  pricePerMlTenge: number
  volumeMl: VolumeMl
  quantity: number
}

export default function AdminNewOrderSheet({
  catalog,
  onClose,
  onCreated,
}: {
  catalog: AdminCatalogPick[]
  onClose: () => void
  onCreated: (order: AdminOrder) => void
}) {
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('+7 ')
  const [query, setQuery] = useState('')
  const [lines, setLines] = useState<Line[]>([])
  const [pending, setPending] = useState(false)
  const [formError, setFormError] = useState('')
  const pendingRef = useRef(false)
  pendingRef.current = pending

  const matches = useMemo(() => {
    const needle = normalizeSearch(query)
    if (needle.length < 2) return []
    const taken = new Set(lines.map((line) => line.offerId))
    return catalog
      .filter((item) => !taken.has(item.offerId))
      .filter((item) => normalizeSearch(`${item.brand} ${item.name}`).includes(needle))
      .slice(0, 6)
  }, [catalog, query, lines])

  const total = lines.reduce(
    (sum, line) => sum + priceForVolume(line.pricePerMlTenge, line.volumeMl) * line.quantity,
    0
  )

  const addPick = (pick: AdminCatalogPick) => {
    if (lines.length >= MAX_CART_ITEMS) {
      toast(AppStrings.cart.limit, 1500)
      return
    }
    setLines((current) => [
      ...current,
      {
        offerId: pick.offerId,
        brand: pick.brand,
        name: pick.name,
        section: pick.section,
        pricePerMlTenge: pick.pricePerMlTenge,
        volumeMl: DEFAULT_VOLUME_ML,
        quantity: 1,
      },
    ])
    setQuery('')
  }

  const submit = async () => {
    setFormError('')
    setPending(true)
    const result = await createAdminOrder({
      customerName: name,
      phone,
      items: lines.map((line) => ({
        offerId: line.offerId,
        volumeMl: line.volumeMl,
        quantity: line.quantity,
      })),
    })
    setPending(false)
    if (!result.ok) {
      setFormError(result.message)
      toast(AppStrings.admin.saveError, 1500)
      return
    }
    toast(`${AppStrings.admin.orderCreated} · ${result.order.orderNumber}`, 1500)
    onCreated(result.order)
    onClose()
  }

  const close = useCallback(() => {
    if (!pendingRef.current) onClose()
  }, [onClose])

  const needle = normalizeSearch(query)

  return (
    <AdminSheet
      title={AppStrings.admin.newOrder}
      onClose={close}
      footer={
        <div className="space-y-2">
          {total > 0 ? <p className="text-sm text-stone-900">{formatTenge(total)}</p> : null}
          {formError ? <p className="text-sm text-error">{formError}</p> : null}
          <Button fullWidth disabled={pending} onClick={() => void submit()}>
            {AppStrings.admin.createOrder}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Input
          label={AppStrings.checkout.name}
          name="admin-order-name"
          value={name}
          autoComplete="name"
          onChange={(event) => setName(event.currentTarget.value)}
        />
        <Input
          label={AppStrings.checkout.phone}
          name="admin-order-phone"
          type="tel"
          inputMode="tel"
          value={phone}
          autoComplete="tel"
          onChange={(event) => setPhone(formatPhoneMask(event.currentTarget.value))}
        />

        <label className="block space-y-2">
          <span className="block text-xs font-medium uppercase tracking-[0.12em] text-muted">
            {AppStrings.admin.pickScent}
          </span>
          <span className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder={AppStrings.admin.search}
              autoComplete="off"
              className="h-11 w-full border border-stone-200 bg-background pl-10 pr-3 text-sm"
            />
          </span>
        </label>

        {matches.length > 0 ? (
          <ul className="border border-stone-200">
            {matches.map((pick) => (
              <li key={pick.offerId} className="border-b border-stone-100 last:border-b-0">
                <button
                  type="button"
                  onClick={() => addPick(pick)}
                  className="flex h-11 w-full items-center justify-between gap-2 px-3 text-left text-sm"
                >
                  <span className="min-w-0 truncate">
                    {pick.brand} {pick.name} · {sectionLabel(pick.section)}
                  </span>
                  <span className="shrink-0 text-xs text-muted">{AppStrings.admin.addScent}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : needle.length >= 2 ? (
          <p className="text-sm text-muted">{AppStrings.admin.emptyProducts}</p>
        ) : null}

        {lines.length > 0 ? (
          <ul className="space-y-3">
            {lines.map((line) => (
              <li key={line.offerId} className="space-y-2 border border-stone-200 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-stone-900">
                    {line.brand} {line.name} · {sectionLabel(line.section)}
                  </p>
                  <button
                    type="button"
                    className="h-11 shrink-0 px-2 text-sm text-muted"
                    onClick={() => setLines((current) => current.filter((item) => item.offerId !== line.offerId))}
                  >
                    {AppStrings.admin.removeLine}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {ALLOWED_VOLUMES.map((ml) => (
                    <button
                      key={ml}
                      type="button"
                      aria-pressed={line.volumeMl === ml}
                      onClick={() =>
                        setLines((current) =>
                          current.map((item) => (item.offerId === line.offerId ? { ...item, volumeMl: ml } : item))
                        )
                      }
                      className={`inline-flex h-11 min-w-11 items-center px-3 text-sm ${
                        line.volumeMl === ml
                          ? 'bg-stone-900 text-stone-50'
                          : 'border border-stone-200 text-stone-700'
                      }`}
                    >
                      {ml} мл
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center border border-stone-200"
                    aria-label={AppStrings.cart.decrease}
                    onClick={() =>
                      setLines((current) =>
                        current.map((item) =>
                          item.offerId === line.offerId
                            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                            : item
                        )
                      )
                    }
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm tabular-nums">{line.quantity}</span>
                  <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center border border-stone-200"
                    aria-label={AppStrings.cart.increase}
                    onClick={() =>
                      setLines((current) =>
                        current.map((item) =>
                          item.offerId === line.offerId
                            ? { ...item, quantity: Math.min(MAX_LINE_QUANTITY, item.quantity + 1) }
                            : item
                        )
                      )
                    }
                  >
                    +
                  </button>
                  <span className="ml-auto text-sm">
                    {formatTenge(priceForVolume(line.pricePerMlTenge, line.volumeMl) * line.quantity)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </AdminSheet>
  )
}
