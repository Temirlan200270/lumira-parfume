'use client'

import { memo } from 'react'
import { VOLUME_OPTIONS, type VolumeMl } from '@/lib/data'

interface VolumeSelectorProps {
  value: VolumeMl
  onChange: (volume: VolumeMl) => void
  disabled?: boolean
  size?: 'card' | 'pdp'
}

function VolumeSelector({
  value,
  onChange,
  disabled = false,
  size = 'card',
}: VolumeSelectorProps) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Объём">
      {VOLUME_OPTIONS.map((ml) => {
        const selected = value === ml
        return (
          <button
            key={ml}
            type="button"
            disabled={disabled}
            onClick={() => onChange(ml)}
            aria-pressed={selected}
            aria-label={`${ml} миллилитров`}
            className={`h-11 min-w-11 px-2 text-sm font-normal tabular-nums transition-colors disabled:pointer-events-none disabled:opacity-40 ${
              size === 'pdp' ? 'flex-1' : ''
            } ${
              selected
                ? 'bg-stone-900 text-stone-50'
                : 'border border-stone-200 text-muted hover:border-stone-900 hover:text-stone-900'
            }`}
          >
            {ml}
          </button>
        )
      })}
    </div>
  )
}

export default memo(VolumeSelector)
