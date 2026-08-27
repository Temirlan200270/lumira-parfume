'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { blockTransition, revealViewport } from '@/lib/motion'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail('')
    }
  }

  return (
    <section id="newsletter" className="py-32 bg-stone-900 text-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealViewport}
          transition={blockTransition}
        >
          <p className="text-xs tracking-[0.4em] text-stone-400 mb-6 uppercase">Подписка</p>
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            Получайте персональные рекомендации
          </h2>
          <p className="text-stone-400 font-light mb-12 max-w-xl mx-auto leading-relaxed">
            Новинки, эксклюзивные подборки и доступ к закрытым распивам. 
            Никакого спама — только аромат.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-stone-300 font-light"
            >
              <p className="text-lg mb-2">Спасибо за подписку!</p>
              <p className="text-sm text-stone-500">Мы отправили письмо на ваш email.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ваш email"
                required
                className="flex-1 bg-stone-800/60 border border-stone-600/50 px-6 py-4 text-white placeholder:text-stone-400 focus:outline-none focus:border-stone-400 transition-colors font-light text-sm"
              />
              <button
                type="submit"
                className="bg-white text-stone-900 px-8 py-4 text-sm tracking-[0.2em] hover:bg-stone-100 transition-colors font-light whitespace-nowrap"
              >
                Подписаться
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
