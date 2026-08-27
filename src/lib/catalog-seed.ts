import { createHash } from 'node:crypto'
import type { CatalogDisplay, CatalogSection, Gender, ProductNotes } from './types'
import type { Perfume } from './data'

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/n°/g, 'no')
    .replace(/№/g, 'no')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function productSlug(brand: string, name: string): string {
  return slugify(`${brand} ${name}`)
}

export function uuidFromSeed(seed: string): string {
  const hash = createHash('sha1').update(seed).digest('hex')
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`
}

export function productIdFromSlug(slug: string): string {
  return uuidFromSeed(`product:${slug}`)
}

export function offerIdFromSlug(slug: string, section: CatalogSection): string {
  return uuidFromSeed(`offer:${slug}:${section}`)
}

export interface CatalogSeedProduct {
  id: string
  slug: string
  brand: string
  name: string
  description: string
  gender: Gender
  notes: ProductNotes
  imageUrl: string
}

export interface CatalogSeedOffer {
  id: string
  productId: string
  section: CatalogSection
  pricePerMlTenge: number
  isOriginal: boolean
}

export function perfumeToSeed(perfume: Perfume): {
  product: CatalogSeedProduct
  offer: CatalogSeedOffer
} {
  const slug = productSlug(perfume.brand, perfume.name)
  const productId = productIdFromSlug(slug)
  const display: CatalogDisplay = {
    tags: perfume.tags,
    mood: perfume.mood,
    moodIcon: perfume.moodIcon,
    bottleColor: perfume.bottleColor,
    bottleAccent: perfume.bottleAccent,
    ratings: perfume.ratings,
    season: perfume.season,
    timeOfDay: perfume.timeOfDay,
    category: perfume.category,
    isBestseller: perfume.isBestseller,
    isNew: perfume.isNew,
  }

  return {
    product: {
      id: productId,
      slug,
      brand: perfume.brand,
      name: perfume.name,
      description: perfume.description,
      gender: perfume.gender,
      notes: {
        top: perfume.notes.top,
        middle: perfume.notes.middle,
        base: perfume.notes.base,
        display,
      },
      imageUrl: perfume.image,
    },
    offer: {
      id: offerIdFromSlug(slug, perfume.section),
      productId,
      section: perfume.section,
      pricePerMlTenge: perfume.pricePerMl,
      isOriginal: perfume.section === 'raspiv',
    },
  }
}
