'use client'

import { WHATSAPP_LINK, WHATSAPP_PHONE } from '@/lib/data'
import { AppStrings } from '@/lib/strings'

interface WhatsAppButtonProps {
  className?: string
  compact?: boolean
  iconOnly?: boolean
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.04 2C6.5 2 2.01 6.49 2.01 12.03c0 1.77.46 3.5 1.34 5.02L2 22l5.08-1.33A10.02 10.02 0 0 0 12.04 22C17.57 22 22.06 17.51 22.06 11.97 22.05 6.49 17.56 2 12.04 2zm0 18.13c-1.64 0-3.25-.44-4.66-1.27l-.33-.2-3.01.79.8-2.94-.22-.35A8.13 8.13 0 0 1 3.9 12.03c0-4.48 3.65-8.13 8.14-8.13 4.48 0 8.13 3.65 8.13 8.13 0 4.48-3.66 8.1-8.13 8.1z" />
    </svg>
  )
}

export default function WhatsAppButton({
  className = '',
  compact = false,
  iconOnly = false,
}: WhatsAppButtonProps) {
  if (iconOnly) {
    return (
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${AppStrings.catalog.openWhatsApp} ${WHATSAPP_PHONE}`}
        className={`inline-flex h-12 w-12 items-center justify-center rounded-full border border-stone-900 bg-white text-stone-900 shadow-lg hover:bg-stone-900 hover:text-white transition-colors ${className}`}
      >
        <WhatsAppIcon className="w-5 h-5" />
      </a>
    )
  }

  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 border border-stone-900 bg-white text-stone-900 hover:bg-stone-900 hover:text-white transition-colors duration-300 font-light ${
        compact ? 'px-4 py-2.5 text-[10px] tracking-[0.12em]' : 'px-5 py-3.5 text-[11px] tracking-[0.14em]'
      } ${className}`}
    >
      <WhatsAppIcon className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
      <span className="text-center leading-snug">
        {        compact
          ? `WhatsApp ${WHATSAPP_PHONE}`
          : 'Подобрать аромат с парфюмером в WhatsApp'}
      </span>
    </a>
  )
}
