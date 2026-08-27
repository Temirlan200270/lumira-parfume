import type { Transition, ViewportOptions } from 'framer-motion'

export const easeOutFast: [number, number, number, number] = [0.16, 1, 0.3, 1]

export const revealViewport: ViewportOptions = {
  once: true,
  amount: 0.05,
  margin: '0px 0px 160px 0px',
}

export const blockTransition: Transition = {
  duration: 0.25,
  ease: easeOutFast,
}

export const cardTransition = (index: number): Transition => ({
  duration: 0.3,
  delay: Math.min(index, 7) * 0.02,
  ease: easeOutFast,
})
