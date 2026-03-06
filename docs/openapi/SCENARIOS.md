# Popular Integration Scenarios

## 1) Vacancy submit (CV + profile URL)
1. Call `POST /api/forms/uploads/init` with `formType: vacancy` and CV metadata.
2. Upload file via returned signed `PUT` URL.
3. Call `POST /api/forms/vacancy-submissions` with `profileUrl`, uploaded `cvFile`, and `vacancy` snapshot.

## 2) Footer mobile email submit
1. Call `POST /api/forms/email-submissions` with `{ email, source }`.
2. Expect `status: new` and submission id in response.

## 3) Admin moderation flow (any queue)
1. Load list endpoint:
   - clients: `/api/admin/submissions/clients`
   - emails: `/api/admin/submissions/emails`
   - vacancy candidates (canonical): `/api/admin/vacancies/candidates`
2. Open details endpoint by `submissionId`.
3. Apply status change via `/status`.
4. Add moderation notes via `/comment`.
5. Soft-delete via `/delete` when needed.

## 4) Dashboard badges for new submissions
1. Poll queue overviews:
   - `GET /api/admin/submissions/clients/overview`
   - `GET /api/admin/submissions/emails/overview`
   - `GET /api/admin/vacancies/candidates/overview`
2. Use `byStatus.new` as badge/bannner counters.
