'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function throttle(fn: (e: MouseEvent) => void, delay: number) {
  let lastCall = 0
  return (e: MouseEvent) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      fn(e)
    }
  }
}

export default function CursorFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updateMousePosition = throttle((e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }, 16)

    window.addEventListener('mousemove', updateMousePosition)
    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [])

  return (
    <motion.div
      className="fixed top-0 left-0 w-64 h-64 rounded-full pointer-events-none z-40 mix-blend-multiply opacity-20"
      style={{
        background: 'radial-gradient(circle, rgba(120,113,108,0.3) 0%, transparent 70%)',
        transform: `translate(${mousePosition.x - 128}px, ${mousePosition.y - 128}px)`,
      }}
      animate={{
        x: mousePosition.x - 128,
        y: mousePosition.y - 128,
      }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
    />
  )
}
