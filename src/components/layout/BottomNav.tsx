'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, LayoutGrid, MessageCircle, ShoppingBag } from 'lucide-react'
import { useCart } from '@/components/cart/CartProvider'
import { WHATSAPP_LINK } from '@/lib/constants'
import { AppStrings } from '@/lib/strings'

export default function BottomNav() {
  const pathname = usePathname()
  const { itemCount, openCart } = useCart()

  if (pathname.startsWith('/checkout') || pathname.startsWith('/admin')) {
    return null
  }

  const catalogActive = pathname === '/catalog' || pathname.startsWith('/perfume')
  const favoritesActive = pathname === '/favorites'

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-stone-200 bg-background lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Нижняя навигация"
    >
      <div className="grid h-14 grid-cols-4">
        <Link
          href="/catalog"
          className={`flex flex-col items-center justify-center gap-0.5 text-[12px] ${
            catalogActive ? 'text-stone-900' : 'text-muted'
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          {AppStrings.nav.catalog}
        </Link>
        <Link
          href="/favorites"
          className={`flex flex-col items-center justify-center gap-0.5 text-[12px] ${
            favoritesActive ? 'text-stone-900' : 'text-muted'
          }`}
        >
          <Heart className="h-4 w-4" />
          {AppStrings.nav.favorites}
        </Link>
        <button
          type="button"
          onClick={openCart}
          className="relative flex flex-col items-center justify-center gap-0.5 text-[12px] text-muted"
          aria-label={AppStrings.nav.cart}
        >
          <ShoppingBag className="h-4 w-4" />
          {AppStrings.nav.cart}
          {itemCount > 0 && (
            <span className="absolute top-1 right-[calc(50%-22px)] min-w-4 bg-stone-900 px-1 text-center text-[11px] leading-4 text-stone-50 tabular-nums">
              {itemCount}
            </span>
          )}
        </button>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-0.5 text-[12px] text-muted"
        >
          <MessageCircle className="h-4 w-4" />
          {AppStrings.nav.whatsapp}
        </a>
      </div>
    </nav>
  )
}
