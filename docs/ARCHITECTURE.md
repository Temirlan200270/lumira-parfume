# Архитектура

Next.js 16 App Router. Главная и PDP — `force-dynamic`: каталог читается из Supabase на запрос. Один fetch на рендер за счёт `cache()` в `getCatalogResult`.

## Layout

```
RootLayout
├── html (ru)
├── body (min-h-screen)
│   ├── script          # сбрасывает старый lumira-theme из localStorage
│   ├── ToastProvider
│   ├── FavoritesProvider
│   ├── CartProvider
│   └── SearchProvider
│       └── flex min-h-screen flex-col
│           └── StoreChrome
│               ├── /admin → только {children} (свой AdminHeader внутри страницы)
│               └── остальной сайт:
│                   ├── Navbar           # fixed
│                   ├── StoreFrame       # flex-1, отступ под шапку и BottomNav
│                   │   └── {children}
│                   ├── CartDrawer
│                   ├── SearchOverlay
│                   ├── BottomNav        # mobile, кроме /checkout и /admin
│                   └── Footer
```

Главная (`/`): `Catalog` + `Stories`. Остальные лендинг-секции (Hero, квиз, blog, newsletter) в репозитории есть, на страницу не вешаются.

На мобиле в Navbar — логотип и лупа. Избранное, корзина и WhatsApp — в `BottomNav`. На `lg+` они снова в шапке.

## Каталог

1. Пакетный состав витрины — `src/lib/inventory.ts`.
2. `npm run seed:push` деактивирует **все** products/offers, затем upsert из inventory.
3. Админка может добавить, скрыть, снять с наличия или удалить оффер без правки файла. Такие строки **не** в inventory; следующий `seed:push` их выключит.
4. Витрина читает только активный product + активный offer.
5. `npm run seed:images` кладёт фото в bucket `product-images` и пишет `image_url`. Админка грузит фото в тот же bucket при «Добавить позицию».

Счётчик «N ароматов» считает **офферы** (карточки), не уникальные названия.

В сетке нет кнопки «В корзину» — только PDP.

## Фильтры и поиск

Состояние фильтров живёт в клиенте (`Catalog.tsx`). URL обновляется через `history.replaceState`, без `router.replace` — иначе `force-dynamic` страница снова качает каталог на каждый клик.

Читаются query-параметры: `q`, `format`, `gender`, `brand`, `stock`, `min`, `max`, `sort`.

Правила фильтра — `src/lib/catalog-filter.ts`. Поиск — `src/lib/search.ts` (название, бренд, ноты). В подсказках только название; клик фильтрует сетку.

На мобиле шторка фильтров — **черновик**: сетка не меняется, пока не нажмут «Показать N». Крестик и фон отбрасывают черновик. Сортировка и табы формата на десктопе применяются сразу; сетка через `useDeferredValue`.

Лупа в шапке открывает `SearchOverlay` (на главной тот же поиск, что в каталоге).

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

Заказ со стойки идёт через server action `createAdminOrder`, без Telegram и без требования «на сайте / в наличии». См. [ADMIN.md](ADMIN.md).

## Auth и admin

`src/proxy.ts` обновляет сессию Supabase. `/admin` только для email из `ADMIN_EMAILS`. Публичная регистрация в Supabase Auth должна быть выключена.

Server actions админки принимают фото до 6 МБ (`next.config.ts` → `experimental.serverActions.bodySizeLimit`). Bucket режет 5 МБ и типы jpeg/png/webp.

## Тема

Только светлая. Переключателя нет.
