# Architecture

## Лейаут

```
RootLayout
├── html (ru)
├── body (min-h-full flex flex-col)
│   ├── FavoritesProvider
│   │   ├── Navbar (fixed, z-50)
│   │   ├── {children}
│   │   │   └── main
│   │   │       ├── Hero
│   │   │       ├── Categories
│   │   │       ├── FragranceQuiz
│   │   │       ├── Catalog
│   │   │       ├── Bestsellers
│   │   │       ├── NewArrivals
│   │   │       ├── Collections
│   │   │       ├── Stories
│   │   │       ├── SimilarPerfumes
│   │   │       ├── FragranceAnalysis
│   │   │       ├── Blog
│   │   │       ├── FragranceComparison
│   │   │       ├── DiscoverySets
│   │   │       ├── Newsletter
│   │   │       └── AIConsultant
│   │   ├── CursorFollower (z-40)
│   │   ├── grain-overlay (z-9999)
│   │   └── Footer
```

## State Management

- `FavoritesProvider` — React Context + `localStorage`
  - `favorites: string[]`
  - `compareIds: string[]`
  - Методы: `toggleFavorite`, `toggleCompare`, `isFavorite`, `isInCompare`
- Локальный state: `useState` в каждом компоненте
- Роутинг фильтров каталога: `window.location.hash`

## Стилизация

- Tailwind CSS v4 с `@theme` кастомными токенами
- Цветовая палитра: stone + accent (`#d4a5a5`)
- Шрифты: Geist Sans/Mono, Playfair Display (серif)
- Grain overlay: `.grain-sm` (absolute) + `.grain-overlay` (fixed)
- Scroll: `smooth` в globals.css

## Next.js 16 особенности

- App Router обязателен
- `next/font/google` — автоматическая оптимизация
- `metadata` export в layout
- Flat ESLint config (`eslint.config.mjs`)
