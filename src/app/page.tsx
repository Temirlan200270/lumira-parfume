import { Suspense } from 'react'
import Catalog from '@/components/sections/Catalog'
import CatalogError from '@/components/catalog/CatalogError'
import CatalogSkeleton from '@/components/catalog/CatalogSkeleton'
import DiscoverySets from '@/components/sections/DiscoverySets'
import Newsletter from '@/components/sections/Newsletter'
import Stories from '@/components/sections/Stories'
import { getCatalogResult } from '@/lib/catalog'

export const dynamic = 'force-dynamic'

export default async function Home() {
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
      <Stories perfumes={perfumes} />
      <DiscoverySets />
      <Newsletter />
    </main>
  )
}
