import { normalizeSearch, type Perfume } from './data'

const RU_TO_LAT: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
}

function transliterate(value: string): string {
  return value
    .split('')
    .map((char) => RU_TO_LAT[char] ?? char)
    .join('')
}

function variants(value: string): string[] {
  const normalized = normalizeSearch(value)
  const translit = normalizeSearch(transliterate(normalized))
  return translit === normalized ? [normalized] : [normalized, translit]
}

function levenshtein(a: string, b: string): number {
  const rows = a.length + 1
  const cols = b.length + 1
  const matrix: number[][] = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0))
  for (let i = 0; i < rows; i += 1) matrix[i][0] = i
  for (let j = 0; j < cols; j += 1) matrix[0][j] = j
  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      )
    }
  }
  return matrix[a.length][b.length]
}

export function searchScore(perfume: Perfume, query: string): number {
  const q = normalizeSearch(query)
  if (q.length < 2) return 0

  const words = q.split(/\s+/).filter(Boolean)
  if (words.length > 1) {
    const scores = words.map((word) => searchScore(perfume, word))
    if (scores.some((score) => score === 0)) return 0
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
  }

  const names = variants(perfume.name)
  const brands = variants(perfume.brand)
  const notes = variants(
    [...perfume.notes.top, ...perfume.notes.middle, ...perfume.notes.base].join(' ')
  )
  const queries = variants(q)

  let best = 0
  for (const needle of queries) {
    if (names.some((name) => name === needle)) best = Math.max(best, 100)
    else if (names.some((name) => name.startsWith(needle))) best = Math.max(best, 90)
    else if (brands.some((brand) => brand.startsWith(needle))) best = Math.max(best, 80)
    else if (names.some((name) => name.includes(needle))) best = Math.max(best, 70)
    else if (brands.some((brand) => brand.includes(needle))) best = Math.max(best, 60)
    else if (notes.some((note) => note.includes(needle))) best = Math.max(best, 50)
  }
  return best
}

function typoScore(perfume: Perfume, query: string): number {
  const q = normalizeSearch(query)
  if (q.length < 4) return 0
  const fields = [...variants(perfume.name), ...variants(perfume.brand)]
  for (const field of fields) {
    if (!field) continue
    if (Math.abs(field.length - q.length) > 1 && !field.split(' ').some((token) => Math.abs(token.length - q.length) <= 1)) {
      continue
    }
    if (levenshtein(field, q) <= 1) return 40
    const tokens = field.split(' ').filter(Boolean)
    if (tokens.some((token) => Math.abs(token.length - q.length) <= 1 && levenshtein(token, q) <= 1)) {
      return 40
    }
  }
  return 0
}

export function rankPerfumes(perfumes: Perfume[], query: string): Perfume[] {
  const q = normalizeSearch(query)
  if (q.length < 2) return perfumes

  const scored = perfumes
    .map((perfume) => ({ perfume, score: searchScore(perfume, query) }))
    .filter((row) => row.score > 0)

  if (scored.length === 0 && q.length >= 4) {
    const typos = perfumes
      .map((perfume) => ({ perfume, score: typoScore(perfume, query) }))
      .filter((row) => row.score > 0)
    return typos.sort((a, b) => b.score - a.score).map((row) => row.perfume)
  }

  return scored.sort((a, b) => b.score - a.score).map((row) => row.perfume)
}

export function searchSuggestions(perfumes: Perfume[], query: string, limit = 6): Perfume[] {
  return rankPerfumes(perfumes, query).slice(0, limit)
}

export const POPULAR_QUERIES = ['Aventus', 'Baccarat', 'Sauvage'] as const
