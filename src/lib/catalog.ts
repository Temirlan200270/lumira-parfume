import 'server-only'

import { DEFAULT_VOLUME_ML, perfumes, priceForVolume, type Perfume } from '@/lib/data'
import { perfumeToSeed } from '@/lib/catalog-seed'
import { getPublicSupabaseEnv } from '@/lib/env'
import { logger } from '@/lib/logger'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { CatalogSection, Gender, ProductNotes, CatalogDisplay } from '@/lib/types'

const DEFAULT_DISPLAY: CatalogDisplay = {
  tags: [],
  mood: '',
  moodIcon: '🧴',
  bottleColor: '#e7e5e4',
  bottleAccent: '#a8a29e',
  ratings: {
    longevity: 7,
    sillage: 7,
    compliments: 7,
    versatility: 7,
  },
  season: '',
  timeOfDay: '',
  category: 'niche',
}

interface ProductRow {
  id: string
  slug: string
  brand: string
  name: string
  description: string
  gender: Gender
  notes: ProductNotes
  image_url: string
  is_active: boolean
}

interface OfferRow {
  id: string
  product_id: string
  section: CatalogSection
  price_per_ml_tenge: number
  is_original: boolean
  is_in_stock: boolean
  is_active: boolean
}

export function toPerfumeCard(product: ProductRow, offer: OfferRow): Perfume {
  const display = product.notes.display ?? DEFAULT_DISPLAY
  return {
    id: offer.id,
    offerId: offer.id,
    productId: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    price: priceForVolume(offer.price_per_ml_tenge, DEFAULT_VOLUME_ML),
    pricePerMl: offer.price_per_ml_tenge,
    section: offer.section,
    image: product.image_url,
    category: display.category,
    gender: product.gender,
    notes: {
      top: product.notes.top ?? [],
      middle: product.notes.middle ?? [],
      base: product.notes.base ?? [],
    },
    ratings: display.ratings,
    season: display.season,
    timeOfDay: display.timeOfDay,
    mood: display.mood,
    description: product.description,
    tags: display.tags,
    moodIcon: display.moodIcon,
    bottleColor: display.bottleColor,
    bottleAccent: display.bottleAccent,
    pairsWith: [],
    isBestseller: display.isBestseller,
    isNew: display.isNew,
    isInStock: offer.is_in_stock,
    isOriginal: offer.is_original,
  }
}

export function localCatalog(): Perfume[] {
  return perfumes.map((perfume) => {
    const seeded = perfumeToSeed(perfume)
    return {
      ...perfume,
      id: seeded.offer.id,
      offerId: seeded.offer.id,
      productId: seeded.product.id,
      slug: seeded.product.slug,
      isInStock: true,
      isOriginal: seeded.offer.isOriginal,
    }
  })
}

export interface CatalogResult {
  perfumes: Perfume[]
  error: boolean
}

export async function getCatalogResult(): Promise<CatalogResult> {
  if (!getPublicSupabaseEnv()) {
    return { perfumes: localCatalog(), error: false }
  }

  try {
    const supabase = await createSupabaseServerClient()
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, slug, brand, name, description, gender, notes, image_url, is_active')
      .eq('is_active', true)

    if (productsError || !products) {
      logger.error('catalog_products_failed', { message: productsError?.message ?? 'empty' })
      return { perfumes: [], error: true }
    }

    const { data: offers, error: offersError } = await supabase
      .from('offers')
      .select('id, product_id, section, price_per_ml_tenge, is_original, is_in_stock, is_active')
      .eq('is_active', true)

    if (offersError || !offers) {
      logger.error('catalog_offers_failed', { message: offersError?.message ?? 'empty' })
      return { perfumes: [], error: true }
    }

    const productMap = new Map((products as ProductRow[]).map((product) => [product.id, product]))
    const cards: Perfume[] = []
    for (const offer of offers as OfferRow[]) {
      const product = productMap.get(offer.product_id)
      if (!product) continue
      cards.push(toPerfumeCard(product, offer))
    }
    return { perfumes: cards, error: false }
  } catch (error) {
    logger.error('catalog_query_failed', {
      message: error instanceof Error ? error.message : 'unknown',
    })
    return { perfumes: [], error: true }
  }
}

export async function getCatalog(): Promise<Perfume[]> {
  const result = await getCatalogResult()
  return result.perfumes
}

export async function getPerfumeBySlug(slug: string): Promise<Perfume | null> {
  const catalog = await getCatalog()
  return catalog.find((perfume) => perfume.slug === slug) ?? null
}

export function similarPerfumes(catalog: Perfume[], current: Perfume, limit = 4): Perfume[] {
  const others = catalog.filter((perfume) => perfume.id !== current.id)
  const sameSection = others.filter((perfume) => perfume.section === current.section)
  const pool = sameSection.length >= limit ? sameSection : others
  return pool.slice(0, limit)
}

