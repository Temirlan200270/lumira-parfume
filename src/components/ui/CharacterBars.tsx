'use client'

import { motion } from 'framer-motion'
import { Perfume } from '@/lib/data'

interface CharacterBarsProps {
  perfume: Perfume
}

export default function CharacterBars({ perfume }: CharacterBarsProps) {
  const characteristics = [
    { label: 'Свежесть', value: perfume.ratings.sillage, color: 'bg-blue-400' },
    { label: 'Сладость', value: perfume.ratings.compliments > 8 ? 8 : perfume.ratings.compliments, color: 'bg-rose-300' },
    { label: 'Древесность', value: perfume.ratings.longevity > 8 ? 9 : perfume.ratings.longevity, color: 'bg-amber-600' },
    { label: 'Загадочность', value: perfume.ratings.versatility < 7 ? 8 : 5, color: 'bg-purple-400' },
    { label: 'Статусность', value: perfume.pricePerMl >= 1500 ? 10 : perfume.section === 'raspiv' ? 9 : 7, color: 'bg-yellow-500' },
  ]

  return (
    <div className="space-y-4">
      {characteristics.map((char, index) => (
        <div key={char.label} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-stone-500 tracking-wider uppercase">{char.label}</span>
            <span className="text-stone-700 font-light">{char.value}/10</span>
          </div>
          <div className="h-1.5 bg-stone-100 w-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${char.value * 10}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className={`h-full ${char.color}`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
