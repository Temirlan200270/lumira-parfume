import Link from 'next/link'
import { AppStrings } from '@/lib/strings'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Как это работает | Lumira',
}

export default function HowItWorksPage() {
  return (
    <main className="flex-1 bg-background">
      <div className="container-lumira section-y max-w-3xl">
        <h1 className="text-[32px] font-light leading-10 text-stone-900 md:text-[40px]">
          {AppStrings.how.title}
        </h1>
        <p className="mt-4 text-sm leading-[22px] text-muted">{AppStrings.how.intro}</p>

        <section className="mt-10 space-y-3">
          <h2 className="text-[28px] font-light text-stone-900">{AppStrings.how.originTitle}</h2>
          <p className="text-sm leading-[22px] text-stone-700">{AppStrings.how.origin}</p>
        </section>
        <section className="mt-10 space-y-3">
          <h2 className="text-[28px] font-light text-stone-900">{AppStrings.how.pourTitle}</h2>
          <p className="text-sm leading-[22px] text-stone-700">{AppStrings.how.pour}</p>
        </section>
        <section className="mt-10 space-y-3">
          <h2 className="text-[28px] font-light text-stone-900">{AppStrings.how.payTitle}</h2>
          <p className="text-sm leading-[22px] text-stone-700">{AppStrings.how.pay}</p>
        </section>
        <section className="mt-10 space-y-3">
          <h2 className="text-[28px] font-light text-stone-900">{AppStrings.how.guaranteeTitle}</h2>
          <p className="text-sm leading-[22px] text-stone-700">{AppStrings.how.guarantee}</p>
        </section>

        <Link href="/" className="mt-10 inline-block text-sm text-stone-900 hover:underline">
          {AppStrings.home.shop}
        </Link>
      </div>
    </main>
  )
}
