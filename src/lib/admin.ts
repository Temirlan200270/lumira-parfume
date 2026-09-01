import type { CatalogSection, OrderStatus } from './types'

export const ADMIN_TZ = 'Asia/Almaty'

export const ORDER_STATUSES: OrderStatus[] = ['new', 'confirmed', 'paid', 'completed', 'cancelled']

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  new: 'Новый',
  confirmed: 'Подтверждён',
  paid: 'Оплачен',
  completed: 'Выдан',
  cancelled: 'Отмена',
}

const WORK_STATUSES: ReadonlySet<OrderStatus> = new Set(['new', 'confirmed'])
const ARCHIVE_STATUSES: ReadonlySet<OrderStatus> = new Set(['paid', 'completed', 'cancelled'])

export function isWorkStatus(status: OrderStatus): boolean {
  return WORK_STATUSES.has(status)
}

export function isArchiveStatus(status: OrderStatus): boolean {
  return ARCHIVE_STATUSES.has(status)
}

export function formatAdminOrderTime(iso: string, now: Date = new Date()): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const time = date.toLocaleTimeString('ru-RU', {
    timeZone: ADMIN_TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const day = ymdInAdminTz(date)
  const today = ymdInAdminTz(now)
  if (day === today) return `сегодня ${time}`
  if (day === shiftYmd(today, -1)) return `вчера ${time}`
  const pretty = date
    .toLocaleDateString('ru-RU', { timeZone: ADMIN_TZ, day: 'numeric', month: 'short' })
    .replace('.', '')
  return `${pretty} ${time}`
}

export function offerStockToast(name: string, section: CatalogSection, inStock: boolean): string {
  const format = section === 'raspiv' ? 'распив' : 'разлив'
  return `${name} · ${format} · ${inStock ? 'в наличии' : 'нет в наличии'}`
}

export function offerSiteToast(name: string, section: CatalogSection, onSite: boolean): string {
  const format = section === 'raspiv' ? 'распив' : 'разлив'
  return `${name} · ${format} · ${onSite ? 'на сайте' : 'скрыт'}`
}

function ymdInAdminTz(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: ADMIN_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

function shiftYmd(ymd: string, days: number): string {
  const [year, month, day] = ymd.split('-').map(Number)
  const shifted = new Date(Date.UTC(year, month - 1, day + days))
  return shifted.toISOString().slice(0, 10)
}
