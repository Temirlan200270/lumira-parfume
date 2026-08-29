import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { perfumeToSeed } from '../src/lib/catalog-seed.ts'
import { perfumes } from '../src/lib/data.ts'

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

const products = new Map<
  string,
  {
    id: string
    slug: string
    brand: string
    name: string
    description: string
    gender: string
    notes: unknown
    image_url: string
    is_active: boolean
  }
>()
const offers: Array<{
  id: string
  product_id: string
  section: string
  price_per_ml_tenge: number
  is_original: boolean
  is_in_stock: boolean
  is_active: boolean
}> = []

for (const perfume of perfumes) {
  const seeded = perfumeToSeed(perfume)
  products.set(seeded.product.id, {
    id: seeded.product.id,
    slug: seeded.product.slug,
    brand: seeded.product.brand,
    name: seeded.product.name,
    description: seeded.product.description,
    gender: seeded.product.gender,
    notes: seeded.product.notes,
    image_url: seeded.product.imageUrl,
    is_active: true,
  })
  offers.push({
    id: seeded.offer.id,
    product_id: seeded.offer.productId,
    section: seeded.offer.section,
    price_per_ml_tenge: seeded.offer.pricePerMlTenge,
    is_original: seeded.offer.isOriginal,
    is_in_stock: true,
    is_active: true,
  })
}

const productRows = [...products.values()]
const { error: productError } = await admin.from('products').upsert(productRows)
if (productError) throw new Error(productError.message)

const { error: offerError } = await admin.from('offers').upsert(offers)
if (offerError) throw new Error(offerError.message)

console.info(`Pushed ${productRows.length} products and ${offers.length} offers`)
