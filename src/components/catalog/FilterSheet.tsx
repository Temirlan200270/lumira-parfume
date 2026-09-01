'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { X } from 'lucide-react'
import type { Perfume } from '@/lib/data'
import Button from '@/components/ui/Button'
import FilterFields, { EMPTY_FILTER_DRAFT, type FilterDraft } from '@/components/catalog/FilterFields'
import { matchCatalogFilters, type CatalogSectionFilter } from '@/lib/catalog-filter'
import { aromaCountLabel } from '@/lib/labels'
import { rankPerfumes } from '@/lib/search'
import { AppStrings } from '@/lib/strings'
import { useFocusTrap } from '@/lib/use-focus-trap'

interface FilterSheetProps {
  initial: FilterDraft
  brands: string[]
  hasOutOfStock: boolean
  perfumes: Perfume[]
  section: CatalogSectionFilter
  query: string
  onApply: (draft: FilterDraft) => void
  onClose: () => void
}

export default function FilterSheet({
  initial,
  brands,
  hasOutOfStock,
  perfumes,
  section,
  query,
  onApply,
  onClose,
}: FilterSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const [draft, setDraft] = useState<FilterDraft>(initial)
  useFocusTrap(true, sheetRef, onClose)

  const onChange = useCallback((patch: Partial<FilterDraft>) => {
    setDraft((current) => ({ ...current, ...patch }))
  }, [])

  const onReset = useCallback(() => {
    setDraft(EMPTY_FILTER_DRAFT)
  }, [])

  const draftCount = useMemo(() => {
    const scoped = matchCatalogFilters(perfumes, {
      section,
      gender: draft.gender,
      brand: draft.brand,
      stock: hasOutOfStock ? draft.stock : 'all',
      minPrice: draft.minPrice,
      maxPrice: draft.maxPrice,
    })
    if (query.trim().length < 2) return scoped.length
    return rankPerfumes(scoped, query).length
  }, [perfumes, section, draft, hasOutOfStock, query])

  return (
    <div className="fixed inset-0 z-[70] lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Закрыть фильтры"
        onClick={onClose}
      />
      <div
        ref={sheetRef}
        className="absolute inset-x-0 bottom-0 flex max-h-[90vh] flex-col bg-background pb-[env(safe-area-inset-bottom)]"
        role="dialog"
        aria-modal="true"
        aria-label={AppStrings.catalog.filters}
      >
        <div className="flex items-center justify-between px-4 pt-4">
          <p className="text-sm font-medium">{AppStrings.catalog.filters}</p>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center"
            onClick={onClose}
            aria-label="Закрыть"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2">
          <FilterFields
            draft={draft}
            brands={brands}
            hasOutOfStock={hasOutOfStock}
            onChange={onChange}
            onReset={onReset}
          />
        </div>
        <div className="border-t border-stone-200 px-4 py-3">
          <Button
            fullWidth
            onClick={() => {
              onClose()
              onApply(draft)
            }}
          >
            {AppStrings.catalog.showResults} {aromaCountLabel(draftCount)}
          </Button>
        </div>
      </div>
    </div>
  )
}
