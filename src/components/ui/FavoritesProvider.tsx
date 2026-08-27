'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react'

interface FavoritesContextType {
  favorites: string[]
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  compareIds: string[]
  toggleCompare: (id: string) => void
  isInCompare: (id: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)
const EMPTY_IDS: string[] = []
const FAVORITES_KEY = 'lumira-favorites'
const LEGACY_FAVORITES_KEY = 'essence-favorites'
const COMPARE_KEY = 'lumira-compare'
const LEGACY_COMPARE_KEY = 'essence-compare'
const STORAGE_EVENT = 'lumira-favorites-change'

let favoritesCacheRaw: string | null | undefined
let favoritesCache: string[] = EMPTY_IDS
let compareCacheRaw: string | null | undefined
let compareCache: string[] = EMPTY_IDS

function parseIds(raw: string | null): string[] {
  if (!raw) return EMPTY_IDS
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return EMPTY_IDS
    const ids = parsed.filter((value): value is string => typeof value === 'string')
    return ids.length > 0 ? ids : EMPTY_IDS
  } catch {
    return EMPTY_IDS
  }
}

function readIds(key: string): string[] {
  const raw = localStorage.getItem(key)
  if (key === FAVORITES_KEY) {
    if (!raw) {
      const legacy = localStorage.getItem(LEGACY_FAVORITES_KEY)
      if (legacy) {
        localStorage.setItem(FAVORITES_KEY, legacy)
        return parseIds(legacy)
      }
    }
    if (raw === favoritesCacheRaw) return favoritesCache
    favoritesCacheRaw = raw
    favoritesCache = parseIds(raw)
    return favoritesCache
  }
  if (key === COMPARE_KEY && !raw) {
    const legacy = localStorage.getItem(LEGACY_COMPARE_KEY)
    if (legacy) {
      localStorage.setItem(COMPARE_KEY, legacy)
      return parseIds(legacy)
    }
  }
  if (raw === compareCacheRaw) return compareCache
  compareCacheRaw = raw
  compareCache = parseIds(raw)
  return compareCache
}

function writeIds(key: string, ids: string[]): void {
  const next = ids.length > 0 ? ids : EMPTY_IDS
  if (key === FAVORITES_KEY) {
    favoritesCache = next
    favoritesCacheRaw = JSON.stringify(next)
    localStorage.setItem(key, favoritesCacheRaw)
  } else {
    compareCache = next
    compareCacheRaw = JSON.stringify(next)
    localStorage.setItem(key, compareCacheRaw)
  }
  window.dispatchEvent(new Event(STORAGE_EVENT))
}

function subscribeStorage(listener: () => void): () => void {
  window.addEventListener(STORAGE_EVENT, listener)
  window.addEventListener('storage', listener)
  return () => {
    window.removeEventListener(STORAGE_EVENT, listener)
    window.removeEventListener('storage', listener)
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const favorites = useSyncExternalStore(
    subscribeStorage,
    () => readIds(FAVORITES_KEY),
    () => EMPTY_IDS
  )
  const compareIds = useSyncExternalStore(
    subscribeStorage,
    () => readIds(COMPARE_KEY),
    () => EMPTY_IDS
  )

  const toggleFavorite = useCallback((id: string) => {
    const current = readIds(FAVORITES_KEY)
    writeIds(
      FAVORITES_KEY,
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    )
  }, [])

  const toggleCompare = useCallback((id: string) => {
    const current = readIds(COMPARE_KEY)
    if (current.includes(id)) {
      writeIds(COMPARE_KEY, current.filter((item) => item !== id))
      return
    }
    writeIds(COMPARE_KEY, current.length >= 2 ? [current[1], id] : [...current, id])
  }, [])

  const value = useMemo<FavoritesContextType>(
    () => ({
      favorites,
      toggleFavorite,
      isFavorite: (id: string) => favorites.includes(id),
      compareIds,
      toggleCompare,
      isInCompare: (id: string) => compareIds.includes(id),
    }),
    [favorites, compareIds, toggleFavorite, toggleCompare]
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider')
  return context
}
