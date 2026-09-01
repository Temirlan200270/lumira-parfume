'use client'

import { memo, startTransition, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Filter, Search, X } from 'lucide-react'
import type { Perfume } from '@/lib/data'
import ProductCard from '@/components/ui/ProductCard'
import FilterFields, { type FilterDraft } from '@/components/catalog/FilterFields'
import FilterSheet from '@/components/catalog/FilterSheet'
import { applyCatalogFilters, hasNarrowingFilters } from '@/lib/catalog-filter'
import { CATALOG_SEARCH_ID } from '@/lib/constants'
import { aromaCountLabel } from '@/lib/labels'
import { POPULAR_QUERIES, rankPerfumes, searchSuggestions } from '@/lib/search'
import { AppStrings } from '@/lib/strings'
import LogoMark from '@/components/ui/LogoMark'
import { useSearchUi } from '@/components/layout/SearchProvider'

type SectionFilter = 'all' | 'razliv' | 'raspiv'
type SortKey = 'popular' | 'price-asc' | 'price-desc' | 'name'
type StockFilter = 'all' | 'in' | 'out'

const CATALOG_TABS: { id: SectionFilter; label: string }[] = [
  { id: 'all', label: AppStrings.catalog.tabAll },
  { id: 'razliv', label: AppStrings.catalog.razliv },
  { id: 'raspiv', label: AppStrings.catalog.raspiv },
]

interface CatalogProps {
  perfumes: Perfume[]
}

const CatalogGrid = memo(function CatalogGrid({ perfumes }: { perfumes: Perfume[] }) {
  const priorityIdsRef = useRef<Set<string> | null>(null)
  if (!priorityIdsRef.current) {
    priorityIdsRef.current = new Set(perfumes.slice(0, 8).map((item) => item.id))
  }
  const priorityIds = priorityIdsRef.current

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {perfumes.map((perfume) => (
        <ProductCard key={perfume.id} perfume={perfume} priority={priorityIds.has(perfume.id)} />
      ))}
    </div>
  )
})

const SortSelect = memo(function SortSelect({
  value,
  className,
  onChange,
}: {
  value: SortKey
  className: string
  onChange: (value: string | null) => void
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value === 'popular' ? null : event.target.value)}
      aria-label={AppStrings.catalog.sort}
      className={className}
    >
      <option value="popular">{AppStrings.catalog.sortPopular}</option>
      <option value="price-asc">{AppStrings.catalog.sortPriceAsc}</option>
      <option value="price-desc">{AppStrings.catalog.sortPriceDesc}</option>
      <option value="name">{AppStrings.catalog.sortName}</option>
    </select>
  )
})

function asSection(value: string | null): SectionFilter {
  if (value === 'razliv' || value === 'raspiv') return value
  return 'all'
}

function asGender(value: string | null): Perfume['gender'] | 'all' {
  if (value === 'male' || value === 'female' || value === 'unisex') return value
  return 'all'
}

function asStock(value: string | null): StockFilter {
  if (value === 'in' || value === 'out') return value
  return 'all'
}

function asSort(value: string | null): SortKey {
  if (value === 'price-asc' || value === 'price-desc' || value === 'name') return value
  return 'popular'
}

