import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { perfumes } from '../src/lib/data.ts'
import { perfumeToSeed } from '../src/lib/catalog-seed.ts'

const here = dirname(fileURLToPath(import.meta.url))

function sqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`
}

function sqlJson(value: unknown): string {
  return sqlString(JSON.stringify(value))
}

const products = new Map<string, ReturnType<typeof perfumeToSeed>['product']>()
const offers: ReturnType<typeof perfumeToSeed>['offer'][] = []

for (const perfume of perfumes) {
  const seeded = perfumeToSeed(perfume)
  products.set(seeded.product.id, seeded.product)
  offers.push(seeded.offer)
}

const productList = [...products.values()]
const newIds = productList.map((product) => sqlString(product.id)).join(', ')
const newSlugs = productList.map((product) => sqlString(product.slug)).join(', ')

const productValues = productList
  .map((product) => {
    return `(${sqlString(product.id)}, ${sqlString(product.slug)}, ${sqlString(product.brand)}, ${sqlString(product.name)}, ${sqlString(product.description)}, ${sqlString(product.gender)}, ${sqlJson(product.notes)}::jsonb, ${sqlString(product.imageUrl)}, true)`
  })
  .join(',\n')

const offerValues = offers
  .map((offer) => {
    return `(${sqlString(offer.id)}, ${sqlString(offer.productId)}, ${sqlString(offer.section)}, ${offer.pricePerMlTenge}, ${offer.isOriginal}, true, true)`
  })
  .join(',\n')

const sql = `-- Replace storefront inventory. Hide everything else.

update public.offers set is_active = false, is_in_stock = false;
update public.products set is_active = false;

update public.products
set slug = slug || '-retired-' || left(id::text, 8)
where id not in (${newIds})
  and slug in (${newSlugs});

insert into public.products (id, slug, brand, name, description, gender, notes, image_url, is_active)
values
${productValues}
on conflict (id) do update set
  slug = excluded.slug,
  brand = excluded.brand,
  name = excluded.name,
  description = excluded.description,
  gender = excluded.gender,
  notes = excluded.notes,
  image_url = excluded.image_url,
  is_active = excluded.is_active;

insert into public.offers (id, product_id, section, price_per_ml_tenge, is_original, is_in_stock, is_active)
values
${offerValues}
on conflict (id) do update set
  product_id = excluded.product_id,
  section = excluded.section,
  price_per_ml_tenge = excluded.price_per_ml_tenge,
  is_original = excluded.is_original,
  is_in_stock = excluded.is_in_stock,
  is_active = excluded.is_active;
`

writeFileSync(join(here, '../supabase/migrations/20260829153000_replace_inventory.sql'), sql)
console.info(`Seeded ${products.size} products and ${offers.length} offers`)
