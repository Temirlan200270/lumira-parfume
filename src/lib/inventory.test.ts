import assert from 'node:assert/strict'
import test from 'node:test'
import { perfumeToSeed, productSlug } from './catalog-seed'
import { inventory } from './inventory'
import { perfumes } from './data'
import { calculateOrder } from './order'

test('inventory has 102 unique in-stock items with correct genders', () => {
  assert.equal(inventory.length, 102)
  assert.equal(inventory.filter((item) => item.gender === 'female').length, 23)
  assert.equal(inventory.filter((item) => item.gender === 'male').length, 38)
  assert.equal(inventory.filter((item) => item.gender === 'unisex').length, 41)
  assert.equal(inventory.filter((item) => item.hit).length, 4)

  const slugs = inventory.map((item) => productSlug(item.brand, item.name))
  assert.equal(new Set(slugs).size, slugs.length)

  const keys = inventory.map((item) => `${item.brand}::${item.name}`)
  assert.equal(new Set(keys).size, keys.length)

  assert.equal(perfumes.length, 102)
  assert.ok(perfumes.every((perfume) => perfume.section === 'razliv'))
  assert.ok(perfumes.every((perfume) => perfume.isInStock !== false))
  assert.equal(
    perfumes.filter((perfume) => perfume.gender === 'female').length,
    23
  )
})

test('seed offer ids stay stable for order calculation', () => {
  const perfume = perfumes.find((item) => item.brand === 'Lattafa' || item.name === 'Khamrah')
    ?? perfumes.find((item) => item.brand !== 'Creed')
  assert.ok(perfume)
  const seeded = perfumeToSeed(perfume)
  const result = calculateOrder(
    [{ offerId: seeded.offer.id, volumeMl: 5, quantity: 1 }],
    [
      {
        id: seeded.offer.id,
        productId: seeded.product.id,
        brand: perfume.brand,
        name: perfume.name,
        section: perfume.section,
        pricePerMlTenge: perfume.pricePerMl,
        isOriginal: false,
        isInStock: true,
        isActive: true,
        productIsActive: true,
      },
    ]
  )
  assert.equal(result.ok, true)
  if (result.ok) {
    assert.equal(result.value.totalTenge, perfume.pricePerMl * 5)
    assert.equal(result.value.items[0]?.name, perfume.name)
  }
})
