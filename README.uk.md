# echocode-newsite

[English version](./README.md)

Продакшен: https://www.echocode.digital/  
Preview / dev deploy: https://echocode-newsite.vercel.app/

## Швидкий старт

- Node `20.19.6`
- npm `11.7.0`

## Основні команди

- `npm run dev` - запуск локального Next.js застосунку
- `npm run typecheck` - перевірка TypeScript
- `npm run lint` - перевірка ESLint
- `npm run openapi:lint` - перевірка OpenAPI
- `npm run check` - обов'язкова перевірка перед комітом (`typecheck + lint + openapi:lint + build`)
- `npm run test:firestore:rules` - тести Firestore Rules
- `npm run test:storage:rules` - тести Storage Rules

## API документація

- Swagger UI локально і в production: `/docs/api`
- Raw OpenAPI spec: `/api/docs/openapi/openapi.yaml`

## Git workflow

### Ролі гілок

- `main` - продакшен-гілка. Кожен push у `main` розглядається як кандидат на продакшен-реліз і деплоїться на live domain.
- `develop` - preview-гілка для активної розробки, перевірки нових фіч і QA перед виведенням у продакшен.
- Кожна нова задача має починатися з окремої task-гілки, створеної від `main`.

### Обов'язковий порядок роботи

1. Для кожної нової задачі створюй окрему гілку від `main`.
2. Реалізуй і перевіряй зміни у task-гілці.
3. Зливай task-гілку в `develop` для preview deploy та перевірки фічі.
4. Після QA і підтвердження коректної роботи промоуть перевірений стан з `develop` у `main`.

### Важливе правило релізів

- Не пушити в `main` випадково або для проміжних змін.
- `main` використовується тільки для підтверджених production-ready змін.
- Якщо зміна не була перевірена на `develop`, її не можна зливати в `main`.

## Чекліст перед комітом

1. `git pull`
2. `npm ci` на свіжому клоні або після змін залежностей
3. Внести зміни
4. Якщо змінювався `package.json`, виконати `npm install`, щоб оновити `package-lock.json`
5. `npm run check`
6. `git add ...`
7. `git commit -m "message"`

Якщо змінювалися Firebase Rules, також виконай:

1. `npm run test:firestore:rules`
2. `npm run test:storage:rules`

## Правило для lockfile

Husky pre-commit блокує коміт, якщо `package.json` вже staged, а `package-lock.json` ні.

Якщо це сталося:

1. `npm install`
2. `git add package-lock.json`
3. Повтори commit

Це захищає CI від падіння через розсинхронізацію залежностей.
