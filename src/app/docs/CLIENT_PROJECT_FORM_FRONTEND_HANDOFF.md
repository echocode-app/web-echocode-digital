# Client Project Form: handoff для фронтенду

## Обсяг

- Документ стосується нової `.digital` project/contact форми.
- Submit endpoint: `POST /api/forms/client-project`.
- Upload endpoint для optional file: `POST /api/forms/client-project/image/init`.
- `echocode.app` legacy форма не змінюється: там лишається `firstName + lastName + email + file + description`.

## Що вже підключено

- `lastName` прибрано з `.digital` client-project контракту.
- Новий payload уже підключений у submit logic:
  - `firstName`
  - `countryCode`
  - `phone`
  - `email`
  - `description` optional
  - `image` optional
- Backend нормалізує телефон:
  - `phone` зберігається як digits-only national number
  - `phoneE164` зберігається як `countryCode + phone`
- File flow не змінювався: якщо файл є, спочатку init upload, потім signed `PUT`, потім submit з `image`.
- Admin уже вміє показувати phone у list/details.
- Frontend hook/state/API вже мають `countryCode` і `phone`.
- Поточний UI має простий `phone` input. Його треба замінити на phone selector UI.

## Що робить фронтендер

- Підключає phone input бібліотеку / country selector.
- Візуально приводить форму до макету.
- На зміну країни записує dialing code у `countryCode`, наприклад `+380`.
- На введення номера записує national number у `phone`.
- Не повертати `lastName` у `.digital` форму.
- Не міняти endpoint-и, якщо немає окремої причини.
- Зберегти optional поля:
  - `description`
  - `image`
- Зберегти locked/loading/success/error behavior існуючого `useClientProjectForm`.

## Payload

Мінімальний submit:

```json
{
  "firstName": "Anna",
  "countryCode": "+380",
  "phone": "501234567",
  "email": "test@gmail.com"
}
```

З optional полями:

```json
{
  "firstName": "Anna",
  "countryCode": "+380",
  "phone": "501234567",
  "email": "test@gmail.com",
  "description": "Need a fintech mobile app",
  "image": {
    "path": "client-submissions/<uuid>/attachment",
    "originalName": "brief.pdf",
    "mimeType": "application/pdf",
    "sizeBytes": 123456
  }
}
```

Важливо:

- `countryCode` завжди окремо.
- `phone` без country code.
- Backend приймає форматування в `phone`: пробіли, `()`, `.`, `-`.
- Макетний формат `+380 (00)-000-00` є UI-прикладом, не вимогою до payload.

## Локалізація і default country code

Поточний default code береться з locale:

| Locale | Default code |
| ------ | ------------ |
| `en`   | `+1`         |
| `uk`   | `+380`       |
| `pl`   | `+48`        |
| `de`   | `+49`        |
| `es`   | `+34`        |

Файл: `src/components/modals/ContactUsModal/ContactUsForm/clientProjectForm.constants.ts`.

При роботі над locale-aware routing:

- форма має отримувати актуальний `locale` з `next-intl`;
- default code треба застосовувати тільки для нового/незаповненого стану форми;
- якщо user вручну вибрав країну, language switch не має перезаписувати його вибір;
- якщо бізнес вирішить, що для `en` потрібен інший default, змінюється тільки mapping у constants.

## Валідація

Frontend validation уже підключена:

- `firstName`: 2-40 символів, літери/пробіл/`'`/`-`, плюс anti-spam mixed-case rule.
- `countryCode`: `+` і 1-4 цифри.
- `phone`: 4-15 цифр після нормалізації.
- `email`: valid email, max 120.
- `description`: max 2000.
- `image`: дозволений MIME type і size limit.

Phone бібліотека може давати кращий UX, але backend лишається source of truth.

## QA для фронтендера

- Submit без файлу проходить.
- Submit з файлом проходить повний flow: init upload -> signed PUT -> submit.
- `lastName` ніде не відправляється з `.digital` форми.
- Phone selector реально міняє `countryCode`.
- National number реально міняє `phone`.
- Language switch не ламає вже введені значення.
- Success state і auto-close працюють як раніше.
- Validation messages показуються для name/email/phone/file.
- У `/admin/submissions/clients` видно phone, а name відкривається у details.
