'use client'

import { motion } from 'framer-motion'
import { Perfume } from '@/lib/data'
import PerfumeNotes from '@/components/ui/PerfumeNotes'
import CharacterBars from '@/components/ui/CharacterBars'

interface FragranceAnalysisProps {
  perfumes: Perfume[]
}

export default function FragranceAnalysis({ perfumes }: FragranceAnalysisProps) {
  const featured = perfumes.find(p => p.isBestseller) || perfumes[0]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.4em] text-stone-500 mb-4 uppercase">Анализ аромата</p>
          <h2 className="text-3xl md:text-4xl font-light text-stone-900 mb-4">
            Пирамида нот и характер
          </h2>
          <p className="text-stone-600 font-light max-w-xl mx-auto">
            Интерактивный разбор {featured.brand} {featured.name} — нажмите на ноту, чтобы узнать о ней больше
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-light text-stone-900 mb-6">Пирамида нот</h3>
            <PerfumeNotes perfume={featured} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-light text-stone-900 mb-6">Характер аромата</h3>
            <CharacterBars perfume={featured} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
