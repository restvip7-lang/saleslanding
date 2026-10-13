# saleslanding — шаблон продающего сайта для объекта недвижимости

Один шаблон, много объектов. Каждый объект — папка `properties/<id>/` с `property.json` и фото. Сайт собирается Node-скриптом без зависимостей, форма и трекинг идут через Vercel serverless (`/api`).

## Новый объект за 10 минут
1. Скопируйте `properties/sales1` в `properties/sales2`, замените `property.json` и фото (`photos/`). Оригиналы кладите в `source/`.
2. Локально: `PROPERTY=sales2 node build.mjs`, результат в `dist/`.
3. Vercel: новый проект из этого репозитория, переменная `PROPERTY=sales2`, домен `sales2.домен.ru` (CNAME на Vercel).
4. В `property.json` поставьте `"noindex": false`, когда готовы к индексации, и укажите настоящий `domain`.

## Переменные окружения (Vercel → Settings → Environment Variables)
| Имя | Назначение |
|---|---|
| `PROPERTY` | id объекта (папка в `properties/`) |
| `TELEGRAM_BOT_TOKEN` | токен бота от @BotFather |
| `TELEGRAM_CHAT_ID` | чат/группа, куда падают заявки |
| `TELEGRAM_LOG_CHAT_ID` | (необязательно) отдельный чат для лога кликов, иначе тот же |
| `TRACK_VIEWS=1` | (необязательно) слать в лог каждый новый визит |
| `DRY_RUN=1` | не отправлять в Telegram, писать в логи (для тестов) |

## Трекинг
`src/tracking.js` создаёт `visit_id` (cookie `sl_vid`, 90 дней) и сохраняет UTM, `yclid`/`gclid`/`fbclid`, referrer, устройство (first и last touch).
События уходят в Яндекс.Метрику (`reachGoal`), GA4, Meta Pixel, VK Pixel и в `/api/track`. ID счётчиков заполняются в `property.json → analytics`, пустой ID отключает систему.
В Telegram-лог попадают клики WhatsApp/Telegram/звонок/маршрут и отправка формы, каждый с `visit_id` и источником. Ссылки WA/TG содержат код визита, менеджер видит его в переписке.

Цели для Метрики (создайте «JavaScript-событие»): `form_submit`, `click_whatsapp`, `click_whatsapp_bar`, `click_whatsapp_lead`, `click_whatsapp_thanks`, `click_telegram*`, `click_phone`, `click_phone_bar`, `form_start`, `calc_use`, `gallery_open`, `scroll_50`, `time_30s`.

## Заявки
Форма → `POST /api/lead` → сообщение в Telegram. Защита: honeypot, лимит запросов, валидация телефона `+7XXXXXXXXXX`. После отправки показываются кнопки WA/TG для быстрой связи.

## Локальный запуск
`PROPERTY=sales1 node build.mjs`, затем любой статический сервер для `dist/`. API проверяется на Vercel (`vercel dev`) или вызовом обработчиков из `api/` с `DRY_RUN=1`.

## Медиа
Фото лежат в репозитории (`photos/`, желательно webp ≤ 300 КБ, 1600 px). Видео не коммитьте: вставляйте embed-ссылку в `video.embed`.
