import CheckoutView from './CheckoutView'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Оформление заказа | Lumira',
}

export default function CheckoutPage() {
  return <CheckoutView />
}
