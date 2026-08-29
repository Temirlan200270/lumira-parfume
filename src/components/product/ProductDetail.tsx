'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import type { Perfume } from '@/lib/data'
import { DEFAULT_VOLUME_ML, formatTenge, priceForVolume, type VolumeMl } from '@/lib/data'
import ProductPhoto from '@/components/ui/ProductPhoto'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import VolumeSelector from '@/components/ui/VolumeSelector'
import ProductCard from '@/components/ui/ProductCard'
import { useCart } from '@/components/cart/CartProvider'
import { useFavorites } from '@/components/ui/FavoritesProvider'
import { genderLabel, sectionLabel } from '@/lib/labels'
import { AppStrings } from '@/lib/strings'

interface ProductDetailProps {
  perfume: Perfume
  similar: Perfume[]
}

export default function ProductDetail({ perfume, similar }: ProductDetailProps) {
  const [volume, setVolume] = useState<VolumeMl>(DEFAULT_VOLUME_ML)
  const { addItem } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(perfume.id)
  const inStock = perfume.isInStock !== false
  const totalPrice = priceForVolume(perfume.pricePerMl, volume)
  const hasNotes =
    perfume.notes.top.length > 0 || perfume.notes.middle.length > 0 || perfume.notes.base.length > 0

  const add = () => {
    if (!inStock) return
    addItem({
      offerId: perfume.offerId ?? perfume.id,
      productId: perfume.productId ?? perfume.id,
      brand: perfume.brand,
      name: perfume.name,
      section: perfume.section,
      volumeMl: volume,
      previewPricePerMl: perfume.pricePerMl,
      image: perfume.image,
      slug: perfume.slug,
    })
  }

  const meta = [genderLabel(perfume.gender), sectionLabel(perfume.section)].filter(Boolean)

  return (
    <main className="flex-1 bg-background pb-24 lg:pb-0">
      <div className="container-lumira section-y">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[58%_42%] lg:items-start">
          <div className="aspect-[3/4] overflow-hidden bg-paper lg:sticky lg:top-20">
            <ProductPhoto
              src={perfume.image}
              alt={`${perfume.brand} ${perfume.name}, флакон`}
              name={perfume.name}
              faded={!inStock}
            />
          </div>

          <div className="lg:sticky lg:top-20">
            <Link
              href={`/?brand=${encodeURIComponent(perfume.brand)}`}
              className="text-xs font-medium uppercase tracking-[0.12em] text-muted"
            >
              {perfume.brand}
            </Link>
            <h1 className="mt-2 text-[32px] font-light leading-10 text-stone-900 md:text-[40px]">
              {perfume.name}
            </h1>
            <p className="mt-3 text-sm text-muted">{meta.join(' · ')}</p>
            {!inStock ? (
              <div className="mt-3">
                <Badge tone="oos">{AppStrings.product.outOfStock}</Badge>
              </div>
            ) : null}

            <p className="mt-6 text-[28px] font-light tabular-nums text-stone-900">{formatTenge(totalPrice)}</p>
            <p className="mt-1 text-sm text-muted tabular-nums">
              {formatTenge(perfume.pricePerMl)} {AppStrings.product.perMl}
            </p>

            <div className="mt-6">
              <VolumeSelector value={volume} onChange={setVolume} disabled={!inStock} size="pdp" />
            </div>

            <div className="mt-4 hidden gap-2 lg:flex">
              <Button fullWidth disabled={!inStock} onClick={add}>
                {inStock ? AppStrings.product.addToCart : AppStrings.product.outOfStock}
              </Button>
              <button
                type="button"
                onClick={() => toggleFavorite(perfume.id)}
                className={`flex h-11 w-11 shrink-0 items-center justify-center border ${
                  favorite ? 'border-accent bg-accent text-white' : 'border-stone-200 text-stone-900'
                }`}
                aria-label={favorite ? AppStrings.product.favoriteRemove : AppStrings.product.favoriteAdd}
              >
                <Heart className={`h-4 w-4 ${favorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            <ul className="mt-6 space-y-2 text-sm text-muted">
              <li>
                {perfume.section === 'raspiv'
                  ? AppStrings.product.formatRaspiv
                  : AppStrings.product.formatRazliv}
              </li>
              <li>{AppStrings.product.kaspi}</li>
              <li>{AppStrings.product.delivery}</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 space-y-10">
          {perfume.description ? (
            <section>
              <p className="max-w-3xl text-sm leading-[22px] text-stone-700">{perfume.description}</p>
            </section>
          ) : null}

          {hasNotes ? (
            <section>
              <h2 className="mb-4 text-[28px] font-light text-stone-900">{AppStrings.product.notes}</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {perfume.notes.top.length > 0 ? (
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-muted">
                      {AppStrings.product.notesTop}
                    </p>
                    <p className="text-sm text-stone-900">{perfume.notes.top.join(', ')}</p>
                  </div>
                ) : null}
                {perfume.notes.middle.length > 0 ? (
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-muted">
                      {AppStrings.product.notesMiddle}
                    </p>
                    <p className="text-sm text-stone-900">{perfume.notes.middle.join(', ')}</p>
                  </div>
                ) : null}
                {perfume.notes.base.length > 0 ? (
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-muted">
                      {AppStrings.product.notesBase}
                    </p>
                    <p className="text-sm text-stone-900">{perfume.notes.base.join(', ')}</p>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          {similar.length > 0 ? (
            <section>
              <h2 className="mb-6 text-[28px] font-light text-stone-900">{AppStrings.product.similar}</h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
                {similar.map((item) => (
                  <ProductCard key={item.id} perfume={item} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>

      <div
        className="fixed right-0 left-0 z-40 border-t border-stone-200 bg-background px-4 py-2 lg:hidden"
        style={{ bottom: 'calc(56px + env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-center gap-3">
          <p className="text-base tabular-nums text-stone-900">{formatTenge(totalPrice)}</p>
          <Button fullWidth disabled={!inStock} onClick={add}>
            {inStock ? AppStrings.product.addToCart : AppStrings.product.outOfStock}
          </Button>
        </div>
      </div>
    </main>
  )
}
