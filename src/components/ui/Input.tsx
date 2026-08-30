import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, id, className = '', ...props },
  ref,
) {
  const inputId = id ?? props.name
  const errorId = error && inputId ? `${inputId}-error` : undefined

  return (
    <label className="block space-y-2" htmlFor={inputId}>
      <span className="block text-xs font-medium uppercase tracking-[0.12em] text-muted">
        {label}
      </span>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={`h-11 w-full scroll-mt-20 rounded-[2px] border bg-background px-3 text-base text-stone-900 placeholder:text-muted md:text-sm ${
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
})

export default Input
