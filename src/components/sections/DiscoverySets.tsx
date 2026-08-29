import { discoverySets, formatTenge } from '@/lib/data'
import { AppStrings } from '@/lib/strings'
import { buildWhatsAppUrl } from '@/lib/order'

export default function DiscoverySets() {
  return (
    <section className="section-y bg-background">
      <div className="container-lumira">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-[28px] font-light leading-9 text-stone-900 md:text-[36px]">
            {AppStrings.home.setsTitle}
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-[22px] text-muted">{AppStrings.home.setsLead}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {discoverySets.map((set) => (
            <article key={set.id} className="border border-stone-200 bg-background">
              <div className="flex aspect-square items-center justify-center bg-paper">
                <span className="font-serif text-sm tracking-[0.2em] text-muted">
                  {AppStrings.home.setPlaceholder}
                </span>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-base font-medium text-stone-900">{set.name}</h3>
                <p className="mb-6 text-sm leading-[22px] text-muted">{set.description}</p>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-base tabular-nums text-stone-900">{formatTenge(set.price)}</p>
                  <a
                    href={buildWhatsAppUrl(`${set.name}\n${set.description}\n${formatTenge(set.price)}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center border border-stone-200 px-3 text-sm text-stone-900 hover:border-stone-900"
                  >
                    {AppStrings.home.setCta}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
