'use client'

import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[72vh] flex items-center bg-stone-100 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-stone-50 to-white" />
      <div className="absolute inset-0 grain-sm" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-6xl lg:text-7xl font-light leading-relaxed text-stone-900 mb-8 tracking-tight"
          >
            Аромат, который
            <br />
            <span className="italic font-medium text-stone-700 border-b-2 border-stone-300 pb-1">говорит</span> за вас
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="text-base md:text-lg text-stone-500 font-light leading-relaxed max-w-xl mx-auto"
          >
            Погрузитесь в мир изысканных композиций. Каждый флакон — часть вашей истории.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
