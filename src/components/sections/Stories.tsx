import Link from 'next/link'
import type { Perfume } from '@/lib/data'
import { perfumeHref } from '@/lib/labels'
import { AppStrings } from '@/lib/strings'

const stories = [
  {
    id: 1,
    title: 'Creed',
    text: 'Aventus держится на ананасе, берёзе и мускусе: яркий старт и сухой древесный шлейф. Это один из самых узнаваемых мужских ароматов в каталоге — его просят по имени.',
    perfumeName: 'Aventus',
  },
  {
    id: 2,
    title: 'Франсис Куркджян',
    text: 'Baccarat Rouge 540 родился как аромат для хрустального дома, а стал языком современной роскоши. Куркджян соединил шафран и амбру так, что композиция звучит и на коже, и в комнате: сладкая, но не липкая, светоносная, как гранёное стекло. Один жест — и аромат запоминают раньше имени.',
    perfumeName: 'Baccarat Rouge 540',
  },
  {
    id: 3,
    title: 'Dior',
    text: 'Sauvage построен на бергамоте и амброксане: открытый, сухой, сразу читаемый. Это не ниша и не секрет — аромат, который чаще других называют, когда просят «что-то свежее и мужское».',
    perfumeName: 'Sauvage',
  },
]

export default function Stories({ perfumes }: { perfumes: Perfume[] }) {
  return (
    <section className="section-y bg-background">
      <div className="container-lumira">
        <h2 className="mb-10 text-[28px] font-light leading-9 text-stone-900 md:text-[36px]">
          {AppStrings.home.stories}
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {stories.map((story) => {
            const match = perfumes.find((perfume) => perfume.name === story.perfumeName)
            return (
              <article key={story.id} className="border border-stone-200 p-6">
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.12em] text-muted">{story.title}</p>
                <p className="mb-6 text-sm leading-[22px] text-stone-700">{story.text}</p>
                {match ? (
                  <Link href={perfumeHref(match.slug)} className="text-sm text-stone-900 hover:underline">
                    {match.brand} · {match.name}
                  </Link>
                ) : (
                  <p className="text-sm text-muted">{story.perfumeName}</p>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
