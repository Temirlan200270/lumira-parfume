import { readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { productSlug, slugify } from '../src/lib/catalog-seed.ts'
import { inventory } from '../src/lib/inventory.ts'

function loadEnvLocal(): void {
  const raw = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8')
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq < 0) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvLocal()

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const secret = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !secret) {
  throw new Error('Supabase env is missing')
}

const admin = createClient(url, secret, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const IMAGE_EXT = /\.(jpe?g|png|webp)$/i
const picturesDir = resolve(process.cwd(), 'pictures')

function listImages(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...listImages(full))
    else if (IMAGE_EXT.test(entry.name)) out.push(full)
  }
  return out
}

function pickBest(paths: string[]): string | null {
  if (paths.length === 0) return null
  return paths
    .map((path) => ({ path, size: statSync(path).size }))
    .sort((a, b) => b.size - a.size)[0]?.path ?? null
}

const sources: Array<{ label: string; path: string; slug: string }> = []
for (const entry of readdirSync(picturesDir, { withFileTypes: true })) {
  const full = join(picturesDir, entry.name)
  if (entry.isFile() && IMAGE_EXT.test(entry.name)) {
    sources.push({
      label: entry.name,
      path: full,
      slug: slugify(entry.name.replace(IMAGE_EXT, '').replace(/no046/g, 'no-12')),
    })
    continue
  }
  if (!entry.isDirectory()) continue
  const best = pickBest(listImages(full))
  if (!best) continue
  sources.push({ label: entry.name, path: best, slug: slugify(entry.name) })
}

function score(nameSlug: string, brandSlug: string, sourceSlug: string): number {
  let points = 0
  if (sourceSlug.includes(nameSlug) && sourceSlug.includes(brandSlug)) points += 80
  if (sourceSlug.startsWith(nameSlug) && sourceSlug.includes(brandSlug)) points += 40
  if (nameSlug.includes('fabulous') && sourceSlug.includes('fabulous') && sourceSlug.includes('tom-ford')) {
    points += 90
  }
  if (brandSlug.includes('kosmala') && sourceSlug.includes('kosmala')) points += 90
  if (nameSlug.includes('gaba') && sourceSlug.includes('gaba')) points += 90
  if (nameSlug.includes('black-opium') && sourceSlug.includes('black-opium')) points += 90
  if (nameSlug.includes('spicebomb') && sourceSlug.includes('spicebomb')) points += 90
  if (nameSlug.length >= 6 && sourceSlug.includes(nameSlug)) points += 20
  return points
}

const unique = new Map<string, { brand: string; name: string }>()
for (const item of inventory) {
  unique.set(productSlug(item.brand, item.name), { brand: item.brand, name: item.name })
}

const used = new Set<string>()
const matches: Array<{ slug: string; path: string; dest: string; contentType: string }> = []
const missing: string[] = []

for (const [slug, item] of unique) {
  const nameSlug = slugify(item.name)
  const brandSlug = slugify(item.brand)
  let best: (typeof sources)[number] | null = null
  let bestScore = 0
  for (const source of sources) {
    if (used.has(source.path)) continue
    const points = score(nameSlug, brandSlug, source.slug)
    if (points > bestScore) {
      bestScore = points
      best = source
    }
  }
  if (!best || bestScore < 20) {
    missing.push(`${item.brand} / ${item.name}`)
    continue
  }
  used.add(best.path)
  const ext = extname(best.path).toLowerCase()
  const destExt = ext === '.png' ? '.png' : ext === '.webp' ? '.webp' : '.jpg'
  const contentType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'
  matches.push({
    slug,
    path: best.path,
    dest: `${slug}${destExt}`,
    contentType,
  })
}

const extras = sources.filter((source) => !used.has(source.path)).map((source) => source.label)

console.info(`Matched ${matches.length}/${unique.size} products`)
if (missing.length > 0) {
  console.info('No photo:')
  for (const row of missing) console.info(`  - ${row}`)
}
if (extras.length > 0) {
  console.info('Skipped extras (not in catalog):')
  for (const row of extras) console.info(`  - ${row}`)
}

const publicBase = `${url}/storage/v1/object/public/product-images`

for (const match of matches) {
  const body = readFileSync(match.path)
  const { error: uploadError } = await admin.storage.from('product-images').upload(match.dest, body, {
    contentType: match.contentType,
    upsert: true,
  })
  if (uploadError) throw new Error(`${match.dest}: ${uploadError.message}`)

  const imageUrl = `${publicBase}/${match.dest}`
  const { error: updateError } = await admin.from('products').update({ image_url: imageUrl }).eq('slug', match.slug)
  if (updateError) throw new Error(`${match.slug}: ${updateError.message}`)
  console.info(`OK ${match.slug}`)
}

console.info(`Uploaded ${matches.length} images`)
