import 'server-only'

import { cache } from 'react'
import { DEFAULT_VOLUME_ML, priceForVolume, type Perfume } from '@/lib/data'
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

export interface CatalogResult {
  perfumes: Perfume[]
  error: boolean
}

export const getCatalogResult = cache(async function getCatalogResult(): Promise<CatalogResult> {
  if (!getPublicSupabaseEnv()) {
    return { perfumes: [], error: true }
  }

  try {
    const supabase = await createSupabaseServerClient()
    const [{ data: products, error: productsError }, { data: offers, error: offersError }] = await Promise.all([
      supabase
        .from('products')
        .select('id, slug, brand, name, description, gender, notes, image_url, is_active')
        .eq('is_active', true),
      supabase
        .from('offers')
        .select('id, product_id, section, price_per_ml_tenge, is_original, is_in_stock, is_active')
        .eq('is_active', true),
    ])

    if (productsError || offersError) {
      logger.error('catalog_fetch_failed', {
        message: productsError?.message ?? offersError?.message ?? 'empty',
      })
      return { perfumes: [], error: true }
    }

    const byProductId = new Map(((products ?? []) as ProductRow[]).map((product) => [product.id, product]))
    const perfumes = ((offers ?? []) as OfferRow[]).flatMap((offer) => {
      const product = byProductId.get(offer.product_id)
      return product ? [toPerfumeCard(product, offer)] : []
    })

    return { perfumes, error: false }
  } catch (error) {
    logger.error('catalog_fetch_failed', {
      message: error instanceof Error ? error.message : 'unknown',
    })
    return { perfumes: [], error: true }
  }
})

export async function getCatalog(): Promise<Perfume[]> {
  const result = await getCatalogResult()
  return result.perfumes
}

export const getPerfumeBySlug = cache(async function getPerfumeBySlug(
  slug: string,
  section?: CatalogSection
): Promise<Perfume | null> {
  if (!getPublicSupabaseEnv()) return null

  try {
    const supabase = await createSupabaseServerClient()
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, slug, brand, name, description, gender, notes, image_url, is_active')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle()

    if (productError || !product) {
      if (productError) {
        logger.error('perfume_fetch_failed', { message: productError.message, slug })
      }
      return null
    }

    const { data: offers, error: offersError } = await supabase
      .from('offers')
      .select('id, product_id, section, price_per_ml_tenge, is_original, is_in_stock, is_active')
      .eq('product_id', product.id)
      .eq('is_active', true)

    if (offersError) {
      logger.error('perfume_fetch_failed', { message: offersError.message, slug })
      return null
    }

    const mapped = ((offers ?? []) as OfferRow[]).map((offer) =>
      toPerfumeCard(product as ProductRow, offer)
    )
    if (mapped.length === 0) return null
    if (section) return mapped.find((perfume) => perfume.section === section) ?? mapped[0] ?? null
    return mapped.find((perfume) => perfume.section === 'razliv') ?? mapped[0] ?? null
  } catch (error) {
    logger.error('perfume_fetch_failed', {
      message: error instanceof Error ? error.message : 'unknown',
      slug,
    })
    return null
  }
})

