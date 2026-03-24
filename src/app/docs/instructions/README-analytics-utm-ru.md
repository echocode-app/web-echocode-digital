# Analytics, Метрики и UTM Guide

### Назначение

Этот документ объясняет:

- как работает аналитика в проекте
- как формируются метрики в админке
- как работает UTM-атрибуция
- какую tagged-ссылку ставить в каждый канал для `echocode.digital` и `echocode.app`

### Основные страницы в админке

- аналитика `.digital`: `/admin/dashboard`
- аналитика `.app`: `/admin/echocode-app`
- готовые UTM-ссылки: `/admin/info/utm`

### Высокоуровневый flow аналитики

1. Пользователь открывает страницу на `echocode.digital` или `echocode.app`.
2. Публичный фронтенд отправляет событие просмотра страницы в `/api/analytics/page-view`.
3. В запрос включаются:
   - `siteId`
   - `siteHost`
   - `referrer`
   - сохраненная first-touch атрибуция, если она есть
4. Бэкенд определяет, к какому сайту относится запрос.
5. Бэкенд записывает analytics events в Firebase / Firestore в коллекцию `analytics_events`.
6. Админские дашборды агрегируют эти события и показывают KPI, трафик по срезам, referrer, долю UTM source, top pages, geography и lead-метрики.

### Как работает аналитика форм и лидов

Аналитика в проекте это не только page views.

Проект также передает analytics context вместе с публичными формами, включая:

- email submissions
- vacancy submissions
- client-project submissions

Это значит, что лиды можно связать с исходным first-touch UTM source, если атрибуция была сохранена.

### Как формируются метрики

Дашборды используют analytics и submissions-данные, чтобы строить метрики вроде:

- page views
- top pages
- countries / geography
- доля referrer и UTM source
- объем лидов по источникам
- примерная conversion, если page-view и lead данные можно сопоставить
- активность по vacancy leads

Важно:

- метрики `.digital` изолированы под `siteId = echocode_digital`
- метрики `.app` изолированы под `siteId = echocode_app`

То есть трафик и лиды двух сайтов намеренно разделены.

### Как работает UTM

Проект использует модель first-touch attribution.

Поддерживаемые параметры:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

Пример:

`https://www.echocode.digital/?utm_source=linkedin&utm_medium=social&utm_campaign=digital_outreach`

### Принцип first-touch

- При первом заходе, где есть `utm_source`, атрибуция сохраняется в `localStorage` браузера
- Ключ хранения: `echocode_attribution`
- Уже сохраненная атрибуция не перезаписывается
- Сохраненная атрибуция потом переиспользуется для page-view и lead events

На практике это значит:

- если пользователь впервые пришел из LinkedIn, этот источник может быть привязан и к более поздней отправке формы
- если команда открывает tagged-ссылки внутри компании, аналитика загрязняется

### Правила именования UTM

- Всегда передавайте полную tagged-ссылку
- Держите единый нейминг для каждого канала
- Используйте разные значения `campaign` для разных размещений, которые хотите сравнивать
- Не смешивайте social, paid, referral, marketplace и outbound traffic под одним `medium`
- Не открывайте маркетинговые ссылки много раз из внутренних чатов, QA и браузеров команды

### Таблица каналов для двух сайтов

