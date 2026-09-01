'use client'

import Link from 'next/link'
import { AppStrings } from '@/lib/strings'
import { signOutAdmin } from './actions'

export default function AdminHeader({ showLogout = false }: { showLogout?: boolean }) {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-background">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between gap-3 px-4 sm:px-6">
        <p className="inline-flex items-baseline gap-2 text-stone-900">
          <span className="font-serif text-xl italic">{AppStrings.brand.mark}</span>
          <span className="text-muted font-light" aria-hidden>
            ·
          </span>
          <span className="text-[10px] font-light uppercase tracking-[0.2em] text-muted">
            {AppStrings.admin.badge}
          </span>
        </p>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-stone-900 hover:text-muted">
            {AppStrings.admin.toStore}
          </Link>
          {showLogout ? (
            <form action={signOutAdmin}>
              <button type="submit" className="text-sm text-muted hover:text-stone-900">
                {AppStrings.admin.logout}
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </header>
  )
}
