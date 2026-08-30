import assert from 'node:assert/strict'
import test from 'node:test'
import { perfumeToSeed, productSlug } from './catalog-seed'
import { inventory } from './inventory'
import { perfumes } from './data'
import { calculateOrder } from './order'

test('inventory has 90 razliv and 3 raspiv items with unique offers', () => {
  assert.equal(inventory.length, 93)
  assert.equal(inventory.filter((item) => item.gender === 'female').length, 21)
  assert.equal(inventory.filter((item) => item.gender === 'male').length, 30)
  assert.equal(inventory.filter((item) => item.gender === 'unisex').length, 42)
  assert.equal(inventory.filter((item) => item.hit).length, 3)

  const slugs = inventory.map((item) => productSlug(item.brand, item.name))
  assert.equal(new Set(slugs).size, 92)

  const keys = inventory.map((item) => `${item.brand}::${item.name}::${item.section ?? 'razliv'}`)
  assert.equal(new Set(keys).size, keys.length)

  assert.equal(perfumes.length, 93)
  assert.equal(perfumes.filter((perfume) => perfume.section === 'razliv').length, 90)
  assert.equal(perfumes.filter((perfume) => perfume.section === 'raspiv').length, 3)
  assert.ok(perfumes.every((perfume) => perfume.isInStock !== false))
  assert.equal(
    perfumes.filter((perfume) => perfume.gender === 'female').length,
    21
  )

  const retiredBrands = ['Rabanne', 'Paco Rabanne', 'Tiziana Terenzi', 'Dolce&Gabbana']
  assert.equal(inventory.filter((item) => retiredBrands.includes(item.brand)).length, 0)
  assert.equal(inventory.filter((item) => item.brand === 'Dior' && item.name === 'Sauvage').length, 0)
  assert.ok(inventory.some((item) => item.brand === 'Dior' && item.name === 'Sauvage Elixir'))
  assert.equal(inventory.filter((item) => item.name === 'Allure Homme Sport').length, 0)
  assert.equal(inventory.filter((item) => item.name === 'Eros Parfum').length, 0)

  assert.ok(inventory.some((item) => item.name === 'Black Opium'))
  assert.ok(inventory.some((item) => item.brand === 'Hormone Paris' && /gaba/i.test(item.name)))
  assert.ok(inventory.some((item) => item.name === 'Spicebomb Metallic Musk'))
  assert.equal(inventory.filter((item) => item.name === 'Black Opium Pink Glaze').length, 0)
  assert.equal(inventory.filter((item) => item.name === 'Vanilla Sex').length, 0)
  assert.ok(inventory.some((item) => item.brand === 'Maison Crivelli' && item.name === 'Hibiscus Mahajád'))
  assert.ok(inventory.some((item) => item.brand === 'Maison Crivelli' && item.name === 'Oud Maracujá'))
  assert.ok(inventory.some((item) => item.brand === 'Marc-Antoine Barrois' && item.name === 'Ganymede'))

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
