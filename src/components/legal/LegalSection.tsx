import type { ReactNode } from 'react'

export default function LegalSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="mt-10 space-y-3">
      <h2 className="text-[22px] font-light text-stone-900">{title}</h2>
      <div className="space-y-3 text-sm leading-[22px] text-stone-700">{children}</div>
    </section>
  )
}
