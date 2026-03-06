# echocode-newsite

Dev Vercel: https://echocode-newsite.vercel.app/

## Quick setup

- Node `20.19.6`
- npm `11.7.0`
- If you use nvm: `nvm use`

## Main commands

- `npm run dev` - local Next.js app
- `npm run typecheck` - TypeScript validation
- `npm run lint` - ESLint validation
- `npm run openapi:lint` - OpenAPI validation
- `npm run check` - required pre-commit check (`typecheck + lint + openapi:lint + build`)
- `npm run test:firestore:rules` - Firestore Rules tests
- `npm run test:storage:rules` - Storage Rules tests
- `BASE_URL=http://127.0.0.1:3000 npm run seed:mock:submissions` - mock email/candidate submissions for admin smoke test

## API documentation

- Swagger UI locally and in production: `/docs/api`
- Raw OpenAPI spec: `/api/docs/openapi/openapi.yaml`
- Source files:
- `docs/openapi/openapi.yaml`
- `docs/openapi/SCENARIOS.md`
- `src/app/docs/SUBMISSIONS_INTEGRATION_HANDOFF.md`

## Admin moderation queues

- Client submissions: `/admin/submissions/clients`
- Email submissions: `/admin/submissions/emails`
- Vacancy candidates: `/admin/vacancies/candidates`

Canonical admin API namespaces:

- `/api/admin/submissions/clients/*`
- `/api/admin/submissions/emails/*`
- `/api/admin/vacancies/candidates/*`

Legacy compatibility alias remains available:

- `/api/admin/submissions/vacancies/*`

## Commit checklist

1. `git pull`
2. `npm ci` (fresh clone / after dependency changes)
3. Make your changes
4. If you changed `package.json` -> run `npm install` (updates `package-lock.json`)
5. `npm run check`
6. `git add ...`
7. `git commit -m "message"`

If Firebase Rules changed, also run:

1. `npm run test:firestore:rules`
2. `npm run test:storage:rules`

## Lockfile rule (important)

Husky pre-commit will block the commit if `package.json` is staged but `package-lock.json` is not.

If that happens:

1. `npm install`
2. `git add package-lock.json`
3. Commit again

This keeps CI from failing because of dependency mismatch.

## Branches

- `develop` - current sprint work, deploys to the live Vercel dev page: https://echocode-newsite.vercel.app/
- `coming-soon` - temporary placeholder page on the domain https://www.echocode.digital/ (also hosted on Vercel)
- `BE` - temporary backend/server logic work that should not go to `develop` yet
- `main` - do not push casually; it overrides `coming-soon` for the domain setup
- all other branches - temporary feature/task branches
