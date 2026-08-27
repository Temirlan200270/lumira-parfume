import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  fullWidth?: boolean
  children: ReactNode
}

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-stone-900 text-stone-50 hover:bg-stone-800 disabled:bg-stone-900',
  secondary: 'border border-stone-900 bg-transparent text-stone-900 hover:bg-stone-900 hover:text-stone-50',
  ghost: 'bg-transparent text-stone-900 hover:bg-stone-100',
  destructive: 'bg-transparent text-error hover:bg-red-50',
}

export default function Button({
  variant = 'primary',
  fullWidth = false,
  className = '',
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex h-11 items-center justify-center px-5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-40 ${variantClass[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
