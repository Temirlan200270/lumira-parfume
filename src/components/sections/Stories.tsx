import Link from 'next/link'
import type { Perfume } from '@/lib/data'
import { perfumeHref } from '@/lib/labels'
import { AppStrings } from '@/lib/strings'

const stories = [
  {
    id: 1,
    title: 'Оливье Кресп',
    text: 'Black Opium держится на кофе и ванили, но звучит не как десерт, а как ночной город. Кресп собрал сладость так, чтобы она оставалась жёсткой: горькая, тёплая, без сахарной плёнки.',
    perfumeName: 'Black Opium',
  },
  {
    id: 2,
    title: 'Франсис Куркджян',
    text: 'Baccarat Rouge 540 родился как аромат для хрустального дома, а стал языком современной роскоши. Куркджян соединил шафран и амбру так, что композиция звучит и на коже, и в комнате: сладкая, но не липкая, светоносная, как гранёное стекло.',
    perfumeName: 'Baccarat Rouge 540',
  },
  {
    id: 3,
    title: 'Альберто Морильяс',
    text: 'Acqua di Gio открыл морской аккорд целому поколению. Морильяс пишет воду как свет: солёную, чистую, без тяжёлого шлейфа. Аромат, который не объясняет себя — просто остаётся на коже.',
    perfumeName: 'Acqua di Gio',
  },
]

export default function Stories({ perfumes }: { perfumes: Perfume[] }) {
  const visible = stories
    .map((story) => ({
      story,
      match: perfumes.find(
        (perfume) => perfume.name === story.perfumeName && perfume.isInStock !== false,
      ),
    }))
    .filter((item): item is { story: (typeof stories)[number]; match: Perfume } => Boolean(item.match))

  if (visible.length === 0) return null

  return (
    <section className="section-y bg-paper">
      <div className="container-lumira">
        <h2 className="mb-10 text-center text-[28px] font-light leading-9 text-stone-900 md:text-[36px]">
          {AppStrings.home.stories}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {visible.map(({ story, match }) => (
            <article key={story.id} className="border border-stone-200 bg-background p-6">
              <p className="mb-6 font-serif text-5xl font-light leading-none text-stone-300" aria-hidden>
                ”
              </p>
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.12em] text-stone-900">
                {story.title}
              </p>
              <p className="mb-6 text-sm leading-[22px] text-stone-700">{story.text}</p>
              <div className="border-t border-stone-200 pt-4">
                <Link
                  href={perfumeHref(match.slug, match.section)}
                  className="text-sm text-muted hover:text-stone-900"
                >
                  {match.brand} · {match.name}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
