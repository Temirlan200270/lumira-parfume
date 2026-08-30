'use client'

import { memo, useState } from 'react'
import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import {
  DEFAULT_VOLUME_ML,
  type Perfume,
  type VolumeMl,
  formatTenge,
  priceForVolume,
} from '@/lib/data'
import ProductPhoto from '@/components/ui/ProductPhoto'
import Badge from '@/components/ui/Badge'
import VolumeSelector from '@/components/ui/VolumeSelector'
import { useFavorites } from '@/components/ui/FavoritesProvider'
import { useCart } from '@/components/cart/CartProvider'
import { perfumeHref, sectionLabel } from '@/lib/labels'
import { AppStrings } from '@/lib/strings'

interface ProductCardProps {
  perfume: Perfume
  index?: number
}

function ProductCard({ perfume }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addItem } = useCart()
  const favorite = isFavorite(perfume.id)
  const [volume, setVolume] = useState<VolumeMl>(DEFAULT_VOLUME_ML)
  const inStock = perfume.isInStock !== false
  const totalPrice = priceForVolume(perfume.pricePerMl, volume)
  const offerId = perfume.offerId ?? perfume.id
  const href = perfumeHref(perfume.slug, perfume.section)

  const statusBadge = !inStock
    ? { tone: 'oos' as const, label: AppStrings.product.outOfStock }
    : perfume.isBestseller
      ? { tone: 'hit' as const, label: AppStrings.product.hit }
      : perfume.isNew
        ? { tone: 'new' as const, label: AppStrings.product.isNew }
        : null

  return (
    <article className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-paper">
        <Link href={href} className="absolute inset-0 block cursor-pointer">
          <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.02]">
            <ProductPhoto
              src={perfume.image}
              alt={`${perfume.brand} ${perfume.name}, флакон`}
              name={perfume.name}
              faded={!inStock}
            />
          </div>
        </Link>

        {statusBadge ? (
          <div className="absolute top-3 left-3 z-10">
            <Badge tone={statusBadge.tone}>{statusBadge.label}</Badge>
          </div>
        ) : null}

        <div className="absolute top-3 right-3 z-10">
          <Badge tone="outline">{sectionLabel(perfume.section)}</Badge>
        </div>

        <div className="absolute right-2 bottom-2 z-10 flex gap-1">
          <button
            type="button"
            onClick={() => toggleFavorite(perfume.id)}
            className={`flex h-11 w-11 items-center justify-center border ${
              favorite
                ? 'border-accent bg-accent text-white'
                : 'border-stone-200 bg-background text-stone-900 hover:border-accent hover:text-accent'
            }`}
            aria-label={favorite ? AppStrings.product.favoriteRemove : AppStrings.product.favoriteAdd}
          >
            <Heart className={`h-4 w-4 ${favorite ? 'fill-current' : ''}`} />
          </button>
          <button
            type="button"
            disabled={!inStock}
            onClick={() => {
              if (!inStock) return
              addItem({
                offerId,
                productId: perfume.productId ?? perfume.id,
                brand: perfume.brand,
                name: perfume.name,
                section: perfume.section,
                volumeMl: volume,
                previewPricePerMl: perfume.pricePerMl,
                image: perfume.image,
                slug: perfume.slug,
              })
            }}
            className="flex h-11 w-11 items-center justify-center border border-stone-200 bg-background text-stone-900 hover:bg-stone-900 hover:text-stone-50 disabled:pointer-events-none disabled:opacity-40"
            aria-label={inStock ? AppStrings.product.addToCart : AppStrings.product.outOfStock}
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3 pt-3 text-left">
        <Link href={href} className="block space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">{perfume.brand}</p>
          <h3 className="min-h-[40px] text-sm font-normal leading-5 text-stone-900 line-clamp-2 md:min-h-[44px] md:text-base md:leading-[22px]">
            {perfume.name}
          </h3>
        </Link>

        <div>
          <p className="text-base font-normal tabular-nums text-stone-900">
            {inStock ? formatTenge(totalPrice) : AppStrings.product.outOfStock}
          </p>
          <p className="text-xs text-muted tabular-nums">
            {formatTenge(perfume.pricePerMl)} {AppStrings.product.perMl}
          </p>
        </div>

        <VolumeSelector value={volume} onChange={setVolume} disabled={!inStock} />
      </div>
    </article>
  )
}

export default memo(ProductCard)
