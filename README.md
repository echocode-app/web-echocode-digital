# echocode-newsite

[Українська версія](./README.uk.md)

Production: https://www.echocode.digital/  
Preview / development deploy: https://echocode-newsite.vercel.app/

## Quick setup

- Node `20.19.6`
- npm `11.7.0`

## Main commands

- `npm run dev` - run the local Next.js app
- `npm run typecheck` - run TypeScript validation
- `npm run lint` - run ESLint validation
- `npm run openapi:lint` - run OpenAPI validation
- `npm run check` - required pre-commit validation (`typecheck + lint + openapi:lint + build`)
- `npm run test:firestore:rules` - run Firestore Rules tests
- `npm run test:storage:rules` - run Storage Rules tests

## API documentation

- Swagger UI locally and in production: `/docs/api`
- Raw OpenAPI spec: `/api/docs/openapi/openapi.yaml`

## Git workflow

### Branch roles

- `main` is the production branch. Every push to `main` is treated as a production release candidate and deploys to the live domain.
- `develop` is the preview branch for active development, feature validation, and QA checks before production promotion.
- Each new task must start from `main` in a dedicated task branch.

### Required branch flow

1. Create a new branch from `main` for each task.
2. Implement and validate the change in the task branch.
3. Merge the task branch into `develop` for preview deployment and feature verification.
4. After QA approval, promote the validated state from `develop` to `main`.

### Important release rule

- Do not push to `main` casually.
- Use `main` only for approved production-ready changes.
- If a change has not been verified on `develop`, it should not be merged into `main`.

## Commit checklist

1. `git pull`
2. `npm ci` on a fresh clone or after dependency changes
3. Make your changes
4. If `package.json` changed, run `npm install` to update `package-lock.json`
5. `npm run check`
6. `git add ...`
7. `git commit -m "message"`

If Firebase Rules changed, also run:

1. `npm run test:firestore:rules`
2. `npm run test:storage:rules`

## Lockfile rule

Husky pre-commit blocks the commit if `package.json` is staged but `package-lock.json` is not.

If that happens:

1. `npm install`
2. `git add package-lock.json`
3. Commit again

This prevents CI failures caused by dependency mismatch.
