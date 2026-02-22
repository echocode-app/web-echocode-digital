# Backend Documentation (Current Iteration)

## Передкомітні перевірки

1. Підтягнути актуальну базову гілку (`main`/`develop`)
2. Перевірити, що env-контракти не зламані (`.env.local`, `src/server/config/env.ts`)
3. Запустити обов'язкову перевірку: `npm run check`
4. Якщо змінювалися API-роути, перевірити локально success/error сценарії
5. Якщо змінювалися auth/permissions/errors, окремо перевірити 400/401/403/500/503 сценарії
6. Якщо змінювалися Firebase Rules (`firestore.rules` / `storage.rules`), перевірити `firebase.json` та deny-by-default політику

- `curl http://localhost:3000/api/health`
- `curl http://localhost:3000/api/internal/firebase-check`
- `curl http://localhost:3000/api/admin/me`

- `curl -i -H "Authorization: Bearer invalid-token" http://localhost:3000/api/admin/me`
- `curl -i -H "Authorization: Bearer valid-token" http://localhost:3000/api/admin/me`

- `npm run test:firestore:rules`
- `npm run test:storage:rules`
- `npm run check`

7. Оновити документацію, якщо змінився контракт API або серверна поведінка
8. Комітити тільки після повністю успішного `npm run check`

## Що вже реалізовано у серверному фундаменті

### Базова серверна структура

Серверний код винесений у чіткі домени:

- `src/server/config` - конфігурація env
- `src/server/firebase` - інтеграція з Firebase Admin SDK
- `src/server/auth` - auth service та role/permission модель
- `src/server/middlewares` - auth/permission guards
- `src/server/lib` - загальні серверні утиліти (response/error/http/validation/pagination/wrappers)
- `src/app/api/*` - route handlers (контролери)

### Firebase Admin SDK

Реалізовано singleton-ініціалізацію Firebase Admin App з підтримкою:

- credentials з env (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`)
- fallback на ADC (Application Default Credentials)
- опціональний Storage bucket

Підключені модулі:

- `Auth`
- `Firestore`
- `Storage`

### Єдина API response-конвенція

Усі endpoint-и повертають стандартизовану форму відповіді:

Успіх:

```json
{
  "success": true,
  "data": {}
}
```

Помилка:

```json
{
  "success": false,
  "error": {
    "code": "SOME_ERROR_CODE",
    "message": "Human-readable public message"
  }
}
```

### Error Catalog + централізована обробка помилок

Є централізований каталог помилок (`API_ERROR_CATALOG`), який визначає:

- canonical error code
- HTTP status
- safe public message

`ApiError.fromCode(...)` застосовує ці правила централізовано.

`handleApiRoute(...)` виконує boundary-обробку:

- нормалізує винятки
- формує стандартизовану error-відповідь
- логує інцидент

### Request tracing (`x-request-id`)

Для кожного API-запиту забезпечується request id:

- береться з вхідного `x-request-id` (якщо валідний)
- або генерується автоматично
- повертається у response header
- потрапляє в error-логи

### `withApi` wrapper (уніфікований pipeline)

Запроваджено `withApi(...)`, який централізує типові кроки обробки запиту:

- request id
- валідація query/body
- auth перевірка
- permission перевірка
- pagination parsing
- єдиний формат response/error

### Admin Auth Firebase ID Token (поточна ітерація)

Реалізовано production-oriented auth flow для адмін API:

- `extractIdToken(request)` витягує токен лише з `Authorization: Bearer <ID_TOKEN>`
- `verifyIdToken(token)` виконує перевірку через Firebase Admin SDK (режим залежить від середовища)
- `requireAuth(...)` повертає нормалізований auth context (`uid`, `email`, `claims`, `role`)
- `admin/me` виконує auth + bootstrap allowlist + permission check у фіксованому порядку:
  спочатку bootstrap ролі (за allowlist), потім перевірка `admin.access`

Environment policy:

- `development`: verification без revocation check (`checkRevoked=false`) для швидкого локального циклу
- `staging/production`: verification з revocation check (`checkRevoked=true`)
- `developer` роль має повний доступ у `development`
- у non-dev режим керується `DEVELOPER_ACCESS_MODE` (`full` або `readonly`, поточний дефолт: `full`)

### Pagination contract

Реалізовано єдиний контракт пагінації:

- підтримка `offset` mode (`page`, `limit`)
- підтримка `cursor` mode (`cursor`, `limit`)
- взаємовиключність cursor/page
- єдина meta-структура для list responses
- додатково створено `withPaginatedApi(...)` для list-endpoint-ів, де pagination гарантовано присутня в контексті handler

## Поточні API endpoint-и

### `GET /api/health`

Призначення: базова liveness-перевірка сервісу.

Повертає:

- статус `ok`
- поточне середовище (`env`)
- timestamp

### `GET /api/internal/firebase-check`

Призначення: внутрішня перевірка доступності Firebase сервісів у non-production середовищі.

Особливості:

- вимкнено в production
- додатково керується env-прапорцем `INTERNAL_FIREBASE_CHECK_ENABLED`
- у `development` доступ без auth (для швидкої локальної діагностики)
- у non-dev додатково вимагає auth + `admin.access`
- Firestore check: write/read/delete smoke cycle
- Storage check опційний через `FIREBASE_CHECK_STORAGE`

### `GET /api/admin/me`

Призначення: повернення server-trusted профілю автентифікованого користувача.

Логіка:

- auth через Firebase ID token
- admin access enforcement через middleware wrapper
- повернення актуального профілю з Firebase Admin SDK

## Auth/Role модель (поточний стан)

- Ролі: `admin`, `developer`, `manager`
- Permissions: централізовані в `ROLE_PERMISSIONS`
- Перевірка прав: `requirePermission(...)`
- `admin` має повний доступ
- `developer` має повний доступ у `development`, а також у non-dev за замовчуванням (`DEVELOPER_ACCESS_MODE=full`)
- для переходу на read-only для `developer` достатньо перемкнути `DEVELOPER_ACCESS_MODE=readonly`
- `manager` має доступ до бізнес-операцій, але без `admin.settings` та `audit.read`

#### API-рівень (RBAC)

| Дія / доступ                                           | Anonymous | Manager | Developer        | Admin |
| ------------------------------------------------------ | --------- | ------- | ---------------- | ----- |
| Доступ до admin API (`admin.access`)                   | ❌        | ✅      | ✅ (`full` mode) | ✅    |
| Операційні write-дії (submissions/vacancies/portfolio) | ❌        | ✅      | ✅ (`full` mode) | ✅    |
| `admin.settings`                                       | ❌        | ❌      | ✅ (`full` mode) | ✅    |
| `audit.read` (логування дій в адмінпанелі)             | ❌        | ❌      | ✅ (`full` mode) | ✅    |

#### Firestore Client SDK rules-рівень

| Ресурс / операція                           | Anonymous | Manager | Developer | Admin |
| ------------------------------------------- | --------- | ------- | --------- | ----- |
| `submissions/{id}` read/write               | ❌        | ❌      | ❌        | ✅    |
| `vacancies/{id}` read (published)           | ✅        | ✅      | ✅        | ✅    |
| `vacancies/{id}` read (draft)               | ❌        | ❌      | ❌        | ✅    |
| `vacancies/{id}` write                      | ❌        | ❌      | ❌        | ✅    |
| `portfolio/{id}` read (published)           | ✅        | ✅      | ✅        | ✅    |
| `portfolio/{id}` read (draft)               | ❌        | ❌      | ❌        | ✅    |
| `portfolio/{id}` write                      | ❌        | ❌      | ❌        | ✅    |
| `_internal_firebase_checks/{id}` read/write | ❌        | ❌      | ❌        | ❌    |

`Anonymous` = неавтентифікований запит (без Firebase ID token). Це публічний відвідувач або будь-який клієнт без валідної авторизації.

## Firestore Rules (finalized for current stage)

Файли реалізації:

- `firestore.rules`
- `firestore.indexes.json`
- `firebase.json`
- `tests/firestore.rules.test.mjs`

Поточна матриця доступів:

- `submissions/{id}`:
- `read/write` тільки для `admin`
- schema validation: required/allowed keys + базова типізація полів
- immutable поля: `formType`, `email`, `source`
- `vacancies/{id}`:
- `read` для `admin` або публічно лише якщо `isPublished == true`
- `write` тільки для `admin`
- immutable поле: `slug`
- `portfolio/{id}`:
- `read` для `admin` або публічно лише якщо `isPublished == true`
- `write` тільки для `admin`
- immutable поле: `slug`
- `_internal_firebase_checks/{id}`: повний deny для client SDK
- fallback `/{document=**}`: deny all

Що перевірено тестами:

- анонімний доступ блокується для чутливих даних (`submissions`, internal collection)
- non-admin не може записувати в `submissions`/`vacancies`/`portfolio`

## Storage Rules (v1 ready for corporate Firebase rollout)

Файли реалізації:

- `storage.rules`
- `firebase.json`
- `tests/storage.rules.test.mjs`

Поточна модель доступу:

- `uploads/portfolio/{projectId}/{fileName}`
- `read`: публічний
- `create`: `admin` / `developer` / `manager`
- `replace/delete`: тільки `admin` / `developer`
- тільки зображення, максимум `5MB`

- `uploads/vacancies/{vacancyId}/{fileName}`
- `read`: публічний
- `create`: `admin` / `developer` / `manager`
- `replace/delete`: тільки `admin` / `developer`
- тільки зображення, максимум `5MB`

- `uploads/submissions/{submissionId}/{fileName}` (CV/файли з форм)
- `read`: тільки staff-ролі (`admin` / `developer` / `manager`)
- `create`: `admin` / `developer` / `manager`
- `replace/delete`: тільки `admin` / `developer`
- тільки документи, максимум `20MB`

- fallback `/{allPaths=**}`: deny all

Обмеження MIME типів:

- images: `jpeg`, `png`, `webp`, `gif`, `avif`, `bmp`, `tiff`, `heic`, `heif`
- documents: `pdf`, `doc`, `docx`, `rtf`, `odt`, `txt`

Що перевірено тестами:

- unauthorized uploads блокуються
- manager може створювати, але не може replace/delete
- admin/developer можуть replace/delete
- size/type restrictions працюють (image `5MB`, docs `20MB`)
- приватність submission файлів та публічність portfolio/vacancy зображень дотримані
- публічне читання дозволене лише для published контенту
- draft контент читається лише `admin`
- invalid schema блокується
- immutable поля не можна змінити

## Validation foundation for Forms Submissions (prepared)

Єдиний контракт валідації:

- `src/shared/validation/submissions.ts` (schema contract)
- `src/server/submissions/validation.ts` (parser + draft builder)

### Project form (`formType = project`)

| Поле            | Обов'язкове | Валідація                                 |
| --------------- | ----------- | ----------------------------------------- |
| `firstName`     | ✅          | 2-20 символів, лише літери/пробіл/`'`/`-` |
| `lastName`      | ✅          | 2-20 символів, лише літери/пробіл/`'`/`-` |
| `email`         | ✅          | валідний email, max 30                    |
| `needs`         | ❌          | якщо передано: 10-1000 символів           |
| `attachment`    | ❌          | один файл, який проходить file schema      |

### Candidate form (`formType = candidate`)

| Поле          | Обов'язкове | Валідація                                        |
| ------------- | ----------- | ------------------------------------------------ |
| `cvFile`      | ✅          | document MIME, max 20MB, safe `uploads/...` path |
| `profileUrl`  | ✅          | валідний `http/https` URL, max 2048              |

### File constraints

| Тип        | MIME                                        | Ліміт   |
| ---------- | ------------------------------------------- | ------- |
| `image`    | `jpeg/png/webp/gif/avif/bmp/tiff/heic/heif` | до 5MB  |
| `document` | `pdf/doc/docx/rtf/odt/txt`                  | до 20MB |

`buildSubmissionDraft(...)` нормалізує payload у стабільну server shape перед записом у БД.

## Forms Submissions (implemented backend scope)

### Project Form Create

- `POST /api/forms/submissions` (public, no auth)
- підтримується `formType = project`; `candidate` поки повертає `NOT_IMPLEMENTED`
- Firestore schema (MVP, `submissions/{docId}`): `formType`, `status`, `contact`, `content`, `attachments`, `createdAt`, `updatedAt`
- success response: `{ success: true, data: { id, status, createdAt } }`

### Project File Upload Flow

- `POST /api/forms/uploads/init` генерує signed `PUT` URL з TTL `10min`
- tmp path format: `uploads/submissions/tmp/<uuid>` (без розширення)
- submit-time verification у `POST /api/forms/submissions`: prefix + object existence + `contentType` + `size` cross-check
- Storage bucket має бути явно заданий через `FIREBASE_STORAGE_BUCKET` (fail-fast без fallback bucket)
- zero-byte files відхиляються і на init-policy, і на verification
- MVP limitations: tmp file лишається фінальним шляхом; orphan tmp files не прибираються автоматично; finalize/move відсутній

### Admin Submissions List

- `GET /api/admin/submissions` (`auth: true`, permission: `submissions.read`)
- pagination strategy: offset (`page`, `limit`) + `count()` для `total/totalPages`
- sorting: тільки `createdAt` (`asc|desc`), optional `status` filter
- response DTO item: `id`, `formType`, `status`, `contact.{name,email}`, `hasAttachment`, `createdAt`
- internal fields (`content.message`, `attachments[]`, `updatedAt`) не експонуються

## Ключові env-параметри (поточна ітерація)

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
