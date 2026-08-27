'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { blockTransition, cardTransition, revealViewport } from '@/lib/motion'

const stories = [
  {
    id: 1,
    title: 'Жан-Клод Эллена',
    text: 'Эллена учил парфюмерию говорить шёпотом. В Terre d’Hermès он собрал минеральный аккорд так, будто камень нагрелся на солнце: цитрус вспыхивает и сразу уступает место кедру и флинту. Это не «сильный запах», а пространство вокруг человека — воздух, в котором читается характер.',
    perfume: 'Hermès · Terre d’Hermès',
  },
  {
    id: 2,
    title: 'Франсис Куркджян',
    text: 'Baccarat Rouge 540 родился как аромат для хрустального дома, а стал языком современной роскоши. Куркджян соединил шафран и амбру так, что композиция звучит и на коже, и в комнате: сладкая, но не липкая, светоносная, как гранёное стекло. Один жест — и аромат запоминают раньше имени.',
    perfume: 'Maison Francis Kurkdjian · Baccarat Rouge 540',
  },
  {
    id: 3,
    title: 'Доминик Ропьон',
    text: 'В Portrait of a Lady Ропьон взял египетскую розу в количестве, которое обычно считают невозможным, и удержал её пачули и ладаном. Получился не букет, а портрет: плотный, театральный, с дыханием. Парфюм здесь работает как литература — раскрывается главами и не отпускает до последней ноты.',
    perfume: 'Frédéric Malle · Portrait of a Lady',
  },
]

export default function Stories() {
  return (
    <section id="stories" className="relative z-10 py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealViewport}
          transition={blockTransition}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.4em] text-stone-500 mb-4 uppercase">Истории</p>
          <h2 className="text-3xl md:text-4xl font-light text-stone-900">
            Истории известных парфюмеров
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={revealViewport}
              transition={cardTransition(index)}
              className="bg-white p-8 border border-stone-100 hover:border-stone-300 transition-colors"
            >
              <Quote className="w-8 h-8 text-stone-200 mb-4" />
              <p className="text-sm tracking-[0.12em] text-stone-900 uppercase mb-4 font-light">
                {story.title}
              </p>
              <p className="text-stone-700 font-light leading-relaxed mb-6">
                {story.text}
              </p>
              <div className="border-t border-stone-100 pt-4">
                <p className="text-xs text-stone-500">{story.perfume}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
