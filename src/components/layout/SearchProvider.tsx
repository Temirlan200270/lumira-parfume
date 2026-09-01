'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { CATALOG_SEARCH_ID } from '@/lib/constants'

type HomeQueryHandler = (query: string) => void

interface SearchContextValue {
  isOpen: boolean
  openSearch: () => void
  closeSearch: () => void
  requestSearch: () => void
  registerHomeQuery: (handler: HomeQueryHandler | null) => void
  applyHomeQuery: (query: string) => boolean
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined)

function isVisibleSearchInput(element: HTMLElement): boolean {
  return element.offsetParent !== null
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const homeQueryRef = useRef<HomeQueryHandler | null>(null)

  const openSearch = useCallback(() => setIsOpen(true), [])
  const closeSearch = useCallback(() => setIsOpen(false), [])

  const registerHomeQuery = useCallback((handler: HomeQueryHandler | null) => {
    homeQueryRef.current = handler
  }, [])

  const applyHomeQuery = useCallback((query: string) => {
    if (!homeQueryRef.current) return false
    homeQueryRef.current(query)
    return true
  }, [])

  const requestSearch = useCallback(() => {
    const input = document.getElementById(CATALOG_SEARCH_ID)
    if (input instanceof HTMLInputElement && isVisibleSearchInput(input)) {
      input.scrollIntoView({ behavior: 'smooth', block: 'center' })
      window.setTimeout(() => input.focus(), 200)
      return
    }
    setIsOpen(true)
  }, [])

  const value = useMemo(
    () => ({
      isOpen,
      openSearch,
      closeSearch,
      requestSearch,
      registerHomeQuery,
      applyHomeQuery,
    }),
    [isOpen, openSearch, closeSearch, requestSearch, registerHomeQuery, applyHomeQuery]
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
