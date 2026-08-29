'use client'

import { FormEvent, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useSearchUi } from '@/components/layout/SearchProvider'
import { perfumeHref } from '@/lib/labels'
import { POPULAR_QUERIES, searchSuggestions } from '@/lib/search'
import { AppStrings } from '@/lib/strings'
import { useFocusTrap } from '@/lib/use-focus-trap'

export default function SearchOverlay() {
  const { isOpen, closeSearch, perfumes } = useSearchUi()
  const [query, setQuery] = useState('')
  const router = useRouter()

  const suggestions = useMemo(
    () => (query.trim().length >= 2 ? searchSuggestions(perfumes, query) : []),
    [perfumes, query]
  )
  const overlayRef = useRef<HTMLDivElement>(null)
  useFocusTrap(isOpen, overlayRef, closeSearch)

  if (!isOpen) return null

  const goCatalog = (value: string) => {
    const next = value.trim()
    closeSearch()
    setQuery('')
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
            onChange={(event) => setQuery(event.target.value)}
            placeholder={AppStrings.catalog.searchPlaceholder}
            autoComplete="off"
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
              {suggestions.map((perfume) => (
                <li key={perfume.id}>
                  <button
                    type="button"
                    className="flex h-auto w-full flex-col items-start py-3 text-left"
                    onClick={() => {
                      closeSearch()
                      setQuery('')
                      router.push(perfumeHref(perfume.slug))
                    }}
                  >
                    <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
                      {perfume.brand}
                    </span>
                    <span className="text-sm text-stone-900">{perfume.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">
              {`По запросу «${query}» ничего не найдено`}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
