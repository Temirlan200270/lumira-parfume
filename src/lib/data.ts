import { ALLOWED_VOLUMES, DEFAULT_VOLUME_ML, WHATSAPP_LINK, WHATSAPP_PHONE } from './constants'
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

export const bottleColors: Record<string, { color: string; accent: string }> = {
  ' Creed Aventus': { color: '#1a3a4a', accent: '#2d6a8a' },
  ' MFK Baccarat': { color: '#c9a227', accent: '#f4d03f' },
  ' Tom Ford Tobacco': { color: '#3e2723', accent: '#5d4037' },
  ' Le Labo Santal': { color: '#d7ccc8', accent: '#a1887f' },
  ' Xerjoff Erba': { color: '#e8f5e9', accent: '#81c784' },
  ' Clive Christian': { color: '#1a1a2e', accent: '#16213e' },
  ' Parfums Marly': { color: '#fce4ec', accent: '#f8bbd0' },
  ' Roja Elysium': { color: '#e3f2fd', accent: '#90caf9' },
  ' Initio Oud': { color: '#4a148c', accent: '#7b1fa2' },
  ' Amouage Reflection': { color: '#eceff1', accent: '#b0bec5' },
  ' Dior Sauvage': { color: '#1a237e', accent: '#283593' },
  ' Chanel Bleu': { color: '#0d47a1', accent: '#1565c0' },
  ' YSL Y': { color: '#263238', accent: '#37474f' },
  ' Versace Eros': { color: '#1b5e20', accent: '#2e7d32' },
  ' Lacoste Pour': { color: '#e8f5e9', accent: '#66bb6a' },
  ' Dior Miss': { color: '#fce4ec', accent: '#ec407a' },
  ' Chanel Coco': { color: '#f3e5f5', accent: '#ce93d8' },
  ' YSL Black': { color: '#212121', accent: '#424242' },
  ' Versace Bright': { color: '#e0f7fa', accent: '#4dd0e1' },
  ' Viktor Rolf': { color: '#004d40', accent: '#00695c' },
  ' Le Labo Another': { color: '#f5f5f5', accent: '#e0e0e0' },
  ' Byredo Gypsy': { color: '#d7ccc8', accent: '#a1887f' },
  ' Diptyque Philosykos': { color: '#f1f8e9', accent: '#aed581' },
  ' MM Jazz Club': { color: '#3e2723', accent: '#6d4c41' },
  ' Aesop Hwyl': { color: '#1b5e20', accent: '#388e3c' },
  ' Frederic Malle': { color: '#fff3e0', accent: '#ffb74d' },
  ' Nasomatto Baraonda': { color: '#8d6e63', accent: '#a1887f' },
  ' Tauer LTT': { color: '#e1f5fe', accent: '#81d4fa' },
  ' DS Durga Rose': { color: '#fce4ec', accent: '#f48fb1' },
  ' Olympic Orchids': { color: '#e8eaf6', accent: '#9fa8da' },
}

