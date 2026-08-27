'use client'

import { motion } from 'framer-motion'
import { Perfume } from '@/lib/data'
import ProductCard from '@/components/ui/ProductCard'

interface SimilarPerfumesProps {
  perfumes: Perfume[]
}

export default function SimilarPerfumes({ perfumes }: SimilarPerfumesProps) {
  const featured = perfumes.find(p => p.isBestseller) || perfumes[0]
  const similarIds = featured.pairsWith || []
  const similarPerfumes = similarIds
    .map(id => perfumes.find(p => p.id === id))
    .filter(Boolean) as Perfume[]

  const hasSimilar = similarPerfumes.length > 0
  const title = hasSimilar ? `Если нравится ${featured.name}` : 'Рекомендуем попробовать'
  const subtitle = hasSimilar
    ? 'Эти ароматы похожи по духу. Попробуйте, если ищете что-то похожее.'
    : 'Популярные ароматы, которые выбирают наши покупатели.'

  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.4em] text-stone-500 mb-4 uppercase">Рекомендации</p>
          <h2 className="text-3xl md:text-4xl font-light text-stone-900 mb-4">
            {title}
          </h2>
          <p className="text-stone-600 font-light max-w-xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {(hasSimilar ? similarPerfumes : perfumes.slice(0, 4)).map((perfume, index) => (
            <ProductCard key={perfume.id} perfume={perfume} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
