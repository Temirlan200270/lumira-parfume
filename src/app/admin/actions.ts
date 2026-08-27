'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { isAdminEmail } from '@/lib/env'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createSupabaseAdminClient, hasSupabaseAdminEnv } from '@/lib/supabase/admin'
import type { OrderStatus } from '@/lib/types'

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

function refreshAdminViews(): void {
  revalidatePath('/admin')
  revalidatePath('/')
}

export async function updateOffer(formData: FormData): Promise<void> {
  await requireAdminEmail()
  if (!hasSupabaseAdminEnv()) {
    throw new Error('Supabase admin env is not configured')
  }

  const offerId = String(formData.get('offerId') ?? '')
  const price = Number(formData.get('pricePerMlTenge'))
  const isInStock = formData.get('isInStock') === 'on'
  const isActive = formData.get('isActive') === 'on'

  if (!offerId || !Number.isInteger(price) || price <= 0) {
    throw new Error('Некорректная цена')
  }

  const admin = createSupabaseAdminClient()
  const { error } = await admin
    .from('offers')
    .update({
      price_per_ml_tenge: price,
      is_in_stock: isInStock,
      is_active: isActive,
    })
    .eq('id', offerId)

  if (error) {
    throw new Error(error.message)
  }
  refreshAdminViews()
}

export async function updateProductVisibility(formData: FormData): Promise<void> {
  await requireAdminEmail()
  if (!hasSupabaseAdminEnv()) {
    throw new Error('Supabase admin env is not configured')
  }

  const productId = String(formData.get('productId') ?? '')
  const isActive = formData.get('isActive') === 'on'
  if (!productId) {
    throw new Error('Некорректный товар')
  }

  const admin = createSupabaseAdminClient()
  const { error } = await admin.from('products').update({ is_active: isActive }).eq('id', productId)
  if (error) {
    throw new Error(error.message)
  }
  refreshAdminViews()
}

export async function updateOrderStatus(formData: FormData): Promise<void> {
  await requireAdminEmail()
  if (!hasSupabaseAdminEnv()) {
    throw new Error('Supabase admin env is not configured')
  }

  const orderId = String(formData.get('orderId') ?? '')
  const status = String(formData.get('status') ?? '') as OrderStatus
  const allowed: OrderStatus[] = ['new', 'confirmed', 'paid', 'completed', 'cancelled']
  if (!orderId || !allowed.includes(status)) {
    throw new Error('Некорректный статус')
  }

  const admin = createSupabaseAdminClient()
  const { error } = await admin.from('orders').update({ status }).eq('id', orderId)
  if (error) {
    throw new Error(error.message)
  }
  revalidatePath('/admin')
}

export async function signOutAdmin(): Promise<void> {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/admin')
}
