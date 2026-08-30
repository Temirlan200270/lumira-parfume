'use client'

import { memo, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Filter, Search, X } from 'lucide-react'
import type { Perfume } from '@/lib/data'
import ProductCard from '@/components/ui/ProductCard'
import { applyCatalogFilters, hasNarrowingFilters } from '@/lib/catalog-filter'
import { CATALOG_SEARCH_ID } from '@/lib/constants'
import { aromaCountLabel } from '@/lib/labels'
import { POPULAR_QUERIES, rankPerfumes, searchSuggestions } from '@/lib/search'
import { AppStrings } from '@/lib/strings'
import { useFocusTrap } from '@/lib/use-focus-trap'

const GENDER_OPTIONS: { id: 'all' | Perfume['gender']; label: string }[] = [
  { id: 'all', label: AppStrings.gender.all },
  { id: 'male', label: AppStrings.gender.male },
  { id: 'female', label: AppStrings.gender.female },
  { id: 'unisex', label: AppStrings.gender.unisex },
]

type SectionFilter = 'all' | 'razliv' | 'raspiv'
type SortKey = 'popular' | 'price-asc' | 'price-desc' | 'name'
type StockFilter = 'all' | 'in' | 'out'

interface CatalogProps {
  perfumes: Perfume[]
}

