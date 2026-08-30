import type { Metadata, Viewport } from 'next'
import CheckoutView from './CheckoutView'

export const metadata: Metadata = {
  title: 'Оформление заказа | Lumira',
}

export const viewport: Viewport = {
  interactiveWidget: 'resizes-content',
}

export default function CheckoutPage() {
  return <CheckoutView />
}
