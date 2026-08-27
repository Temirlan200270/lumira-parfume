import type { InputHTMLAttributes, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: ReactNode
}

export default function Input({
  label,
  error,
  hint,
  id,
  className = '',
  ...props
}: InputProps) {
  const inputId = id ?? props.name
  const errorId = error && inputId ? `${inputId}-error` : undefined

  return (
    <label className="block space-y-2" htmlFor={inputId}>
      <span className="block text-xs font-medium uppercase tracking-[0.12em] text-muted">
        {label}
      </span>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={`h-11 w-full rounded-[2px] border bg-background px-3 text-base md:text-sm text-stone-900 placeholder:text-muted ${
          error ? 'border-error' : 'border-stone-200 focus:border-stone-900'
        } ${className}`}
        {...props}
      />
      {error ? (
        <span id={errorId} className="block text-sm text-error">
          {error}
        </span>
      ) : hint ? (
        <span className="block text-sm text-muted">{hint}</span>
      ) : null}
    </label>
  )
}
