'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import ProductCard from '@/components/ui/ProductCard'
import Button from '@/components/ui/Button'
import { useFavorites } from '@/components/ui/FavoritesProvider'
import type { Perfume } from '@/lib/data'
import { AppStrings } from '@/lib/strings'

export default function FavoritesView({ perfumes }: { perfumes: Perfume[] }) {
  const { favorites } = useFavorites()
  const items = perfumes.filter((perfume) => favorites.includes(perfume.id))

  return (
    <main className="flex min-h-0 flex-1 flex-col bg-background">
      <div
        className={`container-lumira flex min-h-0 flex-1 flex-col ${
          items.length === 0 ? 'pt-10 pb-8 md:pt-16' : 'section-y'
        }`}
      >
        <h1 className="text-[32px] font-light leading-10 text-stone-900 md:text-[40px]">
          {AppStrings.favorites.title}
        </h1>
        {items.length === 0 ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-8 text-center">
            <Heart className="h-5 w-5 text-muted" strokeWidth={1.25} aria-hidden />
            <p className="mt-6 text-sm text-stone-900">{AppStrings.favorites.empty}</p>
            <p className="mt-2 max-w-[20rem] text-sm leading-relaxed text-muted">
              {AppStrings.favorites.emptyHint}
            </p>
            <Link href="/" className="mt-8">
              <Button>{AppStrings.favorites.toCatalog}</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {items.map((perfume) => (
              <ProductCard key={perfume.id} perfume={perfume} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
