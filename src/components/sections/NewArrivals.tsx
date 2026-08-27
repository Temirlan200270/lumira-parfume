'use client'

import { motion } from 'framer-motion'
import { Perfume } from '@/lib/data'
import ProductCard from '@/components/ui/ProductCard'

interface NewArrivalsProps {
  perfumes: Perfume[]
}

export default function NewArrivals({ perfumes }: NewArrivalsProps) {
  const newArrivals = perfumes.filter(p => p.isNew)

  return (
    <section id="new-arrivals" className="py-24 bg-stone-50 relative">
      <div className="absolute inset-0 opacity-[0.01]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[10px] tracking-[0.5em] text-stone-400 mb-5 uppercase">Поступления</p>
          <h2 className="text-3xl md:text-4xl font-light text-stone-900 tracking-tight">
            Новинки
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
          {newArrivals.map((perfume, index) => (
            <ProductCard key={perfume.id} perfume={perfume} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
