import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const next = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    const raw = Array.isArray(value) ? value[0] : value
    if (raw) next.set(key, raw)
  }
  const qs = next.toString()
  redirect(qs ? `/?${qs}` : '/')
}
