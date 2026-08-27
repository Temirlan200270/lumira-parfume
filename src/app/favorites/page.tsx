import FavoritesView from './FavoritesView'
import { getCatalog } from '@/lib/catalog'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Избранное | Lumira',
}

export default async function FavoritesPage() {
  const perfumes = await getCatalog()
  return <FavoritesView perfumes={perfumes} />
}
