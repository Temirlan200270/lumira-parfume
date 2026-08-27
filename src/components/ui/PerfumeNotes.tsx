'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Perfume } from '@/lib/data'

interface PerfumeNotesProps {
  perfume: Perfume
}

const noteDescriptions: Record<string, string> = {
  'Бергамот': 'Даёт бодрящую горчинку и свежесть. Король цитрусовых.',
  'Яблоко': 'Сочный фрукт. Создаёт ощущение чистоты и лёгкости.',
  'Черная смородина': 'Едкая, терпкая, почти алкогольная свежесть.',
  'Берёза': 'Дымный, смолистый. Запах финской сауны и зимнего леса.',
  'Амор': 'Мягкий тропический цветок. Медовый и кремовый.',
  'Дриас': 'Сухие цветы, пыльца, тепло солнца.',
  'Жасмин': 'Королевский цветочный. Богатый, восточный, чувственный.',
  'Мускус': 'Тёплый, животный, как кожа. Основа всех лучших ароматов.',
  'Дубовый мох': 'Зелёный, сырой, пахнет древним лесом.',
  'Амбра': 'Тёплая, сладковатая, как солнце на коже.',
  'Ваниль': 'Сладкая, кремовая, уютная. Аромат детства и безопасности.',
  'Шалфей': 'Зелёный, травянистый, с горчинкой.',
  'Апельсин': 'Яркий, сочный, солнечный.',
  'Янтарь': 'Минеральный, тёплый, как древняя смола.',
  'Кедр': 'Сухой, древесный, благородный.',
  'Сандал': 'Кремовый, мягкий, молочный.',
  'Кожа': 'Дублёная кожа, седа, табак. Аромат кожаного кресла.',
  'Тонка бобы': 'Сладкий миндаль, ваниль, карамель.',
  'Миндаль': 'Марципан, грустный, нежный.',
  'Бобы тонка': 'Тёмный миндаль с ванильным оттенком.',
  'Уд': 'Деревянный, лекарственный, бальзамический.',
  'Лимон': 'Металлический, чистый, живой.',
  'Нероли': 'Цитрусовый цветочный, эфирный.',
  'Ладанник': 'Пряный, апельсиновый, тёплый.',
  'Роза': 'Цветочная вода, пыльца, мёд.',
  'Пион': 'Свежий, розовый, как утренний букет.',
  'Сирень': 'Мягкий, фиалковый, мечтательный.',
  'Патчули': 'Землистый, сухой, древесный.',
  'Табак': 'Сладкий, сухой, слегка дымный.',
  'Ароматическая ваниль': 'Тёмная, пряная, почти восточная.',
  'Земляничное дерево': 'Сладковатое дерево, кокосовое молоко.',
  'Цветок табака': 'Мягкий лист табака.',
  'Какао': 'Горький шоколад, пыль, сухость.',
  'Дуб': 'Сухой, вяжущий, винный.',
  'Альдегиды': 'Металлический, блестящий, воздушный.',
  'Лаванда': 'Травянистый, свежий, аромат чистоты.',
  'Ирис': 'Пудровый, картофельный, благородный.',
  'Ландыш': 'Зелёный, восковый, хрустальный.',
  'Мандарин': 'Сладкий, лёгкий, детский.',
  'Фиалка': 'Зелёный лист, пудровый, с горчинкой.',
  'Мята': 'Холодная, свежая, ледяная.',
  'Абрикос': 'Мягкий, персиковый, бархатистый.',
  'Грейпфрут': 'Горький цитрус, розовый, живой.',
  'Перец': 'Пряный, острый, теплый.',
  'Шафран': 'Пряный, лекарственный, редкий.',
  'Мускатный орех': 'Тёплый, пряный, сладковатый.',
  'Агарwood (UD)': 'Древнее дерево, бальзам, роскошь.',
  'Пачули': 'Землистый, древесный, гипнотический.',
  'Базилик': 'Зелёный, пряный, почти мятный.',
  'Тимьян': 'Сухой, прованский, солнце.',
  'Кипарис': 'Зелёный, смолистый, средиземноморский.',
  'Ветивер': 'Землистый, дымный, корневой.',
  'Сосна': 'Хвойный, свежий, как лес после дождя.',
  'Ладан': 'Церковный, смолистый, мистический.',
  'Зелёный инжир': 'Молодой лист, сок, зелёный.',
  'Лайм': 'Кислый, зеленый, острый.',
  'Анис': 'Сладкий, резаный, восточный.',
  'Бензоин': 'Карамельный, ванильный, бальзамический.',
  'Мускатный шалфей': 'Пряный, зеленый, ароматный.',
  'Египетская роза': 'Медовая, густая, солнечная.',
  'Красное дерево': 'Кремовый, пудровый, чувственный.',
  'Пряности': 'Тёплые, пьянящие, пряные.',
  'Имбирь': 'Пряный, острый, тёплый.',
  'Элеми': 'Деревянистый, смолистый, пряный.',
  'Ром': 'Выдержанный, древесный, карамельный.',

















































  'Dnevnoy': 'Светлый, чистый, насыщенный.',
}

export default function PerfumeNotes({ perfume }: PerfumeNotesProps) {
  const [selectedNote, setSelectedNote] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <p className="text-[10px] tracking-[0.3em] text-stone-400 uppercase text-center">Верхние ноты</p>
          <div className="space-y-1">
            {perfume.notes.top.map((note) => (
              <button
                key={note}
                onClick={() => setSelectedNote(note)}
                className={`w-full text-left px-3 py-2 text-xs transition-all font-light border ${
                  selectedNote === note
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-stone-50 text-stone-600 border-stone-100 hover:border-stone-300'
                }`}
              >
                {note}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] tracking-[0.3em] text-stone-400 uppercase text-center">Средние ноты</p>
          <div className="space-y-1">
            {perfume.notes.middle.map((note) => (
              <button
                key={note}
                onClick={() => setSelectedNote(note)}
                className={`w-full text-left px-3 py-2 text-xs transition-all font-light border ${
                  selectedNote === note
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-stone-50 text-stone-600 border-stone-100 hover:border-stone-300'
                }`}
              >
                {note}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] tracking-[0.3em] text-stone-400 uppercase text-center">Базовые ноты</p>
          <div className="space-y-1">
            {perfume.notes.base.map((note) => (
              <button
                key={note}
                onClick={() => setSelectedNote(note)}
                className={`w-full text-left px-3 py-2 text-xs transition-all font-light border ${
                  selectedNote === note
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-stone-50 text-stone-600 border-stone-100 hover:border-stone-300'
                }`}
              >
                {note}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedNote && (
          <motion.div
            key={selectedNote}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-stone-50 border border-stone-100"
          >
            <p className="text-sm text-stone-700 font-light italic">
              {noteDescriptions[selectedNote] || 'Уникальная нота с характерным ароматом.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
