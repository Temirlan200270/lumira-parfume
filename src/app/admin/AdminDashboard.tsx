'use client'

import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import Button from '@/components/ui/Button'
import { normalizeSearch } from '@/lib/data'
import { isArchiveStatus, isWorkStatus } from '@/lib/admin'
import { AppStrings } from '@/lib/strings'
import type { CatalogSection, OrderStatus } from '@/lib/types'
import AdminOfferRow from './AdminOfferRow'
import AdminOrderCard, { type AdminOrder } from './AdminOrderCard'
import AdminNewOrderSheet from './AdminNewOrderSheet'

interface AdminProduct {
  id: string
  brand: string
  name: string
  imageUrl: string
  isActive: boolean
  offers: Array<{
    id: string
    section: CatalogSection
    pricePerMlTenge: number
    isInStock: boolean
    isActive: boolean
  }>
}

type SectionFilter = 'all' | CatalogSection
type AdminPane = 'orders' | 'vitrina'
type OrderBucket = 'work' | 'archive'

const FORMAT_TABS: { id: SectionFilter; label: string }[] = [
  { id: 'all', label: AppStrings.catalog.tabAll },
  { id: 'razliv', label: AppStrings.catalog.razliv },
  { id: 'raspiv', label: AppStrings.catalog.raspiv },
]

function asPane(value: string | null): AdminPane {
  return value === 'vitrina' ? 'vitrina' : 'orders'
}

const tabClass = (active: boolean) =>
  `inline-flex h-11 min-w-0 w-full items-center justify-center px-2 text-[11px] uppercase tracking-[0.08em] sm:px-3 sm:text-xs sm:tracking-[0.12em] ${
    active
      ? 'bg-stone-900 text-stone-50'
      : 'border border-stone-200 text-muted hover:border-stone-900 hover:text-stone-900'
  }`