const razlivBase: Omit<Perfume, 'section' | 'pricePerMl'>[] = [
  {
    id: '1',
    name: 'Aventus',
    brand: 'Creed',
    price: 320,
    image: '/perfumes/aventus.jpg',
    category: 'luxury',
    gender: 'male',
    notes: {
      top: ['Бергамот', 'Яблоко', 'Черная смородина'],
      middle: ['Берёза', 'Амор', 'Дриас', 'Жасмин'],
      base: ['Мускус', 'Дубовый мох', 'Амбра', 'Ваниль']
    },
    ratings: { longevity: 9, sillage: 8, compliments: 10, versatility: 7 },
    season: 'Осень',
    timeOfDay: 'День и вечер',
    mood: 'Дорого, уверенность',
    description: 'Свежий цитрусовый старт напоминает утреннюю прогулку по побережью Средиземного моря.',
    tags: ['#свежий', '#деловой', '#вечерний'],
    moodIcon: '💎',
    bottleColor: '#1a3a4a',
    bottleAccent: '#2d6a8a',
    pairsWith: ['12', '19'],
    isBestseller: true
  },
  {
    id: '2',
    name: 'Baccarat Rouge 540',
    brand: 'Maison Francis Kurkdjian',
    price: 380,
    image: '/perfumes/baccarat.jpg',
    category: 'luxury',
    gender: 'unisex',
    notes: {
      top: ['Шалфей', 'Апельсин'],
      middle: ['Жасмин амиакт', 'Мандарин'],
      base: ['Янтарь', 'Кедр', 'Амбра']
    },
    ratings: { longevity: 10, sillage: 9, compliments: 10, versatility: 6 },
    season: 'Зима',
    timeOfDay: 'Вечер',
    mood: 'Элитный, оперный',
    description: 'Золотой аромат для тех, кто привык быть в центре внимания.',
    tags: ['#элитный', '#сладкий', '#акцентный'],
    moodIcon: '🔥',
    bottleColor: '#c9a227',
    bottleAccent: '#f4d03f',
    pairsWith: ['1', '8'],
    isBestseller: true
  },
  {
    id: '3',
    name: 'Santal 33',
    brand: 'Le Labo',
    price: 280,
    image: '/perfumes/santal33.jpg',
    category: 'niche',
    gender: 'unisex',
    notes: {
      top: ['Бергамот', 'Фиалка'],
      middle: ['Сандал', 'Кожа', 'Тонка бобы'],
      base: ['Кедр', 'Ваниль', 'Мускус']
    },
    ratings: { longevity: 8, sillage: 8, compliments: 9, versatility: 8 },
    season: 'Все сезоны',
    timeOfDay: 'Офис, вечер',
    mood: 'Уютный, интеллектуальный',
    description: 'Древесно-кожаная композиция для ценителей минимализма.',
    tags: ['#уютный', '#интеллектуальный', '#повседневный'],
    moodIcon: '☕',
    bottleColor: '#d7ccc8',
    bottleAccent: '#a1887f',
    pairsWith: ['5', '7'],
    isBestseller: true
  },
  {
    id: '4',
    name: 'Poison Girl',
    brand: 'Dior',
    price: 135,
    image: '/perfumes/poison.jpg',
    category: 'designer',
    gender: 'female',
    notes: {
      top: ['Апельсин', 'Лимон'],
      middle: ['Роза', 'Ваниль', 'Миндаль'],
      base: ['Бобы тонка', 'Уд', 'Кедр']
    },
    ratings: { longevity: 9, sillage: 8, compliments: 9, versatility: 7 },
    season: 'Зима',
    timeOfDay: 'Вечер',
    mood: 'Сладкий, дерзкий',
    description: 'Для свидания, которое хочется запомнить.',
    tags: ['#сладкий', '#дерзкий', '#свидание'],
    moodIcon: '💋',
    bottleColor: '#fce4ec',
    bottleAccent: '#ec407a',
    pairsWith: ['2', '6'],
    isNew: true
  },
  {
    id: '5',
    name: 'Acqua di Giò',
    brand: 'Armani',
    price: 98,
    image: '/perfumes/acqua.jpg',
    category: 'designer',
    gender: 'male',
    notes: {
      top: ['Лимон', 'Бергамот', 'Нероли'],
      middle: ['Жасмин', 'Роза', 'Ладанник'],
      base: ['Мускус', 'Дубовый мох', 'Патчули']
    },
    ratings: { longevity: 7, sillage: 6, compliments: 8, versatility: 9 },
    season: 'Лето',
    timeOfDay: 'День',
    mood: 'Свежий, офисный',
    description: 'Классика для повседневного ношения. Никаких сюрпризов — только удовольствие.',
    tags: ['#свежий', '#офис', '#лето'],
    moodIcon: '💼',
    bottleColor: '#1a237e',
    bottleAccent: '#283593',
    pairsWith: ['3', '6'],
    isBestseller: true
  },
  {
    id: '6',
    name: 'Miss Dior',
    brand: 'Dior',
    price: 120,
    image: '/perfumes/missdior.jpg',
    category: 'designer',
    gender: 'female',
    notes: {
      top: ['Апельсин', 'Мандарин'],
      middle: ['Роза', 'Пион', 'Сирень'],
      base: ['Патчули', 'Ваниль', 'Мускус']
    },
    ratings: { longevity: 7, sillage: 7, compliments: 9, versatility: 8 },
    season: 'Весна',
    timeOfDay: 'День',
    mood: 'Романтичный, лёгкий',
    description: 'Цветочная свежесть для весеннего настроения.',
    tags: ['#романтичный', '#цветочный', '#лёгкий'],
    moodIcon: '🌸',
    bottleColor: '#fce4ec',
    bottleAccent: '#ec407a',
    pairsWith: ['4', '8'],
    isNew: true
  },
  {
    id: '7',
    name: 'Tobacco Vanille',
    brand: 'Tom Ford',
    price: 260,
    image: '/perfumes/tobacco.jpg',
    category: 'luxury',
    gender: 'unisex',
    notes: {
      top: ['Табак', 'Ароматическая ваниль', 'Земляничное дерево'],
      middle: ['Цветок табака', 'Какао'],
      base: ['Ваниль', 'Сандал', 'Дуб']
    },
    ratings: { longevity: 10, sillage: 9, compliments: 10, versatility: 5 },
    season: 'Осень',
    timeOfDay: 'Вечер',
    mood: 'Мужской, сытный',
    description: 'Зимний аромат для уверенных в себе.',
    tags: ['#сытный', '#зимний', '#премиум'],
    moodIcon: '🌙',
    bottleColor: '#3e2723',
    bottleAccent: '#5d4037',
    pairsWith: ['1', '3'],
    isNew: true
  },
  {
    id: '8',
    name: 'Chanel N°5',
    brand: 'Chanel',
    price: 150,
    image: '/perfumes/chanel5.jpg',
    category: 'designer',
    gender: 'female',
    notes: {
      top: ['Альдегиды', 'Лимон', 'Нероли', 'Лаванда'],
      middle: ['Жасмин', 'Ирис', 'Ландыш', 'Роза'],
      base: ['Ваниль', 'Мускус', 'Сандал', 'Кедр']
    },
    ratings: { longevity: 9, sillage: 8, compliments: 10, versatility: 7 },
    season: 'Все сезоны',
    timeOfDay: 'День и вечер',
    mood: 'Классика, элегантность',
    description: 'Самая известная композиция в мире. Вневременная элегантность.',
    tags: ['#классика', '#элегантность', '#универсальный'],
    moodIcon: '👑',
    bottleColor: '#f3e5f5',
    bottleAccent: '#ce93d8',
    pairsWith: ['6', '2'],
    isBestseller: true
  },
  {
    id: '9',
    name: 'Erba Pura',
    brand: 'Xerjoff',
    price: 290,
    image: '/perfumes/erba.jpg',
    category: 'luxury',
    gender: 'unisex',
    notes: {
      top: ['Бергамот', 'Апельсин', 'Кировый перец'],
      middle: ['Фиалка', 'Роза', 'Мусатники'],
      base: ['Мускус', 'Амбра', 'Ваниль']
    },
    ratings: { longevity: 9, sillage: 9, compliments: 10, versatility: 7 },
    season: 'Лето',
    timeOfDay: 'День и вечер',
    mood: 'Яркий, праздничный',
    description: 'Сицилийское солнце в каждой капле. Очень яркий и запоминающийся.',
    tags: ['#яркий', '#цитрусовый', '#премиум'],
    moodIcon: '✨',
    bottleColor: '#e8f5e9',
    bottleAccent: '#81c784',
    pairsWith: ['2', '11'],
    isNew: true
  },
  {
    id: '10',
    name: 'No. 1',
    brand: 'Clive Christian',
    price: 450,
    image: '/perfumes/clive.jpg',
    category: 'luxury',
    gender: 'male',
    notes: {
      top: ['Лаванда', 'Базилик', 'Апельсин'],
      middle: ['Роза', 'Жасмин', 'Герань'],
      base: ['Сандал', 'Ваниль', 'Мускус']
    },
    ratings: { longevity: 10, sillage: 10, compliments: 9, versatility: 5 },
    season: 'Все сезоны',
    timeOfDay: 'Вечер',
    mood: 'Императорский, роскошный',
    description: 'Самый дорогой парфюм в мире. Для тех, кто ценит абсолют.',
    tags: ['#императорский', '#люкс', '#вечерний'],
    moodIcon: '👑',
    bottleColor: '#1a1a2e',
    bottleAccent: '#16213e',
    pairsWith: ['7', '18'],
    isBestseller: true
  },
  {
    id: '11',
    name: 'Haltane',
    brand: 'Parfums de Marly',
    price: 310,
    image: '/perfumes/haltane.jpg',
    category: 'luxury',
    gender: 'male',
    notes: {
      top: ['Бергамот', 'Мята', 'Фиалка'],
      middle: ['Абрикос', 'Лаванда', 'Кожа'],
      base: ['Дубовый мох', 'Патчули', 'Ваниль']
    },
    ratings: { longevity: 9, sillage: 8, compliments: 9, versatility: 7 },
    season: 'Осень',
    timeOfDay: 'День и вечер',
    mood: 'Джентльменский, сдержанный',
    description: 'Золотой стандарт современной мужской парфюмерии.',
    tags: ['#джентльмен', '#осенний', '#премиум'],
    moodIcon: '🎩',
    bottleColor: '#fce4ec',
    bottleAccent: '#f8bbd0',
    pairsWith: ['1', '12'],
    isNew: true
  },
  {
    id: '12',
    name: 'Elysium',
    brand: 'Roja Parfums',
    price: 400,
    image: '/perfumes/elysium.jpg',
    category: 'luxury',
    gender: 'male',
    notes: {
      top: ['Грейпфрут', 'Лимон', 'Бергамот'],
      middle: ['Лаванда', 'Роза', 'Перец'],
      base: ['Дубовый мох', 'Мускус', 'Амбра']
    },
    ratings: { longevity: 9, sillage: 8, compliments: 8, versatility: 6 },
    season: 'Лето',
    timeOfDay: 'День',
    mood: 'Светский, уверенный',
    description: 'Аромат высокого общества. Свежесть с характером.',
    tags: ['#светский', '#свежий', '#люкс'],
    moodIcon: '🌟',
    bottleColor: '#e3f2fd',
    bottleAccent: '#90caf9',
    pairsWith: ['5', '11'],
    isNew: true
  },
  {
    id: '13',
    name: 'Oud for Greatness',
    brand: 'Initio Parfums Prives',
    price: 350,
    image: '/perfumes/oud.jpg',
    category: 'luxury',
    gender: 'unisex',
    notes: {
      top: ['Лаванда', 'Шафран', 'Мята'],
      middle: ['Амбра', 'Мускатный орех'],
      base: ['Агарwood (UD)', 'Сандал', 'Пачули']
    },
    ratings: { longevity: 10, sillage: 10, compliments: 9, versatility: 5 },
    season: 'Зима',
    timeOfDay: 'Вечер',
    mood: 'Таинственный, мощный',
    description: 'Исламский люкс. Могучий и завораживающий.',
    tags: ['#мощный', '#восточный', '#ночной'],
    moodIcon: '🌙',
    bottleColor: '#4a148c',
    bottleAccent: '#7b1fa2',
    pairsWith: ['15', '22'],
    isBestseller: true
  },
  {
    id: '14',
    name: 'Reflection Man',
    brand: 'Amouage',
    price: 370,
    image: '/perfumes/reflection.jpg',
    category: 'luxury',
    gender: 'male',
    notes: {
      top: ['Бергамот', 'Мята', 'Апельсин'],
      middle: ['Роза', 'Красное дерево', 'Жасмин'],
      base: ['Сандал', 'Мускус', 'Амбра']
    },
    ratings: { longevity: 9, sillage: 8, compliments: 9, versatility: 7 },
    season: 'Лето',
    timeOfDay: 'День и вечер',
    mood: 'Блистательный, морской',
    description: 'Бриллиантовая свежесть. Для ярких личностей.',
    tags: ['#бриллиант', '#морской', '#свежий'],
    moodIcon: '💠',
    bottleColor: '#eceff1',
    bottleAccent: '#b0bec5',
    pairsWith: ['9', '17'],
    isNew: true
  },
  {
    id: '15',
    name: 'Sauvage EDP',
    brand: 'Dior',
    price: 130,
    image: '/perfumes/sauvage.jpg',
    category: 'designer',
    gender: 'male',
    notes: {
      top: ['Бергамот', 'Пряности'],
      middle: ['Лаванда', 'Фиалка', 'Шалфей'],
      base: ['Амброксан', 'Дубовый мох', 'Амбра']
    },
    ratings: { longevity: 9, sillage: 9, compliments: 8, versatility: 7 },
    season: 'Все сезоны',
    timeOfDay: 'День и вечер',
    mood: 'Дикий, привлекательный',
    description: 'Самый продаваемый мужской аромат в мире. Брутальность и харизма.',
    tags: ['#брутальный', '#хит', '#всесезонный'],
    moodIcon: '🐺',
    bottleColor: '#1a237e',
    bottleAccent: '#283593',
    pairsWith: ['5', '11'],
    isBestseller: true
  },
  {
    id: '16',
    name: 'Bleu de Chanel EDP',
    brand: 'Chanel',
    price: 140,
    image: '/perfumes/bleu.jpg',
    category: 'designer',
    gender: 'male',
    notes: {
      top: ['Бергамот', 'Мята', 'Лимон'],
      middle: ['Имбирь', 'Жасмин', 'Нероли'],
      base: ['Сандал', 'Дубовый мох', 'Элеми']
    },
    ratings: { longevity: 8, sillage: 8, compliments: 8, versatility: 9 },
    season: 'Все сезоны',
    timeOfDay: 'День и вечер',
    mood: 'Элегантный, уверенный',
    description: 'Утончённая классика. Код Chanel для мужчин.',
    tags: ['#элегантный', '#классика', '#универсальный'],
    moodIcon: '🧊',
    bottleColor: '#0d47a1',
    bottleAccent: '#1565c0',
    pairsWith: ['12', '22'],
    isNew: true
  },
  {
    id: '17',
    name: 'Y EDP',
    brand: 'Yves Saint Laurent',
    price: 105,
    image: '/perfumes/ysl-y.jpg',
    category: 'designer',
    gender: 'male',
    notes: {
      top: ['Яблоко', 'Бергамот', 'Имбирь'],
      middle: ['Тимьян', 'Лаванда', 'Берёза'],
      base: ['Амбра', 'Дубовый мох', 'Бобы тонка']
    },
    ratings: { longevity: 8, sillage: 7, compliments: 8, versatility: 8 },
    season: 'Осень',
    timeOfDay: 'День',
    mood: 'Творческий, энергичный',
    description: 'Для тех, кто создаёт будущее. Аромат Y-формации.',
    tags: ['#современный', '#деловой', '#осенний'],
    moodIcon: '⚡',
    bottleColor: '#263238',
    bottleAccent: '#37474f',
    pairsWith: ['1', '16'],
    isNew: true
  },
  {
    id: '18',
    name: 'Eros',
    brand: 'Versace',
    price: 90,
    image: '/perfumes/eros.jpg',
    category: 'designer',
    gender: 'male',
    notes: {
      top: ['Яблоко', 'Мята', 'Лимон'],
      middle: ['Тонка бобы', 'Жасмин', 'Роза'],
      base: ['Ваниль', 'Дубовый мох', 'Кедр']
    },
    ratings: { longevity: 8, sillage: 8, compliments: 9, versatility: 6 },
    season: 'Зима',
    timeOfDay: 'Вечер',
    mood: 'Страстный, мифологический',
    description: 'Назван в честь бога любви. Сладкий, но не приторный.',
    tags: ['#страстный', '#сладкий', '#вечерний'],
    moodIcon: '💖',
    bottleColor: '#1b5e20',
    bottleAccent: '#2e7d32',
    pairsWith: ['19', '4'],
    isBestseller: true
  },
  {
    id: '19',
    name: 'Pour Homme',
    brand: 'Lacoste',
    price: 85,
    image: '/perfumes/lacoste.jpg',
    category: 'designer',
    gender: 'male',
    notes: {
      top: ['Яблоко', 'Бергамот', 'Лимон'],
      middle: ['Жасмин', 'Роза', 'Кипарис'],
      base: ['Дубовый мох', 'Мускус', 'Амбра']
    },
    ratings: { longevity: 7, sillage: 6, compliments: 7, versatility: 9 },
    season: 'Лето',
    timeOfDay: 'День',
    mood: 'Спортивный, лёгкий',
    description: 'Утренняя свежесть в каждой капле. По-настоящему лёгкий.',
    tags: ['#спортивный', '#лёгкий', '#летний'],
    moodIcon: '🏸',
    bottleColor: '#e8f5e9',
    bottleAccent: '#66bb6a',
    pairsWith: ['5', '21'],
    isNew: true
  },
  {
    id: '20',
    name: 'Coco Mademoiselle',
    brand: 'Chanel',
    price: 145,
    image: '/perfumes/coco.jpg',
    category: 'designer',
    gender: 'female',
    notes: {
      top: ['Апельсин', 'Бергамот'],
      middle: ['Жасмин', 'Роза', 'Личи'],
      base: ['Ваниль', 'Пачули', 'Дубовый мох']
    },
    ratings: { longevity: 9, sillage: 8, compliments: 10, versatility: 7 },
    season: 'Осень',
    timeOfDay: 'Вечер',
    mood: 'Сексуальный, шикарный',
    description: 'Шик в каждой детали. Аромат сильной женщины.',
    tags: ['#шик', '#вечерний', '#классика'],
    moodIcon: '💃',
    bottleColor: '#f3e5f5',
    bottleAccent: '#ce93d8',
    pairsWith: ['18', '24'],
    isBestseller: true
  },
  {
    id: '21',
    name: 'Black Opium',
    brand: 'Yves Saint Laurent',
    price: 115,
    image: '/perfumes/blackopium.jpg',
    category: 'designer',
    gender: 'female',
    notes: {
      top: ['Груша', 'Апельсин', 'Чёрная смородина'],
      middle: ['Кофе', 'Жасмин', 'Апельсиновый цвет'],
      base: ['Ваниль', 'Дубовый мох', 'Кедр']
    },
    ratings: { longevity: 9, sillage: 8, compliments: 9, versatility: 6 },
    season: 'Зима',
    timeOfDay: 'Вечер',
    mood: 'Насыщенный, кофейный',
    description: 'Кофеинированный шоколад в капсуле. Сладкий и дерзкий.',
    tags: ['#кофе', '#сладкий', '#ночной'],
    moodIcon: '☕',
    bottleColor: '#212121',
    bottleAccent: '#424242',
    pairsWith: ['20', '26'],
    isNew: true
  },
  {
    id: '22',
    name: 'Bright Crystal',
    brand: 'Versace',
    price: 70,
    image: '/perfumes/bright.jpg',
    category: 'designer',
    gender: 'female',
    notes: {
      top: ['Йогурт', 'Яблоко', 'Личи'],
      middle: ['Магнолия', 'Лотос', 'Гардения'],
      base: ['Дубовый мох', 'Мускус', 'Амбра']
    },
    ratings: { longevity: 6, sillage: 6, compliments: 7, versatility: 8 },
    season: 'Весна',
    timeOfDay: 'День',
    mood: 'Кристальный, лёгкий',
    description: 'Свежесть южных садов. Для первых весенних дней.',
    tags: ['#свежий', '#дневной', '#лёгкий'],
    moodIcon: '💧',
    bottleColor: '#e0f7fa',
    bottleAccent: '#4dd0e1',
    pairsWith: ['6', '28'],
    isNew: true
  },
  {
    id: '23',
    name: 'Flowerbomb',
    brand: 'Viktor & Rolf',
    price: 130,
    image: '/perfumes/flowerbomb.jpg',
    category: 'designer',
    gender: 'female',
    notes: {
      top: ['Чай', 'Жасмин', 'Мандарин'],
      middle: ['Фрезия', 'Роза', 'Лотос'],
      base: ['Пачули', 'Мускус', 'Дубовый мох']
    },
    ratings: { longevity: 8, sillage: 7, compliments: 9, versatility: 6 },
    season: 'Весна',
    timeOfDay: 'День',
    mood: 'Букетный, женственный',
    description: 'Цветочный взрыв. Вызывающая роскошь.',
    tags: ['#букетный', '#женственный', '#весенний'],
    moodIcon: '💐',
    bottleColor: '#004d40',
    bottleAccent: '#00695c',
    pairsWith: ['8', '26'],
    isBestseller: true
  },
  {
    id: '24',
    name: 'Another 13',
    brand: 'Le Labo',
    price: 240,
    image: '/perfumes/another.jpg',
    category: 'niche',
    gender: 'unisex',
    notes: {
      top: ['Жасмин', 'Мускус'],
      middle: ['Амброксан', 'Мускус'],
      base: ['Мускус', 'Дубовый мох']
    },
    ratings: { longevity: 9, sillage: 8, compliments: 7, versatility: 8 },
    season: 'Все сезоны',
    timeOfDay: 'Офис',
    mood: 'Минималистичный, стерильный',
    description: '13 ингредиентов, симметрично сбалансированных. Стерильная чистота.',
    tags: ['#стерильный', '#минимализм', '#офис'],
    moodIcon: '🔬',
    bottleColor: '#f5f5f5',
    bottleAccent: '#e0e0e0',
    pairsWith: ['21', '29'],
    isNew: true
  },
  {
    id: '25',
    name: 'Gypsy Water',
    brand: 'Byredo',
    price: 250,
    image: '/perfumes/gypsy.jpg',
    category: 'niche',
    gender: 'unisex',
    notes: {
      top: ['Бергамот', 'Лимон', 'Перец'],
      middle: ['Сосна', 'Ладан', 'Ветивер'],
      base: ['Дубовый мох', 'Ваниль', 'Мускус']
    },
    ratings: { longevity: 7, sillage: 7, compliments: 8, versatility: 8 },
    season: 'Осень',
    timeOfDay: 'Вечер',
    mood: 'Бродячий, дымный',
    description: 'Пахнет костром в лесу. Свобода в каждом вдохе.',
    tags: ['#лесной', '#дымный', '#костёр'],
    moodIcon: '🔥',
    bottleColor: '#d7ccc8',
    bottleAccent: '#a1887f',
    pairsWith: ['27', '30'],
    isBestseller: true
  },
  {
    id: '26',
    name: 'Philosykos',
    brand: 'Diptyque',
    price: 170,
    image: '/perfumes/philo.jpg',
    category: 'niche',
    gender: 'unisex',
    notes: {
      top: ['Бергамот', 'Сосна'],
      middle: ['Фиговое дерево', 'Зелёный инжир'],
      base: ['Дубовый мох', 'Белый кедр']
    },
    ratings: { longevity: 7, sillage: 6, compliments: 7, versatility: 8 },
    season: 'Лето',
    timeOfDay: 'День',
    mood: 'Средиземноморский, солнечный',
    description: 'Греческий остров в каждом пшике. Свежесть фиговых деревьев.',
    tags: ['#фиговый', '#средиземноморский', '#летний'],
    moodIcon: '🌿',
    bottleColor: '#f1f8e9',
    bottleAccent: '#aed581',
    pairsWith: ['5', '25'],
    isNew: true
  },
  {
    id: '27',
    name: 'Jazz Club',
    brand: 'Maison Margiela',
    price: 140,
    image: '/perfumes/jazz.jpg',
    category: 'niche',
    gender: 'male',
    notes: {
      top: ['Ром', 'Лайм', 'Мята'],
      middle: ['Табак', 'Ром', 'Анис'],
      base: ['Дубовый мох', 'Бобы тонка', 'Ваниль']
    },
    ratings: { longevity: 8, sillage: 8, compliments: 8, versatility: 5 },
    season: 'Зима',
    timeOfDay: 'Вечер',
    mood: 'Нострический, живой',
    description: 'Нью-Йоркский джаз-клуб 30-х. Дым и ром.',
    tags: ['#джаз', '#ночной', '#ром'],
    moodIcon: '🎷',
    bottleColor: '#3e2723',
    bottleAccent: '#6d4c41',
    pairsWith: ['7', '22'],
    isNew: true
  },
  {
    id: '28',
    name: 'Hwyl',
    brand: 'Aesop',
    price: 135,
    image: '/perfumes/hwyl.jpg',
    category: 'niche',
    gender: 'unisex',
    notes: {
      top: ['Бергамот', 'Базилик', 'Тимьян'],
      middle: ['Кипарис', 'Ветивер', 'Берёза'],
      base: ['Сандал', 'Ветивер', 'Ваниль']
    },
    ratings: { longevity: 8, sillage: 7, compliments: 7, versatility: 8 },
    season: 'Все сезоны',
    timeOfDay: 'Офис',
    mood: 'Замшевый, лесной',
    description: 'Японский бамбуковый лес. Глубина и спокойствие.',
    tags: ['#лесной', '#деловой', '#аскетичный'],
    moodIcon: '🎋',
    bottleColor: '#1b5e20',
    bottleAccent: '#388e3c',
    pairsWith: ['3', '26'],
    isBestseller: true
  },
  {
    id: '29',
    name: 'Portrait of a Lady',
    brand: 'Frederic Malle',
    price: 380,
    image: '/perfumes/portrait.jpg',
    category: 'niche',
    gender: 'female',
    notes: {
      top: ['Роза', 'Мускатный шалфей'],
      middle: ['Египетская роза', 'Красное дерево'],
      base: ['Пачули', 'Мускус', 'Амбра']
    },
    ratings: { longevity: 10, sillage: 9, compliments: 9, versatility: 5 },
    season: 'Зима',
    timeOfDay: 'Вечер',
    mood: 'Аристократичный, мощный',
    description: 'Портрет аристократки. Версия бесконечной розы.',
    tags: ['#аристократичный', '#розовый', '#вечерний'],
    moodIcon: '👑',
    bottleColor: '#fff3e0',
    bottleAccent: '#ffb74d',
    pairsWith: ['15', '13'],
    isNew: true
  },
  {
    id: '30',
    name: 'Baraonda',
    brand: 'Nasomatto',
    price: 180,
    image: '/perfumes/baraonda.jpg',
    category: 'niche',
    gender: 'male',
    notes: {
      top: ['Виски', 'Дуб'],
      middle: ['Табак', 'Цветки акации'],
      base: ['Дубовый мох', 'Бензоин', 'Мускус']
    },
    ratings: { longevity: 9, sillage: 8, compliments: 7, versatility: 6 },
    season: 'Зима',
    timeOfDay: 'Вечер',
    mood: 'Пьянящий, деревянный',
    description: 'Бочка с виски в шотландском баре. Мужской алкоголь.',
    tags: ['#виски', '#статусный', '#зимний'],
    moodIcon: '🥃',
    bottleColor: '#8d6e63',
    bottleAccent: '#a1887f',
    pairsWith: ['24', '7'],
    isNew: true
  }
]

