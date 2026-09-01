'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import SearchOverlay from '@/components/layout/SearchOverlay'
import StoreFrame from '@/components/layout/StoreFrame'
import CartDrawer from '@/components/cart/CartDrawer'

export default function StoreChrome({
  children,
  footer,
}: {
  children: ReactNode
  footer: ReactNode
}) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return <div className="flex min-h-0 flex-1 flex-col">{children}</div>
  }

  return (
    <>
      <Navbar />
      <StoreFrame>{children}</StoreFrame>
      <CartDrawer />
      <SearchOverlay />
      <BottomNav />
      {footer}
    </>
  )
}
