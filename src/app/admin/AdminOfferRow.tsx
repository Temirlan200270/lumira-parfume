'use client'

import { useRef, useState } from 'react'
import { ALLOWED_VOLUMES } from '@/lib/constants'
import { formatTenge, priceForVolume } from '@/lib/order'
import { offerSiteToast, offerStockToast } from '@/lib/admin'
import { sectionLabel } from '@/lib/labels'
import { isRenderableProductImage } from '@/lib/product-image'
import { AppStrings } from '@/lib/strings'
import { useToast } from '@/components/ui/Toast'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { deleteOffer, patchOffer } from './actions'
import AdminSheet from './AdminSheet'
import type { CatalogSection } from '@/lib/types'

interface AdminOfferRowProps {
  productId: string
  brand: string
  name: string
  imageUrl: string
  offer: {
    id: string
    section: CatalogSection
    pricePerMlTenge: number
    isInStock: boolean
    isActive: boolean
  }
  onDeleted: (offerId: string) => void
}

function Toggle({
  checked,
  label,
  disabled,
  onChange,
}: {
  checked: boolean
  label: string
  disabled: boolean
  onChange: (next: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="inline-flex h-11 min-w-11 items-center gap-2 text-left disabled:opacity-40"
    >
      <span
        className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-stone-900' : 'bg-stone-200'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-4' : ''
          }`}
        />
      </span>
      <span className="text-xs text-stone-700">{label}</span>
    </button>
  )
}

export default function AdminOfferRow({
  productId,
  brand,
  name,
  imageUrl,
  offer,
  onDeleted,
}: AdminOfferRowProps) {
  const { toast } = useToast()
  const [price, setPrice] = useState(String(offer.pricePerMlTenge))
  const [inStock, setInStock] = useState(offer.isInStock)
  const [onSite, setOnSite] = useState(offer.isActive)
  const [pending, setPending] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const pendingRef = useRef(false)
  pendingRef.current = pending

  const lastSaved = useRef({
    price: offer.pricePerMlTenge,
    inStock: offer.isInStock,
    onSite: offer.isActive,
  })

  const persist = async (next: { pricePerMlTenge: number; isInStock: boolean; isActive: boolean }, okMessage: string) => {
    setPending(true)
    const result = await patchOffer({
      offerId: offer.id,
      pricePerMlTenge: next.pricePerMlTenge,
      isInStock: next.isInStock,
      isActive: next.isActive,
    })
    setPending(false)
    if (!result.ok) {
      toast(AppStrings.admin.saveError, 1500)
      return false
    }
    lastSaved.current = {
      price: next.pricePerMlTenge,
      inStock: next.isInStock,
      onSite: next.isActive,
    }
    toast(okMessage, 1500)
    return true
  }

  const parsedPrice = Number(price)

  const commitPrice = async () => {
    if (!Number.isInteger(parsedPrice) || parsedPrice <= 0) return
    if (parsedPrice === lastSaved.current.price) return
    const ok = await persist(
      { pricePerMlTenge: parsedPrice, isInStock: inStock, isActive: onSite },
      AppStrings.admin.saveOk
    )
    if (!ok) setPrice(String(lastSaved.current.price))
  }

  const toggleStock = async (next: boolean) => {
    const previous = inStock
    setInStock(next)
    const ok = await persist(
      { pricePerMlTenge: Number.isInteger(parsedPrice) && parsedPrice > 0 ? parsedPrice : offer.pricePerMlTenge, isInStock: next, isActive: onSite },
      offerStockToast(name, offer.section, next)
    )
    if (!ok) setInStock(previous)
  }

  const toggleSite = async (next: boolean) => {
    const previous = onSite
    setOnSite(next)
    const ok = await persist(
      { pricePerMlTenge: Number.isInteger(parsedPrice) && parsedPrice > 0 ? parsedPrice : offer.pricePerMlTenge, isInStock: inStock, isActive: next },
      offerSiteToast(name, offer.section, next)
    )
    if (!ok) setOnSite(previous)
  }

  const remove = async () => {
    setPending(true)
    const result = await deleteOffer({ offerId: offer.id, productId })
    setPending(false)
    if (!result.ok) {
      toast(AppStrings.admin.saveError, 1500)
      return
    }
    toast(AppStrings.admin.deleted, 1500)
    onDeleted(offer.id)
  }

  const showImage = isRenderableProductImage(imageUrl)
  const previewPrice = Number.isInteger(parsedPrice) && parsedPrice > 0 ? parsedPrice : offer.pricePerMlTenge

  return (
    <article className="flex gap-3 border border-stone-200 p-3">
      <div className="relative h-11 w-9 shrink-0 overflow-hidden bg-paper">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="block h-full w-full bg-stone-100" />
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.12em] text-muted">{brand}</p>
            <p className="text-sm text-stone-900">{name}</p>
          </div>
          <Badge tone="outline" size="sm">
            {sectionLabel(offer.section)}
          </Badge>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <span className="sr-only">{AppStrings.admin.pricePerMl}</span>
            <input
              type="number"
              min={1}
              inputMode="numeric"
              value={price}
              onChange={(event) => setPrice(event.currentTarget.value)}
              onBlur={() => {
                void commitPrice()
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') event.currentTarget.blur()
              }}
              className="h-11 w-24 border border-stone-200 px-2 text-sm tabular-nums"
            />
            <span className="text-xs text-muted">{AppStrings.admin.priceUnit}</span>
          </label>
          <p className="mt-1 text-xs text-muted">
            {ALLOWED_VOLUMES.map((ml) => `${ml} мл ${formatTenge(priceForVolume(previewPrice, ml))}`).join(' · ')}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <Toggle
            checked={inStock}
            label={AppStrings.admin.inStock}
            disabled={pending}
            onChange={(next) => {
              void toggleStock(next)
            }}
          />
          <Toggle
            checked={onSite}
            label={AppStrings.admin.onSite}
            disabled={pending}
            onChange={(next) => {
              void toggleSite(next)
            }}
          />
        </div>

        <button
          type="button"
          disabled={pending}
          onClick={() => setConfirmOpen(true)}
          className="h-11 text-sm text-error disabled:opacity-40"
        >
          {AppStrings.admin.delete}
        </button>
      </div>

      {confirmOpen ? (
        <AdminSheet
          title={AppStrings.admin.deleteTitle}
          onClose={() => {
            if (!pendingRef.current) setConfirmOpen(false)
          }}
          footer={
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="secondary"
                fullWidth
                disabled={pending}
                onClick={() => setConfirmOpen(false)}
              >
                {AppStrings.admin.deleteCancel}
              </Button>
              <Button variant="destructive" fullWidth disabled={pending} onClick={() => void remove()}>
                {AppStrings.admin.delete}
              </Button>
            </div>
          }
        >
          <p className="text-sm text-stone-700">{AppStrings.admin.deleteLead}</p>
        </AdminSheet>
      ) : null}
    </article>
  )
}
