import {
  ALLOWED_VOLUMES,
  MAX_CART_ITEMS,
  MAX_LINE_QUANTITY,
  MIN_NAME_LENGTH,
  MAX_NAME_LENGTH,
  MIN_CITY_LENGTH,
  WHATSAPP_E164,
} from './constants'
import type {
  CalculatedOrder,
  Offer,
  OrderErrorCode,
  OrderItemSnapshot,
  OrderPayload,
  OrderRequestItem,
  VolumeMl,
} from './types'

export interface OfferForOrder {
  id: string
  productId: string
  brand: string
  name: string
  section: Offer['section']
  pricePerMlTenge: number
  isOriginal: boolean
  isInStock: boolean
  isActive: boolean
  productIsActive: boolean
}

export interface OrderFailure {
  code: OrderErrorCode
  message: string
}

export type OrderResult<T> = { ok: true; value: T } | { ok: false; error: OrderFailure }

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isVolumeMl(value: number): value is VolumeMl {
  return (ALLOWED_VOLUMES as readonly number[]).includes(value)
}

export function priceForVolume(pricePerMl: number, ml: number): number {
  return pricePerMl * ml
}

export function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, '')
  let national = digits

  if (digits.length === 11 && digits.startsWith('8')) {
    national = `7${digits.slice(1)}`
  } else if (digits.length === 10) {
    national = `7${digits}`
  }

  if (!/^7\d{10}$/.test(national)) return null
  return `+${national}`
}

