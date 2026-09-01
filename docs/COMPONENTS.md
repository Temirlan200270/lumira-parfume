# Компоненты

Список по тому, что реально в дереве рендера. Файлы из раннего лендинга, которые никто не импортирует, — в конце.

## Layout и оболочка

| Компонент | Роль |
|-----------|------|
| `StoreChrome` | на `/admin` прячет магазинную оболочку; иначе Navbar + StoreFrame + drawer + overlay + BottomNav + Footer |
| `Navbar` | шапка: на мобиле логотип и лупа; с `lg` ещё каталог-ссылки, избранное, корзина, WhatsApp |
| `Footer` | навигация, адрес, часы, WhatsApp, legal |
| `BottomNav` | mobile: каталог, избранное, корзина, WhatsApp; нет на `/checkout` и `/admin` |
| `StoreFrame` | отступ под шапку и нижнее меню |
| `SearchProvider` / `SearchOverlay` | поиск с лупы (и с других страниц) |
| `CartProvider` / `CartDrawer` | корзина |
| `FavoritesProvider` | избранное |
| `Toast` | тосты |

## Витрина

| Компонент | Роль |
|-----------|------|
| `Catalog` | табы формата, поиск, фильтры, сетка |
| `CatalogGrid` | внутри Catalog, `memo` |
| `LogoMark` | марка над каталогом (на мобиле часть хрома скрыта) |
| `ProductCard` | фото, бейдж формата, цена, ₸/мл, 5/10/20; ссылка на PDP, **без** «В корзину» и сердца на фото |
| `ProductPhoto` | фото или плейсхолдер, lazy ниже первого экрана |
| `VolumeSelector` | 5 / 10 / 20 мл |
| `Badge` | новинка, нет в наличии, формат (хит в сетке не показывается) |
| `FilterSheet` / `FilterFields` | мобильная шторка — черновик до «Показать N»; десктоп-фильтры сразу |
| `Stories` | только ароматы, которые есть в каталоге и в наличии |
| `CatalogError` / `CatalogSkeleton` | ошибка и загрузка каталога |

## Покупка и контент

| Компонент | Роль |
|-----------|------|
| `ProductDetail` | PDP: избранное на desktop, «В корзину», закреплённая кнопка на mobile |
| `CheckoutView` | имя, телефон, согласие; кнопка всегда активна, ошибки с фокусом |
| `LegalSection` | секции политики |
| `Logo`, `Button`, `Input` | общие |

## Админка (`/admin`)

| Компонент | Роль |
|-----------|------|
| `AdminHeader` | марка, витрина, выход |
| `AdminLoginForm` | вход |
| `AdminDashboard` | вкладки Заказы / Витрина |
| `AdminOrderCard` | заказ, статус, WhatsApp |
| `AdminNewOrderSheet` | новый заказ |
| `AdminOfferRow` | цена, наличие, «на сайте», удаление |
| `AdminNewProductSheet` | новая позиция и фото |
| `AdminSheet` | нижняя шторка / центральное окно |

Подробности: [ADMIN.md](ADMIN.md).

## Не смонтированы

Есть в `src/`, на `/` и в layout не подключены. Не описывать их как живые фичи:

`Hero`, `HomeHero`, `Categories`, `FragranceQuiz`, `Bestsellers`, `Hits`, `NewArrivals`, `Collections`, `Blog`, `Newsletter`, `DiscoverySets`, `HowItWorksStrip`, `TrustRow`, `FormatTiles`, `FragranceAnalysis`, `SimilarPerfumes`, `FragranceComparison`, `AIConsultant`, `PerfumeBottle`, `PerfumeNotes`, `CharacterBars`, `CursorFollower`, `PageTransition`, `TransitionOverlay`, `CheckoutModal`.

`AIConsultant` — mock, обещает квиз, советует чужие SKU. По целевому состоянию не включать, пока ответы не идут только из каталога.

`SimilarPerfumes` на PDP не висит — см. [BACKLOG.md](BACKLOG.md).
