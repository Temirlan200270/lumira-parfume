'use client'

import Link from 'next/link'
import { Heart, Search, ShoppingBag } from 'lucide-react'
import { useCart } from '@/components/cart/CartProvider'
import { useSearchUi } from '@/components/layout/SearchProvider'
import Logo from '@/components/ui/Logo'
import { WHATSAPP_LINK } from '@/lib/constants'
import { AppStrings } from '@/lib/strings'

const desktopLinks = [
  { href: '/', label: AppStrings.nav.catalog },
  { href: '/?format=razliv', label: AppStrings.nav.razliv },
  { href: '/?format=raspiv', label: AppStrings.nav.raspiv },
  { href: '/how-it-works', label: AppStrings.nav.how },
]

export default function Navbar() {
  const { itemCount, openCart } = useCart()
  const { requestSearch } = useSearchUi()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-stone-200 bg-background md:h-16">
      <div className="container-lumira flex h-full items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Основное меню">
          {desktopLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-normal text-stone-900 hover:text-muted"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:gap-2">
          <button
            type="button"
            onClick={requestSearch}
            className="flex h-11 w-11 items-center justify-center text-stone-900"
            aria-label={AppStrings.nav.search}
          >
            <Search className="h-4 w-4" />
          </button>
          <Link
            href="/favorites"
            className="hidden h-11 w-11 items-center justify-center text-stone-900 lg:flex"
            aria-label={AppStrings.nav.favorites}
          >
            <Heart className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="relative hidden h-11 w-11 items-center justify-center text-stone-900 lg:flex"
            aria-label={AppStrings.cart.open}
          >
            <ShoppingBag className="h-4 w-4" />
            {itemCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-4 bg-stone-900 px-1 text-center text-[11px] leading-4 text-stone-50 tabular-nums">
                {itemCount}
              </span>
            )}
          </button>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden px-2 text-sm font-normal text-stone-900 hover:text-muted lg:inline"
          >
            {AppStrings.nav.whatsapp}
          </a>
        </div>
      </div>
    </header>
  )
}
