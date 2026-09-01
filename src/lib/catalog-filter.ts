import type { Perfume } from './data'

export type CatalogSectionFilter = 'all' | 'razliv' | 'raspiv'
export type CatalogSortKey = 'popular' | 'price-asc' | 'price-desc' | 'name'
export type CatalogStockFilter = 'all' | 'in' | 'out'

export const CATALOG_PRICE_VOLUME_ML = 5

export interface CatalogMatchInput {
  section: CatalogSectionFilter
  gender: Perfume['gender'] | 'all'
  brand: string
  stock: CatalogStockFilter
  minPrice: string
  maxPrice: string
}

export interface CatalogFilterInput extends CatalogMatchInput {
  sortBy: CatalogSortKey
}

export function matchCatalogFilters(perfumes: Perfume[], filters: CatalogMatchInput): Perfume[] {
  let result = perfumes
  if (filters.section !== 'all') {
    result = result.filter((perfume) => perfume.section === filters.section)
  }
  if (filters.gender !== 'all') {
    result = result.filter((perfume) => perfume.gender === filters.gender)
  }
  if (filters.brand) {
    result = result.filter((perfume) => perfume.brand === filters.brand)
  }
  if (filters.stock === 'in') {
    result = result.filter((perfume) => perfume.isInStock !== false)
  }
  if (filters.stock === 'out') {
    result = result.filter((perfume) => perfume.isInStock === false)
  }

  const min = Number(filters.minPrice)
  const max = Number(filters.maxPrice)
  if (filters.minPrice && Number.isFinite(min)) {
    result = result.filter((perfume) => perfume.pricePerMl * CATALOG_PRICE_VOLUME_ML >= min)
  }
  if (filters.maxPrice && Number.isFinite(max)) {
    result = result.filter((perfume) => perfume.pricePerMl * CATALOG_PRICE_VOLUME_ML <= max)
  }
  return result
}

export function applyCatalogFilters(perfumes: Perfume[], filters: CatalogFilterInput): Perfume[] {
  const result = matchCatalogFilters(perfumes, filters)
  const sorted = [...result]
  switch (filters.sortBy) {
    case 'price-asc':
      sorted.sort((a, b) => a.pricePerMl - b.pricePerMl)
      break
    case 'price-desc':
      sorted.sort((a, b) => b.pricePerMl - a.pricePerMl)
      break
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
      break
    default:
      sorted.sort((a, b) => Number(b.isBestseller) - Number(a.isBestseller))
  }
  return sorted
}

export function hasNarrowingFilters(input: {
  gender: Perfume['gender'] | 'all'
  brand: string
  stock: CatalogStockFilter
  minPrice: string
  maxPrice: string
  query: string
}): boolean {
  return (
    input.gender !== 'all' ||
    Boolean(input.brand) ||
    input.stock !== 'all' ||
    Boolean(input.minPrice) ||
    Boolean(input.maxPrice) ||
    input.query.trim().length > 0
  )
}