export default function AdminDashboard({
  products,
  orders,
}: {
  products: AdminProduct[]
  orders: AdminOrder[]
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [pane, setPane] = useState<AdminPane>(() => asPane(searchParams.get('pane')))
  const [bucket, setBucket] = useState<OrderBucket>('work')
  const [query, setQuery] = useState('')
  const [section, setSection] = useState<SectionFilter>('all')
  const [statusById, setStatusById] = useState<Record<string, OrderStatus>>({})
  const [hiddenOfferIds, setHiddenOfferIds] = useState<string[]>([])
  const [extraOrders, setExtraOrders] = useState<AdminOrder[]>([])
  const [newOrderOpen, setNewOrderOpen] = useState(false)
  const deferredQuery = useDeferredValue(query)
  const deferredSection = useDeferredValue(section)
  const hidden = useMemo(() => new Set(hiddenOfferIds), [hiddenOfferIds])

  useEffect(() => {
    setPane(asPane(searchParams.get('pane')))
  }, [searchParams])

  const resolvedOrders = useMemo(() => {
    const seen = new Set(orders.map((order) => order.id))
    const created = extraOrders.filter((order) => !seen.has(order.id))
    return [...created, ...orders]
      .map((order) => ({ ...order, status: statusById[order.id] ?? order.status }))
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  }, [orders, extraOrders, statusById])

  const newOrderCount = resolvedOrders.filter((order) => order.status === 'new').length

  const workOrders = resolvedOrders.filter((order) => isWorkStatus(order.status))
  const archiveOrders = resolvedOrders.filter((order) => isArchiveStatus(order.status))
  const visibleOrders = bucket === 'work' ? workOrders : archiveOrders

  const rows = useMemo(() => {
    const needle = normalizeSearch(deferredQuery)
    return products.flatMap((product) =>
      product.offers
        .filter((offer) => !hidden.has(offer.id))
        .filter((offer) => (deferredSection === 'all' ? true : offer.section === deferredSection))
        .filter((offer) => {
          if (!needle) return true
          const haystack = normalizeSearch(`${product.brand} ${product.name}`)
          return haystack.includes(needle)
        })
        .map((offer) => ({ product, offer }))
    )
  }, [products, deferredQuery, deferredSection, hidden])

  const catalog = useMemo(
    () =>
      products.flatMap((product) =>
        product.offers
          .filter((offer) => !hidden.has(offer.id))
          .map((offer) => ({
            offerId: offer.id,
            brand: product.brand,
            name: product.name,
            section: offer.section,
            pricePerMlTenge: offer.pricePerMlTenge,
          }))
      ),
    [products, hidden]
  )

  const selectPane = useCallback(
    (next: AdminPane) => {
      setPane(next)
      if (typeof window === 'undefined') return
      const params = new URLSearchParams(window.location.search)
      if (next === 'orders') params.delete('pane')
      else params.set('pane', 'vitrina')
      const qs = params.toString()
      window.history.replaceState(window.history.state, '', qs ? `${pathname}?${qs}` : pathname)
    },
    [pathname]
  )

  const onStatus = useCallback((orderId: string, status: OrderStatus) => {
    setStatusById((current) => ({ ...current, [orderId]: status }))
  }, [])

  const onDeleted = useCallback((offerId: string) => {
    setHiddenOfferIds((current) => (current.includes(offerId) ? current : [...current, offerId]))
  }, [])

  const onCreated = useCallback((order: AdminOrder) => {
    setExtraOrders((current) => [order, ...current])
    setBucket('work')
  }, [])

  const closeNewOrder = useCallback(() => {
    setNewOrderOpen(false)
  }, [])

  return (
    <main className="flex-1 px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6 sm:px-6">
      <div className="mx-auto max-w-2xl space-y-4">
        <div role="tablist" aria-label="Раздел админки" className="grid grid-cols-2 gap-1">
          <button
            type="button"
            role="tab"
            aria-selected={pane === 'orders'}
            onClick={() => selectPane('orders')}
            className={tabClass(pane === 'orders')}
          >
            {AppStrings.admin.orders}
            {newOrderCount > 0 ? <span className="ml-1 tabular-nums">({newOrderCount})</span> : null}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={pane === 'vitrina'}
            onClick={() => selectPane('vitrina')}
            className={tabClass(pane === 'vitrina')}
          >
            {AppStrings.admin.products}
          </button>
        </div>

        {pane === 'orders' ? (
          <section className="space-y-4">
            <Button fullWidth onClick={() => setNewOrderOpen(true)}>
              {AppStrings.admin.newOrder}
            </Button>
            <div role="tablist" aria-label="Очередь заказов" className="grid grid-cols-2 gap-1">
              <button
                type="button"
                role="tab"
                aria-selected={bucket === 'work'}
                onClick={() => setBucket('work')}
                className={tabClass(bucket === 'work')}
              >
                {AppStrings.admin.work}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={bucket === 'archive'}
                onClick={() => setBucket('archive')}
                className={tabClass(bucket === 'archive')}
              >
                {AppStrings.admin.archive}
              </button>
            </div>

            {visibleOrders.length === 0 ? (
              <p className="text-sm text-muted">
                {bucket === 'work' ? AppStrings.admin.emptyOrders : AppStrings.admin.emptyArchive}
              </p>
            ) : (
              <div className="space-y-3">
                {visibleOrders.map((order) => (
                  <AdminOrderCard key={order.id} order={order} onStatus={onStatus} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <section className="space-y-4">
            <label className="relative block">
              <span className="sr-only">{AppStrings.admin.search}</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                placeholder={AppStrings.admin.search}
                autoComplete="off"
                className="h-11 w-full border border-stone-200 bg-background pl-10 pr-3 text-base text-stone-900 placeholder:text-muted md:text-sm"
              />
            </label>
            <div role="tablist" aria-label={AppStrings.catalog.filters} className="grid grid-cols-3 gap-1">
              {FORMAT_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={section === tab.id}
                  onClick={() => setSection(tab.id)}
                  className={tabClass(section === tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {rows.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-muted">{AppStrings.admin.emptyProducts}</p>
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="h-11 text-sm text-stone-900 underline"
                  >
                    {AppStrings.admin.searchReset}
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="space-y-3">
                {rows.map(({ product, offer }) => (
                  <AdminOfferRow
                    key={offer.id}
                    productId={product.id}
                    brand={product.brand}
                    name={product.name}
                    imageUrl={product.imageUrl}
                    offer={offer}
                    onDeleted={onDeleted}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
      {newOrderOpen ? (
        <AdminNewOrderSheet catalog={catalog} onClose={closeNewOrder} onCreated={onCreated} />
      ) : null}
    </main>
  )
}
