'use client'

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useFocusTrap } from '@/lib/use-focus-trap'

export default function AdminSheet({
  title,
  onClose,
  children,
  footer,
}: {
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  useFocusTrap(mounted, sheetRef, onClose)

  useLayoutEffect(() => {
    setMounted(true)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  if (!mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[80]">
      <button type="button" className="absolute inset-0 bg-black/40" aria-label="Закрыть" onClick={onClose} />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col overflow-hidden bg-background pb-[env(safe-area-inset-bottom)] sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[calc(100%-2rem)] sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-h-[85dvh] sm:border sm:border-stone-200"
      >
        <div className="flex items-center justify-between gap-3 px-4 pt-4">
          <p className="min-w-0 text-sm font-medium text-stone-900">{title}</p>
          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center"
            onClick={onClose}
            aria-label="Закрыть"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-4 py-3">{children}</div>
        {footer ? <div className="border-t border-stone-200 px-4 py-3">{footer}</div> : null}
      </div>
    </div>,
    document.body
  )
}
