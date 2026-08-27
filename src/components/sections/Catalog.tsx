'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Filter, Search, X } from 'lucide-react'
import { Perfume, PerfumeSection, matchesPerfumeSearch } from '@/lib/data'
import ProductCard from '@/components/ui/ProductCard'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import { blockTransition, revealViewport } from '@/lib/motion'

interface CatalogProps {
  perfumes: Perfume[]
}

type SectionFilter = 'all' | PerfumeSection

export default function Catalog({ perfumes }: CatalogProps) {
  const [activeSection, setActiveSection] = useState<SectionFilter>('all')
  const [selectedGender, setSelectedGender] = useState<Perfume['gender'] | 'all'>('all')
  const [sortBy, setSortBy] = useState<string>('popular')
  const [query, setQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

  useEffect(() => {
    const applyHashFilter = () => {
      const hash = window.location.hash
      if (hash === '#catalog-razliv' || hash === '#catalog-raspiv') {
        setActiveSection(hash.replace('#catalog-', '') as PerfumeSection)
      } else if (hash === '#catalog-all' || hash === '#catalog') {
        setActiveSection('all')
      }
    }

    applyHashFilter()
    window.addEventListener('hashchange', applyHashFilter)
    return () => window.removeEventListener('hashchange', applyHashFilter)
  }, [])

  const filtered = useMemo(() => {
    let result = [...perfumes]

    if (activeSection !== 'all') {
      result = result.filter((p) => p.section === activeSection)
    }

    if (selectedGender !== 'all') {
      result = result.filter((p) => p.gender === selectedGender)
    }

    result = result.filter((p) => matchesPerfumeSearch(p, query))

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.pricePerMl - b.pricePerMl)
        break
      case 'price-desc':
        result.sort((a, b) => b.pricePerMl - a.pricePerMl)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
        break
      case 'rating':
        result.sort((a, b) => b.ratings.compliments - a.ratings.compliments)
        break
      default:
        result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0))
        break
    }

    return result
  }, [perfumes, activeSection, selectedGender, sortBy, query])

  const suggestions = useMemo(() => filtered.slice(0, 6), [filtered])

  const selectSection = (section: SectionFilter) => {
    setActiveSection(section)
    const hash = section === 'all' ? '#catalog' : `#catalog-${section}`
    window.history.replaceState(null, '', hash)
  }

  const title =
    activeSection === 'raspiv'
      ? 'Распив'
      : activeSection === 'razliv'
        ? 'Разлив'
        : 'Все ароматы'

  const tabs: { id: SectionFilter; label: string; hint?: string }[] = [
    { id: 'all', label: 'Все' },
    { id: 'razliv', label: 'Разлив' },
    { id: 'raspiv', label: 'Распив', hint: '100% оригинал' },
  ]

  return (
    <section id="catalog" className="pt-32 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealViewport}
          transition={blockTransition}
          className="text-center mb-8"
        >
          <p className="text-xs tracking-[0.4em] text-stone-500 mb-4 uppercase">Каталог</p>
          <h2 className="text-4xl md:text-5xl font-light text-stone-900">{title}</h2>
        </motion.div>

        <div className="flex justify-center mb-6">
          <div
            role="tablist"
            aria-label="Раздел каталога"
            className="inline-flex flex-wrap justify-center gap-2"
          >
            {tabs.map((tab) => {
              const active = activeSection === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => selectSection(tab.id)}
                  className={`inline-flex items-center gap-2 h-10 px-4 text-[11px] tracking-[0.18em] uppercase font-light transition-colors ${
                    active
                      ? 'bg-black text-white border border-black'
                      : 'bg-transparent text-stone-500 border border-stone-300 hover:border-stone-900 hover:text-stone-900'
                  }`}
                >
                  {tab.label}
                  {tab.hint && (
                    <span
                      className={`normal-case tracking-normal text-[9px] px-1.5 py-0.5 ${
                        active ? 'bg-white/15 text-white' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {tab.hint}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="min-h-[3rem] mb-6 flex items-start justify-center">
          {activeSection === 'raspiv' && (
            <p className="max-w-xl text-center text-sm text-stone-500 font-light leading-relaxed">
              Распив — оригинальный парфюм из фирменного флакона, не копия и не аналог.
            </p>
          )}
          {activeSection === 'razliv' && (
            <p className="max-w-xl text-center text-sm text-stone-500 font-light leading-relaxed">
              Разлив: 800 ₸ за 1 мл на все ароматы. Выберите объём 5, 10 или 20 мл на карточке.
            </p>
          )}
        </div>

        <div className="flex justify-center mb-10">
          <WhatsAppButton />
        </div>

        <div className="relative max-w-2xl mx-auto mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          <input
            id="perfume-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            placeholder="Поиск: название, бренд или нота"
            autoComplete="off"
            className="w-full h-12 pl-11 pr-11 bg-stone-50 border border-stone-200 text-sm font-light text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900"
              aria-label="Очистить поиск"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {searchFocused && query.trim() && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 bg-white border border-stone-200">
              {suggestions.map((perfume) => (
                <button
                  key={perfume.id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setQuery(`${perfume.brand} ${perfume.name}`)
                    setSearchFocused(false)
                    document.getElementById(`perfume-${perfume.id}`)?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    })
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-stone-50 transition-colors border-b border-stone-100 last:border-b-0"
                >
                  <p className="text-[10px] tracking-[0.2em] text-stone-400 uppercase">{perfume.brand}</p>
                  <p className="text-sm font-light text-stone-900">{perfume.name}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={revealViewport}
            transition={blockTransition}
            className="lg:w-64 flex-shrink-0"
          >
            <div className="bg-stone-50 p-6 border border-stone-100 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-4 h-4 text-stone-500" />
                <span className="text-xs tracking-[0.2em] text-stone-700 uppercase">Фильтры</span>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-xs tracking-[0.15em] text-stone-500 uppercase mb-3">Пол</p>
                  <div className="space-y-2">
                    {[
                      { id: 'all', label: 'Все' },
                      { id: 'male', label: 'Мужской' },
                      { id: 'female', label: 'Женский' },
                      { id: 'unisex', label: 'Унисекс' },
                    ].map((gender) => (
                      <button
                        key={gender.id}
                        type="button"
                        onClick={() => setSelectedGender(gender.id as Perfume['gender'] | 'all')}
                        className={`w-full text-left px-3 py-2 text-sm transition-colors font-light ${
                          selectedGender === gender.id
                            ? 'bg-stone-900 text-white'
                            : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                        }`}
                      >
                        {gender.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs tracking-[0.15em] text-stone-500 uppercase mb-3">Сортировка</p>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 text-stone-700 text-sm font-light focus:outline-none focus:border-stone-900"
                  >
                    <option value="popular">По популярности</option>
                    <option value="price-asc">Цена: по возрастанию</option>
                    <option value="price-desc">Цена: по убыванию</option>
                    <option value="name">По названию</option>
                    <option value="rating">По рейтингу</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-stone-500 font-light">
                Показано <span className="text-stone-900">{filtered.length}</span> ароматов
              </p>
              {(activeSection !== 'all' || selectedGender !== 'all' || query) && (
                <button
                  onClick={() => {
                    setActiveSection('all')
                    setSelectedGender('all')
                    setQuery('')
                    window.history.replaceState(null, '', '#catalog')
                  }}
                  className="text-xs tracking-wider text-stone-500 hover:text-stone-900 flex items-center gap-1 transition-colors"
                >
                  <X className="w-3 h-3" />
                  Сбросить
                </button>
              )}
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {filtered.map((perfume, index) => (
                    <div key={perfume.id} id={`perfume-${perfume.id}`}>
                      <ProductCard perfume={perfume} index={index} />
                    </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-stone-400 font-light">
                  {query ? `По запросу «${query}» ничего не найдено` : 'Ничего не найдено'}
                </p>
                <button
                  onClick={() => {
                    setActiveSection('all')
                    setSelectedGender('all')
                    setQuery('')
                    window.history.replaceState(null, '', '#catalog')
                  }}
                  className="mt-4 text-xs tracking-[0.2em] border-b border-stone-300 pb-1 hover:border-stone-900 transition-colors"
                >
                  Сбросить фильтры
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
