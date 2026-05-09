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

- `main` is the production branch and must always represent the current live state.
- `develop` is the preview / staging branch for new features before production.
- Feature branches are temporary task branches for isolated development.

### Required branch flow

1. Create a new feature branch from the latest `develop`.
2. Keep the feature branch up to date with `develop` and `main` while working.
3. Open a PR from the feature branch into `develop`.
4. Test and approve the change on the `develop` preview deployment.
5. Open a PR from `develop` into `main` only after preview verification passes.

In short:

```text
main = production
develop = preview / staging for new features
feature branches -> PR into develop -> test preview -> PR develop into main
```

### Synchronization rule

- `develop` may be ahead of `main` only while new features are being tested.
- If `main` is ahead of `develop`, update `develop` from `main` before starting or merging new work.
- Feature branches must be kept current with the latest `develop` and production `main`.
- No new feature should go directly to `main`; every feature must be verified on `develop` first.

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
