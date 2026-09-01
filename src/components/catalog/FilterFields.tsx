'use client'

import { memo } from 'react'
import type { Perfume } from '@/lib/data'
import type { CatalogStockFilter } from '@/lib/catalog-filter'
import { AppStrings } from '@/lib/strings'

const GENDER_OPTIONS: { id: 'all' | Perfume['gender']; label: string }[] = [
  { id: 'all', label: AppStrings.gender.all },
  { id: 'male', label: AppStrings.gender.male },
  { id: 'female', label: AppStrings.gender.female },
  { id: 'unisex', label: AppStrings.gender.unisex },
]

export interface FilterDraft {
  gender: Perfume['gender'] | 'all'
  brand: string
  stock: CatalogStockFilter
  minPrice: string
  maxPrice: string
}

export const EMPTY_FILTER_DRAFT: FilterDraft = {
  gender: 'all',
  brand: '',
  stock: 'all',
  minPrice: '',
  maxPrice: '',
}

interface FilterFieldsProps {
  draft: FilterDraft
  brands: string[]
  hasOutOfStock: boolean
  onChange: (patch: Partial<FilterDraft>) => void
  onReset: () => void
  onPriceCommit?: () => void
}

function FilterFields({
  draft,
  brands,
  hasOutOfStock,
  onChange,
  onReset,
  onPriceCommit,
}: FilterFieldsProps) {
  const effectiveStock = hasOutOfStock ? draft.stock : 'all'

  return (
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
              onClick={() => onChange({ gender: gender.id })}
              className={`flex min-h-9 items-center justify-center px-2 text-sm ${
                draft.gender === gender.id ? 'bg-stone-900 text-stone-50' : 'text-stone-700 hover:bg-stone-100'
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
          value={draft.brand}
          onChange={(event) => onChange({ brand: event.target.value })}
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
            value={draft.minPrice}
            onChange={(event) => onChange({ minPrice: event.target.value })}
            onBlur={onPriceCommit}
            onKeyDown={(event) => {
              if (event.key === 'Enter') event.currentTarget.blur()
            }}
            className="h-10 rounded-[2px] border border-stone-200 px-3 text-sm"
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="до"
            value={draft.maxPrice}
            onChange={(event) => onChange({ maxPrice: event.target.value })}
            onBlur={onPriceCommit}
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
          {(['all', 'in', ...(hasOutOfStock ? (['out'] as const) : [])] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onChange({ stock: item })}
              className={`flex min-h-9 items-center px-3 text-left text-sm ${
                effectiveStock === item ? 'bg-stone-900 text-stone-50' : 'text-stone-700 hover:bg-stone-100'
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

      <button type="button" onClick={onReset} className="text-sm text-muted hover:text-stone-900">
        {AppStrings.catalog.reset}
      </button>
    </div>
  )
}

export default memo(FilterFields)
