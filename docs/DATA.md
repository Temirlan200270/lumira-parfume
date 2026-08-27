# Data Model

## Perfume (src/lib/data.ts)

```typescript
interface Perfume {
  id: string
  name: string
  brand: string
  price: number
  image: string
  category: 'luxury' | 'designer' | 'niche'
  gender: 'male' | 'female' | 'unisex'
  notes: { top: string[]; middle: string[]; base: string[] }
  ratings: { longevity: number; sillage: number; compliments: number; versatility: number }
  season: string
  timeOfDay: string
  mood: string
  description: string
  tags: string[]
  moodIcon: string
  bottleColor: string
  bottleAccent: string
  pairsWith: string[]
  isBestseller?: boolean
  isNew?: boolean
}
```

## Категории

- `luxury` — люкс сегмент (Creed, Xerjoff, Roja и др.)
- `designer` — масс-маркет (Dior, Chanel, YSL и др.)
- `niche` — нишевая (Le Labo, Byredo, Diptyque и др.)

## Discovery Sets

```typescript
interface DiscoverySet {
  id: string
  name: string
  description: string
  price: number
  image: string
  perfumes: string[]  // id из perfumes
}
```

## Квиз

4 вопроса, каждый с 3-4 вариантами. Логика подбора:
- sweet → `notes.middle.includes('Жасмин')`
- fresh → `notes.top.includes('Бергамот')`
- остальные → fallback на первые 3 аромата

## Favorites Context

```typescript
interface FavoritesContextType {
  favorites: string[]
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  compareIds: string[]
  toggleCompare: (id: string) => void
  isInCompare: (id: string) => boolean
}
```

Хранилище: `localStorage`
- `essence-favorites`
- `essence-compare`
