'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { isAdminEmail } from '@/lib/env'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createSupabaseAdminClient, hasSupabaseAdminEnv } from '@/lib/supabase/admin'
import type { OrderItemSnapshot, OrderStatus, VolumeMl } from '@/lib/types'
import { ORDER_STATUSES } from '@/lib/admin'
import {
  calculateAdminOrder,
  createOrderNumber,
  isVolumeMl,
  normalizeName,
  normalizePhone,
  type OfferForOrder,
} from '@/lib/order'

interface OfferJoinRow {
  id: string
  product_id: string
  section: OfferForOrder['section']
  price_per_ml_tenge: number
  is_original: boolean
  is_in_stock: boolean
  is_active: boolean
  products:
    | { id: string; brand: string; name: string; is_active: boolean }
    | { id: string; brand: string; name: string; is_active: boolean }[]
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

async function requireAdminEmail(): Promise<string> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) {
    throw new Error('Нужно войти в админку')
  }
  const email = typeof data.claims.email === 'string' ? data.claims.email : ''
  if (!isAdminEmail(email)) {
    throw new Error('Нет доступа к админке')
  }
  return email
}

export async function patchOffer(input: {
  offerId: string
  pricePerMlTenge: number
  isInStock: boolean
  isActive: boolean
}): Promise<{ ok: true } | { ok: false }> {
  try {
    await requireAdminEmail()
    if (!hasSupabaseAdminEnv()) return { ok: false }
    if (!input.offerId || !Number.isInteger(input.pricePerMlTenge) || input.pricePerMlTenge <= 0) {
      return { ok: false }
    }
    const admin = createSupabaseAdminClient()
    const { error } = await admin
      .from('offers')
      .update({
        price_per_ml_tenge: input.pricePerMlTenge,
        is_in_stock: input.isInStock,
        is_active: input.isActive,
      })
      .eq('id', input.offerId)
    if (error) return { ok: false }
    revalidatePath('/')
    revalidatePath('/admin')
    return { ok: true }
  } catch {
    return { ok: false }
  }
}

export async function patchOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<{ ok: true } | { ok: false }> {
  try {
    await requireAdminEmail()
    if (!hasSupabaseAdminEnv()) return { ok: false }
    if (!orderId || !ORDER_STATUSES.includes(status)) return { ok: false }
    const admin = createSupabaseAdminClient()
    const { error } = await admin.from('orders').update({ status }).eq('id', orderId)
    if (error) return { ok: false }
    return { ok: true }
  } catch {
    return { ok: false }
  }
}

export async function deleteOffer(input: {
  offerId: string
  productId: string
}): Promise<{ ok: true } | { ok: false }> {
  try {
    await requireAdminEmail()
    if (!hasSupabaseAdminEnv()) return { ok: false }
    if (!input.offerId || !input.productId) return { ok: false }
    const admin = createSupabaseAdminClient()
    const { data: target, error: targetError } = await admin
      .from('offers')
      .select('id, product_id')
      .eq('id', input.offerId)
      .maybeSingle()
    if (targetError || !target || target.product_id !== input.productId) return { ok: false }
    const { count, error: countError } = await admin
      .from('offers')
      .select('id', { count: 'exact', head: true })
      .eq('product_id', input.productId)
    if (countError) return { ok: false }
    if (count === 1) {
      const { error } = await admin.from('products').delete().eq('id', input.productId)
      if (error) return { ok: false }
    } else {
      const { error } = await admin.from('offers').delete().eq('id', input.offerId)
      if (error) return { ok: false }
    }
    revalidatePath('/')
    revalidatePath('/admin')
    return { ok: true }
  } catch {
    return { ok: false }
  }
}

export async function createAdminOrder(input: {
  customerName: string
  phone: string
  items: Array<{ offerId: string; volumeMl: number; quantity: number }>
}): Promise<
  | {
      ok: true
      order: {
        id: string
        orderNumber: string
        customerName: string
        phoneE164: string
        items: OrderItemSnapshot[]
        totalTenge: number
        status: OrderStatus
        telegramSent: boolean
        createdAt: string
      }
    }
  | { ok: false; message: string }
> {
  try {
    await requireAdminEmail()
    if (!hasSupabaseAdminEnv()) return { ok: false, message: 'Сервер не настроен' }

    const customerName = normalizeName(input.customerName)
    const phone = normalizePhone(input.phone)
    if (!customerName) return { ok: false, message: 'Укажите имя' }
    if (!phone) return { ok: false, message: 'Укажите телефон' }
    if (!Array.isArray(input.items) || input.items.length === 0) {
      return { ok: false, message: 'Добавьте аромат' }
    }

    const lines: Array<{ offerId: string; volumeMl: VolumeMl; quantity: number }> = []
    for (const item of input.items) {
      if (!isVolumeMl(item.volumeMl)) {
        return { ok: false, message: 'Доступны только объёмы 5, 10 и 20 мл' }
      }
      lines.push({ offerId: item.offerId, volumeMl: item.volumeMl, quantity: item.quantity })
    }

    const admin = createSupabaseAdminClient()
    const offerIds = [...new Set(input.items.map((item) => item.offerId))]
    const { data: offerRows, error: offersError } = await admin
      .from('offers')
      .select(
        'id, product_id, section, price_per_ml_tenge, is_original, is_in_stock, is_active, products(id, brand, name, is_active)'
      )
      .in('id', offerIds)
    if (offersError) return { ok: false, message: 'Не удалось создать заказ' }

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

    const calculated = calculateAdminOrder(lines, offers)
    if (!calculated.ok) return { ok: false, message: calculated.error.message }

    const orderId = crypto.randomUUID()
    const orderNumber = createOrderNumber(orderId)
    const createdAt = new Date().toISOString()
    const { error: insertError } = await admin.from('orders').insert({
      id: orderId,
      order_number: orderNumber,
      customer_name: customerName,
      phone_e164: phone,
      items: calculated.value.items,
      total_tenge: calculated.value.totalTenge,
      status: 'new',
      client_request_id: orderId,
      telegram_sent: true,
      legal_accepted_at: createdAt,
    })
    if (insertError) return { ok: false, message: 'Не удалось создать заказ' }
    revalidatePath('/admin')

    return {
      ok: true,
      order: {
        id: orderId,
        orderNumber,
        customerName,
        phoneE164: phone,
        items: calculated.value.items,
        totalTenge: calculated.value.totalTenge,
        status: 'new',
        telegramSent: true,
        createdAt,
      },
    }
  } catch {
    return { ok: false, message: 'Не удалось создать заказ' }
  }
}

export async function signOutAdmin(): Promise<void> {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/admin')
}
