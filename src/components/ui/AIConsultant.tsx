'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Sparkles, Send } from 'lucide-react'
import { formatTenge } from '@/lib/data'

const quickSuggestions = [
  'Найди замену Dior Sauvage',
  'Что пахнет как старая библиотека?',
  'Хочу что-то на зиму для офиса',
  'Лучший комплиментарный аромат',
]

const raspivLines = [
  `Thomas Kosmala No 12 Oud Desire — ${formatTenge(1600)} за 1 мл`,
  `Mancera Cedrat Boise — ${formatTenge(1500)} за 1 мл`,
  `Mancera Red Tobacco — ${formatTenge(1500)} за 1 мл`,
]

const raspivReply = [
  'Распив — это оригинальный парфюм: отливант из фирменного флакона, не копия.',
  '',
  ...raspivLines,
  '',
  'Объём выбираете на карточке: 5, 10 или 20 мл.',
].join('\n')

const mockResponses: Record<string, string> = {
  'Найди замену Dior Sauvage': 'Похожие по духу: Acqua di Giò (Armani) и Elysium (Roja). Оба имеют ту же бергамотовую свежесть, но с более мягким подходом.',
  'Что пахнет как старая библиотека?': 'Вам подойдёт Santal 33 (Le Labo) или Gypsy Water (Byredo). Древесные, дымные, с нотками старой кожи и пыльной бумаги.',
  'Хочу что-то на зиму для офиса': 'Tobacco Vanille (Tom Ford) или Portrait of a Lady (Frederic Malle). Тёплые, сытные, но сдержанные.',
  'Лучший комплиментарный аромат': 'Baccarat Rouge 540 (MFK) — золотой стандарт комплиментов. Erba Pura (Xerjoff) — яркий и запоминающийся.',
  Распив: raspivReply,
}

export default function AIConsultant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: 'ai', text: 'Здравствуйте! Я ваш парфюмерный консультант. Задайте вопрос об ароматах или выберите быстрый вариант ниже.' },
  ])
  const [input, setInput] = useState('')

  const handleSend = (text: string) => {
    if (!text.trim()) return
    const userMsg = { role: 'user' as const, text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    setTimeout(() => {
      const aiResponse =
        mockResponses[text] ||
        'Интересный выбор! Могу порекомендовать сходить в каталог и попробовать квиз на сайте — он подберёт аромат по вашим предпочтениям.'
      setMessages((prev) => [...prev, { role: 'ai', text: aiResponse }])
    }, 800)
  }

  return (
    <div className="fixed bottom-3 right-3 z-50 md:bottom-6 md:right-6">
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 md:w-14 md:h-14 bg-stone-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-stone-800 transition-colors"
          aria-label="Открыть консультанта"
        >
          <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-0 right-0 w-[min(380px,calc(100vw-1.5rem))] max-h-[min(560px,70vh)] bg-white border border-stone-200 shadow-2xl flex flex-col"
          >
            <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-stone-500" />
                <span className="text-xs tracking-[0.2em] text-stone-700 uppercase">Парфюмерный AI</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-stone-900">
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[280px]">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2 text-sm font-light whitespace-pre-line ${
                      msg.role === 'user' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-800'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {messages.length === 1 && (
              <div className="px-4 pb-2 space-y-3">
                <div>
                  <p className="text-[10px] tracking-wider text-stone-400 uppercase mb-2">Категория</p>
                  <button
                    onClick={() => handleSend('Распив')}
                    className="w-full text-left px-3 py-2.5 border border-stone-200 hover:border-stone-900 transition-colors"
                  >
                    <span className="block text-[11px] tracking-[0.18em] uppercase text-stone-900">Распив</span>
                    <span className="block text-[11px] text-stone-500 font-light mt-1 leading-relaxed">
                      Оригинальный парфюм — отливант из фирменного флакона
                    </span>
                  </button>
                  <ul className="mt-2 space-y-1 px-1">
                    {raspivLines.map((line) => (
                      <li key={line} className="text-[11px] text-stone-500 font-light">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] tracking-wider text-stone-400 uppercase mb-2">Быстрые подсказки:</p>
                  <div className="flex flex-col gap-2">
                    {quickSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSend(suggestion)}
                        className="text-[11px] px-3 py-1.5 border border-stone-200 text-stone-600 hover:border-stone-900 hover:text-stone-900 transition-colors font-light text-left"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="p-3 border-t border-stone-100">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend(input)
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Опишите желаемый аромат..."
                  className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 text-sm font-light focus:outline-none focus:border-stone-900 transition-colors"
                />
                <button type="submit" className="px-3 py-2 bg-stone-900 text-white hover:bg-stone-800 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
