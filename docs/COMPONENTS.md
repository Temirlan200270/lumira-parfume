# Компоненты

Список по тому, что реально в дереве рендера. Файлы из раннего лендинга, которые никто не импортирует, — в конце.

## Layout и оболочка

| Компонент | Роль |
|-----------|------|
| `Navbar` | шапка: каталог, поиск, избранное, корзина, WhatsApp |
| `Footer` | навигация, адрес, часы, WhatsApp, legal |
| `BottomNav` | mobile: каталог, избранное, корзина, WhatsApp |
| `StoreFrame` | отступ под шапку и нижнее меню |
| `SearchProvider` / `SearchOverlay` | поиск с других страниц |
| `CartProvider` / `CartDrawer` | корзина |
| `FavoritesProvider` | избранное |
| `Toast` | тосты |

## Витрина

| Компонент | Роль |
|-----------|------|
| `Catalog` | табы формата, поиск, фильтры, сетка |
| `CatalogGrid` | внутри Catalog, `memo` |
| `ProductCard` | фото, формат, объём, в корзину / избранное |
| `ProductPhoto` | фото или плейсхолдер, lazy ниже первого экрана |
| `VolumeSelector` | 5 / 10 / 20 мл |
| `Badge` | хит, новинка, нет в наличии, формат |
| `Stories` | истории только про ароматы, которые есть в каталоге и в наличии |
| `CatalogError` / `CatalogSkeleton` | ошибка и загрузка каталога |

## Покупка и контент

| Компонент | Роль |
|-----------|------|
| `ProductDetail` | PDP |
| `CheckoutView` | оформление: имя, телефон, согласие; кнопка всегда активна, ошибки с фокусом |
| `LegalSection` | секции политики |
| `Logo`, `Button`, `Input` | общие |

## Не смонтированы

Есть в `src/`, на `/` и в layout не подключены. Не описывать их как живые фичи:

`Hero`, `HomeHero`, `Categories`, `FragranceQuiz`, `Bestsellers`, `Hits`, `NewArrivals`, `Collections`, `Blog`, `Newsletter`, `DiscoverySets`, `HowItWorksStrip`, `TrustRow`, `FormatTiles`, `FragranceAnalysis`, `SimilarPerfumes`, `FragranceComparison`, `AIConsultant`, `PerfumeBottle`, `PerfumeNotes`, `CharacterBars`, `CursorFollower`, `PageTransition`, `TransitionOverlay`, `CheckoutModal`.

`AIConsultant` — mock, обещает квиз, советует чужие SKU. По целевому состоянию не включать, пока ответы не идут только из каталога.
