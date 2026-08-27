import { Suspense } from 'react'
import Catalog from '@/components/sections/Catalog'
import CatalogError from '@/components/catalog/CatalogError'
import CatalogSkeleton from '@/components/catalog/CatalogSkeleton'
import { getCatalogResult } from '@/lib/catalog'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Каталог | Lumira',
  description: 'Разлив и оригинальный распив. Объём выбираете на карточке.',
}

export default async function CatalogPage() {
  const { perfumes, error } = await getCatalogResult()

  return (
    <main className="flex-1">
      {error ? (
        <CatalogError />
      ) : (
        <Suspense fallback={<CatalogSkeleton />}>
          <Catalog perfumes={perfumes} />
        </Suspense>
      )}
    </main>
  )
}
