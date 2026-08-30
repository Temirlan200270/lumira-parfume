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

Необходимые переменные окружения описаны в `.env.example`.

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
<td>Проверяет заказы, ассортимент и поиск</td>
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

Источник правды для состава витрины:

```text
src/lib/inventory.ts
```

После изменения ассортимента:

```bash
npm test
npm run seed:push
```

Каталог синхронизируется с Supabase. Неактуальные позиции деактивируются, а актуальные синхронизируются из `inventory.ts`.

Поиск работает по названию, бренду и нотам. В подсказках показывается только название аромата. Клик по подсказке фильтрует каталог, а не открывает карточку товара.

## Структура проекта

```text
src/
├── app/                 # страницы и маршруты Next.js
├── components/          # UI-компоненты
│   ├── layout/
│   └── sections/
├── lib/
│   ├── inventory.ts     # источник правды ассортимента
│   ├── search.ts        # логика поиска
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
<td>Публичная оферта</td>
</tr>
<tr>
<td><code>/legal/privacy</code></td>
<td>Политика конфиденциальности</td>
</tr>
</tbody>
</table>

`/catalog` редиректит на `/` с сохранением query-параметров.

Доступ к `/admin` ограничен аккаунтами из `ADMIN_EMAILS`.

## Документация

Целевое состояние проекта: [docs/Lumira-Target-State.md](docs/Lumira-Target-State.md).
