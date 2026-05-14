# echocode-newsite

[English version](./README.md)

Продакшен: https://www.echocode.digital/  
Preview / dev deploy: https://echocode-newsite.vercel.app/

## Швидкий старт

- Node `20.19.6`
- npm `11.7.0`

## Основні команди

- `npm run dev` - запуск локального Next.js застосунку
- `npm run test:lead-form-contract` - тести контракту і валідації lead form
- `npm run typecheck` - перевірка TypeScript
- `npm run lint` - перевірка ESLint
- `npm run openapi:lint` - перевірка OpenAPI
- `npm run check` - обов'язкова перевірка перед комітом (`lead form contract test + typecheck + lint + openapi:lint + build`)
- `npm run test:firestore:rules` - тести Firestore Rules
- `npm run test:storage:rules` - тести Storage Rules

## Чекліст перевірок

### Обов'язково перед кожним комітом

Виконати:

```bash
npm run check
```

Це покриває:

- тести контракту lead form
- перевірку TypeScript
- перевірку ESLint
- перевірку OpenAPI
- production build

### Обов'язково після змін Firebase Rules

Виконати:

```bash
npm run test:firestore:rules
npm run test:storage:rules
```

### Обов'язково перед merge у production

- Злити feature-гілки в `develop`.
- Перевірити preview deployment з `develop`.
- Запустити `npm run check` на фінальному стані гілки.
- Зливати `develop` у `main` тільки після успішної preview-перевірки.

## Контракт Lead Form

Обов'язкові поля:

- `firstName`
- `countryCode`
- `phone`
- `email`

Опційні поля:

- `description`
- `image`

Frontend має надсилати `countryCode` окремо від національного номера `phone`. Backend нормалізує форматування номера і зберігає `phone` у цифрах та `phoneE164`.

## API документація

- Swagger UI локально і в production: `/docs/api`
- Raw OpenAPI spec: `/api/docs/openapi/openapi.yaml`

## Locale routing

- Канонічні locale URL:
  - English: `/en`
  - Ukrainian: `/ua`
  - German: `/de`
  - Spanish: `/es`
  - Polish: `/pl`
- `/` тільки визначає locale і редіректить за збереженою/браузерною мовою; fallback: `/en`.
- `/uk` є legacy alias для української і permanent redirect на `/ua`.
- Contact modal routes locale-aware: `/{locale}/contact` і `/{locale}/contact/success`.
- SEO canonical, hreflang і sitemap мають використовувати канонічні prefixes вище.

## Git workflow

### Ролі гілок

- `main` - production-гілка, яка завжди має відповідати поточному live-стану.
- `develop` - preview / staging-гілка для нових фіч перед релізом у production.
- Feature branches - тимчасові гілки для ізольованої розробки окремих задач.

### Обов'язковий порядок роботи

1. Для кожної нової задачі створюй окрему feature-гілку від актуального `develop`.
2. Під час роботи тримай feature-гілку актуальною відносно `develop` і `main`.
3. Відкривай PR з feature-гілки в `develop`.
4. Перевіряй і затверджуй зміну на preview deploy з `develop`.
5. Відкривай PR з `develop` у `main` тільки після успішної перевірки preview.

Коротко:

```text
main = production
develop = preview / staging для нових фіч
feature branches -> PR into develop -> тест preview -> PR develop into main
```

### Правило синхронізації

- `develop` може випереджати `main` тільки на етапі розробки і тестування нових фіч.
- Якщо `main` випереджає `develop`, треба оновити `develop` з `main` перед стартом або злиттям нової роботи.
- Feature branches мають залишатися актуальними відносно останнього `develop` і production `main`.
- Жодна нова фіча не має потрапляти напряму в `main`; спочатку вона має бути перевірена на `develop`.

## Чекліст перед комітом

1. `git pull`
2. `npm ci` на свіжому клоні або після змін залежностей
3. Внести зміни
4. Якщо змінювалися dependency-relevant поля в `package.json`, виконати `npm install`, щоб оновити `package-lock.json`
5. `npm run check`
6. `git add ...`
7. `git commit -m "message"`

Якщо змінювалися Firebase Rules, також виконай:

1. `npm run test:firestore:rules`
2. `npm run test:storage:rules`

## Правило для lockfile

Husky pre-commit порівнює staged `package.json` з `HEAD`.

Коміт блокується тільки якщо змінилися dependency-relevant поля, а `package-lock.json` не staged. Це залежності, devDependencies, optionalDependencies, peerDependencies, overrides, workspaces, engines, packageManager, name/version metadata.

Script-only зміни в `package.json` не потребують оновлення lockfile.

Якщо це сталося:

1. `npm install`
2. `git add package-lock.json`
3. Повтори commit

Це захищає CI від падіння через розсинхронізацію залежностей.
