import { formatTenge } from '@/lib/order'
import { AppStrings } from '@/lib/strings'
import type { CatalogSection, OrderItemSnapshot, OrderStatus } from '@/lib/types'
import { signOutAdmin, updateOffer, updateOrderStatus, updateProductVisibility } from './actions'

interface AdminProduct {
  id: string
  brand: string
  name: string
  isActive: boolean
  offers: Array<{
    id: string
    section: CatalogSection
    pricePerMlTenge: number
    isInStock: boolean
    isActive: boolean
  }>
}

interface AdminOrder {
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

const STATUSES: OrderStatus[] = ['new', 'confirmed', 'paid', 'completed', 'cancelled']

export default function AdminDashboard({
  products,
  orders,
}: {
  products: AdminProduct[]
  orders: AdminOrder[]
}) {
  return (
    <main className="flex-1 pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-light text-stone-900">{AppStrings.admin.title}</h1>
          <form action={signOutAdmin}>
            <button type="submit" className="text-xs tracking-[0.18em] uppercase text-stone-500">
              {AppStrings.admin.logout}
            </button>
          </form>
        </div>

        <section className="space-y-4">
          <h2 className="text-sm tracking-[0.2em] uppercase text-stone-400">{AppStrings.admin.products}</h2>
          <div className="overflow-x-auto border border-stone-200">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-stone-50 text-left text-[11px] tracking-[0.14em] uppercase text-stone-500">
                <tr>
                  <th className="px-3 py-3">Товар</th>
                  <th className="px-3 py-3">Раздел</th>
                  <th className="px-3 py-3">{AppStrings.admin.pricePerMl}</th>
                  <th className="px-3 py-3">{AppStrings.admin.inStock}</th>
                  <th className="px-3 py-3">Оффер</th>
                  <th className="px-3 py-3">Витрина</th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {products.flatMap((product) =>
                  product.offers.map((offer) => (
                    <tr key={offer.id} className="border-t border-stone-100">
                      <td className="px-3 py-3">
                        <p className="text-stone-900">{product.brand}</p>
                        <p className="text-stone-500 font-light">{product.name}</p>
                      </td>
                      <td className="px-3 py-3">{offer.section === 'raspiv' ? 'Распив' : 'Разлив'}</td>
                      <td className="px-3 py-3" colSpan={5}>
                        <div className="flex flex-wrap items-center gap-3">
                          <form action={updateOffer} className="flex flex-wrap items-center gap-3">
                            <input type="hidden" name="offerId" value={offer.id} />
                            <input
                              name="pricePerMlTenge"
                              type="number"
                              min={1}
                              defaultValue={offer.pricePerMlTenge}
                              className="w-24 h-9 px-2 border border-stone-200"
                            />
                            <label className="flex items-center gap-2 text-xs text-stone-600">
                              <input
                                type="checkbox"
                                name="isInStock"
                                defaultChecked={offer.isInStock}
                              />
                              {AppStrings.admin.inStock}
                            </label>
                            <label className="flex items-center gap-2 text-xs text-stone-600">
                              <input
                                type="checkbox"
                                name="isActive"
                                defaultChecked={offer.isActive}
                              />
                              Оффер
                            </label>
                            <button type="submit" className="h-9 px-3 border border-stone-900 text-[10px] tracking-[0.14em] uppercase">
                              Сохранить
                            </button>
                          </form>
                          <form action={updateProductVisibility} className="flex items-center gap-2">
                            <input type="hidden" name="productId" value={product.id} />
                            <label className="flex items-center gap-2 text-xs text-stone-600">
                              <input
                                type="checkbox"
                                name="isActive"
                                defaultChecked={product.isActive}
                              />
                              {product.isActive ? 'На витрине' : AppStrings.admin.hidden}
                            </label>
                            <button type="submit" className="h-9 px-3 border border-stone-200 text-[10px] tracking-[0.14em] uppercase">
                              Витрина
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm tracking-[0.2em] uppercase text-stone-400">{AppStrings.admin.orders}</h2>
          <div className="space-y-3">
            {orders.length === 0 ? (
              <p className="text-sm text-stone-400 font-light">Заказов пока нет</p>
            ) : (
              orders.map((order) => (
                <article key={order.id} className="border border-stone-200 p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="text-sm text-stone-900">{order.orderNumber}</p>
                      <p className="text-sm text-stone-500 font-light">
                        {order.customerName} · {order.phoneE164}
                      </p>
                    </div>
                    <p className="text-sm">{formatTenge(order.totalTenge)}</p>
                  </div>
                  <ul className="text-sm text-stone-600 font-light space-y-1">
                    {order.items.map((item) => (
                      <li key={`${item.offerId}-${item.volumeMl}`}>
                        {item.brand} {item.name}, {item.volumeMl} мл × {item.quantity} — {formatTenge(item.lineTotalTenge)}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs text-stone-400">
                      {AppStrings.admin.telegramSent}: {order.telegramSent ? 'да' : 'нет'}
                    </span>
                    <form action={updateOrderStatus} className="flex items-center gap-2">
                      <input type="hidden" name="orderId" value={order.id} />
                      <select
                        name="status"
                        defaultValue={order.status}
                        className="h-9 px-2 border border-stone-200 text-sm"
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <button type="submit" className="h-9 px-3 border border-stone-900 text-[10px] tracking-[0.14em] uppercase">
                        {AppStrings.admin.status}
                      </button>
                    </form>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