export default function Catalog({ perfumes }: CatalogProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { registerHomeQuery } = useSearchUi()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const closeFilters = useCallback(() => setFiltersOpen(false), [])

  const urlSection = asSection(searchParams.get('format'))
  const urlQuery = searchParams.get('q') ?? ''
  const urlGender = asGender(searchParams.get('gender'))
  const urlBrand = searchParams.get('brand') ?? ''
  const urlStock = asStock(searchParams.get('stock'))
  const urlSort = asSort(searchParams.get('sort'))
  const urlMinPrice = searchParams.get('min') ?? ''
  const urlMaxPrice = searchParams.get('max') ?? ''

  const [activeSection, setActiveSection] = useState(urlSection)
  const [query, setQuery] = useState(urlQuery)
  const [selectedGender, setSelectedGender] = useState(urlGender)
  const [selectedBrand, setSelectedBrand] = useState(urlBrand)
  const [stock, setStock] = useState(urlStock)
  const [sortBy, setSortBy] = useState(urlSort)
  const [minPrice, setMinPrice] = useState(urlMinPrice)
  const [maxPrice, setMaxPrice] = useState(urlMaxPrice)
  const deferredQuery = useDeferredValue(query)
  const deferredMinPrice = useDeferredValue(minPrice)
  const deferredMaxPrice = useDeferredValue(maxPrice)
  const deferredSection = useDeferredValue(activeSection)
  const deferredGender = useDeferredValue(selectedGender)
  const deferredBrand = useDeferredValue(selectedBrand)
  const deferredStockValue = useDeferredValue(stock)
  const deferredSortBy = useDeferredValue(sortBy)
  const queryRef = useRef(query)
  const minPriceRef = useRef(minPrice)
  const maxPriceRef = useRef(maxPrice)
  queryRef.current = query
  minPriceRef.current = minPrice
  maxPriceRef.current = maxPrice

  useEffect(() => {
    setActiveSection(urlSection)
    setQuery(urlQuery)
    setSelectedGender(urlGender)
    setSelectedBrand(urlBrand)
    setStock(urlStock)
    setSortBy(urlSort)
    setMinPrice(urlMinPrice)
    setMaxPrice(urlMaxPrice)
  }, [urlSection, urlQuery, urlGender, urlBrand, urlStock, urlSort, urlMinPrice, urlMaxPrice])

  const writeSearchToUrl = useCallback(
    (patch: Record<string, string | null>) => {
      if (typeof window === 'undefined') return
      const next = new URLSearchParams(window.location.search)
      if (!('q' in patch)) {
        if (queryRef.current) next.set('q', queryRef.current)
        else next.delete('q')
      }
      if (!('min' in patch)) {
        if (minPriceRef.current) next.set('min', minPriceRef.current)
        else next.delete('min')
      }
      if (!('max' in patch)) {
        if (maxPriceRef.current) next.set('max', maxPriceRef.current)
        else next.delete('max')
      }
      for (const [key, value] of Object.entries(patch)) {
        if (!value) next.delete(key)
        else next.set(key, value)
      }
      next.delete('page')
      const qs = next.toString()
      const href = qs ? `${pathname}?${qs}` : pathname
      const current = `${window.location.pathname}${window.location.search}`
      if (href === current) return
      window.history.replaceState(window.history.state, '', href)
    },
    [pathname]
  )

  const setParams = useCallback(
    (patch: Record<string, string | null>) => {
      if ('format' in patch) setActiveSection(asSection(patch.format))
      if ('gender' in patch) setSelectedGender(asGender(patch.gender))
      if ('brand' in patch) setSelectedBrand(patch.brand ?? '')
      if ('stock' in patch) setStock(asStock(patch.stock))
      if ('sort' in patch) setSortBy(asSort(patch.sort))
      startTransition(() => {
        writeSearchToUrl(patch)
      })
    },
    [writeSearchToUrl]
  )

  const applySheetFilters = useCallback(
    (draft: FilterDraft) => {
      setSelectedGender(draft.gender)
      setSelectedBrand(draft.brand)
      setStock(draft.stock)
      setMinPrice(draft.minPrice)
      setMaxPrice(draft.maxPrice)
      startTransition(() => {
        writeSearchToUrl({
          gender: draft.gender === 'all' ? null : draft.gender,
          brand: draft.brand || null,
          stock: draft.stock === 'all' ? null : draft.stock,
          min: draft.minPrice || null,
          max: draft.maxPrice || null,
        })
      })
    },
    [writeSearchToUrl]
  )

  const writeQueryToUrl = useCallback(
    (value: string) => {
      writeSearchToUrl({ q: value || null })
    },
    [writeSearchToUrl]
  )

  const commitPriceToUrl = useCallback(() => {
    writeSearchToUrl({
      min: minPriceRef.current || null,
      max: maxPriceRef.current || null,
    })
  }, [writeSearchToUrl])

  const commitQuery = useCallback(
    (value: string) => {
      setQuery(value)
      setSearchFocused(false)
      writeQueryToUrl(value)
    },
    [writeQueryToUrl]
  )

  useEffect(() => {
    registerHomeQuery(commitQuery)
    return () => registerHomeQuery(null)
  }, [commitQuery, registerHomeQuery])

  const onSearchChange = (value: string) => {
    setQuery(value)
  }

  const brands = useMemo(() => {
    return [...new Set(perfumes.map((perfume) => perfume.brand))].sort((a, b) => a.localeCompare(b, 'ru'))
  }, [perfumes])
  const hasOutOfStock = useMemo(
    () => perfumes.some((perfume) => perfume.isInStock === false),
    [perfumes],
  )
  const gridStock = hasOutOfStock ? deferredStockValue : 'all'

  const scoped = useMemo(
    () =>
      applyCatalogFilters(perfumes, {
        section: deferredSection,
        gender: deferredGender,
        brand: deferredBrand,
        stock: gridStock,
        minPrice: deferredMinPrice,
        maxPrice: deferredMaxPrice,
        sortBy: deferredSortBy,
      }),
    [
      perfumes,
      deferredSection,
      deferredGender,
      deferredBrand,
      gridStock,
      deferredMinPrice,
      deferredMaxPrice,
      deferredSortBy,
    ]
  )

  const filtered = useMemo(() => {
    if (deferredQuery.trim().length < 2) return scoped
    return rankPerfumes(scoped, deferredQuery)
  }, [scoped, deferredQuery])

  const suggestions = useMemo(
    () => (query.trim().length >= 2 ? searchSuggestions(scoped, query) : []),
    [scoped, query]
  )

  const title =
    activeSection === 'raspiv'
      ? AppStrings.catalog.raspiv
      : activeSection === 'razliv'
        ? AppStrings.catalog.razliv
        : AppStrings.catalog.all

  const appliedDraft = useMemo<FilterDraft>(
    () => ({
      gender: selectedGender,
      brand: selectedBrand,
      stock,
      minPrice,
      maxPrice,
    }),
    [selectedGender, selectedBrand, stock, minPrice, maxPrice]
  )

  const frozenGridRef = useRef(filtered)
  if (!filtersOpen) frozenGridRef.current = filtered
  const gridPerfumes = filtersOpen ? frozenGridRef.current : filtered

  const reset = () => {
    setQuery('')
    setMinPrice('')
    setMaxPrice('')
    setActiveSection('all')
    setSelectedGender('all')
    setSelectedBrand('')
    setStock('all')
    setSortBy('popular')
    if (typeof window !== 'undefined') {
      window.history.replaceState(window.history.state, '', pathname)
    }
  }

  const onSortChange = useCallback((value: string | null) => {
    setParams({ sort: value })
  }, [setParams])

  const onDesktopFilterChange = useCallback(
    (patch: Partial<FilterDraft>) => {
      if (patch.gender !== undefined) {
        setParams({ gender: patch.gender === 'all' ? null : patch.gender })
      }
      if (patch.brand !== undefined) {
        setParams({ brand: patch.brand || null })
      }
      if (patch.stock !== undefined) {
        setParams({ stock: patch.stock === 'all' ? null : patch.stock })
      }
      if (patch.minPrice !== undefined) setMinPrice(patch.minPrice)
      if (patch.maxPrice !== undefined) setMaxPrice(patch.maxPrice)
    },
    [setParams]
  )

  return (
    <section className="bg-background pt-3 pb-10 md:pt-16 md:pb-16">
      <div className="container-lumira">
        <div className="mb-4 md:mb-6">
          <LogoMark />
        </div>
        <h1 className="sr-only md:not-sr-only md:mb-6 md:text-[40px] md:font-light md:leading-10 md:text-stone-900">
          {title}
        </h1>

        <div className="mb-2 flex items-center gap-2 md:mb-3 md:gap-3">
          <div
            role="tablist"
            aria-label="Раздел каталога"
            className="flex min-w-0 flex-1 gap-1 overflow-x-auto md:flex-none"
          >
            {CATALOG_TABS.map((tab) => {
              const active = activeSection === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setParams({ format: tab.id === 'all' ? null : tab.id })}
                  className={`inline-flex h-9 shrink-0 items-center px-3 text-xs uppercase tracking-[0.12em] md:h-11 md:px-4 ${
                    active
                      ? 'bg-stone-900 text-stone-50'
                      : 'border border-stone-200 text-muted hover:border-stone-900 hover:text-stone-900'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 border border-stone-200 px-3 text-xs lg:hidden"
          >
            <Filter className="h-3.5 w-3.5" />
            {AppStrings.catalog.filters}
          </button>

          <form
            className="relative hidden min-w-0 flex-1 md:block"
            onSubmit={(event) => {
              event.preventDefault()
              commitQuery(query.trim())
            }}
          >
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <label htmlFor={CATALOG_SEARCH_ID} className="sr-only">
            {AppStrings.catalog.searchLabel}
          </label>
          <input
            id={CATALOG_SEARCH_ID}
            type="text"
            value={query}
            onChange={(event) => onSearchChange(event.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={(event) => {
              window.setTimeout(() => setSearchFocused(false), 150)
              writeQueryToUrl(event.currentTarget.value)
            }}
            placeholder={AppStrings.catalog.searchPlaceholder}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            inputMode="search"
            className="h-11 w-full border border-stone-200 bg-background pl-10 pr-12 text-base text-stone-900 placeholder:text-muted md:text-sm"
          />
          {query ? (
            <button
              type="button"
              onClick={() => commitQuery('')}
              className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-muted hover:text-stone-900"
              aria-label={AppStrings.catalog.searchClear}
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
          {searchFocused && query.trim().length >= 2 && suggestions.length > 0 ? (
            <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 border border-stone-200 bg-background">
              {suggestions.map((perfume) => (
                <button
                  key={perfume.id}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => commitQuery(perfume.name)}
                  className="w-full border-b border-stone-100 px-4 py-3 text-left last:border-b-0 hover:bg-stone-50"
                >
                  <p className="text-sm text-stone-900">{perfume.name}</p>
                </button>
              ))}
            </div>
          ) : null}
          {searchFocused && !query.trim() ? (
            <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 border border-stone-200 bg-background p-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-muted">
                {AppStrings.catalog.popular}
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_QUERIES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => commitQuery(item)}
                    className="h-11 border border-stone-200 px-3 text-sm"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          </form>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {filtersOpen ? (
            <FilterSheet
              initial={appliedDraft}
              brands={brands}
              hasOutOfStock={hasOutOfStock}
              perfumes={perfumes}
              section={activeSection}
              query={query}
              onApply={applySheetFilters}
              onClose={closeFilters}
            />
          ) : null}

          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] space-y-4 overflow-y-auto pr-1">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
                {AppStrings.catalog.filters}
              </p>
              <FilterFields
                draft={appliedDraft}
                brands={brands}
                hasOutOfStock={hasOutOfStock}
                onChange={onDesktopFilterChange}
                onReset={reset}
                onPriceCommit={commitPriceToUrl}
              />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-center justify-between gap-3 md:mb-4">
              <p className="text-xs text-muted md:text-sm">{aromaCountLabel(filtered.length)}</p>
              <SortSelect
                value={sortBy}
                onChange={onSortChange}
                className="h-8 max-w-[11rem] rounded-[2px] border-0 bg-transparent px-0 text-xs text-stone-900 lg:h-10 lg:w-52 lg:max-w-none lg:border lg:border-stone-200 lg:bg-background lg:px-3 lg:text-sm"
              />
            </div>

            {gridPerfumes.length > 0 ? (
              <div aria-busy={deferredSortBy !== sortBy || deferredSection !== activeSection || undefined}>
                <CatalogGrid perfumes={gridPerfumes} />
              </div>
            ) : deferredSection === 'raspiv' &&
              !hasNarrowingFilters({
                gender: deferredGender,
                brand: deferredBrand,
                stock: gridStock,
                minPrice: deferredMinPrice,
                maxPrice: deferredMaxPrice,
                query: deferredQuery,
              }) ? (
              <div className="py-20">
                <p className="text-sm text-stone-900">{AppStrings.catalog.emptyRaspiv}</p>
                <p className="mt-2 text-sm text-muted">{AppStrings.catalog.emptyRaspivLead}</p>
                <button
                  type="button"
                  onClick={() => setParams({ format: 'razliv' })}
                  className="mt-6 inline-flex h-11 items-center text-sm text-stone-900 underline"
                >
                  {AppStrings.catalog.emptyRaspivCta}
                </button>
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-muted">
                  {query ? `По запросу «${query}» ничего не найдено` : AppStrings.catalog.empty}
                </p>
                <button type="button" onClick={reset} className="mt-4 text-sm text-stone-900 underline">
                  {AppStrings.catalog.reset}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
