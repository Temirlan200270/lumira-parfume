'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

const categoryIcons: Record<string, ReactNode> = {
  all: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-6 h-6">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v20M2 12h20" />
    </svg>
  ),
  razliv: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-6 h-6">
      <path d="M8 3h8l-1 5H9z" />
      <path d="M9 8h6l-1.5 13h-3z" />
      <path d="M10 12h4" />
    </svg>
  ),
  raspiv: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-6 h-6">
      <path d="M9 2v4M15 2v4M8 6h8l-1 14h-6z" />
      <path d="M10 10h4" />
    </svg>
  ),
}

export default function Categories() {
  return (
    <section id="categories" className="pt-32 pb-24 bg-stone-50 relative">
      <div className="absolute inset-0 grain-sm" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-light text-stone-900 tracking-tight">
            Раздел
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
          {[
            { id: 'all', name: 'Все', href: '#catalog-all' },
            { id: 'razliv', name: 'Разлив', href: '#catalog-razliv' },
            { id: 'raspiv', name: 'Распив', href: '#catalog-raspiv' },
          ].map((cat, index) => (
            <motion.a
              key={cat.id}
              href={cat.href}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ y: -3 }}
              className="group bg-white p-6 text-center border border-stone-100 hover:border-stone-200 transition-all duration-500"
            >
              <div className="flex items-center justify-center text-stone-400 group-hover:text-stone-900 transition-colors duration-500 mb-4">
                {categoryIcons[cat.id]}
              </div>
              <span className="text-[10px] tracking-[0.2em] text-stone-500 group-hover:text-stone-900 transition-colors uppercase font-light">
                {cat.name}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
