# QA Checklist та Короткий Гайд по Проєкту

## 1. Summary

Це marketing website + admin panel для Echocode.

## 1.1. Корисні посилання

### Основний новий `.digital` сайт

- Vercel preview: [https://echocode-newsite.vercel.app/](https://echocode-newsite.vercel.app/)
- Figma макет: [Corporate IT Website Design](https://www.figma.com/design/y75RM6CagqVYqzYPk39VFz/Corporate-IT-Website-Design?node-id=30-2&p=f&t=Y49XD9iLiNuS3adk-0)

### Admin panel

- Admin dashboard: [https://echocode-newsite.vercel.app/admin/dashboard](https://echocode-newsite.vercel.app/admin/dashboard)

### Для довідки: старий `.app` сайт

- Production: [https://www.echocode.app/](https://www.echocode.app/)
- Figma макет: [Website UI Redesign](https://www.figma.com/design/ZBhqMLTAkyzeAveZziiPV9/Website-UI-Redesign?node-id=0-1&p=f&t=XtP6EtA5qxBqtvzE-0)

У проєкті є 2 великі частини:

- public website:
  - головна
  - service pages
    - Mobile Development
    - Web Development
    - Game Development
    - iGaming
    - Design
    - QA
  - portfolio
  - team
  - career
    - vacancy pages (iOS Developer, QA Engineer, UI／UX Designer)
  - partnership
  - contact modal
- admin panel:
  - dashboard
  - submissions moderation
    - Clients
    - Emails
  - vacancies
    - Candidates
  - portfolio management
  - logs / info
  - окремий зріз для `echocode.app`
    - Clients

## 2. Що використано в проєкті

- `Next.js`
- `React`
- `TypeScript`
- `Tailwind CSS`
- `next-intl` для localization
- `Firebase`:
  - `Firestore`
  - `Storage`
  - `Auth`
- `Vercel` для deploy / analytics geo headers

## 3. Localization

### Доступні мови

- `en`
- `ua`
- `de`
- `es`

### Як localization застосовується в UI/UX

- мова впливає на весь текстовий контент public website
- мова перемикається через `LanguageSwitcher`
- частина typography / text sizing адаптується під locale
- `html lang` змінюється відповідно до активної мови
- там, де `Wadik` не підтримує потрібні символи або конкретну мову, за домовленістю з командою використовується `Rubik`

### Що перевіряти QA

- перемикання мови працює на всіх основних сторінках
- після перемикання мови текст дійсно оновлюється
- немає змішування мов в одному блоці
- немає обрізаних або зламаних рядків після зміни мови
- немає layout shift через довші тексти

## 4. Breakpoints у проєкті

Використані breakpoint-и:

- `sm`: `390px`
- `md`: `768px`
- `lg`: `1024px`
- `xl`: `1290px`

### Практичні viewport-и для ручної перевірки

- `390 x 844` або близько до mobile
- `768 x 1024` для tablet
- `1024 x 768` для small desktop
- `1290+` для desktop

## 5. Основні інтерактивні сценарії

### Contact modal

Основний modal для public сайту.

Що робить:

- відкривається з CTA-кнопок
- блокує scroll background
- закривається через:
  - close button
  - backdrop click
  - `Esc`
- під час `loading` закриття блокується
- після `success` показує success state і auto-close

### Contact form states

- `idle`
- `loading`
- `success`

Що перевіряти:

- required fields
- validation errors
- submit disabled / locked during loading
- success message
- повторне відкриття modal після success

### Vacancy candidate form states

- `idle`
- `pending`
- `success`
- `error`

Що перевіряти:

- upload CV
- validation profile URL
- submit with file
- submit button states
- reset form після success

### Footer email form

Що перевіряти:

- valid / invalid email
- success submit
- error handling

## 5.1. Реалізовані validation rules для submit forms

Нижче коротко описано те, що вже реалізовано в коді. QA варто перевіряти саме ці сценарії.

### Contact modal / client project form

- `firstName`
  - required
  - trim
  - мінімум `2` символи
  - максимум `40` символів
  - дозволені тільки:
    - літери
    - пробіли
    - апостроф
    - дефіс
- `lastName`
  - required
  - ті самі правила, що і для `firstName`
- `email`
  - required
  - trim
  - валідний email format
  - максимум `120` символів
- `description / about your needs`
  - optional
  - trim
  - максимум `2000` символів
- attachment file
  - optional
  - перевіряється MIME type
  - перевіряється size
  - файл не може бути порожнім

### Footer email form

- email required
- trim
- мінімум `3` символи
- максимум `30` символів
- має бути валідний email format
- має проходити basic domain pattern check

### Vacancy candidate form

- `profileUrl`
  - required
  - trim
  - валідний URL
  - максимум `2048` символів
  - URL має починатися з `http://` або `https://`
- `cvFile`
  - required
  - перевіряється file name
  - перевіряється MIME type
  - перевіряється file size
  - перевіряється safe storage path

### Що QA варто перевіряти по validation behavior

- помилка показується для порожнього required field
- помилка зникає після вводу валідного значення
- trim працює коректно
- submit не проходить з invalid даними
- submit проходить з valid даними
- loading / success / error states не ламають форму

## 6. Принцип фільтрації в проєкті

### Public website

Основний фільтр є в portfolio section:

- filter by platform
- filter by categories
- URL/search params мають оновлюватися коректно
- після refresh сторінка повинна зберігати поточний filter state

### Admin

Основні фільтри в moderation tables:

- `status`
- `dateFrom`
- `dateTo`
- інколи додатковий domain-specific filter, наприклад `vacancyKey`

Що перевіряти:

- фільтр реально змінює список
- порожній state показується коректно
- після зміни status запис або зникає, або лишається в списку логічно
- pagination / load more / next page не ламають фільтрацію

## 7. Що мінімально перевіряти в DevTools

QA не обов'язково тестувати API через Postman. Для цього проєкту достатньо мінімального DevTools flow.

### Network

Перевіряти:

- немає масових `4xx` / `5xx` помилок
- при відкритті public page є `POST /api/analytics/page-view`
- при submit форм ідуть відповідні requests
- для vacancy/file flow є:
  - `POST /api/forms/uploads/init`
  - `PUT` upload у signed URL
  - `POST /api/forms/vacancy-submissions`

### Console

Перевіряти:

- немає runtime errors
- немає hydration errors
- немає нескінченних warnings, які ламають flow

### Responsive Mode

Перевіряти:

- mobile
- tablet
- desktop

На mobile окремо дивитися:

- header / burger / navigation
- modal width / close button / scrolling
- form fields не вилазять за контейнер
- footer layout

## 8. Зовнішні сервіси для перевірки

### Основний

- [PageSpeed Insights](https://pagespeed.web.dev/)

Очікування:

- бажано `80+` по основних score
- без критичних важливих помилок
- особливо звертати увагу на:
  - performance
  - accessibility
  - best practices
  - SEO

### Додатково

- [W3C HTML Validator](https://validator.w3.org/)
- [W3C CSS Validator](https://jigsaw.w3.org/css-validator/)
- [WAVE Accessibility Checker](https://wave.webaim.org/)
- [Broken Link Checker](https://www.brokenlinkcheck.com/broken-links.php)

Примітка:

- modern CSS tooling може давати noise у CSS validator
- критичніше звертати увагу на реальні HTML structure issues, accessibility issues, broken links та performance problems

## 9. Що перевіряти на public website

### Загальна manual перевірка

1. Відкрити основні сторінки.
2. Перевірити, що сторінка відкривається без помилок.
3. Перевірити text/content по макету на desktop.
4. Перевірити responsive поведінку на `sm / md / lg / xl`.
5. Перевірити localization.
6. Перевірити CTA та navigation links.

### Список основних сценаріїв

- home page render
- header navigation
- footer links
- language switcher
- open/close contact modal
- contact form validation
- contact form success
- footer email submit
- portfolio filters
- vacancy page render
- vacancy candidate submit
- not-found / error states якщо доступні

## 10. Що перевіряти в admin, якщо є доступ

### Dashboard

Перевірити:

- всі блоки відкриваються без error state
- KPI widgets мають логічні значення
- `Load more` відкриває додаткові блоки
- charts / lists не ламають layout на mobile / tablet / desktop

### Submissions moderation

Для:

- clients
- emails
- candidates
- `echocode.app submissions`

Перевірити:

- список відкривається
- details page відкривається
- status update працює
- comment add працює
- delete працює
- badges/new counters логічні
- reviewed metadata оновлюється логічно

### Echocode.app admin slice

Перевірити:

- окремий dashboard відкривається
- метрики не змішані з `.digital`
- submissions list відкривається
- status flow та details працюють

## 11. Базовий ручний QA checklist

### Cross-browser

Перевірити хоча б:

- Chrome
- Safari
- Firefox

Особливо звертати увагу на:

- video autoplay / fallback
- hover / focus states
- modal behavior
- sticky / fixed elements
- form submit states

### Adaptive / responsive

Перевірити:

- mobile
- tablet
- desktop

Що дивитися:

- нічого не виїжджає за контейнер
- немає горизонтального скролу без причини
- картки / гріди / таблиці не ламаються
- кнопки і поля доступні для тапу
- sticky / fixed кнопки не перекривають важливий контент

### Форми / submits

Перевірити:

- contact modal form
- footer email form
- vacancy candidate form

Сценарії:

- empty submit
- invalid data
- valid data
- loading state
- success state
- error state
- повторний submit / повторне відкриття форми

### Контент і локалізація

Перевірити:

- localization на `en / ua / de / es`
- відсутність змішування мов
- відсутність grammar / typo mistakes
- відсутність дивних машинних формулювань
- правильні CTA тексти
- відсутність обрізаних заголовків і кнопок

### Console / runtime

Перевірити:

- відсутність runtime errors у console
- відсутність hydration errors
- відсутність масових warnings, які ламають UX

### Навігація і посилання

Перевірити:

- header links
- footer links
- social links
- CTA buttons
- portfolio item links
- prototype links
- admin navigation

### Accessibility basics

Перевірити:

- видимість focus states
- логічний tab order
- достатню контрастність
- наявність alt / label там, де це критично

## 12. Мінімальний алгоритм тестування для QA

### Раунд 1. Smoke check

1. Відкрити сайт.
2. Переконатися, що головна сторінка завантажилась.
3. Перевірити Console.
4. Перевірити Network.
5. Відкрити 2-3 ключові сторінки.
6. Відкрити contact modal.
7. Надіслати хоча б одну форму.

### Раунд 2. Responsive

1. Перевірити mobile viewport.
2. Перевірити tablet viewport.
3. Перевірити desktop viewport.
4. Знайти місця, де текст або кнопки виходять за контейнер.

### Раунд 3. Localization

1. Перемкнути всі доступні locale.
2. Перевірити header, footer, hero, forms, modal, vacancy page.
3. Перевірити, що нічого не лишилось тільки англійською без причини.

### Раунд 4. Forms

1. Empty submit.
2. Invalid data.
3. Valid data.
4. File upload сценарій.
5. Success / error state.

### Раунд 5. Admin

1. Перевірити dashboard.
2. Перевірити moderation lists.
3. Перевірити details page.
4. Перевірити status changes.
5. Перевірити comments.

## 13. Що важливо зафіксувати в bug report

- сторінка / URL
- locale
- viewport size
- device / browser
- expected result
- actual result
- screenshot / screen recording
- якщо є: request URL, response status, console error

## 14. Не обов'язково:

- вручну тестувати API через Postman
- аналізувати складні network payloads
- перевіряти backend business logic на рівні запитів
- дебажити Firebase / DB / server internals

Достатньо:

- перевірити, що UI flow працює
- submit реально проходить
- немає visible errors
- у DevTools немає явних `4xx / 5xx` або runtime crashes

вдалого тестування ✊🏻
