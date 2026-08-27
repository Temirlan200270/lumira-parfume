'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag } from 'lucide-react'
import {
  Perfume,
  VOLUME_OPTIONS,
  DEFAULT_VOLUME_ML,
  VolumeMl,
  formatTenge,
  priceForVolume,
} from '@/lib/data'
import PerfumeBottle from '@/components/ui/PerfumeBottle'
import { useFavorites } from '@/components/ui/FavoritesProvider'
import { useCart } from '@/components/cart/CartProvider'
import { cardTransition, revealViewport } from '@/lib/motion'
import { AppStrings } from '@/lib/strings'

interface ProductCardProps {
  perfume: Perfume
  index?: number
}

export default function ProductCard({ perfume, index = 0 }: ProductCardProps) {
  const starRating = Math.round(perfume.ratings.compliments / 2)
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addItem } = useCart()
  const favorite = isFavorite(perfume.id)
  const [volume, setVolume] = useState<VolumeMl>(DEFAULT_VOLUME_ML)
  const inStock = perfume.isInStock !== false
  const totalPrice = priceForVolume(perfume.pricePerMl, volume)
  const offerId = perfume.offerId ?? perfume.id

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={cardTransition(index)}
      className="group"
    >
      <div className="relative aspect-[3/4] bg-stone-100 mb-5 overflow-hidden">
        <div className="absolute inset-0 grain-sm" />
        <div className="absolute inset-0 flex items-center justify-center p-8 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
          <PerfumeBottle
            color={perfume.bottleColor}
            accent={perfume.bottleAccent}
            label={perfume.name}
          />
        </div>

        {!inStock && (
          <span className="absolute top-4 right-4 bg-white/90 px-2 py-1 text-[9px] tracking-[0.25em] text-stone-500 uppercase">
            {AppStrings.product.outOfStock}
          </span>
        )}

        {inStock && perfume.section === 'raspiv' && (
          <span className="absolute top-4 right-4 text-[9px] tracking-[0.25em] text-stone-500 uppercase">
            {AppStrings.product.original}
          </span>
        )}

        {perfume.isBestseller && (
          <span className="absolute top-4 left-4 text-[9px] tracking-[0.25em] text-stone-400 uppercase">
            Хит
          </span>
        )}
        {perfume.isNew && perfume.section !== 'raspiv' && (
          <span className="absolute top-4 left-4 text-[9px] tracking-[0.25em] text-stone-500 uppercase">
            Новинка
          </span>
        )}

        <div className="absolute bottom-4 right-4 flex gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault()
              toggleFavorite(perfume.id)
            }}
            className={`w-9 h-9 border flex items-center justify-center transition-all duration-300 ${
              favorite
                ? 'bg-accent border-accent text-white'
                : 'bg-white/80 backdrop-blur-sm border-stone-200 text-stone-600 sm:opacity-0 sm:group-hover:opacity-100 hover:border-accent hover:text-accent'
            }`}
            title={favorite ? 'Убрать из избранного' : 'В избранное'}
          >
            <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-current' : ''}`} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            disabled={!inStock}
            onClick={(e) => {
              e.preventDefault()
              if (!inStock) return
              addItem({
                offerId,
                productId: perfume.productId ?? perfume.id,
                brand: perfume.brand,
                name: perfume.name,
                section: perfume.section,
                volumeMl: volume,
                previewPricePerMl: perfume.pricePerMl,
              })
            }}
            className="w-9 h-9 bg-white/80 backdrop-blur-sm border border-stone-200 flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none"
            title={inStock ? AppStrings.product.addToCart : AppStrings.product.outOfStock}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-stone-700" />
          </motion.button>
        </div>
      </div>

      <div className="space-y-2 px-0.5">
        <div className="space-y-1">
          <p className="text-[9px] tracking-[0.2em] text-stone-400 uppercase">{perfume.brand}</p>
          <h3 className="text-base font-light text-stone-900 tracking-tight">
            {perfume.name}
          </h3>
        </div>

        <p className="text-[10px] text-stone-400 font-light tracking-[0.2em] uppercase">
          {perfume.tags.slice(0, 3).join(' • ')}
        </p>

        <p className="text-sm text-stone-900 font-light tracking-wide text-center pt-1">
          {inStock ? formatTenge(totalPrice) : AppStrings.product.outOfStock}
        </p>

        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="text-[10px] tracking-[0.2em] text-stone-400 uppercase">ml</span>
          {VOLUME_OPTIONS.map((ml) => {
            const selected = volume === ml
            return (
              <button
                key={ml}
                type="button"
                disabled={!inStock}
                onClick={() => setVolume(ml)}
                className={`w-8 h-8 text-[11px] font-light border transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none ${
                  selected
                    ? 'border-stone-900 text-stone-900 bg-white'
                    : 'border-stone-200 text-stone-400 hover:border-stone-400 hover:text-stone-700'
                }`}
                aria-pressed={selected}
                aria-label={`${ml} миллилитров`}
              >
                {ml}
              </button>
            )
          })}
        </div>

        <p className="text-[10px] text-stone-400 font-light text-center">
          {formatTenge(perfume.pricePerMl)} {AppStrings.product.perMl}
        </p>

        <div className="flex items-center justify-center pt-1">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-2.5 h-2.5 ${
                  i < starRating ? 'text-stone-300' : 'text-stone-200'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
