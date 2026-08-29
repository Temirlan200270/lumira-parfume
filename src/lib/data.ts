import { ALLOWED_VOLUMES, DEFAULT_VOLUME_ML, WHATSAPP_LINK, WHATSAPP_PHONE } from './constants'
import { inventory } from './inventory'
import { formatTenge, priceForVolume } from './order'
import type { CatalogSection, VolumeMl } from './types'

export type PerfumeSection = CatalogSection
export const VOLUME_OPTIONS = ALLOWED_VOLUMES
export const RAZLIV_PRICE_PER_ML = 800
export { DEFAULT_VOLUME_ML, WHATSAPP_LINK, WHATSAPP_PHONE, formatTenge, priceForVolume }
export type { VolumeMl }

export function normalizeSearch(value: string): string {
  return value
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^a-zа-я0-9]+/gi, ' ')
    .trim()
}

export function matchesPerfumeSearch(perfume: Perfume, query: string): boolean {
  const words = normalizeSearch(query).split(/\s+/).filter(Boolean)
  if (words.length === 0) return true

  const haystack = normalizeSearch(
    [
      perfume.name,
      perfume.brand,
      perfume.description,
      perfume.mood,
      perfume.section === 'raspiv' ? 'распив оригинал original' : 'разлив',
      perfume.gender === 'male' ? 'мужской мужские' : perfume.gender === 'female' ? 'женский женские' : 'унисекс',
      ...perfume.tags,
      ...perfume.notes.top,
      ...perfume.notes.middle,
      ...perfume.notes.base,
    ].join(' ')
  )

  return words.every((word) => haystack.includes(word))
}

export interface Perfume {
  id: string
  name: string
  brand: string
  price: number
  pricePerMl: number
  section: PerfumeSection
  image: string
  category: string
  gender: 'male' | 'female' | 'unisex'
  notes: {
    top: string[]
    middle: string[]
    base: string[]
  }
  ratings: {
    longevity: number
    sillage: number
    compliments: number
    versatility: number
  }
  season: string
  timeOfDay: string
  mood: string
  description: string
  tags: string[]
  moodIcon: string
  bottleColor: string
  bottleAccent: string
  pairsWith: string[]
  isBestseller?: boolean
  isNew?: boolean
  offerId?: string
  productId?: string
  slug?: string
  isInStock?: boolean
  isOriginal?: boolean
}

const EMPTY_NOTES = { top: [], middle: [], base: [] }
const DEFAULT_RATINGS = { longevity: 7, sillage: 7, compliments: 7, versatility: 7 }

export const perfumes: Perfume[] = inventory.map((item, index) => ({
  id: String(index + 1),
  name: item.name,
  brand: item.brand,
  price: RAZLIV_PRICE_PER_ML * DEFAULT_VOLUME_ML,
  pricePerMl: RAZLIV_PRICE_PER_ML,
  section: 'razliv',
  image: '',
  category: 'catalog',
  gender: item.gender,
  notes: EMPTY_NOTES,
  ratings: DEFAULT_RATINGS,
  season: '',
  timeOfDay: '',
  mood: '',
  description: '',
  tags: [],
  moodIcon: '',
  bottleColor: '#e7e5e4',
  bottleAccent: '#a8a29e',
  pairsWith: [],
  isBestseller: Boolean(item.hit),
  isInStock: true,
}))

export const discoverySets = [
  {
    id: 'ds1',
    name: 'Набор открытий: Лето',
    description: '4 пробника по 2 мл для солнечных дней',
    price: 45,
    image: '/sets/summer.jpg',
    perfumes: ['5', '1', '6', '2'],
  },
  {
    id: 'ds2',
    name: 'Набор открытий: Зима',
    description: '4 пробника по 2 мл для холодного сезона',
    price: 45,
    image: '/sets/winter.jpg',
    perfumes: ['7', '4', '2', '8'],
  },
  {
    id: 'ds3',
    name: 'Набор открытий: Ниша',
    description: '4 пробника по 2 мл для ценителей',
    price: 55,
    image: '/sets/niche.jpg',
    perfumes: ['3', '2', '7', '1'],
  },
]

export const categories = [
  { id: 'all', name: 'Все', icon: '' },
  { id: 'razliv', name: 'Разлив', icon: '💧' },
  { id: 'raspiv', name: 'Распив', icon: '🧪' },
]

export const moods = [
  'Хочу пахнуть дорого',
  'Для свидания',
  'Офисный аромат',
  'Комплиментарный',
  'На лето',
  'На зиму',
  'Нишевая парфюмерия',
  'На каждый день',
]

export const quizQuestions = [
  {
    id: 1,
    question: 'Что вы предпочитаете?',
    icon: '🌸',
    options: [
      { label: 'Сладкие и цветочные', value: 'sweet', icon: '🍯' },
      { label: 'Свежие цитрусовые', value: 'fresh', icon: '🍋' },
      { label: 'Древесные и землистые', value: 'woody', icon: '🌲' },
      { label: 'Дубильные и кожаные', value: 'leather', icon: '🧥' },
    ],
  },
  {
    id: 2,
    question: 'Когда планируете носить?',
    icon: '⏰',
    options: [
      { label: 'День — работа/учеба', value: 'day', icon: '☀️' },
      { label: 'Вечер — встреча/свидание', value: 'night', icon: '🌙' },
      { label: 'И день, и вечер', value: 'both', icon: '🌓' },
    ],
  },
  {
    id: 3,
    question: 'Какое настроение?',
    icon: '💭',
    options: [
      { label: 'Уверенность и сила', value: 'power', icon: '💪' },
      { label: 'Романтика и мягкость', value: 'romantic', icon: '💕' },
      { label: 'Спокойствие и баланс', value: 'calm', icon: '🧘' },
    ],
  },
  {
    id: 4,
    question: 'Сезон?',
    icon: '🌤️',
    options: [
      { label: 'Лето', value: 'summer', icon: '☀️' },
      { label: 'Зима', value: 'winter', icon: '❄️' },
      { label: 'Все сезоны', value: 'all', icon: '♾️' },
    ],
  },
]