const raspivPerfumes: Perfume[] = [
  {
    id: 'r1',
    name: 'No 12 Oud Desire',
    brand: 'Thomas Kosmala',
    price: 1600 * DEFAULT_VOLUME_ML,
    pricePerMl: 1600,
    section: 'raspiv',
    image: '/perfumes/kosmala12.jpg',
    category: 'niche',
    gender: 'unisex',
    notes: {
      top: ['Уд', 'Роза', 'Шафран'],
      middle: ['Ладан', 'Амбра', 'Пряности'],
      base: ['Сандал', 'Мускус', 'Кожа']
    },
    ratings: { longevity: 10, sillage: 9, compliments: 9, versatility: 6 },
    season: 'Зима',
    timeOfDay: 'Вечер',
    mood: 'Восточный, глубокий',
    description: 'Оригинальный парфюм. Отливант из фирменного флакона Thomas Kosmala No 12.',
    tags: ['#уд', '#оригинал', '#распив'],
    moodIcon: '🧪',
    bottleColor: '#3e2723',
    bottleAccent: '#8d6e63',
    pairsWith: ['r2', 'r3'],
    isBestseller: true
  },
  {
    id: 'r2',
    name: 'Cedrat Boise',
    brand: 'Mancera',
    price: 1500 * DEFAULT_VOLUME_ML,
    pricePerMl: 1500,
    section: 'raspiv',
    image: '/perfumes/cedrat.jpg',
    category: 'niche',
    gender: 'unisex',
    notes: {
      top: ['Цитрус', 'Чёрная смородина', 'Бергамот'],
      middle: ['Кедр', 'Жасмин', 'Пачули'],
      base: ['Ваниль', 'Мускус', 'Кожа']
    },
    ratings: { longevity: 9, sillage: 8, compliments: 10, versatility: 8 },
    season: 'Все сезоны',
    timeOfDay: 'День и вечер',
    mood: 'Свежий, древесный',
    description: 'Оригинальный парфюм. Отливант из фирменного флакона Mancera Cedrat Boise.',
    tags: ['#цитрус', '#оригинал', '#распив'],
    moodIcon: '🍋',
    bottleColor: '#1a3a4a',
    bottleAccent: '#c9a227',
    pairsWith: ['r1', 'r3'],
    isBestseller: true
  },
  {
    id: 'r3',
    name: 'Red Tobacco',
    brand: 'Mancera',
    price: 1500 * DEFAULT_VOLUME_ML,
    pricePerMl: 1500,
    section: 'raspiv',
    image: '/perfumes/redtobacco.jpg',
    category: 'niche',
    gender: 'unisex',
    notes: {
      top: ['Табак', 'Корица', 'Яблоко'],
      middle: ['Уд', 'Ладан', 'Пачули'],
      base: ['Ваниль', 'Амбра', 'Тонка']
    },
    ratings: { longevity: 10, sillage: 10, compliments: 9, versatility: 5 },
    season: 'Зима',
    timeOfDay: 'Вечер',
    mood: 'Пряный, табачный',
    description: 'Оригинальный парфюм. Отливант из фирменного флакона Mancera Red Tobacco.',
    tags: ['#табак', '#оригинал', '#распив'],
    moodIcon: '🔥',
    bottleColor: '#4a148c',
    bottleAccent: '#b71c1c',
    pairsWith: ['r1', 'r2'],
    isBestseller: true
  }
]

