# Components Reference

## Sections

| Компонент | Props | Описание |
|-----------|-------|----------|
| `Hero` | — | Главный экран, CTA к квизу и каталогу |
| `Categories` | — | 6 карточек категорий с href `#catalog-{id}` |
| `FragranceQuiz` | — | 4 вопроса, результат → 3 аромата |
| `Catalog` | `perfumes: Perfume[]` | Фильтры: категория/пол/настроение, сортировка |
| `Bestsellers` | `perfumes: Perfume[]` | Featured + сетка остальных |
| `NewArrivals` | `perfumes: Perfume[]` | Сетка `isNew` ароматов |
| `Collections` | — | 4 thematic подборки |
| `Stories` | — | 3 отзыва покупателей |
| `SimilarPerfumes` | `perfumes: Perfume[]` | 4 карточки по `pairsWith` или fallback |
| `FragranceAnalysis` | `perfumes: Perfume[]` | `PerfumeNotes` + `CharacterBars` |
| `Blog` | — | 3 статьи-заглушки |
| `FragranceComparison` | `perfumes: Perfume[]` | Выбор 2 ароматов → сравнение 4 метрик |
| `DiscoverySets` | — | 3 набора пробников |
| `Newsletter` | — | Форма подписки |

## UI Components

| Компонент | Props | Описание |
|-----------|-------|----------|
| `PerfumeBottle` | `color, accent, label` | SVG-флакон с градиентом |
| `ProductCard` | `perfume, index` | Карточка с бутылкой, тегами, цена, избранное |
| `PerfumeNotes` | `perfume` | 3 колонки нот + описание при клике |
| `CharacterBars` | `perfume` | 5 анимированных полос |
| `AIConsultant` | — | Чат-виджет с mock-ответами |
| `CursorFollower` | — | Радиальный след курсора (z-40) |
| `FavoritesProvider` | `children` | Context + localStorage |
| `PageTransition` | `children` | AnimatePresence обёртка |

## Известные ограничения

- `AIConsultant` — только mock-ответы
- Корзина — не реализована (кнопка `console.log`)
- Блог — ссылки на `/blog/{id}` не ведут в реальные страницы
- Сравнение — только в рамках одной сессии
