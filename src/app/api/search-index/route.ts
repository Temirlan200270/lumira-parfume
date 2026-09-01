import { getCatalog } from '@/lib/catalog'

export async function GET() {
  const perfumes = await getCatalog()
  const unique = new Map<string, { id: string; name: string }>()
  for (const perfume of perfumes) {
    if (!unique.has(perfume.name)) {
      unique.set(perfume.name, { id: perfume.id, name: perfume.name })
    }
  }
  return Response.json([...unique.values()], {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  })
}
