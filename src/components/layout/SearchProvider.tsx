'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { CATALOG_SEARCH_ID } from '@/lib/constants'
import type { Perfume } from '@/lib/data'

interface SearchContextValue {
  isOpen: boolean
  perfumes: Perfume[]
  openSearch: () => void
  closeSearch: () => void
  requestSearch: () => void
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined)

export function SearchProvider({
  children,
  perfumes,
}: {
  children: ReactNode
  perfumes: Perfume[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const openSearch = useCallback(() => setIsOpen(true), [])
  const closeSearch = useCallback(() => setIsOpen(false), [])

  const requestSearch = useCallback(() => {
    if (pathname === '/') {
      const input = document.getElementById(CATALOG_SEARCH_ID)
      if (input instanceof HTMLInputElement) {
        input.scrollIntoView({ behavior: 'smooth', block: 'center' })
        window.setTimeout(() => input.focus(), 200)
        return
      }
      router.push('/')
      return
    }
    setIsOpen(true)
  }, [pathname, router])

  const value = useMemo(
    () => ({ isOpen, perfumes, openSearch, closeSearch, requestSearch }),
    [isOpen, perfumes, openSearch, closeSearch, requestSearch]
  )

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}

export function useSearchUi(): SearchContextValue {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearchUi must be used within SearchProvider')
  }
  return context
}
