# Digital Boutique — Perfume E-Commerce

Next.js 16 магазин нишевой парфюмерии с премиальным дизайном, интерактивным подбором ароматов и системой избранного.

## Стек

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Lucide React
- Puppeteer (скриншоты)

## Запуск

```bash
npm install
npm run dev      # localhost:3000
npm run build    # продакшен-сборка
npm run lint     # проверка кода
```

## Структура

```
src/
  app/
    layout.tsx      — корневой лейаут, шрифты, провайдеры
    page.tsx        — главная страница, сборка всех секций
    globals.css     — тема, шумовые оверлеи, базовые стили
  components/
    layout/
      Navbar.tsx    — фиксированная шапка, мобильное меню
      Footer.tsx    — подвал
    sections/
      Hero.tsx         — главный экран с CTA
      Categories.tsx   — грид категорий
      FragranceQuiz.tsx — 4-шаговый квиз подбора
      Catalog.tsx      — каталог с фильтрами и сортировкой
      Bestsellers.tsx  — хиты продаж
      NewArrivals.tsx  — новинки
      Collections.tsx  — thematic подборки
      Stories.tsx      — отзывы покупателей
      SimilarPerfumes.tsx — рекомендации по духу
      FragranceAnalysis.tsx — пирамида нот + характеры
      Blog.tsx         — журнал (заглушки)
      Newsletter.tsx   — подписка
      DiscoverySets.tsx — наборы пробников
    ui/
      PerfumeBottle.tsx     — SVG-флакон
      ProductCard.tsx       — карточка товара
      PerfumeNotes.tsx      — интерактивные ноты
      CharacterBars.tsx     — полосы характеристик
      FragranceComparison.tsx — сравнение двух ароматов
      AIConsultant.tsx      — AI-консультант (mock)
      CursorFollower.tsx    — курсор-след
      FavoritesProvider.tsx — контекст избранного/сравнения
      TransitionOverlay.tsx — переходы
      PageTransition.tsx    — анимации страницы
  lib/
    data.ts           — 30 ароматов, категории, квиз
  scripts/
    screenshot.mjs    — Puppeteer скриншоты секций
```