export const perfumes: Perfume[] = [
  ...razlivBase.map((perfume): Perfume => ({
    ...perfume,
    section: 'razliv',
    pricePerMl: RAZLIV_PRICE_PER_ML,
    price: RAZLIV_PRICE_PER_ML * DEFAULT_VOLUME_ML,
  })),
  ...raspivPerfumes,
]

export const discoverySets = [
  {
    id: 'ds1',
    name: 'Набор открытий: Лето',
    description: '4 пробника по 2 мл для солнечных дней',
    price: 45,
    image: '/sets/summer.jpg',
    perfumes: ['5', '1', '6', '2']
  },
  {
    id: 'ds2',
    name: 'Набор открытий: Зима',
    description: '4 пробника по 2 мл для холодного сезона',
    price: 45,
    image: '/sets/winter.jpg',
    perfumes: ['7', '4', '2', '8']
  },
  {
    id: 'ds3',
    name: 'Набор открытий: Ниша',
    description: '4 пробника по 2 мл для ценителей',
    price: 55,
    image: '/sets/niche.jpg',
    perfumes: ['3', '2', '7', '1']
  }
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
  'На каждый день'
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
      { label: 'Дубильные и кожаные', value: 'leather', icon: '🧥' }
    ]
  },
  {
    id: 2,
    question: 'Когда планируете носить?',
    icon: '⏰',
    options: [
      { label: 'День — работа/учеба', value: 'day', icon: '☀️' },
      { label: 'Вечер — встреча/свидание', value: 'night', icon: '🌙' },
      { label: 'И день, и вечер', value: 'both', icon: '🌓' }
    ]
  },
  {
    id: 3,
    question: 'Какое настроение?',
    icon: '💭',
    options: [
      { label: 'Уверенность и сила', value: 'power', icon: '💪' },
      { label: 'Романтика и мягкость', value: 'romantic', icon: '💕' },
      { label: 'Спокойствие и баланс', value: 'calm', icon: '🧘' }
    ]
  },
  {
    id: 4,
    question: 'Сезон?',
    icon: '🌤️',
    options: [
      { label: 'Лето', value: 'summer', icon: '☀️' },
      { label: 'Зима', value: 'winter', icon: '❄️' },
      { label: 'Все сезоны', value: 'all', icon: '♾️' }
    ]
  }
]
