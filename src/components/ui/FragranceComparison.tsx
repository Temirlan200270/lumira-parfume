'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Perfume, formatTenge } from '@/lib/data'

interface FragranceComparisonProps {
  perfumes: Perfume[]
}

export default function FragranceComparison({ perfumes }: FragranceComparisonProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [animKey, setAnimKey] = useState(0)
  const selected = selectedIds.map(id => perfumes.find(p => p.id === id)).filter(Boolean) as Perfume[]

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= 2) return [prev[1], id]
      return [...prev, id]
    })
    setAnimKey(k => k + 1)
  }

  const metrics = [
    { key: 'longevity', label: 'Стойкость', getValue: (p: Perfume) => p.ratings.longevity },
    { key: 'sillage', label: 'Шлейф', getValue: (p: Perfume) => p.ratings.sillage },
    { key: 'compliments', label: 'Комплименты', getValue: (p: Perfume) => p.ratings.compliments },
    { key: 'versatility', label: 'Универсальность', getValue: (p: Perfume) => p.ratings.versatility },
  ]

  return (
    <section id="comparison" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Sparkles className="w-5 h-5 text-stone-300 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-light text-stone-900 mb-4 tracking-tight">
            Сравнение ароматов
          </h2>
          <p className="text-stone-500 font-light max-w-lg mx-auto text-sm">
            Выберите два аромата, чтобы сравнить их по ключевым параметрам
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 space-y-2">
            <p className="text-[10px] tracking-[0.2em] text-stone-400 uppercase mb-4">Выберите ароматы</p>
            {perfumes.slice(0, 10).map(perfume => {
              const isSelected = selectedIds.includes(perfume.id)
              return (
                <button
                  key={perfume.id}
                  onClick={() => toggleSelect(perfume.id)}
                  className={`w-full text-left px-4 py-3 transition-all duration-300 flex items-center justify-between group ${
                    isSelected
                      ? 'bg-stone-900 text-white'
                      : 'bg-white border border-stone-100 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <div>
                    <p className="text-[10px] tracking-wider opacity-60">{perfume.brand}</p>
                    <p className="text-sm font-light">{perfume.name}</p>
                  </div>
                  <span className={`text-xs tracking-wider ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                    {formatTenge(perfume.pricePerMl)} / мл
                  </span>
                </button>
              )
            })}
          </div>

          <div className="lg:col-span-2">
            {selected.length === 2 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-stone-100 overflow-hidden"
              >
                <div className="grid grid-cols-2 divide-x divide-stone-100">
                  {selected.map(perfume => (
                    <div key={perfume.id} className="p-6">
                      <p className="text-[9px] tracking-[0.2em] text-stone-400 uppercase">{perfume.brand}</p>
                      <h3 className="text-lg font-light text-stone-900 mt-1">{perfume.name}</h3>
                      <p className="text-xs text-stone-500 mt-1">{perfume.moodIcon} {perfume.mood}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone-100 divide-y divide-stone-50">
                  {metrics.map(metric => {
                    const valA = metric.getValue(selected[0])
                    const valB = metric.getValue(selected[1])
                    return (
                      <div key={metric.key} className="grid grid-cols-2 divide-x divide-stone-100">
                        {selected.map(perfume => {
                          const val = metric.getValue(perfume)
                          const isHigher = val === Math.max(valA, valB)
                          return (
                            <div key={perfume.id} className="px-6 py-5 flex items-center justify-between">
                              <span className="text-[10px] text-stone-400 tracking-[0.15em] uppercase">{metric.label}</span>
                              <div className="flex items-center gap-3">
                                <div className="w-24 h-[3px] bg-stone-100 relative overflow-hidden">
                                  <motion.div
                                    key={`${metric.key}-${val}-${animKey}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${val * 10}%` }}
                                    transition={{ duration: 1.2, delay: 0.3 }}
                                    className={`absolute inset-y-0 left-0 ${isHigher ? 'bg-stone-800' : 'bg-stone-400'}`}
                                    style={{
                                      boxShadow: isHigher ? '0 0 8px rgba(28, 25, 23, 0.3)' : 'none',
                                    }}
                                  />
                                </div>
                                <span className="text-[10px] text-stone-400 w-6 text-right tabular-nums">{val}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            ) : (
              <div className="bg-white border border-stone-100 p-12 text-center">
                <p className="text-stone-400 font-light text-sm">
                  {selectedIds.length === 0
                    ? 'Выберите два аромата для сравнения'
                    : `Выбрано ${selectedIds.length} из 2`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
