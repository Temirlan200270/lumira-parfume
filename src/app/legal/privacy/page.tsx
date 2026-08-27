import { AppStrings } from '@/lib/strings'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности | Lumira',
}

export default function PrivacyPage() {
  return (
    <main className="flex-1 bg-background">
      <div className="container-lumira section-y max-w-3xl">
        <h1 className="text-[32px] font-light leading-10 text-stone-900 md:text-[40px]">
          {AppStrings.legal.privacyTitle}
        </h1>
        <p className="mt-6 text-sm leading-[22px] text-muted">{AppStrings.legal.stub}</p>
      </div>
    </main>
  )
}
