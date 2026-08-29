import assert from 'node:assert/strict'
import test from 'node:test'
import { perfumeToSeed, productSlug } from './catalog-seed'
import { inventory } from './inventory'
import { perfumes } from './data'
import { calculateOrder } from './order'

test('inventory has 102 razliv and 3 raspiv items with unique offers', () => {
  assert.equal(inventory.length, 105)
  assert.equal(inventory.filter((item) => item.gender === 'female').length, 23)
  assert.equal(inventory.filter((item) => item.gender === 'male').length, 38)
  assert.equal(inventory.filter((item) => item.gender === 'unisex').length, 44)
  assert.equal(inventory.filter((item) => item.hit).length, 4)

  const slugs = inventory.map((item) => productSlug(item.brand, item.name))
  assert.equal(new Set(slugs).size, 104)

  const keys = inventory.map((item) => `${item.brand}::${item.name}::${item.section ?? 'razliv'}`)
  assert.equal(new Set(keys).size, keys.length)

  assert.equal(perfumes.length, 105)
  assert.equal(perfumes.filter((perfume) => perfume.section === 'razliv').length, 102)
  assert.equal(perfumes.filter((perfume) => perfume.section === 'raspiv').length, 3)
  assert.ok(perfumes.every((perfume) => perfume.isInStock !== false))
  assert.equal(
    perfumes.filter((perfume) => perfume.gender === 'female').length,
    23
  )

  const oud = perfumes.find((item) => item.name === 'No.12 Oud Douze')
  const cedrat = perfumes.find((item) => item.name === 'Cedrat Boise')
  const redRaspiv = perfumes.find((item) => item.name === 'Red Tobacco' && item.section === 'raspiv')
  const redRazliv = perfumes.find((item) => item.name === 'Red Tobacco' && item.section === 'razliv')
  assert.ok(oud && cedrat && redRaspiv && redRazliv)
  assert.equal(oud.pricePerMl, 1600)
  assert.equal(cedrat.pricePerMl, 1500)
  assert.equal(redRaspiv.pricePerMl, 1500)
  assert.equal(redRazliv.pricePerMl, 800)
  assert.equal(perfumeToSeed(oud).offer.section, 'raspiv')
  assert.equal(perfumeToSeed(oud).offer.isOriginal, true)
  assert.equal(perfumeToSeed(redRazliv).product.id, perfumeToSeed(redRaspiv).product.id)
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
