'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function TransitionOverlay() {
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href^="#"]')
      if (!link) return

      e.preventDefault()
      const href = link.getAttribute('href')
      if (!href || href === '#') return

      setIsTransitioning(true)

      setTimeout(() => {
        const el = document.querySelector(href)
        if (el) {
          el.scrollIntoView({ behavior: 'instant' })
        }
        setTimeout(() => setIsTransitioning(false), 300)
      }, 200)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 bg-stone-50 pointer-events-none z-[9998]"
      initial={{ opacity: 0 }}
      animate={{ opacity: isTransitioning ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    />
  )
}
