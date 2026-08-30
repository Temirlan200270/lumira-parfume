# Данные

## Ассортимент

Источник состава витрины: `src/lib/inventory.ts`.

Тип строки — `InventoryItem`: бренд, название, пол, опционально `hit`, `section` (`razliv` | `raspiv`), `pricePerMl`, `tags`, `image`.

Разлив без своей цены получает `800 ₸` за 1 мл (`RAZLIV_PRICE_PER_ML` в `data.ts`). Распив задаёт свою цену за мл.

`src/lib/data.ts` собирает локальный массив `perfumes` из inventory — для тестов и seed. Живая витрина идёт из Supabase (`src/lib/catalog.ts` → `toPerfumeCard`).

Не храните в доках полный список SKU: он меняется. Смотрите inventory и тесты `src/lib/inventory.test.ts`.

## Perfume (карточка на витрине)

Поля, которыми реально пользуется UI:

- `id` — id оффера
- `offerId`, `productId`, `slug`
- `name`, `brand`, `gender`
- `section` — `razliv` | `raspiv`
- `price`, `pricePerMl`
- `image`
- `isBestseller`, `isNew`, `isInStock`, `isOriginal`
- `notes`, `tags`, `description` — если заполнены в notes/display продукта

Один product может иметь два offer (как Red Tobacco).

## Заказ

`OrderPayload`: `clientRequestId`, `customerName`, `phone`, `acceptedLegal`, `items[]` (`offerId`, `volumeMl` 5|10|20, `quantity`).

В `orders`:

- `customer_name`, `phone_e164`
- `items` (jsonb, серверные цены)
- `total_tenge`, `status`
- `legal_accepted_at` — факт согласия
- `telegram_sent`

## Клиентское хранилище

| Ключ | Что |
|------|-----|
| `lumira-cart` | корзина |
| `lumira-favorites` | избранное |
| `lumira-compare` | сравнение (код есть, на витрине не ведущее) |

Старые ключи `essence-*` при чтении мигрируются.

## Юридические плейсхолдеры

В `src/lib/constants.ts`: `LEGAL_OPERATOR_NAME`, `LEGAL_OPERATOR_IDN`. Пока не подставлять выдуманный ИП. Оферта на сайте — заглушка «в процессе подготовки». Политика описывает текущие сервисы (Supabase eu-central-1, Vercel, WhatsApp, Telegram).

## Точка и контакты

Павлодар, Н. Назарбаева 283/1, 10:00–20:00, WhatsApp из `constants.ts`.