const CatalogGrid = memo(function CatalogGrid({ perfumes }: { perfumes: Perfume[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {perfumes.map((perfume, index) => (
        <ProductCard key={perfume.id} perfume={perfume} index={index} />
      ))}
    </div>
  )
})

function SortSelect({
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
}

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
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const filterSheetRef = useRef<HTMLDivElement>(null)
  const closeFilters = useCallback(() => setFiltersOpen(false), [])
  useFocusTrap(filtersOpen, filterSheetRef, closeFilters)

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
      writeSearchToUrl(patch)
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

  const onSearchChange = (value: string) => {
    setQuery(value)
  }

  const brands = useMemo(() => {
    return [...new Set(perfumes.map((perfume) => perfume.brand))].sort((a, b) => a.localeCompare(b, 'ru'))
  }, [perfumes])

  const scoped = useMemo(
    () =>
      applyCatalogFilters(perfumes, {
        section: activeSection,
        gender: selectedGender,
        brand: selectedBrand,
        stock,
        minPrice: deferredMinPrice,
        maxPrice: deferredMaxPrice,
        sortBy,
      }),
    [
      perfumes,
      activeSection,
      selectedGender,
      selectedBrand,
      stock,
      deferredMinPrice,
      deferredMaxPrice,
      sortBy,
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

  const lead =
    activeSection === 'raspiv'
      ? AppStrings.catalog.leadRaspiv
      : activeSection === 'razliv'
        ? AppStrings.catalog.leadRazliv
        : AppStrings.catalog.leadAll

  const tabs: { id: SectionFilter; label: string }[] = [
    { id: 'all', label: AppStrings.catalog.tabAll },
    { id: 'razliv', label: AppStrings.catalog.razliv },
    { id: 'raspiv', label: AppStrings.catalog.raspiv },
  ]

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

  const renderFilters = () => (
    <div className="space-y-4">
      <fieldset>
        <legend className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-muted">
          {AppStrings.catalog.gender}
        </legend>
        <div className="grid grid-cols-2 gap-1">
          {GENDER_OPTIONS.map((gender) => (
            <button
              key={gender.id}
              type="button"
              onClick={() => setParams({ gender: gender.id === 'all' ? null : gender.id })}
              className={`flex min-h-9 items-center justify-center px-2 text-sm ${
                selectedGender === gender.id ? 'bg-stone-900 text-stone-50' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              {gender.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-muted">
          {AppStrings.catalog.brand}
        </legend>
        <select
          aria-label={AppStrings.catalog.brand}
          value={selectedBrand}
          onChange={(event) => setParams({ brand: event.target.value || null })}
          className="h-10 w-full rounded-[2px] border border-stone-200 bg-background px-3 text-sm"
        >
          <option value="">{AppStrings.catalog.allBrands}</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-muted">
          {AppStrings.catalog.price}
        </legend>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder="от"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            onBlur={commitPriceToUrl}
            onKeyDown={(event) => {
              if (event.key === 'Enter') event.currentTarget.blur()
            }}
            className="h-10 rounded-[2px] border border-stone-200 px-3 text-sm"
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="до"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            onBlur={commitPriceToUrl}
            onKeyDown={(event) => {
              if (event.key === 'Enter') event.currentTarget.blur()
            }}
            className="h-10 rounded-[2px] border border-stone-200 px-3 text-sm"
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-muted">
          {AppStrings.catalog.stock}
        </legend>
        <div className="grid grid-cols-1 gap-1">
          {(['all', 'in', 'out'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setParams({ stock: item === 'all' ? null : item })}
              className={`flex min-h-9 items-center px-3 text-left text-sm ${
                stock === item ? 'bg-stone-900 text-stone-50' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              {item === 'all'
                ? AppStrings.catalog.stockAll
                : item === 'in'
                  ? AppStrings.catalog.stockIn
                  : AppStrings.catalog.stockOut}
            </button>
          ))}
        </div>
      </fieldset>

      <button type="button" onClick={reset} className="text-sm text-muted hover:text-stone-900">
        {AppStrings.catalog.reset}
      </button>
    </div>
  )

  return (
    <section className="section-y bg-background">
      <div className="container-lumira">
        <h1 className="mb-6 text-[32px] font-light leading-10 text-stone-900 md:text-[40px]">{title}</h1>

        <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center">
          <div
            role="tablist"
            aria-label="Раздел каталога"
            className="flex shrink-0 gap-1 overflow-x-auto"
          >
            {tabs.map((tab) => {
              const active = activeSection === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setParams({ format: tab.id === 'all' ? null : tab.id })}
                  className={`inline-flex h-11 shrink-0 items-center px-4 text-xs uppercase tracking-[0.12em] ${
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

          <form
            className="relative min-w-0 flex-1"
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

        <p className="mb-6 text-sm leading-[22px] text-muted">{lead}</p>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="lg:hidden">
            <div className="mb-4 flex gap-2">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="inline-flex h-11 items-center gap-2 border border-stone-200 px-4 text-sm"
              >
                <Filter className="h-4 w-4" />
                {AppStrings.catalog.filters}
              </button>
              <SortSelect
                value={sortBy}
                onChange={(value) => setParams({ sort: value })}
                className="h-11 flex-1 rounded-[2px] border border-stone-200 bg-background px-3 text-sm"
              />
            </div>
          </div>

          {filtersOpen ? (
            <div className="fixed inset-0 z-[70] lg:hidden">
              <button
                type="button"
                className="absolute inset-0 bg-black/40"
                aria-label="Закрыть фильтры"
                onClick={closeFilters}
              />
              <div
                ref={filterSheetRef}
                className="absolute inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto bg-background p-4 pb-[calc(16px+env(safe-area-inset-bottom))]"
                role="dialog"
                aria-modal="true"
                aria-label={AppStrings.catalog.filters}
              >
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-medium">{AppStrings.catalog.filters}</p>
                  <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center"
                    onClick={closeFilters}
                    aria-label="Закрыть"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {renderFilters()}
              </div>
            </div>
          ) : null}

          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] space-y-4 overflow-y-auto pr-1">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
                {AppStrings.catalog.filters}
              </p>
              {renderFilters()}
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm text-muted">{aromaCountLabel(filtered.length)}</p>
              <SortSelect
                value={sortBy}
                onChange={(value) => setParams({ sort: value })}
                className="hidden h-10 w-52 rounded-[2px] border border-stone-200 bg-background px-3 text-sm lg:block"
              />
            </div>

            {filtered.length > 0 ? (
              <CatalogGrid perfumes={filtered} />
            ) : activeSection === 'raspiv' &&
              !hasNarrowingFilters({
                gender: selectedGender,
                brand: selectedBrand,
                stock,
                minPrice,
                maxPrice,
                query,
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
