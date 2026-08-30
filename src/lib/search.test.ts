import assert from 'node:assert/strict'
import test from 'node:test'
import { perfumes } from './data'
import { rankPerfumes } from './search'

test('search finds Sauvage Elixir and not regular Sauvage', () => {
  const names = rankPerfumes(perfumes, 'sauvage').map((perfume) => perfume.name)
  assert.ok(names.includes('Sauvage Elixir'))
  assert.equal(names.includes('Sauvage'), false)
})

test('search matches several words against name and brand', () => {
  const names = rankPerfumes(perfumes, 'dior sauvage elixir').map((perfume) => perfume.name)
  assert.ok(names.includes('Sauvage Elixir'))
})

test('search returns full catalog for a one-letter query at rank layer', () => {
  assert.equal(rankPerfumes(perfumes, 's').length, perfumes.length)
})