| Канал                | Что ставить для `echocode.digital`                                                                       | Что ставить для `echocode.app`                                                                     | Минимальная рекомендация                                                                                                                   |
| -------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| LinkedIn             | `https://echocode.digital/?utm_source=linkedin&utm_medium=social&utm_campaign=digital_outreach`          | `https://echocode.app/?utm_source=linkedin&utm_medium=social&utm_campaign=app_founder_post`        | Для агентских услуг ведем на `.digital`, для продуктового контента и роста приложения на `.app`.                                           |
| Instagram            | не основной preset для `.digital` в текущем наборе                                                       | `https://echocode.app/?utm_source=instagram&utm_medium=social&utm_campaign=app_profile_link`       | В основном использовать для `.app`; для `.digital` делать отдельную ссылку только если Instagram реально используется как агентский канал. |
| Telegram             | не основной preset для `.digital` в текущем наборе                                                       | `https://echocode.app/?utm_source=telegram&utm_medium=community&utm_campaign=app_channel_post`     | Использовать для founder/community постов; Telegram лучше держать отдельно как `community`.                                                |
| Upwork               | `https://echocode.digital/?utm_source=upwork&utm_medium=marketplace&utm_campaign=digital_profile`        | не рекомендуется как основной канал для `.app`                                                     | Использовать только для агентских лидов и сервисного трафика.                                                                              |
| Freelancehunt        | `https://echocode.digital/?utm_source=freelancehunt&utm_medium=marketplace&utm_campaign=digital_profile` | не рекомендуется как основной канал для `.app`                                                     | Использовать только для агентского трафика из маркетплейсов.                                                                               |
| Email signature      | `https://echocode.digital/?utm_source=email&utm_medium=outbound&utm_campaign=digital_signature`          | не основной preset                                                                                 | Подходит для подписей founder, sales и partnership писем; не смешивать с cold outreach.                                                    |
| Cold email           | `https://echocode.digital/?utm_source=cold_email&utm_medium=outbound&utm_campaign=digital_outreach`      | не основной preset                                                                                 | Использовать, когда нужно отдельно видеть прямой outbound email.                                                                           |
| Partner referral     | `https://echocode.digital/?utm_source=partner&utm_medium=referral&utm_campaign=digital_partner_referral` | не основной preset                                                                                 | Использовать для партнерских и теплых рекомендаций; не смешивать с email и social.                                                         |
| Clutch               | `https://echocode.digital/?utm_source=clutch&utm_medium=marketplace&utm_campaign=digital_profile`        | не рекомендуется как основной канал для `.app`                                                     | Использовать для агентского discovery и review-platform трафика.                                                                           |
| Behance              | `https://echocode.digital/?utm_source=behance&utm_medium=portfolio&utm_campaign=digital_showcase`        | не основной preset                                                                                 | Лучший вариант для design showcase трафика на агентский сайт.                                                                              |
| Dribbble             | `https://echocode.digital/?utm_source=dribbble&utm_medium=portfolio&utm_campaign=digital_showcase`       | не основной preset                                                                                 | Использовать для дизайн-портфолио трафика; не смешивать с social-каналами.                                                                 |
| Meta Ads             | `https://echocode.digital/?utm_source=meta&utm_medium=paid_social&utm_campaign=digital_lead_ads`         | `https://echocode.app/?utm_source=meta&utm_medium=paid_social&utm_campaign=app_meta_acquisition`   | Сначала определить цель кампании: service leads идут на `.digital`, product acquisition на `.app`.                                         |
| Influencer / Creator | не основной preset                                                                                       | `https://echocode.app/?utm_source=influencer&utm_medium=paid_social&utm_campaign=app_creator_drop` | Лучший вариант для creator-driven app кампаний; если нужно сравнение, разделять кампании по креаторам.                                     |
| Product Hunt         | не рекомендуется как основной канал для `.digital`                                                       | `https://echocode.app/?utm_source=producthunt&utm_medium=community&utm_campaign=app_launch`        | Использовать только для продуктового launch flow.                                                                                          |
| X / Twitter          | не основной preset                                                                                       | `https://echocode.app/?utm_source=x&utm_medium=social&utm_campaign=app_thread`                     | Хорошо подходит для founder-led product контента и launch thread.                                                                          |
| Reddit               | не основной preset                                                                                       | `https://echocode.app/?utm_source=reddit&utm_medium=community&utm_campaign=app_community_post`     | Использовать только для трафика из конкретных subreddit/community обсуждений.                                                              |
| YouTube              | не основной preset                                                                                       | `https://echocode.app/?utm_source=youtube&utm_medium=video&utm_campaign=app_video`                 | Подходит для описаний видео, интеграций и launch explainers.                                                                               |
| Newsletter           | не основной preset                                                                                       | `https://echocode.app/?utm_source=newsletter&utm_medium=email&utm_campaign=app_feature`            | Использовать для упоминаний продукта в рассылках и дайджестах.                                                                             |

### Минимальные рекомендации по каналам

- LinkedIn: базовый сильный канал и для B2B agency traffic, и для founder-led app announcements.
- Upwork / Freelancehunt / Clutch: использовать только для `echocode.digital`.
- Behance / Dribbble: вести трафик на `echocode.digital`, потому что это agency и portfolio intent.
- Product Hunt / Reddit / X / YouTube / creator campaigns: в основном использовать для `echocode.app`.
- Meta Ads: сначала определить цель кампании; сервисные лиды идут на `.digital`, продуктовый рост на `.app`.
- Email signature и cold email лучше держать отдельно, потому что у них разное намерение и разное качество трафика.
- Если канал используется редко, не стоит придумывать слишком много новых campaign names; сначала держать стабильный нейминг.

### Практическое правило

Если есть сомнение:

- agency/service traffic вести на `echocode.digital`
- product/app acquisition traffic вести на `echocode.app`

Если один канал может вести на оба сайта, нужно использовать разные tagged URL для каждого назначения и сравнивать их отдельно в админке.
