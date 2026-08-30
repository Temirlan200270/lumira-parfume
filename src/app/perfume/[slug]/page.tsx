import { notFound } from 'next/navigation'
import ProductDetail from '@/components/product/ProductDetail'
import { getPerfumeBySlug } from '@/lib/catalog'
import type { CatalogSection } from '@/lib/types'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function asSection(value: string | string[] | undefined): CatalogSection | undefined {
  const raw = Array.isArray(value) ? value[0] : value
  if (raw === 'razliv' || raw === 'raspiv') return raw
  return undefined
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const query = await searchParams
  const perfume = await getPerfumeBySlug(slug, asSection(query.format))
  if (!perfume) return { title: 'Аромат не найден | Lumira' }
  return {
    title: `${perfume.brand} ${perfume.name} | Lumira`,
    description: perfume.description || `${perfume.brand} ${perfume.name} — разлив и распив по миллилитру.`,
  }
}

export default async function PerfumePage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const query = await searchParams
  const perfume = await getPerfumeBySlug(slug, asSection(query.format))
  if (!perfume) notFound()

  return <ProductDetail perfume={perfume} />
}
