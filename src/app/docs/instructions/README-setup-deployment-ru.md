# Сетап и развертывание сайта

## Основная информация

- Проект: `echocode-newsite`
- Production: `https://www.echocode.digital/`
- Preview / development deploy: `https://echocode-newsite.vercel.app/`
- Требуемая версия Node.js: `20.19.6`
- Требуемая версия npm: `11.7.0`

## Домены и окружения

### Основные домены этого проекта

- Публичный client-facing сайт: `https://www.echocode.digital/`
- Vercel preview / development deploy: `https://echocode-newsite.vercel.app/`

И публичный маркетинговый сайт, и админка живут под одним доменом `echocode.digital`.

Примеры:

- публичный сайт: `https://www.echocode.digital/`
- админка: `https://www.echocode.digital/admin/...`

Домен резолвится внутри проекта как основной site slice: `siteId = echocode_digital`.

## Локальный сетап

1. Склонируйте репозиторий.
2. Установите зависимости:

```bash
npm ci
```

3. Настройте переменные окружения.
4. Запустите проект локально:

```bash
npm run dev
```

5. Откройте локальный сайт в браузере.

## Основные команды

```bash
npm run dev
npm run build
npm run start
npm run typecheck
npm run lint
npm run openapi:lint
npm run check
```

## Обязательные переменные окружения

### Серверные Firebase / app config

- `NODE_ENV`
- `DEVELOPER_ACCESS_MODE`
- `API_VERSION`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_CHECK_STORAGE`
- `INTERNAL_FIREBASE_CHECK_ENABLED`
- `ADMIN_BOOTSTRAP_EMAILS`

Важно: если используются Firebase credentials через env, то `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` и `FIREBASE_PRIVATE_KEY` должны быть заданы вместе.

### Клиентские Firebase-переменные

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Опциональные client-side переменные:

- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`

## Проверки перед коммитом

Выполнить:

```bash
npm run check
```

Если менялись Firebase Rules, также выполнить:

```bash
npm run test:firestore:rules
npm run test:storage:rules
```

## Внутренняя проверка Firebase

Для non-production окружений доступность Firebase можно проверить так:

```bash
curl http://localhost:3000/api/internal/firebase-check
```

Эта проверка управляется флагом `INTERNAL_FIREBASE_CHECK_ENABLED`.

## Техническая архитектура

### Высокоуровневая связь между админкой, backend, Firebase и сайтом

- Публичный сайт построен на Next.js.
- Админка является частью того же приложения и находится под `/admin`.
- Действия из админки проходят через защищенные серверные маршруты `/api/admin/...`.
- Серверный слой использует Firebase Admin SDK для безопасного доступа к Firestore и Firebase Storage.
- Публичный сайт читает данные через backend-логику приложения и рендерит результат для посетителей.

### Модель деплоя через Vercel

- Этот репозиторий деплоится в Vercel.
- Vercel preview deployments используются для проверки веток и QA.
- Preview hostname этого проекта: `echocode-newsite.vercel.app`, а branch preview могут использовать и производные Vercel preview host.
- Production traffic основного сайта маршрутизируется на custom domains, привязанные к этому проекту.

На практике это значит:

- preview / branch verification проходит на Vercel preview URL
- production public traffic идет на `echocode.digital`
- admin-операции открываются через `https://www.echocode.digital/admin/...`

### Структура доменов: публичный сайт и админка

Публичный маркетинговый сайт и админка живут на одном домене:

- `echocode.digital` = публичный marketing / client website и admin entry под `/admin`

### Client-side и server-side использование Firebase

- Client-side Firebase config используется в основном для browser-side auth в админке.
- Server-side Firebase credentials используются для доверенных операций чтения и записи admin-данных.
- Чувствительные write-операции должны выполняться на сервере, а не напрямую из анонимного браузерного клиента.

### Типовой flow обновления контента

1. Администратор логинится.
2. Админка отправляет авторизованный запрос.
3. Сервер валидирует admin token и permissions.
4. Сервер читает или записывает данные в Firestore / Storage.
5. Обновленные данные становятся доступны публичному сайту при следующем fetch / render cycle.

### Основные роли Firebase в проекте

- Firestore: admin-контент, moderation-данные, dashboard aggregation, vacancy settings, portfolio metadata
- Storage: загруженные файлы и изображения
- Firebase Auth: проверка личности администратора
- Firebase Rules: границы client-side доступа

### Связь с отдельным проектом `.app`

У этого репозитория также есть server-side связь с внешним проектом `echocode.app`.

Важно:

- `echocode.app` рассматривается как отдельный site slice: `siteId = echocode_app`
- хосты `echocode.app`, `www.echocode.app` и `web-echocode-app.vercel.app` резолвятся в `.app` slice
- трафик `.app`, page views и form/submission analytics намеренно отделены от `.digital`
- в админке этого репозитория есть отдельный раздел аналитики и submissions для `.app` по адресу `/admin/echocode-app`

Это значит, что текущий проект является не только сайтом `.digital` и его админкой, но и частью общего admin / analytics backend surface для продукта `.app`.

### Практическое резюме архитектуры

- публичный сайт `.digital`: client-facing marketing site
- домен `.cloud`: operational/admin доступ к этому же проекту
- сайт `.app`: отдельный внешний продуктовый сайт
- Firebase + shared admin backend: общий слой данных и аналитики, который позволяет админке видеть и обслуживать оба slice из одной системы

### Важное правило реализации

При документировании, отладке и расширении проекта серверный API layer нужно рассматривать как основной контракт между admin UI и Firebase.

## Flow веток и развертывания

- `main` = production-ветка
- `develop` = preview / QA-ветка
- работа по задаче начинается от `main` в отдельной task-ветке

Обязательный порядок:

1. Создать task-ветку от `main`.
2. Реализовать изменение.
3. Прогнать локальные проверки.
4. Слить task-ветку в `develop` для preview deploy и QA.
5. После подтверждения промоутнуть проверенное состояние из `develop` в `main`.

## Правила деплоя

- Нельзя пушить случайные или непроверенные изменения в `main`.
- `main` используется только для подтвержденных production-ready изменений.
- Перед промоутом в `main` изменения должны быть проверены на `develop`.

## Правило для lockfile

Если меняется `package.json`, нужно также обновить `package-lock.json`.

Если Husky блокирует commit, потому что `package-lock.json` не добавлен в staged:

```bash
npm install
git add package-lock.json
```

После этого повторить commit.