export function normalizeName(input: string): string | null {
  const name = input.replace(/\s+/g, ' ').trim()
  if (name.length < MIN_NAME_LENGTH || name.length > MAX_NAME_LENGTH) return null
  if (!/^[\p{L}\s'-]+$/u.test(name)) return null
  return name
}

export function isUuid(value: string): boolean {
  return UUID_RE.test(value)
}

export function createOrderNumber(orderId: string): string {
  return `LM-${orderId.replace(/-/g, '').slice(0, 8).toUpperCase()}`
}

export function validateOrderPayload(input: unknown): OrderResult<OrderPayload> {
  if (typeof input !== 'object' || input === null) {
    return fail('invalid_payload', 'Некорректные данные заказа')
  }

  const body = input as Record<string, unknown>
  if (typeof body.clientRequestId !== 'string' || !isUuid(body.clientRequestId)) {
    return fail('invalid_request_id', 'Некорректный идентификатор запроса')
  }

  if (typeof body.customerName !== 'string') {
    return fail('invalid_name', 'Укажите имя')
  }
  const customerName = normalizeName(body.customerName)
  if (!customerName) {
    return fail('invalid_name', 'Имя должно содержать только буквы и быть не короче двух символов')
  }

  if (typeof body.phone !== 'string') {
    return fail('invalid_phone', 'Укажите телефон')
  }
  const phone = normalizePhone(body.phone)
  if (!phone) {
    return fail('invalid_phone', 'Введите телефон в формате +7 XXX XXX XX XX')
  }

  let city: string | undefined
  if (typeof body.city === 'string') {
    const trimmed = body.city.replace(/\s+/g, ' ').trim()
    if (trimmed.length < MIN_CITY_LENGTH) {
      return fail('invalid_payload', 'Укажите город')
    }
    city = trimmed
  }

  if (!Array.isArray(body.items)) {
    return fail('empty_cart', 'Корзина пуста')
  }
  if (body.items.length === 0) {
    return fail('empty_cart', 'Корзина пуста')
  }
  if (body.items.length > MAX_CART_ITEMS) {
    return fail('cart_too_large', 'Слишком много позиций в корзине')
  }

  const items: OrderRequestItem[] = []
  for (const rawItem of body.items) {
    if (typeof rawItem !== 'object' || rawItem === null) {
      return fail('invalid_payload', 'Некорректная позиция корзины')
    }
    const item = rawItem as Record<string, unknown>
    if (typeof item.offerId !== 'string' || !isUuid(item.offerId)) {
      return fail('offer_unavailable', 'Товар больше недоступен')
    }
    if (typeof item.volumeMl !== 'number' || !isVolumeMl(item.volumeMl)) {
      return fail('invalid_volume', 'Доступны только объёмы 5, 10 и 20 мл')
    }
    if (
      typeof item.quantity !== 'number' ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > MAX_LINE_QUANTITY
    ) {
      return fail('invalid_quantity', 'Количество должно быть от 1 до 10')
    }
    items.push({
      offerId: item.offerId,
      volumeMl: item.volumeMl,
      quantity: item.quantity,
    })
  }

  if (body.acceptedLegal !== true) {
    return fail('legal_not_accepted', 'Нужно согласие с офертой и политикой конфиденциальности')
  }

  return {
    ok: true,
    value: {
      clientRequestId: body.clientRequestId,
      customerName,
      phone,
      city,
      acceptedLegal: true,
      items,
    },
  }
}

export function calculateOrder(
  items: OrderRequestItem[],
  offers: OfferForOrder[]
): OrderResult<CalculatedOrder> {
  const offerMap = new Map(offers.map((offer) => [offer.id, offer]))
  const snapshots: OrderItemSnapshot[] = []
  let totalTenge = 0

  for (const item of items) {
    const offer = offerMap.get(item.offerId)
    if (!offer || !offer.isActive || !offer.productIsActive) {
      return fail('offer_unavailable', 'Товар больше недоступен')
    }
    if (!offer.isInStock) {
      return fail('offer_out_of_stock', `${offer.brand} ${offer.name} сейчас нет в наличии`)
    }

    const lineTotalTenge = priceForVolume(offer.pricePerMlTenge, item.volumeMl) * item.quantity
    totalTenge += lineTotalTenge
    snapshots.push({
      offerId: offer.id,
      productId: offer.productId,
      brand: offer.brand,
      name: offer.name,
      section: offer.section,
      volumeMl: item.volumeMl,
      quantity: item.quantity,
      pricePerMlTenge: offer.pricePerMlTenge,
      lineTotalTenge,
    })
  }

  return { ok: true, value: { items: snapshots, totalTenge } }
}

export function buildWhatsAppText(params: {
  orderNumber: string
  customerName: string
  city?: string
  items: OrderItemSnapshot[]
  totalTenge: number
}): string {
  const lines = [
    `Заказ ${params.orderNumber}`,
    `Имя: ${params.customerName}`,
    ...(params.city ? [`Город: ${params.city}`] : []),
    '',
    'Состав:',
    ...params.items.map((item) => {
      const section = item.section === 'raspiv' ? 'Распив' : 'Разлив'
      return `• ${item.brand} ${item.name} (${section}), ${item.volumeMl} мл × ${item.quantity} — ${formatTenge(item.lineTotalTenge)}`
    }),
    '',
    `Итого: ${formatTenge(params.totalTenge)}`,
    '',
    'Оплата Kaspi после подтверждения.',
  ]
  return lines.join('\n')
}

export function buildWhatsAppUrl(text: string, phoneE164: string = WHATSAPP_E164): string {
  const digits = phoneE164.replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
}

export function buildTelegramText(params: {
  orderNumber: string
  customerName: string
  phoneE164: string
  city?: string
  items: OrderItemSnapshot[]
  totalTenge: number
}): string {
  const lines = [
    `Новый заказ ${params.orderNumber}`,
    `Имя: ${params.customerName}`,
    `Телефон: ${params.phoneE164}`,
    ...(params.city ? [`Город: ${params.city}`] : []),
    '',
    ...params.items.map((item) => {
      const section = item.section === 'raspiv' ? 'Распив' : 'Разлив'
      return `• ${item.brand} ${item.name} (${section}), ${item.volumeMl} мл × ${item.quantity} — ${formatTenge(item.lineTotalTenge)}`
    }),
    '',
    `Итого: ${formatTenge(params.totalTenge)}`,
  ]
  return lines.join('\n')
}

export function formatTenge(amount: number): string {
  return `${amount.toLocaleString('ru-RU').replace(/\u00A0/g, ' ')} ₸`
}

function fail(code: OrderErrorCode, message: string): OrderResult<never> {
  return { ok: false, error: { code, message } }
}
