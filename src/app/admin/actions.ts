'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { productSlug } from '@/lib/catalog-seed'
import { logger } from '@/lib/logger'
import { getPublicSupabaseEnv, isAdminEmail } from '@/lib/env'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createSupabaseAdminClient, hasSupabaseAdminEnv } from '@/lib/supabase/admin'
import type { CatalogSection, Gender, OrderItemSnapshot, OrderStatus, VolumeMl } from '@/lib/types'
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

const PHOTO_MAX_BYTES = 5 * 1024 * 1024
const PHOTO_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export interface CreatedAdminProduct {
  productId: string
  brand: string
  name: string
  imageUrl: string
  offer: {
    id: string
    section: CatalogSection
    pricePerMlTenge: number
    isInStock: boolean
    isActive: boolean
  }
}

function asGender(value: string): Gender | null {
  if (value === 'male' || value === 'female' || value === 'unisex') return value
  return null
}

function asSection(value: string): CatalogSection | null {
  if (value === 'razliv' || value === 'raspiv') return value
  return null
}

async function uploadProductPhoto(
  admin: ReturnType<typeof createSupabaseAdminClient>,
  slug: string,
  file: File
): Promise<string | null> {
  const ext = PHOTO_TYPES[file.type]
  if (!ext) return null
  if (file.size > PHOTO_MAX_BYTES) return null
  const env = getPublicSupabaseEnv()
  if (!env) return null
  const path = `${slug}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())
  const { error } = await admin.storage.from('product-images').upload(path, buffer, {
    contentType: file.type,
    upsert: true,
  })
  if (error) {
    logger.error('product_photo_upload_failed', { message: error.message, slug })
    return null
  }
  return `${env.url.replace(/\/$/, '')}/storage/v1/object/public/product-images/${path}`
}

export async function createAdminProduct(formData: FormData): Promise<
  { ok: true; product: CreatedAdminProduct } | { ok: false; message: string }
> {
  try {
    await requireAdminEmail()
    if (!hasSupabaseAdminEnv()) return { ok: false, message: 'Сервер не настроен' }

    const brand = String(formData.get('brand') ?? '')
      .replace(/\s+/g, ' ')
      .trim()
    const name = String(formData.get('name') ?? '')
      .replace(/\s+/g, ' ')
      .trim()
    const gender = asGender(String(formData.get('gender') ?? ''))
    const section = asSection(String(formData.get('section') ?? ''))
    const pricePerMlTenge = Number(formData.get('pricePerMlTenge'))
    const photoRaw = formData.get('photo')
    const photo = photoRaw instanceof File && photoRaw.size > 0 ? photoRaw : null

    if (brand.length < 1 || brand.length > 80) return { ok: false, message: 'Укажите бренд' }
    if (name.length < 1 || name.length > 80) return { ok: false, message: 'Укажите название' }
    if (!gender) return { ok: false, message: 'Укажите пол' }
    if (!section) return { ok: false, message: 'Укажите формат' }
    if (!Number.isInteger(pricePerMlTenge) || pricePerMlTenge <= 0) {
      return { ok: false, message: 'Укажите цену за мл' }
    }
    if (photo && (!PHOTO_TYPES[photo.type] || photo.size > PHOTO_MAX_BYTES)) {
      return { ok: false, message: 'Фото: JPEG, PNG или WebP, до 5 МБ' }
    }

    const slug = productSlug(brand, name) || `item-${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`
    if (!slug) return { ok: false, message: 'Укажите бренд и название' }

    const admin = createSupabaseAdminClient()
    let imageUrl = ''
    if (photo) {
      const uploaded = await uploadProductPhoto(admin, slug, photo)
      if (!uploaded) return { ok: false, message: 'Не удалось загрузить фото' }
      imageUrl = uploaded
    }

    const { data: existing, error: existingError } = await admin
      .from('products')
      .select('id, brand, name, image_url')
      .eq('slug', slug)
      .maybeSingle()
    if (existingError) return { ok: false, message: 'Не удалось добавить позицию' }

    let productId: string
    if (existing) {
      productId = existing.id
      const { data: sameOffer, error: offerLookupError } = await admin
        .from('offers')
        .select('id')
        .eq('product_id', productId)
        .eq('section', section)
        .maybeSingle()
      if (offerLookupError) return { ok: false, message: 'Не удалось добавить позицию' }
      if (sameOffer) return { ok: false, message: 'Эта позиция уже есть' }
      if (imageUrl) {
        const { error: imageError } = await admin.from('products').update({ image_url: imageUrl }).eq('id', productId)
        if (imageError) return { ok: false, message: 'Не удалось сохранить фото' }
      } else {
        imageUrl = existing.image_url ?? ''
      }
    } else {
      productId = crypto.randomUUID()
      const { error: productError } = await admin.from('products').insert({
        id: productId,
        slug,
        brand,
        name,
        description: '',
        gender,
        image_url: imageUrl,
        is_active: true,
      })
      if (productError) return { ok: false, message: 'Не удалось добавить позицию' }
    }

    const offerId = crypto.randomUUID()
    const { error: offerError } = await admin.from('offers').insert({
      id: offerId,
      product_id: productId,
      section,
      price_per_ml_tenge: pricePerMlTenge,
      is_original: section === 'raspiv',
      is_in_stock: true,
      is_active: true,
    })
    if (offerError) return { ok: false, message: 'Не удалось добавить позицию' }

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath(`/perfume/${slug}`)

    return {
      ok: true,
      product: {
        productId,
        brand: existing?.brand ?? brand,
        name: existing?.name ?? name,
        imageUrl,
        offer: {
          id: offerId,
          section,
          pricePerMlTenge,
          isInStock: true,
          isActive: true,
        },
      },
    }
  } catch {
    return { ok: false, message: 'Не удалось добавить позицию' }
  }
}

export async function signOutAdmin(): Promise<void> {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/admin')
}
