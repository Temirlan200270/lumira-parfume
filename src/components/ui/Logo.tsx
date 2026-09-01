import Link from 'next/link'
import { AppStrings } from '@/lib/strings'

interface LogoProps {
  href?: string | null
  inverted?: boolean
}

export default function Logo({ href = '/', inverted = false }: LogoProps) {
  const wordmark = inverted ? 'text-white' : 'text-stone-900'
  const mark = inverted ? 'text-stone-500' : 'text-muted'

  const inner = (
    <span className={`inline-flex items-baseline gap-2 ${wordmark}`}>
      <span className="font-serif text-xl italic font-normal tracking-normal md:text-2xl">
        {AppStrings.brand.mark}
      </span>
      <span className={`${mark} font-light`} aria-hidden="true">
        —
      </span>
      <span className={`${mark} text-[10px] font-light uppercase tracking-[0.2em] md:text-[11px]`}>
        {AppStrings.brand.line}
      </span>
    </span>
  )

  if (!href) return inner

  return (
    <Link href={href} className="inline-flex items-baseline">
      {inner}
    </Link>
  )
}
