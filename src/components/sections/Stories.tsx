import Link from 'next/link'
import type { Perfume } from '@/lib/data'
import { perfumeHref } from '@/lib/labels'
import { AppStrings } from '@/lib/strings'

const stories = [
  {
    id: 1,
    title: 'Жан-Клод Эллена',
    text: 'Эллена научил парфюмерию говорить шёпотом. Минеральный аккорд Terre d’Hermès звучит как камень после дождя: сухой, прозрачный, без лишнего жеста.',
    perfumeName: 'Terre d’Hermès',
    brand: 'Hermès',
  },
  {
    id: 2,
    title: 'Франсис Куркджян',
    text: 'Baccarat Rouge 540 родился как аромат для хрустального дома, а стал языком современной роскоши. Куркджян соединил шафран и амбру так, что композиция звучит и на коже, и в комнате: сладкая, но не липкая, светоносная, как гранёное стекло.',
    perfumeName: 'Baccarat Rouge 540',
    brand: 'Maison Francis Kurkdjian',
  },
  {
    id: 3,
    title: 'Доминик Ропьон',
    text: 'Portrait of a Lady держится на египетской розе, пачули и ладане. Ропьон пишет аромат как литературу: плотный, длинный, без дешёвого финала.',
    perfumeName: 'Portrait of a Lady',
    brand: 'Frédéric Malle',
  },
]

export default function Stories({ perfumes }: { perfumes: Perfume[] }) {
  return (
    <section className="section-y bg-paper">
      <div className="container-lumira">
        <h2 className="mb-10 text-center text-[28px] font-light leading-9 text-stone-900 md:text-[36px]">
          {AppStrings.home.stories}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {stories.map((story) => {
            const match = perfumes.find((perfume) => perfume.name === story.perfumeName)
            const footer = `${match?.brand ?? story.brand} · ${match?.name ?? story.perfumeName}`

            return (
              <article key={story.id} className="border border-stone-200 bg-background p-6">
                <p className="mb-6 font-serif text-5xl font-light leading-none text-stone-300" aria-hidden>
                  ”
                </p>
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.12em] text-stone-900">
                  {story.title}
                </p>
                <p className="mb-6 text-sm leading-[22px] text-stone-700">{story.text}</p>
                <div className="border-t border-stone-200 pt-4">
                  {match ? (
                    <Link href={perfumeHref(match.slug)} className="text-sm text-muted hover:text-stone-900">
                      {footer}
                    </Link>
                  ) : (
                    <p className="text-sm text-muted">{footer}</p>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
