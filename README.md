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

## Деплой на Vercel (пошагово)
1. vercel.com → **Add New → Project** → выберите репозиторий `restvip7-lang/saleslanding`. Ветка: `claude/epic-lamport-rnug2b` (позже можно переключить на `main`).
2. **Framework Preset: Other.** Остальное уже задано в `vercel.json` (`node build.mjs`, папка `dist`), менять ничего не нужно.
3. **Environment Variables** до первого запуска:
   - `TELEGRAM_BOT_TOKEN`: токен бота от @BotFather;
   - `TELEGRAM_CHAT_ID`: чат или группа для заявок (бота нужно добавить в чат);
   - `TELEGRAM_LOG_CHAT_ID`: необязательно, отдельный чат для лога кликов;
   - `SITE_ORIGIN`: адрес сайта без слеша в конце, например `https://sales1.example.ru` (для canonical, sitemap и og).
4. Нажмите **Deploy**. Через минуту сайт будет доступен на адресе `*.vercel.app`.
5. **Домен:** Project → Settings → Domains → добавьте `sales1.ваш-домен.ru`, у регистратора пропишите CNAME на значение, которое покажет Vercel.
6. **Проверка после деплоя:** откройте сайт, отправьте тестовую заявку (должна прийти в Telegram с источником и кодом визита), нажмите кнопки WhatsApp/Telegram/звонок (клики должны попасть в лог).
7. **Перед боевым запуском** в `properties/sales1/property.json`: `"noindex": false`, настоящий `domain`, ID счётчиков (`analytics`), реквизиты (`company`), курс евро (`rubRate`), точный адрес (`geo.lat/lng`, `geo.exact: true`).

Если Telegram не настроен, форма отвечает ошибкой и показывает кнопки WhatsApp/Telegram, заявки не «пропадают молча».

## Материалы для менеджеров (/materials)

Скрытая страница с готовыми рекламными картинками (Instagram пост 4:5, Stories и статус 9:16, Telegram 16:9, по два варианта: «Фото и цена» и «Инфографика») и ZIP со всеми файлами. На лендинге ссылки нет, страница закрыта от индексации (`noindex`, `robots.txt`, заголовок `X-Robots-Tag`). Скачивания считаются событиями `download_promo_*`.

Как обновить картинки для объекта (нужен Playwright и Chromium, на Vercel не запускается):

```bash
PROPERTY=sales1 node tools/render-promo.mjs   # properties/sales1/promo/*.png и sales1-promo.zip
PROPERTY=sales1 node build.mjs                # dist/materials.html
```

Данные берутся из `property.json` (название, цена, `infographic`, фото). Шаблоны лежат в `src/render-promo.mjs`, шрифты в `src/promo/fonts/`. Менеджерам отправьте ссылку `https://<домен>/materials`. Перед публикацией проверьте картинки глазами: нет чужих логотипов и водяных знаков, цена актуальна.

## Какая ветка попадает на боевой адрес

Vercel собирает каждый пуш. На боевой адрес (Production) уходит только ветка, указанная в Settings → Git → Production Branch (сейчас `claude/epic-lamport-rnug2b`). Остальные ветки (например, `codex/*`) получают отдельные Preview-адреса. Не нажимайте Promote / «Production rebuild» у деплоя другой ветки: он заменит боевую версию старой сборкой, и страницы вроде `/materials` пропадут (будет 404).
