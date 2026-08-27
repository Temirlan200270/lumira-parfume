import AdminDashboard from './AdminDashboard'
import AdminLoginForm from './AdminLoginForm'
import { isAdminEmail } from '@/lib/env'
import { AppStrings } from '@/lib/strings'
import { createSupabaseAdminClient, hasSupabaseAdminEnv } from '@/lib/supabase/admin'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { CatalogSection, OrderItemSnapshot, OrderStatus } from '@/lib/types'

export const dynamic = 'force-dynamic'

interface ProductRow {
  id: string
  brand: string
  name: string
  is_active: boolean
}

interface OfferRow {
  id: string
  product_id: string
  section: CatalogSection
  price_per_ml_tenge: number
  is_in_stock: boolean
  is_active: boolean
}

interface OrderRow {
  id: string
  order_number: string
  customer_name: string
  phone_e164: string
  items: OrderItemSnapshot[]
  total_tenge: number
  status: OrderStatus
  telegram_sent: boolean
  created_at: string
}

export default async function AdminPage() {
  if (!hasSupabaseAdminEnv()) {
    return (
      <main className="flex-1 pt-32 px-6">
        <p className="text-sm text-stone-500">Заполните переменные Supabase в .env.local</p>
      </main>
    )
  }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) {
    return <AdminLoginForm />
  }

  const email = typeof data.claims.email === 'string' ? data.claims.email : ''
  if (!isAdminEmail(email)) {
    return (
      <main className="flex-1 pt-32 px-6">
        <p className="text-sm text-stone-500">{AppStrings.admin.forbidden}</p>
      </main>
    )
  }

  const admin = createSupabaseAdminClient()
  const [{ data: products }, { data: offers }, { data: orders }] = await Promise.all([
    admin.from('products').select('id, brand, name, is_active').order('brand'),
    admin.from('offers').select('id, product_id, section, price_per_ml_tenge, is_in_stock, is_active'),
    admin
      .from('orders')
      .select('id, order_number, customer_name, phone_e164, items, total_tenge, status, telegram_sent, created_at')
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  const offerRows = (offers ?? []) as OfferRow[]
  const dashboardProducts = ((products ?? []) as ProductRow[]).map((product) => ({
    id: product.id,
    brand: product.brand,
    name: product.name,
    isActive: product.is_active,
    offers: offerRows
      .filter((offer) => offer.product_id === product.id)
      .map((offer) => ({
        id: offer.id,
        section: offer.section,
        pricePerMlTenge: offer.price_per_ml_tenge,
        isInStock: offer.is_in_stock,
        isActive: offer.is_active,
      })),
  }))

  const dashboardOrders = ((orders ?? []) as OrderRow[]).map((order) => ({
    id: order.id,
    orderNumber: order.order_number,
    customerName: order.customer_name,
    phoneE164: order.phone_e164,
    items: order.items,
    totalTenge: order.total_tenge,
    status: order.status,
    telegramSent: order.telegram_sent,
    createdAt: order.created_at,
  }))

  return <AdminDashboard products={dashboardProducts} orders={dashboardOrders} />
}
