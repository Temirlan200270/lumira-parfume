import assert from 'node:assert/strict'
import test from 'node:test'
import { applyCatalogFilters, CATALOG_PRICE_VOLUME_ML, hasNarrowingFilters } from './catalog-filter'
import { perfumes } from './data'

const base = {
  section: 'all' as const,
  gender: 'all' as const,
  brand: '',
  stock: 'all' as const,
  minPrice: '',
  maxPrice: '',
  sortBy: 'popular' as const,
}

test('gender keeps only that gender', () => {
  const female = applyCatalogFilters(perfumes, { ...base, gender: 'female' })
  assert.ok(female.length > 0)
  assert.ok(female.every((item) => item.gender === 'female'))
  assert.equal(
    female.length,
    perfumes.filter((item) => item.gender === 'female').length
  )
})

test('section raspiv does not include razliv of the same name', () => {
  const raspiv = applyCatalogFilters(perfumes, { ...base, section: 'raspiv' })
  assert.equal(raspiv.length, 3)
  assert.ok(raspiv.every((item) => item.section === 'raspiv'))
  const red = raspiv.filter((item) => item.name === 'Red Tobacco')
  assert.equal(red.length, 1)
  assert.equal(red[0]?.pricePerMl, 1500)
})

test('price filter uses 5 ml total, not price per ml', () => {
  const minFiveMl = 5000
  const filtered = applyCatalogFilters(perfumes, { ...base, minPrice: String(minFiveMl) })
  assert.ok(filtered.length > 0)
  assert.ok(filtered.every((item) => item.pricePerMl * CATALOG_PRICE_VOLUME_ML >= minFiveMl))
  assert.equal(
    filtered.some((item) => item.name === 'Red Tobacco' && item.section === 'razliv'),
    false
  )
  assert.ok(filtered.some((item) => item.name === 'Red Tobacco' && item.section === 'raspiv'))
})

test('inverted min/max yields an empty list', () => {
  const filtered = applyCatalogFilters(perfumes, { ...base, minPrice: '20000', maxPrice: '1000' })
  assert.equal(filtered.length, 0)
})

test('brand is exact match', () => {
  const filtered = applyCatalogFilters(perfumes, { ...base, brand: 'Creed' })
  assert.ok(filtered.length > 0)
  assert.ok(filtered.every((item) => item.brand === 'Creed'))
})

test('popular sort puts hits first', () => {
  const filtered = applyCatalogFilters(perfumes, base)
  const hits = filtered.filter((item) => item.isBestseller)
  assert.ok(hits.length >= 3)
  assert.ok(filtered.slice(0, hits.length).every((item) => item.isBestseller))
})

test('out of stock filter is empty when every offer is in stock', () => {
  const filtered = applyCatalogFilters(perfumes, { ...base, stock: 'out' })
  assert.equal(filtered.length, 0)
})

test('narrowing filters exclude the dedicated raspiv empty state', () => {
  assert.equal(
    hasNarrowingFilters({
      gender: 'all',
      brand: '',
      stock: 'all',
      minPrice: '',
      maxPrice: '',
      query: '',
    }),
    false
  )
  assert.equal(
    hasNarrowingFilters({
      gender: 'female',
      brand: '',
      stock: 'all',
      minPrice: '',
      maxPrice: '',
      query: '',
    }),
    true
  )
})
