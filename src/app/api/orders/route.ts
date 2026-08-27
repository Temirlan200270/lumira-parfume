import { NextResponse } from 'next/server'
import { getTelegramEnv } from '@/lib/env'
import { logger } from '@/lib/logger'
import {
  buildTelegramText,
  buildWhatsAppText,
  buildWhatsAppUrl,
  calculateOrder,
  createOrderNumber,
  validateOrderPayload,
  type OfferForOrder,
} from '@/lib/order'
import { createSupabaseAdminClient, hasSupabaseAdminEnv } from '@/lib/supabase/admin'
import type { OrderItemSnapshot } from '@/lib/types'

interface OfferJoinRow {
  id: string
  product_id: string
  section: OfferForOrder['section']
  price_per_ml_tenge: number
  is_original: boolean
  is_in_stock: boolean
  is_active: boolean
  products:
    | {
        id: string
        brand: string
        name: string
        is_active: boolean
      }
    | {
        id: string
        brand: string
        name: string
        is_active: boolean
      }[]
    | null
}

function productFromJoin(products: OfferJoinRow['products']): {
  id: string
  brand: string
  name: string
  is_active: boolean
} | null {
  if (!products) return null
  return Array.isArray(products) ? (products[0] ?? null) : products
}

interface StoredOrder {
  id: string
  order_number: string
  customer_name: string
  items: OrderItemSnapshot[]
  total_tenge: number
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, message }, { status })
}

function whatsappFromOrder(order: StoredOrder, city?: string): string {
  return buildWhatsAppUrl(
    buildWhatsAppText({
      orderNumber: order.order_number,
      customerName: order.customer_name,
      city,
      items: order.items,
      totalTenge: order.total_tenge,
    })
  )
}

async function sendTelegram(text: string): Promise<boolean> {
  const env = getTelegramEnv()
  if (!env) {
    logger.error('telegram_env_missing')
    return false
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${env.botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: env.chatId,
        text,
      }),
    })
    if (!response.ok) {
      logger.error('telegram_http_failed', { status: response.status })
      return false
    }
    return true
  } catch (error) {
    logger.error('telegram_fetch_failed', {
      message: error instanceof Error ? error.message : 'unknown',
    })
    return false
  }
}

export async function POST(request: Request) {
  if (!hasSupabaseAdminEnv()) {
    return jsonError('Сервер заказа ещё не настроен', 503)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonError('Некорректные данные заказа', 400)
  }

  const parsed = validateOrderPayload(body)
  if (!parsed.ok) {
    return jsonError(parsed.error.message, 400)
  }

  const payload = parsed.value
  const admin = createSupabaseAdminClient()

  const { data: existing, error: existingError } = await admin
    .from('orders')
    .select('id, order_number, customer_name, items, total_tenge')
    .eq('client_request_id', payload.clientRequestId)
    .maybeSingle()

  if (existingError) {
    logger.error('order_lookup_failed', { message: existingError.message })
    return jsonError('Не удалось оформить заказ. Попробуйте ещё раз.', 500)
  }

  if (existing) {
    const order = existing as StoredOrder
    return NextResponse.json({
      ok: true,
      orderNumber: order.order_number,
      whatsappUrl: whatsappFromOrder(order, payload.city),
    })
  }

  const offerIds = [...new Set(payload.items.map((item) => item.offerId))]
  const { data: offerRows, error: offersError } = await admin
    .from('offers')
    .select(
      'id, product_id, section, price_per_ml_tenge, is_original, is_in_stock, is_active, products!inner(id, brand, name, is_active)'
    )
    .in('id', offerIds)

  if (offersError) {
    logger.error('order_offers_failed', { message: offersError.message })
    return jsonError('Не удалось оформить заказ. Попробуйте ещё раз.', 500)
  }

  const offers: OfferForOrder[] = ((offerRows ?? []) as unknown as OfferJoinRow[]).map((row) => {
    const product = productFromJoin(row.products)
    return {
      id: row.id,
      productId: row.product_id,
      brand: product?.brand ?? '',
      name: product?.name ?? '',
      section: row.section,
      pricePerMlTenge: row.price_per_ml_tenge,
      isOriginal: row.is_original,
      isInStock: row.is_in_stock,
      isActive: row.is_active,
      productIsActive: product?.is_active ?? false,
    }
  })

  const calculated = calculateOrder(payload.items, offers)
  if (!calculated.ok) {
    return jsonError(calculated.error.message, 409)
  }

  const orderId = crypto.randomUUID()
  const orderNumber = createOrderNumber(orderId)

  const { data: inserted, error: insertError } = await admin
    .from('orders')
    .insert({
      id: orderId,
      order_number: orderNumber,
      customer_name: payload.customerName,
      phone_e164: payload.phone,
      items: calculated.value.items,
      total_tenge: calculated.value.totalTenge,
      status: 'new',
      client_request_id: payload.clientRequestId,
      telegram_sent: false,
    })
    .select('id, order_number, customer_name, items, total_tenge')
    .single()

  if (insertError?.code === '23505') {
    const { data: duplicate } = await admin
      .from('orders')
      .select('id, order_number, customer_name, items, total_tenge')
      .eq('client_request_id', payload.clientRequestId)
      .maybeSingle()
    if (duplicate) {
      const order = duplicate as StoredOrder
      return NextResponse.json({
        ok: true,
        orderNumber: order.order_number,
        whatsappUrl: whatsappFromOrder(order, payload.city),
      })
    }
  }

  if (insertError || !inserted) {
    logger.error('order_insert_failed', { message: insertError?.message ?? 'empty' })
    return jsonError('Не удалось оформить заказ. Попробуйте ещё раз.', 500)
  }

  const order = inserted as StoredOrder
  const snapshots = calculated.value.items
  const telegramSent = await sendTelegram(
    buildTelegramText({
      orderNumber: order.order_number,
      customerName: payload.customerName,
      phoneE164: payload.phone,
      city: payload.city,
      items: snapshots,
      totalTenge: calculated.value.totalTenge,
    })
  )

  if (telegramSent) {
    const { error: telegramUpdateError } = await admin
      .from('orders')
      .update({ telegram_sent: true })
      .eq('id', order.id)
    if (telegramUpdateError) {
      logger.error('telegram_flag_failed', { message: telegramUpdateError.message })
    }
  } else {
    logger.error('telegram_not_sent', { orderNumber: order.order_number })
  }

  logger.info('order_created', {
    orderNumber: order.order_number,
    telegramSent,
  })

  return NextResponse.json({
    ok: true,
    orderNumber: order.order_number,
    whatsappUrl: whatsappFromOrder(
      {
        ...order,
        items: snapshots,
        total_tenge: calculated.value.totalTenge,
      },
      payload.city
    ),
  })
}
