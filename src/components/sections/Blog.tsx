'use client'

import { motion } from 'framer-motion'
import { Calendar, ArrowRight } from 'lucide-react'

const articles = [
  {
    id: 1,
    title: 'Как выбрать парфюм по погоде',
    excerpt: 'Температура и влажность влияют на раскрытие нот. Узнайте, что надевать летом и зимой.',
    date: '15 июня 2026',
    readTime: '5 мин'
  },
  {
    id: 2,
    title: 'Что такое пирамида нот',
    excerpt: 'Понимаем структуру аромата: Верхние, Средние и Базовые ноты. Простое руководство.',
    date: '10 июня 2026',
    readTime: '4 мин'
  },
  {
    id: 3,
    title: 'Нишевая vs матовая парфюмерия',
    excerpt: 'В чём разница и стоит ли переплачивать за нишу? Реальная история одного аромата.',
    date: '3 июня 2026',
    readTime: '6 мин'
  }
]

export default function Blog() {
  return (
    <section id="blog" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.4em] text-stone-500 mb-4 uppercase">Журнал</p>
          <h2 className="text-3xl md:text-4xl font-light text-stone-900">
            Блог о парфюмерии
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.a
              key={article.id}
              href={`/blog/${article.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group block"
            >
              <div className="aspect-[16/9] bg-stone-100 mb-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-stone-100 to-stone-200" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs text-stone-400 tracking-wider">IMAGE</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-stone-500 mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {article.date}
                </span>
                <span>{article.readTime}</span>
              </div>
              <h3 className="text-xl font-light text-stone-900 mb-3 group-hover:text-stone-700 transition-colors">
                {article.title}
              </h3>
              <p className="text-sm text-stone-600 font-light leading-relaxed mb-4">
                {article.excerpt}
              </p>
              <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] text-stone-900 group-hover:gap-3 transition-all">
                Читать
                <ArrowRight className="w-3 h-3" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
