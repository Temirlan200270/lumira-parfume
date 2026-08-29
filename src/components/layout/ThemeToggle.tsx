'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/layout/ThemeProvider'
import { AppStrings } from '@/lib/strings'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-11 w-11 items-center justify-center text-stone-900"
      aria-label={isDark ? AppStrings.nav.themeLight : AppStrings.nav.themeDark}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}
