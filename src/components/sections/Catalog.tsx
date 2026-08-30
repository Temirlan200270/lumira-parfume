'use client'

import { memo, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Filter, Search, X } from 'lucide-react'
import type { Perfume } from '@/lib/data'
import ProductCard from '@/components/ui/ProductCard'
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
      {perfumes.map((perfume) => (
        <ProductCard key={perfume.id} perfume={perfume} />
      ))}
    </div>
  )
})

function asSection(value: string | null): SectionFilter {
  if (value === 'razliv' || value === 'raspiv') return value
  return 'all'
}

export default function Catalog({ perfumes }: CatalogProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const filterSheetRef = useRef<HTMLDivElement>(null)
  const closeFilters = useCallback(() => setFiltersOpen(false), [])
  useFocusTrap(filtersOpen, filterSheetRef, closeFilters)

  const activeSection = asSection(searchParams.get('format'))
  const urlQuery = searchParams.get('q') ?? ''
  const selectedGender = (searchParams.get('gender') as Perfume['gender'] | 'all' | null) ?? 'all'
  const selectedBrand = searchParams.get('brand') ?? ''
  const stock = (searchParams.get('stock') as StockFilter | null) ?? 'all'
  const sortBy = (searchParams.get('sort') as SortKey | null) ?? 'popular'
  const minPrice = searchParams.get('min') ?? ''
  const maxPrice = searchParams.get('max') ?? ''

  const [query, setQuery] = useState(urlQuery)
  const deferredQuery = useDeferredValue(query)
  const searchParamsRef = useRef(searchParams)
  searchParamsRef.current = searchParams

  useEffect(() => {
    setQuery(urlQuery)
  }, [urlQuery])

  const setParams = useCallback(
    (patch: Record<string, string | null>) => {
      const source =
        typeof window !== 'undefined' ? window.location.search : searchParamsRef.current.toString()
      const next = new URLSearchParams(source)
      for (const [key, value] of Object.entries(patch)) {
        if (!value) next.delete(key)
        else next.set(key, value)
      }
      if (!('page' in patch)) next.delete('page')
      const qs = next.toString()
      const href = qs ? `${pathname}?${qs}` : pathname
      const current =
        typeof window !== 'undefined'
          ? `${window.location.pathname}${window.location.search}`
          : `${pathname}${searchParamsRef.current.toString() ? `?${searchParamsRef.current.toString()}` : ''}`
      if (href === current) return
      router.replace(href, { scroll: false })
    },
    [pathname, router]
  )

  const writeQueryToUrl = useCallback(
    (value: string) => {
      if (typeof window === 'undefined') return
      const next = new URLSearchParams(window.location.search)
      if (value) next.set('q', value)
      else next.delete('q')
      next.delete('page')
      const qs = next.toString()
      const href = qs ? `${pathname}?${qs}` : pathname
      const current = `${window.location.pathname}${window.location.search}`
      if (href === current) return
      window.history.replaceState(window.history.state, '', href)
    },
    [pathname]
  )

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

  const scoped = useMemo(() => {
    let result = [...perfumes]
    if (activeSection !== 'all') {
      result = result.filter((perfume) => perfume.section === activeSection)
    }
    if (selectedGender !== 'all') {
      result = result.filter((perfume) => perfume.gender === selectedGender)
    }
    if (selectedBrand) {
      result = result.filter((perfume) => perfume.brand === selectedBrand)
    }
    if (stock === 'in') {
      result = result.filter((perfume) => perfume.isInStock !== false)
    }
    if (stock === 'out') {
      result = result.filter((perfume) => perfume.isInStock === false)
    }
    const min = Number(minPrice)
    const max = Number(maxPrice)
    if (Number.isFinite(min) && minPrice) {
      result = result.filter((perfume) => perfume.pricePerMl * 5 >= min)
    }
    if (Number.isFinite(max) && maxPrice) {
      result = result.filter((perfume) => perfume.pricePerMl * 5 <= max)
    }
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.pricePerMl - b.pricePerMl)
        break
      case 'price-desc':
        result.sort((a, b) => b.pricePerMl - a.pricePerMl)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
        break
      default:
        result.sort((a, b) => Number(b.isBestseller) - Number(a.isBestseller))
    }
    return result
  }, [
    perfumes,
    activeSection,
    selectedGender,
    selectedBrand,
    stock,
    minPrice,
    maxPrice,
    sortBy,
  ])

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
    router.replace(pathname, { scroll: false })
  }

  const filters = (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-muted">
          {AppStrings.catalog.gender}
        </legend>
        <div className="space-y-1">
          {GENDER_OPTIONS.map((gender) => (
            <button
              key={gender.id}
              type="button"
              onClick={() => setParams({ gender: gender.id === 'all' ? null : gender.id })}
              className={`flex h-11 w-full items-center px-3 text-left text-sm ${
                selectedGender === gender.id ? 'bg-stone-900 text-stone-50' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              {gender.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-muted">
          {AppStrings.catalog.brand}
        </legend>
        <select
          aria-label={AppStrings.catalog.brand}
          value={selectedBrand}
          onChange={(event) => setParams({ brand: event.target.value || null })}
          className="h-11 w-full rounded-[2px] border border-stone-200 bg-background px-3 text-sm"
        >
          <option value="">Все бренды</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-muted">
          {AppStrings.catalog.price}
        </legend>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder="от"
            value={minPrice}
            onChange={(event) => setParams({ min: event.target.value || null })}
            className="h-11 rounded-[2px] border border-stone-200 px-3 text-sm"
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="до"
            value={maxPrice}
            onChange={(event) => setParams({ max: event.target.value || null })}
            className="h-11 rounded-[2px] border border-stone-200 px-3 text-sm"
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-muted">
          {AppStrings.catalog.stock}
        </legend>
        {(['all', 'in', 'out'] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setParams({ stock: item === 'all' ? null : item })}
            className={`flex h-11 w-full items-center px-3 text-left text-sm ${
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
              <select
                value={sortBy}
                onChange={(event) => setParams({ sort: event.target.value === 'popular' ? null : event.target.value })}
                aria-label={AppStrings.catalog.sort}
                className="h-11 flex-1 rounded-[2px] border border-stone-200 bg-background px-3 text-sm"
              >
                <option value="popular">{AppStrings.catalog.sortPopular}</option>
                <option value="price-asc">{AppStrings.catalog.sortPriceAsc}</option>
                <option value="price-desc">{AppStrings.catalog.sortPriceDesc}</option>
                <option value="name">{AppStrings.catalog.sortName}</option>
              </select>
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
                {filters}
              </div>
            </div>
          ) : null}

          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 space-y-6">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
                {AppStrings.catalog.filters}
              </p>
              {filters}
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-muted">
                  {AppStrings.catalog.sort}
                </p>
                <select
                  value={sortBy}
                  onChange={(event) => setParams({ sort: event.target.value === 'popular' ? null : event.target.value })}
                  aria-label={AppStrings.catalog.sort}
                  className="h-11 w-full rounded-[2px] border border-stone-200 bg-background px-3 text-sm"
                >
                  <option value="popular">{AppStrings.catalog.sortPopular}</option>
                  <option value="price-asc">{AppStrings.catalog.sortPriceAsc}</option>
                  <option value="price-desc">{AppStrings.catalog.sortPriceDesc}</option>
                  <option value="name">{AppStrings.catalog.sortName}</option>
                </select>
              </div>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted">{aromaCountLabel(filtered.length)}</p>
            </div>

            {filtered.length > 0 ? (
              <CatalogGrid perfumes={filtered} />
            ) : activeSection === 'raspiv' && !query.trim() ? (
              <div className="py-20">
                <p className="text-sm text-stone-900">{AppStrings.catalog.emptyRaspiv}</p>
                <p className="mt-2 text-sm text-muted">{AppStrings.catalog.emptyRaspivLead}</p>
                <Link
                  href="/?format=razliv"
                  className="mt-6 inline-flex h-11 items-center text-sm text-stone-900 underline"
                >
                  {AppStrings.catalog.emptyRaspivCta}
                </Link>
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
