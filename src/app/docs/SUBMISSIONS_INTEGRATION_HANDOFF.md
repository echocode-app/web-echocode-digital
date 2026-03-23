# Інтеграція сабмітів у фронтенд

## Що вже готово
Готова серверна частина для таких сторінок:
- `/admin/submissions/clients`
- `/admin/submissions/emails`
- `/admin/vacancies/candidates`

Також готові публічні endpoint-и для створення нових сабмітів.

## Де дивитися API
- OpenAPI: `docs/openapi/openapi.yaml`
- локальна документація: `/docs/api`
- page-view analytics endpoint: `POST /api/analytics/page-view`

## Авторизація
Усі `/api/admin/*` endpoint-и вимагають:
- `Authorization: Bearer <Firebase ID token>`

Публічні form endpoint-и авторизації не вимагають.

## Публічні endpoint-и
### Email submit
- `POST /api/forms/email-submissions`

### Vacancy submit
1. Отримати upload URL для CV:
- `POST /api/forms/uploads/init`
- `formType: vacancy`

2. Завантажити файл по signed URL

3. Створити сабміт:
- `POST /api/forms/vacancy-submissions`

## Адмінка
### Clients
- list: `GET /api/admin/submissions/clients`
- overview: `GET /api/admin/submissions/clients/overview`
- details: `GET /api/admin/submissions/clients/{submissionId}`
- status: `PATCH /api/admin/submissions/clients/status?submissionId=...`
- comment: `POST /api/admin/submissions/clients/comment?submissionId=...`
- delete: `DELETE /api/admin/submissions/clients/delete?submissionId=...`

### Emails
- list: `GET /api/admin/submissions/emails`
- overview: `GET /api/admin/submissions/emails/overview`
- details: `GET /api/admin/submissions/emails/{submissionId}`
- status: `PATCH /api/admin/submissions/emails/status?submissionId=...`
- comment: `POST /api/admin/submissions/emails/comment?submissionId=...`
- delete: `DELETE /api/admin/submissions/emails/delete?submissionId=...`

### Vacancy candidates
- list: `GET /api/admin/vacancies/candidates`
- overview: `GET /api/admin/vacancies/candidates/overview`
- details: `GET /api/admin/vacancies/candidates/{submissionId}`
- status: `PATCH /api/admin/vacancies/candidates/status?submissionId=...`
- comment: `POST /api/admin/vacancies/candidates/comment?submissionId=...`
- delete: `DELETE /api/admin/vacancies/candidates/delete?submissionId=...`

## Фільтри списків
Спільні query params:
- `limit`
- `cursor`
- `status`
- `dateFrom`
- `dateTo`

Додатково для candidates:
- `vacancyKey`
