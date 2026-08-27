import { notFound } from 'next/navigation'
import ProductDetail from '@/components/product/ProductDetail'
import { getCatalog, getPerfumeBySlug, similarPerfumes } from '@/lib/catalog'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const perfume = await getPerfumeBySlug(slug)
  if (!perfume) return { title: 'Аромат не найден | Lumira' }
  return {
    title: `${perfume.brand} ${perfume.name} | Lumira`,
    description: perfume.description || `${perfume.brand} ${perfume.name} — разлив и распив по миллилитру.`,
  }
}

export default async function PerfumePage({ params }: PageProps) {
  const { slug } = await params
  const perfume = await getPerfumeBySlug(slug)
  if (!perfume) notFound()
  const catalog = await getCatalog()
  const similar = similarPerfumes(catalog, perfume)

  return <ProductDetail perfume={perfume} similar={similar} />
}
