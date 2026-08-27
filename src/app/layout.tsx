import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Playfair_Display } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import SearchOverlay from '@/components/layout/SearchOverlay'
import { SearchProvider } from '@/components/layout/SearchProvider'
import { FavoritesProvider } from '@/components/ui/FavoritesProvider'
import { ToastProvider } from '@/components/ui/Toast'
import { CartProvider } from '@/components/cart/CartProvider'
import CartDrawer from '@/components/cart/CartDrawer'
import StoreFrame from '@/components/layout/StoreFrame'
import { getCatalog } from '@/lib/catalog'
import './globals.css'

export const dynamic = 'force-dynamic'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
})

export const metadata: Metadata = {
  title: 'Lumira Parfume | Оригинальная парфюмерия по миллилитру',
  description: 'Разлив и распив. 5, 10 или 20 мл. Заказ в WhatsApp, оплата Kaspi.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const perfumes = await getCatalog()

  return (
    <html lang="ru" className={`${geistSans.variable} ${playfair.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <ToastProvider>
          <FavoritesProvider>
            <CartProvider>
              <SearchProvider perfumes={perfumes}>
                <Navbar />
                <StoreFrame>{children}</StoreFrame>
                <CartDrawer />
                <SearchOverlay />
                <BottomNav />
                <div className="grain-overlay" />
                <Footer />
              </SearchProvider>
            </CartProvider>
          </FavoritesProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
