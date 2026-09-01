# Данные

## Ассортимент

Пакетный состав витрины: `src/lib/inventory.ts`.

Тип строки — `InventoryItem`: бренд, название, пол, опционально `hit`, `section` (`razliv` | `raspiv`), `pricePerMl`, `tags`, `image`.

Разлив без своей цены получает `800 ₸` за 1 мл (`RAZLIV_PRICE_PER_ML` в `data.ts`). Распив задаёт свою цену за мл.

`src/lib/data.ts` собирает локальный массив `perfumes` из inventory — для тестов и seed. Живая витрина идёт из Supabase (`src/lib/catalog.ts` → `toPerfumeCard`).

Админка пишет в те же таблицы `products` / `offers` (и Storage). Это второй источник. `npm run seed:push` не мержит его с inventory, а выключает всё лишнее. Новую позицию со стойки после стабилизации лучше занести в `inventory.ts`.

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

На карточке сетки `isBestseller` / «хит» не рисуется. `isNew` — бейдж, если выставлен в данных.

Один product может иметь два offer (как Red Tobacco).

## Заказ

`OrderPayload` с сайта: `clientRequestId`, `customerName`, `phone`, `acceptedLegal`, `items[]` (`offerId`, `volumeMl` 5|10|20, `quantity`).

В `orders`:

- `order_number` (`LM-` + 8 символов id)
- `customer_name`, `phone_e164`
- `items` (jsonb, серверные цены)
- `total_tenge`, `status` (`new` | `confirmed` | `paid` | `completed` | `cancelled`)
- `client_request_id`
- `legal_accepted_at`
- `telegram_sent`

Колонка `city` в миграции есть, форма её не шлёт.

Админский заказ: тот же снимок состава, `telegram_sent: true` без отправки в бот, согласие проставляется датой создания.

## Клиентское хранилище

| Ключ | Что |
|------|-----|
| `lumira-cart` | корзина |
| `lumira-favorites` | избранное |
| `lumira-compare` | сравнение (ключ пишется, экрана нет) |

Старые ключи `essence-*` при чтении мигрируются.

## Юридические плейсхолдеры

В `src/lib/constants.ts`: `LEGAL_OPERATOR_NAME`, `LEGAL_OPERATOR_IDN`. Пока не подставлять выдуманный ИП. Оферта на сайте — заглушка «в процессе подготовки». Политика описывает текущие сервисы (Supabase eu-central-1, Vercel, WhatsApp, Telegram).

## Точка и контакты

Павлодар, Н. Назарбаева 283/1, 10:00–20:00, WhatsApp из `constants.ts`.
