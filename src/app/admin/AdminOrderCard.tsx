'use client'

import { buildWhatsAppText, buildWhatsAppUrl, formatTenge } from '@/lib/order'
import { formatAdminOrderTime, ORDER_STATUS_LABEL, ORDER_STATUSES } from '@/lib/admin'
import { sectionLabel } from '@/lib/labels'
import { useToast } from '@/components/ui/Toast'
import { AppStrings } from '@/lib/strings'
import { patchOrderStatus } from './actions'
import type { OrderItemSnapshot, OrderStatus } from '@/lib/types'

export interface AdminOrder {
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

interface AdminOrderCardProps {
  order: AdminOrder
  onStatus: (orderId: string, status: OrderStatus) => void
}

export default function AdminOrderCard({ order, onStatus }: AdminOrderCardProps) {
  const { toast } = useToast()
  const whatsappUrl = buildWhatsAppUrl(
    buildWhatsAppText({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      items: order.items,
      totalTenge: order.totalTenge,
    }),
    order.phoneE164
  )

  const setStatus = async (status: OrderStatus) => {
    if (status === order.status) return
    const previous = order.status
    onStatus(order.id, status)
    const result = await patchOrderStatus(order.id, status)
    if (!result.ok) {
      onStatus(order.id, previous)
      toast(AppStrings.admin.saveError, 1500)
    }
  }

  return (
    <article className="space-y-4 border border-stone-200 p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 break-all text-sm font-medium text-stone-900">{order.orderNumber}</p>
        <p className="shrink-0 text-right text-xs text-muted">{formatAdminOrderTime(order.createdAt)}</p>
      </div>

      <div>
        <p className="break-words text-sm text-stone-900">{order.customerName}</p>
        <a
          href={`tel:${order.phoneE164}`}
          className="inline-flex h-11 items-center text-sm text-muted"
        >
          {order.phoneE164}
        </a>
      </div>

      <ul className="space-y-1 text-sm text-stone-700">
        {order.items.map((item) => (
          <li key={`${item.offerId}-${item.volumeMl}`} className="break-words">
            {item.brand} {item.name} · {sectionLabel(item.section)} · {item.volumeMl} мл × {item.quantity} —{' '}
            {formatTenge(item.lineTotalTenge)}
          </li>
        ))}
      </ul>

      <div>
        <p className="text-sm text-stone-900">{formatTenge(order.totalTenge)}</p>
        <p className="text-xs text-muted">{AppStrings.admin.kaspiAfter}</p>
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-11 w-full items-center justify-center bg-stone-900 px-4 text-sm text-stone-50"
      >
        {AppStrings.admin.whatsapp}
      </a>

      <div className="grid grid-cols-2 gap-1 sm:flex sm:flex-wrap">
        {ORDER_STATUSES.map((status) => {
          const active = order.status === status
          return (
            <button
              key={status}
              type="button"
              aria-pressed={active}
              onClick={() => {
                void setStatus(status)
              }}
              className={`inline-flex h-11 items-center justify-center px-3 text-xs sm:flex-1 ${
                active
                  ? 'bg-stone-900 text-stone-50'
                  : 'border border-stone-200 text-stone-700 hover:border-stone-900'
              }`}
            >
              {ORDER_STATUS_LABEL[status]}
            </button>
          )
        })}
      </div>

      {order.telegramSent ? null : (
        <p className="text-xs text-muted">{AppStrings.admin.telegramMissed}</p>
      )}
    </article>
  )
}
