'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export default function StoreFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const hideBottom = pathname.startsWith('/checkout') || isAdmin

  return (
    <div
      className={`flex min-h-0 flex-1 flex-col ${isAdmin ? '' : 'pt-14 md:pt-16'} ${
        hideBottom ? '' : 'pb-[calc(56px+env(safe-area-inset-bottom))] lg:pb-0'
      }`}
    >
      {children}
    </div>
  )
}
