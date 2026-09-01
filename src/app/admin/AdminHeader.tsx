'use client'

import Link from 'next/link'
import { AppStrings } from '@/lib/strings'
import { signOutAdmin } from './actions'

export default function AdminHeader({ showLogout = false }: { showLogout?: boolean }) {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-background pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between gap-2 px-4 sm:px-6">
        <p className="min-w-0 truncate text-stone-900">
          <span className="font-serif text-xl italic">{AppStrings.brand.mark}</span>
          <span className="hidden font-light text-muted sm:inline" aria-hidden>
            {' '}
            ·{' '}
          </span>
          <span className="hidden text-[10px] font-light uppercase tracking-[0.2em] text-muted sm:inline">
            {AppStrings.admin.badge}
          </span>
        </p>
        <div className="flex shrink-0 items-center">
          <Link
            href="/"
            aria-label={AppStrings.admin.toStoreShort}
            className="inline-flex h-11 items-center px-2 text-sm text-stone-900 hover:text-muted"
          >
            <span className="sm:hidden">{AppStrings.admin.toStoreShort}</span>
            <span className="hidden sm:inline">{AppStrings.admin.toStore}</span>
          </Link>
          {showLogout ? (
            <form action={signOutAdmin}>
              <button
                type="submit"
                className="inline-flex h-11 items-center px-2 text-sm text-muted hover:text-stone-900"
              >
                {AppStrings.admin.logout}
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </header>
  )
}
