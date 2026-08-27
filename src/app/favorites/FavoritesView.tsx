'use client'

import Link from 'next/link'
import ProductCard from '@/components/ui/ProductCard'
import Button from '@/components/ui/Button'
import { useFavorites } from '@/components/ui/FavoritesProvider'
import type { Perfume } from '@/lib/data'
import { AppStrings } from '@/lib/strings'

export default function FavoritesView({ perfumes }: { perfumes: Perfume[] }) {
  const { favorites } = useFavorites()
  const items = perfumes.filter((perfume) => favorites.includes(perfume.id))

  return (
    <main className="flex-1 bg-background">
      <div className="container-lumira section-y">
        <h1 className="mb-8 text-[32px] font-light leading-10 text-stone-900 md:text-[40px]">
          {AppStrings.favorites.title}
        </h1>
        {items.length === 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted">{AppStrings.favorites.empty}</p>
            <Link href="/catalog">
              <Button>{AppStrings.favorites.toCatalog}</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {items.map((perfume) => (
              <ProductCard key={perfume.id} perfume={perfume} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
