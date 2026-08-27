# Fixed Bugs & Issues

## Data (`src/lib/data.ts`)

- [x] Удалён неиспользуемый `bottleColors` с ведущими пробелами в ключах
- [x] `'Гаcks'` → `'Мята'` (Oud for Greatness, верхние ноты)
- [x] `'Анталибский жасмин'` → `'Жасмин'` (Eros, средние ноты)
- [x] `'Замеalo'` → `'Бергамот'` (Pour Homme, верхние ноты)
- [x] `'Ми brake'` → `'Ветивер'` (Hwyl, базовые ноты)
- [x] `' Роза'` → `'Роза'` (Portrait of a Lady, ведущий пробел)
- [x] `'#раб'` → `'#статусный'` (Baraonda, теги)
- [x] Удалены дубликаты нот (`Бергамот` ×2, `Ветивер` ×2)

## Components

- [x] `PerfumeNotes.tsx` — удалены 50+ записей-мусора (транслитерации типа `Imbir`, `Baraonda`, `Замечало`, `Гакс`, `Dealova` и др.)
- [x] `Collections.tsx` — удалён конфликт `md:aspect-auto md:aspect-[2/3]`
- [x] `ProductCard.tsx` — добавлен `console.log` в обработчик корзины
- [x] `DiscoverySets.tsx` — добавлен `console.log` в кнопку «Добавить в корзину»
- [x] `Catalog.tsx` — удалены неиспользуемые импорты `categories`, `useFavorites`
- [x] `CursorFollower.tsx` — убран `any`, исправлен тип throttle
- [x] `FavoritesProvider.tsx` — lazy initializer вместо `setState` в `useEffect`
- [x] `FragranceComparison.tsx` — удалена неиспользуемая `getLevel`
- [x] `PageTransition.tsx` — удалён неиспользуемый `useEffect`
- [x] `PerfumeBottle.tsx` — санитизация ID градиента (пробелы/спецсимволы → `_`)
- [x] `SimilarPerfumes.tsx` — адаптивный заголовок при отсутствии похожих
- [x] `Stories.tsx` — удалён хардкод «14 покупок за 24 часа»
- [x] `Bestsellers.tsx` — добавлено пустое состояние при отсутствии хитов
- [x] `Hero.tsx` — акцент на слове «говорит` (border-bottom + font-medium)

## Build & Lint

- [x] `npm run build` — проходит без ошибок
- [x] `npx eslint src/` — 0 ошибок, 0 предупреждений
