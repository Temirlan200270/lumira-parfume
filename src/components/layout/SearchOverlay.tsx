'use client'

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useSearchUi } from '@/components/layout/SearchProvider'
import { normalizeSearch } from '@/lib/data'
import { POPULAR_QUERIES } from '@/lib/search'
import { AppStrings } from '@/lib/strings'
import { useFocusTrap } from '@/lib/use-focus-trap'

interface SearchIndexItem {
  id: string
  name: string
}

export default function SearchOverlay() {
  const { isOpen, closeSearch, applyHomeQuery } = useSearchUi()
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState<SearchIndexItem[] | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const overlayRef = useRef<HTMLDivElement>(null)
  useFocusTrap(isOpen, overlayRef, closeSearch)

  useEffect(() => {
    if (!isOpen || index) return
    const controller = new AbortController()
    fetch('/api/search-index', { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : []))
      .then((rows: SearchIndexItem[]) => setIndex(Array.isArray(rows) ? rows : []))
      .catch(() => {
        if (!controller.signal.aborted) setIndex([])
      })
    return () => controller.abort()
  }, [isOpen, index])

  const suggestions = useMemo(() => {
    if (query.trim().length < 2 || !index) return []
    const needle = normalizeSearch(query)
    return index.filter((row) => normalizeSearch(row.name).includes(needle)).slice(0, 6)
  }, [index, query])

  if (!isOpen) return null

  const goCatalog = (value: string) => {
    const next = value.trim()
    closeSearch()
    setQuery('')
    if (pathname === '/' && applyHomeQuery(next)) return
    router.push(next ? `/?q=${encodeURIComponent(next)}` : '/')
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    goCatalog(query)
  }

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[80] bg-background">
      <div className="container-lumira pt-4 md:pt-8">
        <form onSubmit={onSubmit} className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <label htmlFor="overlay-search" className="sr-only">
            {AppStrings.catalog.searchLabel}
          </label>
          <input
            id="overlay-search"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder={AppStrings.catalog.searchPlaceholder}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            inputMode="search"
            autoFocus
            className="h-11 w-full border border-stone-200 bg-background pl-10 pr-12 text-base text-stone-900 placeholder:text-muted md:text-sm"
          />
          <button
            type="button"
            onClick={() => {
              closeSearch()
              setQuery('')
            }}
            className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-muted hover:text-stone-900"
            aria-label={AppStrings.catalog.searchClose}
          >
            <X className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6">
          {query.trim().length < 2 ? (
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-muted">
                {AppStrings.catalog.popular}
              </p>
              <ul className="space-y-1">
                {POPULAR_QUERIES.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      className="h-11 w-full text-left text-sm text-stone-900"
                      onClick={() => goCatalog(item)}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : suggestions.length > 0 ? (
            <ul>
              {suggestions.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className="flex h-auto w-full flex-col items-start py-3 text-left"
                    onClick={() => goCatalog(item.name)}
                  >
                    <span className="text-sm text-stone-900">{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : index === null ? null : (
            <p className="text-sm text-muted">
              {`По запросу «${query}» ничего не найдено`}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
