'use client'

import { motion } from 'framer-motion'
import { discoverySets } from '@/lib/data'
import { blockTransition, cardTransition, revealViewport } from '@/lib/motion'

export default function DiscoverySets() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealViewport}
          transition={blockTransition}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.4em] text-stone-500 mb-4 uppercase">Сэмпл-сервис</p>
          <h2 className="text-3xl md:text-4xl font-light text-stone-900 mb-4">
            Наборы пробников
          </h2>
          <p className="text-stone-600 font-light max-w-xl mx-auto">
            Не уверены? Закажите набор из 4 пробников по 2 мл и найдите «свой» аромат
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {discoverySets.map((set, index) => (
            <motion.div
              key={set.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={revealViewport}
              transition={cardTransition(index)}
              whileHover={{ y: -6 }}
              className="group bg-stone-50 border border-stone-100 overflow-hidden cursor-pointer"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-stone-100 to-stone-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-stone-300/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs tracking-[0.3em] text-stone-400">SAMPLE SET</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-light text-stone-900 mb-2">{set.name}</h3>
                <p className="text-sm text-stone-600 font-light mb-4">{set.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-stone-900 font-light">{set.price} €</p>
                  <button onClick={() => console.log('Added discovery set:', set.name)} className="text-xs tracking-[0.15em] text-stone-500 border border-stone-200 px-3 py-1 hover:border-stone-900 hover:text-stone-900 hover:bg-stone-900 hover:text-white transition-all">
                    Добавить в корзину
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
