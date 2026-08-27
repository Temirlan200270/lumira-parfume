'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

interface ToastContextValue {
  toast: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)
  const timerRef = useRef<number | null>(null)

  const toast = useCallback((next: string) => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
    }
    setMessage(next)
    timerRef.current = window.setTimeout(() => {
      setMessage(null)
      timerRef.current = null
    }, 3000)
  }, [])

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {message ? (
        <div
          role="status"
          className="fixed bottom-20 left-1/2 z-[90] max-w-[calc(100%-32px)] -translate-x-1/2 border border-stone-200 bg-background px-4 py-3 text-sm text-stone-900 md:bottom-8"
        >
          {message}
        </div>
      ) : null}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
