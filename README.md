# Lumira Parfume

Интернет-магазин оригинальной парфюмерии по миллилитру.

Поддерживаются форматы **разлив** и **распив** с объёмами 5 / 10 / 20 мл. Заказ оформляется через сайт и отправляется в WhatsApp. Оплата через Kaspi после подтверждения заказа.

Каталог и заказы работают через Supabase.

## Стек

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase
  - каталог
  - offers
  - заказы
  - RLS
- WhatsApp для оформления заказа
- Telegram для уведомлений

## Быстрый запуск

```bash
npm install
cp .env.example .env.local
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

Переменные — в `.env.example`. Для канонического URL в production задайте `NEXT_PUBLIC_SITE_URL` (например `https://ваш-домен.kz`).

## Скрипты

<table>
<thead>
<tr>
<th>Команда</th>
<th>Что делает</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>npm run dev</code></td>
<td>Запускает локальный сервер</td>
</tr>
<tr>
<td><code>npm run build</code></td>
<td>Создаёт production-сборку</td>
</tr>
<tr>
<td><code>npm run lint</code></td>
<td>Запускает ESLint</td>
</tr>
<tr>
<td><code>npm run typecheck</code></td>
<td>Запускает <code>tsc --noEmit</code></td>
</tr>
<tr>
<td><code>npm test</code></td>
<td>Заказы, ассортимент, поиск, фильтры, подписи админки</td>
</tr>
<tr>
<td><code>npm run seed:sql</code></td>
<td>Пересобирает SQL-миграцию каталога из <code>inventory.ts</code></td>
</tr>
<tr>
<td><code>npm run seed:push</code></td>
<td>Синхронизирует каталог Supabase с <code>inventory.ts</code></td>
</tr>
<tr>
<td><code>npm run seed:images</code></td>
<td>Загружает изображения товаров в Supabase Storage</td>
</tr>
</tbody>
</table>

> ⚠️ **Важно:** `npm run seed:push` изменяет живой каталог Supabase.
> Перед запуском убедитесь, что `src/lib/inventory.ts` содержит актуальный ассортимент.

## Каталог

Пакетный состав для сида:

```text
src/lib/inventory.ts
```

Живая витрина читается из Supabase. Стойка может менять офферы в админке без правки файла.

После изменения ассортимента:

```bash
npm test
npm run seed:push
```

`seed:push` выключает все products/offers, затем upsert из `inventory.ts`. Снятую позицию лучше затем удалить из базы, иначе она останется скрытой строкой.

Позиции, заведённые **только в админке**, в `inventory.ts` не попадают. Повторный `seed:push` их выключит, пока строку не добавят в файл. Подробнее: [docs/ADMIN.md](docs/ADMIN.md), [docs/DATA.md](docs/DATA.md).

На витрине считаются **карточки (офферы)**. Один аромат в разливе и распиве — две карточки.

В сетке каталога — фото, формат, цена и объём 5/10/20. **В корзину** только на странице аромата (`/perfume/[slug]`).

Поиск: название, бренд, ноты. В подсказках только название. Клик по подсказке фильтрует сетку, не открывает PDP.

Фильтры (пол, бренд, цена, наличие, формат, сортировка) меняются локально и пишут URL без повторной загрузки каталога.

Тема только светлая.

## Структура проекта

```text
src/
├── app/                 # страницы и маршруты Next.js
├── components/          # UI-компоненты
│   ├── layout/
│   └── sections/
├── lib/
│   ├── inventory.ts     # пакетный состав для seed
│   ├── catalog.ts       # чтение живого каталога из Supabase
│   ├── admin.ts         # статусы и время заказов в админке
│   ├── catalog-filter.ts
│   ├── search.ts
│   └── ...
├── proxy.ts             # сессия Supabase и middleware-логика
└── instrumentation.ts   # runtime instrumentation
```

## Страницы

<table>
<thead>
<tr>
<th>Путь</th>
<th>Назначение</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>/</code></td>
<td>Каталог и фильтры</td>
</tr>
<tr>
<td><code>/perfume/[slug]</code></td>
<td>Карточка аромата</td>
</tr>
<tr>
<td><code>/favorites</code></td>
<td>Избранное</td>
</tr>
<tr>
<td><code>/checkout</code></td>
<td>Оформление заказа</td>
</tr>
<tr>
<td><code>/how-it-works</code></td>
<td>Как работают разлив и распив</td>
</tr>
<tr>
<td><code>/admin</code></td>
<td>Админ-панель</td>
</tr>
<tr>
<td><code>/legal/oferta</code></td>
<td>Оферта (пока заглушка: в подготовке)</td>
</tr>
<tr>
<td><code>/legal/privacy</code></td>
<td>Политика конфиденциальности</td>
</tr>
</tbody>
</table>

`/catalog` редиректит на `/` с сохранением query-параметров.

Доступ к `/admin` ограничен аккаунтами из `ADMIN_EMAILS`. Что умеет стойка: [docs/ADMIN.md](docs/ADMIN.md). Что ещё не доделано: [docs/BACKLOG.md](docs/BACKLOG.md).

## Документация

Оглавление: [docs/INDEX.md](docs/INDEX.md). Админка: [docs/ADMIN.md](docs/ADMIN.md). Недоделки: [docs/BACKLOG.md](docs/BACKLOG.md).

Код — источник истины о текущем устройстве. [docs/Lumira-Target-State.md](docs/Lumira-Target-State.md) — целевой UX, не снимок файлов.
