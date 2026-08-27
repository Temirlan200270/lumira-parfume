'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingBag, Search } from 'lucide-react'
import { categories, WHATSAPP_LINK } from '@/lib/data'
import { useCart } from '@/components/cart/CartProvider'
import { AppStrings } from '@/lib/strings'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { itemCount, openCart } = useCart()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'backdrop-blur-xl' : ''
      }`}
      style={{
        background: scrolled ? 'rgba(255,255,255,0.15)' : 'transparent'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#" className="flex items-baseline gap-2 text-stone-900">
          <span className="font-serif text-2xl italic tracking-[0.08em]">lumira</span>
          <span className="text-stone-300 font-light" aria-hidden="true">—</span>
          <span className="text-[9px] font-light tracking-[0.35em] uppercase">parfume</span>
        </a>

        <div className="hidden md:flex items-center gap-12">
          <a
            href="#catalog"
            className="text-[10px] tracking-[0.25em] text-stone-500 hover:text-stone-900 transition-colors font-light uppercase"
          >
            Каталог
          </a>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button
            type="button"
            onClick={() => {
              const input = document.getElementById('perfume-search')
              input?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              window.setTimeout(() => input?.focus(), 350)
            }}
            className="text-stone-500 hover:text-stone-900 transition-colors"
            aria-label="Поиск парфюма"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={openCart}
            className="relative text-stone-500 hover:text-stone-900 transition-colors"
            aria-label={AppStrings.cart.open}
          >
            <ShoppingBag className="w-4 h-4" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 bg-stone-900 text-white text-[9px] leading-4 text-center">
                {itemCount}
              </span>
            )}
          </button>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] tracking-[0.12em] text-stone-500 hover:text-stone-900 transition-colors font-light uppercase"
          >
            WhatsApp
          </a>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <button
            type="button"
            onClick={openCart}
            className="relative text-stone-900"
            aria-label={AppStrings.cart.open}
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 bg-stone-900 text-white text-[9px] leading-4 text-center">
                {itemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-stone-900"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-stone-100"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {categories.map((cat) => (
                <a
                  key={cat.id}
                  href={`#catalog-${cat.id}`}
                  className="text-lg tracking-[0.15em] text-stone-600 hover:text-stone-900 transition-colors font-light uppercase"
                  onClick={() => setIsOpen(false)}
                >
                  {cat.name}
                </a>
              ))}
              <button
                type="button"
                className="text-left text-lg tracking-[0.15em] text-stone-600 hover:text-stone-900 transition-colors font-light uppercase"
                onClick={() => {
                  setIsOpen(false)
                  window.setTimeout(() => {
                    const input = document.getElementById('perfume-search')
                    input?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    input?.focus()
                  }, 200)
                }}
              >
                Поиск
              </button>
              <button
                type="button"
                className="text-left text-lg tracking-[0.15em] text-stone-600 hover:text-stone-900 transition-colors font-light uppercase"
                onClick={() => {
                  setIsOpen(false)
                  openCart()
                }}
              >
                {AppStrings.cart.title}
                {itemCount > 0 ? ` (${itemCount})` : ''}
              </button>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm tracking-[0.08em] text-stone-900 font-light"
                onClick={() => setIsOpen(false)}
              >
                Консультация WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
