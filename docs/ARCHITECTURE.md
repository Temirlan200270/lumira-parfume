# Архитектура

Next.js 16 App Router. Главная и PDP — `force-dynamic`: каталог читается из Supabase на запрос. Один fetch на рендер за счёт `cache()` в `getCatalogResult`.

## Layout

```
RootLayout
├── html (ru)
├── body (min-h-screen)
│   ├── script        # сбрасывает старый lumira-theme, если он ещё в localStorage
│   ├── ToastProvider
│   ├── FavoritesProvider
│   ├── CartProvider
│   └── SearchProvider (каталог для оверлея поиска)
│       └── оболочка: flex min-h-screen flex-col
│           ├── Navbar          # fixed, вне потока
│           ├── StoreFrame      # flex-1: отступы + растягивает коротко страницы
│           │   └── {children}
│           ├── CartDrawer
│           ├── SearchOverlay
│           ├── BottomNav       # mobile, кроме /checkout и /admin
│           ├── grain-overlay
│           └── Footer          # внизу viewport, если контента мало; не position:sticky
```

Главная (`/`): `Catalog` + `Stories`. Остальные лендинг-секции (Hero, квиз, blog, newsletter) в репозитории есть, на страницу не вешаются.

## Каталог

1. Состав витрины задаёт `src/lib/inventory.ts`.
2. `npm run seed:push` деактивирует все products/offers, затем upsert строк из inventory.
3. Витрина читает только `is_active = true`.
4. `npm run seed:images` кладёт фото в bucket `product-images` и пишет `image_url`.

Счётчик «N ароматов» считает **офферы** (карточки), не уникальные названия. Red Tobacco — разлив и распив, две карточки.

## Фильтры и поиск

Состояние фильтров живёт в клиенте (`Catalog.tsx`). URL обновляется через `history.replaceState`, без `router.replace` — иначе `force-dynamic` страница снова качает каталог на каждый клик.

Читаются query-параметры: `q`, `format`, `gender`, `brand`, `stock`, `min`, `max`, `sort`.

Правила фильтра — `src/lib/catalog-filter.ts`. Поиск и ранжирование — `src/lib/search.ts` (название, бренд, ноты). В подсказках показывается только название; клик фильтрует сетку, не открывает PDP.

## Заказ

```
Корзина (localStorage lumira-cart)
    → /checkout
    → POST /api/orders
    → таблица orders (имя, телефон, состав, legal_accepted_at)
    → Telegram продавцу
    → ссылка WhatsApp покупателю
```

Без галочки согласия заказ не принимается. Цены считает сервер, клиентские суммы игнорируются.

## Auth и admin

`src/proxy.ts` обновляет сессию Supabase. `/admin` только для email из `ADMIN_EMAILS`. Публичная регистрация в Supabase Auth должна быть выключена.

## Тема

Только светлая. Переключателя нет.
