import Link from 'next/link'
import { AppStrings } from '@/lib/strings'

export default function FormatTiles() {
  return (
    <section className="section-y bg-background">
      <div className="container-lumira grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link href="/catalog?format=razliv" className="border border-stone-200 p-8 hover:border-stone-900">
          <h2 className="text-[28px] font-light text-stone-900">{AppStrings.home.razlivTitle}</h2>
          <p className="mt-3 text-sm leading-[22px] text-muted">{AppStrings.home.razlivLead}</p>
          <p className="mt-6 text-base tabular-nums text-stone-900">{AppStrings.home.razlivPrice}</p>
        </Link>
        <Link href="/catalog?format=raspiv" className="border border-stone-200 p-8 hover:border-stone-900">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-[28px] font-light text-stone-900">{AppStrings.home.raspivTitle}</h2>
            <span className="border border-stone-200 px-2 py-1 text-xs uppercase tracking-[0.12em]">
              100% оригинал
            </span>
          </div>
          <p className="mt-3 text-sm leading-[22px] text-muted">{AppStrings.home.raspivLead}</p>
        </Link>
      </div>
    </section>
  )
}
