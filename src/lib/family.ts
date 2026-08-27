import type { Perfume } from './data'

export const FRAGRANCE_FAMILIES = [
  { id: 'citrus', label: 'Цитрус' },
  { id: 'woody', label: 'Древесный' },
  { id: 'oriental', label: 'Восточный' },
  { id: 'fougere', label: 'Фужер' },
  { id: 'floral', label: 'Цветочный' },
  { id: 'gourmand', label: 'Гурман' },
] as const

export type FragranceFamilyId = (typeof FRAGRANCE_FAMILIES)[number]['id']

const FAMILY_KEYWORDS: Record<FragranceFamilyId, string[]> = {
  citrus: ['бергамот', 'лимон', 'апельсин', 'мандарин', 'нероли', 'цитрус', 'грейпфрут'],
  woody: ['сандал', 'кедр', 'ветивер', 'древес', 'кипарис', 'гуайяк'],
  oriental: ['амбра', 'уд', 'уда', 'шафран', 'ладан', 'бензоин', 'янтарь'],
  fougere: ['дубовый мох', 'лаванда', 'герань', 'пачули', 'патчули'],
  floral: ['роза', 'жасмин', 'фиалка', 'ирис', 'тубероза', 'пион'],
  gourmand: ['ваниль', 'тонка', 'какао', 'кофе', 'карамель', 'миндаль', 'пралине'],
}

function noteHaystack(perfume: Perfume): string {
  return [...perfume.notes.top, ...perfume.notes.middle, ...perfume.notes.base, ...perfume.tags, perfume.mood]
    .join(' ')
    .toLowerCase()
}

export function fragranceFamiliesOf(perfume: Perfume): FragranceFamilyId[] {
  const haystack = noteHaystack(perfume)
  return FRAGRANCE_FAMILIES.filter((family) =>
    FAMILY_KEYWORDS[family.id].some((keyword) => haystack.includes(keyword))
  ).map((family) => family.id)
}

export function familyLabel(id: FragranceFamilyId): string {
  return FRAGRANCE_FAMILIES.find((family) => family.id === id)?.label ?? id
}

export function primaryFamilyLabel(perfume: Perfume): string | null {
  const first = fragranceFamiliesOf(perfume)[0]
  return first ? familyLabel(first) : null
}
