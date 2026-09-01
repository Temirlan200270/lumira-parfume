'use client'

import { memo, useState } from 'react'
import Link from 'next/link'
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
import { perfumeHref, sectionLabel } from '@/lib/labels'
import { AppStrings } from '@/lib/strings'

interface ProductCardProps {
  perfume: Perfume
  index?: number
  priority?: boolean
}

const CardOffer = memo(function CardOffer({ perfume }: { perfume: Perfume }) {
  const [volume, setVolume] = useState<VolumeMl>(DEFAULT_VOLUME_ML)
  const inStock = perfume.isInStock !== false
  const totalPrice = priceForVolume(perfume.pricePerMl, volume)

  return (
    <>
      <div>
        <p className="text-base font-normal tabular-nums text-stone-900">
          {inStock ? formatTenge(totalPrice) : AppStrings.product.outOfStock}
        </p>
        <p className="text-xs text-muted tabular-nums">
          {formatTenge(perfume.pricePerMl)} {AppStrings.product.perMl}
        </p>
      </div>
      <VolumeSelector value={volume} onChange={setVolume} disabled={!inStock} />
    </>
  )
})

function ProductCard({ perfume, index = Number.POSITIVE_INFINITY, priority }: ProductCardProps) {
  const inStock = perfume.isInStock !== false
  const href = perfumeHref(perfume.slug, perfume.section)
  const eager = priority ?? index < 8
  const statusBadge = !inStock
    ? { tone: 'oos' as const, label: AppStrings.product.outOfStock }
    : perfume.isNew
      ? { tone: 'new' as const, label: AppStrings.product.isNew }
      : null

  return (
    <article className="catalog-card group">
      <div className="relative aspect-[4/5] overflow-hidden bg-paper md:aspect-[3/4]">
        <Link href={href} className="absolute inset-0 block cursor-pointer">
          <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.02]">
            <ProductPhoto
              src={perfume.image}
              alt={`${perfume.brand} ${perfume.name}, флакон`}
              name={perfume.name}
              faded={!inStock}
              priority={eager}
            />
          </div>
        </Link>

        {statusBadge ? (
          <div className="absolute top-2 left-2 z-10">
            <Badge tone={statusBadge.tone}>{statusBadge.label}</Badge>
          </div>
        ) : null}

        <div className="absolute top-2 right-2 z-10">
          <Badge tone="outline" size="sm">
            {sectionLabel(perfume.section)}
          </Badge>
        </div>
      </div>

      <div className="space-y-3 pt-3 text-left">
        <Link href={href} className="block space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">{perfume.brand}</p>
          <h3 className="text-sm font-normal leading-5 text-stone-900 line-clamp-2 md:min-h-[44px] md:text-base md:leading-[22px]">
            {perfume.name}
          </h3>
        </Link>
        <CardOffer perfume={perfume} />
      </div>
    </article>
  )
}

export default memo(ProductCard)
