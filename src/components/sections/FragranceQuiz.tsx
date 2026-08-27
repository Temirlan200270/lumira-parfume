'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { quizQuestions, perfumes, formatTenge } from '@/lib/data'

export default function FragranceQuiz() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [result, setResult] = useState<string[]>([])

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value]
    setAnswers(newAnswers)

    if (step < quizQuestions.length - 1) {
      setStep(step + 1)
    } else {
      const recommended = perfumes
        .filter(p => {
          if (newAnswers.includes('sweet') && p.notes.middle.includes('Жасмин')) return true
          if (newAnswers.includes('fresh') && p.notes.top.includes('Бергамот')) return true
          return true
        })
        .slice(0, 3)
        .map(p => p.id)
      setResult(recommended.length ? recommended : perfumes.slice(0, 3).map(p => p.id))
    }
  }

  const reset = () => {
    setStep(0)
    setAnswers([])
    setResult([])
  }

  const currentQuestion = quizQuestions[step]

  return (
    <section id="quiz" className="py-28 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-[10px] tracking-[0.5em] text-stone-400 mb-6 uppercase">Персональный подбор</p>
          <h2 className="text-4xl md:text-5xl font-light text-stone-900 tracking-tight">
            Найдём ваш аромат
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          {result.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <Sparkles className="w-10 h-10 text-stone-300 mx-auto mb-8" />
              <h3 className="text-3xl font-light text-stone-900 mb-4 tracking-tight">Ваш ольфакторный профиль готов</h3>
              <p className="text-stone-500 mb-12 font-light">Мы подобрали для вас эти ароматы:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                {result.map((id) => {
                  const perfume = perfumes.find(p => p.id === id)
                  if (!perfume) return null
                  return (
                    <div key={id} className="text-left bg-stone-50 p-6 hover:bg-stone-100 transition-colors duration-500">
                      <div className="aspect-square bg-stone-100 mb-5 flex items-center justify-center">
                        <span className="text-4xl">{perfume.moodIcon}</span>
                      </div>
                      <p className="text-[9px] tracking-[0.2em] text-stone-400 uppercase">{perfume.brand}</p>
                      <h4 className="text-stone-900 font-light text-lg">{perfume.name}</h4>
                      <p className="text-sm text-stone-500 mt-2 font-light">{formatTenge(perfume.pricePerMl)} / 1 мл</p>
                    </div>
                  )
                })}
              </div>
              <button
                onClick={reset}
                className="text-[11px] tracking-[0.25em] border-b border-stone-300 pb-1.5 hover:border-stone-900 transition-colors font-light"
              >
                ПРОЙТИ ТЕСТ ЗАНОВО
              </button>
            </motion.div>
          ) : (
            <div className="text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="mb-10">
                    <p className="text-[10px] tracking-[0.3em] text-stone-400 mb-6">
                      ВОПРОС {step + 1} ИЗ {quizQuestions.length}
                    </p>
                    <div className="w-full bg-stone-100 mb-10">
                      <motion.div
                        className="h-px bg-stone-900"
                        initial={{ width: 0 }}
                        animate={{ width: `${((step + 1) / quizQuestions.length) * 100}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-light text-stone-900 tracking-tight flex items-center justify-center gap-3">
                      <span className="text-2xl">{currentQuestion.icon}</span>
                      {currentQuestion.question}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentQuestion.options.map((option, i) => (
                      <motion.button
                        key={option.value}
                        onClick={() => handleAnswer(option.value)}
                        className={`group relative p-7 bg-stone-50 hover:bg-stone-100/80 transition-all duration-500 text-left ${
                          i % 2 === 1 ? 'sm:ml-8' : 'sm:mr-8'
                        }`}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="flex items-center gap-4">
                          <span className="text-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-300">{option.icon}</span>
                          <span className="text-stone-700 group-hover:text-stone-900 transition-colors font-light text-[15px] tracking-wide">
                            {option.label}
                          </span>
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
