'use client'

import { motion } from 'framer-motion'
import { Perfume } from '@/lib/data'
import ProductCard from '@/components/ui/ProductCard'

interface BestsellersProps {
  perfumes: Perfume[]
}

export default function Bestsellers({ perfumes }: BestsellersProps) {
  const bestsellers = perfumes.filter(p => p.isBestseller)
  const featured = bestsellers[0]
  const rest = bestsellers.slice(1)

  return (
    <section id="bestsellers" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[10px] tracking-[0.5em] text-stone-400 mb-5 uppercase">Популярное</p>
          <h2 className="text-3xl md:text-4xl font-light text-stone-900 tracking-tight">
            Хиты продаж
          </h2>
        </motion.div>

        {bestsellers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-stone-400 font-light">Пока нет хитов продаж</p>
          </div>
        ) : (
          <div className="mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <ProductCard perfume={featured} index={0} />
              {rest.slice(0, 2).map((perfume, i) => (
                <ProductCard key={perfume.id} perfume={perfume} index={i + 1} />
              ))}
            </div>
          </div>
        )}
        {rest.length > 2 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {rest.slice(2).map((perfume, index) => (
              <ProductCard key={perfume.id} perfume={perfume} index={index + 3} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
