'use client'

import { motion } from 'framer-motion'
import { blockTransition, revealViewport } from '@/lib/motion'

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-400 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealViewport}
            transition={blockTransition}
            className="md:col-span-2"
          >
            <h3 className="flex items-baseline gap-3 text-white mb-6">
              <span className="font-serif text-3xl italic tracking-[0.08em]">lumira</span>
              <span className="text-stone-600 font-light" aria-hidden="true">—</span>
              <span className="text-[10px] font-light tracking-[0.35em] uppercase">parfume</span>
            </h3>
            <p className="text-sm leading-relaxed max-w-md">
              Мы создаём пространство, где парфюм превращается в эмоцию. 
              Каждый аромат — история, которую вы носите с собой.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealViewport}
            transition={{ ...blockTransition, delay: 0.02 }}
          >
            <h4 className="text-xs tracking-[0.3em] text-white mb-6 uppercase">Навигация</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#catalog" className="hover:text-white transition-colors">Каталог</a></li>
              <li><a href="#catalog-razliv" className="hover:text-white transition-colors">Разлив</a></li>
              <li><a href="#catalog-raspiv" className="hover:text-white transition-colors">Распив</a></li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealViewport}
            transition={{ ...blockTransition, delay: 0.04 }}
          >
            <h4 className="text-xs tracking-[0.3em] text-white mb-6 uppercase">Контакты</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="https://wa.me/77479192766" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  WhatsApp: +7 747 919 2766
                </a>
              </li>
              <li>hello@essence.ru</li>
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs tracking-wider">© 2026 Lumira Parfume. Все права защищены.</p>
          <div className="flex gap-6 text-xs">
            <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-white transition-colors">Оферта</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
