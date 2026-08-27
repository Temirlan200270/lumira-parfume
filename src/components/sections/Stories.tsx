import Link from 'next/link'
import type { Perfume } from '@/lib/data'
import { perfumeHref } from '@/lib/labels'
import { AppStrings } from '@/lib/strings'

const stories = [
  {
    id: 1,
    title: 'Жан-Клод Эллена',
    text: 'Эллена учил парфюмерию говорить шёпотом. В Terre d’Hermès он собрал минеральный аккорд так, будто камень нагрелся на солнце: цитрус вспыхивает и сразу уступает место кедру и флинту. Это не «сильный запах», а пространство вокруг человека — воздух, в котором читается характер.',
    perfumeName: 'Terre d’Hermès',
  },
  {
    id: 2,
    title: 'Франсис Куркджян',
    text: 'Baccarat Rouge 540 родился как аромат для хрустального дома, а стал языком современной роскоши. Куркджян соединил шафран и амбру так, что композиция звучит и на коже, и в комнате: сладкая, но не липкая, светоносная, как гранёное стекло. Один жест — и аромат запоминают раньше имени.',
    perfumeName: 'Baccarat Rouge 540',
  },
  {
    id: 3,
    title: 'Доминик Ропьон',
    text: 'В Portrait of a Lady Ропьон взял египетскую розу в количестве, которое обычно считают невозможным, и удержал её пачули и ладаном. Получился не букет, а портрет: плотный, театральный, с дыханием. Парфюм здесь работает как литература — раскрывается главами и не отпускает до последней ноты.',
    perfumeName: 'Portrait of a Lady',
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
