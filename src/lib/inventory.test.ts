import assert from 'node:assert/strict'
import test from 'node:test'
import { productSlug } from './catalog-seed'
import { inventory } from './inventory'
import { perfumes } from './data'

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
