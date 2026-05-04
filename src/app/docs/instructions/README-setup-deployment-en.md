# Website Setup and Deployment

## Project basics

- Project: `echocode-newsite`
- Production: `https://www.echocode.digital/`
- Preview / development deploy: `https://echocode-newsite.vercel.app/`
- Required Node.js: `20.19.6`
- Required npm: `11.7.0`

## Domains and environments

### Main domains for this project

- Public client-facing website: `https://www.echocode.digital/`
- Vercel preview / development deploy: `https://echocode-newsite.vercel.app/`

Both the public marketing website and the admin area live under the same `echocode.digital` domain.

Examples:

- public site: `https://www.echocode.digital/`
- admin area: `https://www.echocode.digital/admin/...`

The domain resolves inside the project as the main site slice: `siteId = echocode_digital`.

## Local setup

1. Clone the repository.
2. Install dependencies:

```bash
npm ci
```

3. Configure environment variables.
4. Start the local app:

```bash
npm run dev
```

5. Open the local site in the browser.

## Main commands

```bash
npm run dev
npm run build
npm run start
npm run typecheck
npm run lint
npm run openapi:lint
npm run check
```

## Required environment variables

### Server-side Firebase / app config

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

Important: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` must be provided together if env-based Firebase credentials are used.

### Client-side Firebase config

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Optional client-side keys:

- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`

## Environment variable reference

This section explains what each variable means and what should usually be replaced during migration, environment rebuild, vendor handoff, or project transfer.

Important security note:

- Do not place real production secrets in long-lived documentation.
- If production service-account keys or API keys were shared in chats, docs, tickets, or email, rotate them.

### Server-side Firebase credentials

#### `FIREBASE_PROJECT_ID`

What it means:

- The Firebase / Google Cloud project ID used by the server-side Firebase Admin SDK.

What to replace during migration:

- Replace with the target Firebase project ID of the new environment or the new owner account.

Typical examples:

- old: `echocode-web`
- new: `new-company-web`, `echocode-staging`, `client-prod-project`

When it changes:

- migrating to another Firebase project
- splitting staging and production
- handing over the project to a client account

#### `FIREBASE_CLIENT_EMAIL`

What it means:

- The service account email used by Firebase Admin SDK on the server.

What to replace during migration:

- Replace with the service account email generated in the target Firebase / Google Cloud project.

Typical format:

- `firebase-adminsdk-xxxxx@PROJECT_ID.iam.gserviceaccount.com`

When it changes:

- whenever a different Firebase project is used
- whenever a new service account is issued for security reasons

#### `FIREBASE_PRIVATE_KEY`

What it means:

- The private key belonging to the service account defined in `FIREBASE_CLIENT_EMAIL`.

What to replace during migration:

- Replace with the private key of the new service account JSON from the target Firebase / Google Cloud project.

Operational rule:

- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` must belong to the same service account and same Firebase project.

When it changes:

- when rotating credentials
- when moving to a different Firebase project
- when transferring the project to another owner or company

### Firebase Storage configuration

#### `FIREBASE_STORAGE_BUCKET`

What it means:

- The server-side Firebase Storage bucket used for uploads and file operations.

What to replace during migration:

- Replace with the bucket attached to the target Firebase project.

Typical examples:

- old: `echocode-web.firebasestorage.app`
- new: `client-project.firebasestorage.app`

When it changes:

- when changing Firebase project
- when moving to a dedicated bucket
- when rebuilding infrastructure for another client/account

#### `FIREBASE_CHECK_STORAGE`

What it means:

- Boolean-like flag that enables Storage checks in internal Firebase health verification.

Accepted operational values:

- `true`, `1`, `yes` = enabled
- empty / missing = disabled by default

What to replace during migration:

- Usually not a project-specific value.
- Set it to `true` if you want health checks to validate Storage in the target environment.

#### `INTERNAL_FIREBASE_CHECK_ENABLED`

What it means:

- Boolean-like flag that enables the internal Firebase diagnostics endpoint in non-production workflows.

What to replace during migration:

- Usually keep enabled for local/dev environments.
- For stricter environments, disable it unless the team explicitly needs the check.

Typical values:

- local/dev: `true`
- production-like hardening: unset or `false`

### Client-side Firebase configuration

These values are exposed to the browser and are used for client-side Firebase app initialization, mainly for admin auth integration.

#### `NEXT_PUBLIC_FIREBASE_API_KEY`

What it means:

- Public Firebase web app API key used by the browser-side Firebase SDK.

What to replace during migration:

- Replace with the API key from the target Firebase Web App.

When it changes:

- when switching Firebase project
- when using a different web app registration
- when rotating browser credentials

#### `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`

What it means:

- Firebase Auth domain for the web app.

What to replace during migration:

- Replace with the auth domain of the target Firebase project.

Typical example:

- `PROJECT_ID.firebaseapp.com`

#### `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

What it means:

- Client-side Firebase project ID for the browser SDK.

What to replace during migration:

- Replace with the same target Firebase project ID used by the new web app configuration.

Note:

- In a healthy setup, this should match the intended Firebase project used by the frontend.

#### `NEXT_PUBLIC_FIREBASE_APP_ID`

What it means:

- The Firebase Web App ID registered in the Firebase console.

What to replace during migration:

- Replace with the app ID of the target web app in the new Firebase project.

When it changes:

- when a new Firebase Web App is created
- when the project is transferred and re-registered

#### `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`

What it means:

- Optional client-visible storage bucket name for browser-side Firebase configuration.

What to replace during migration:

- Replace with the bucket for the target Firebase project if browser-side Firebase config still needs it.

Note:

- Server-side storage operations still rely on trusted backend configuration.

#### `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`

What it means:

- Optional Firebase sender ID from the web app config.

What to replace during migration:

- Replace with the sender ID from the new Firebase web app if the target project uses it.

### Application and runtime settings

#### `NODE_ENV`

What it means:

- Standard runtime mode.

Typical values:

- `development`
- `test`
- `production`

What to replace during migration:

- Usually this is environment-specific, not ownership-specific.
- Local `.env.local` commonly uses `development`.
- Hosted production environments should use `production`.

#### `DEVELOPER_ACCESS_MODE`

What it means:

- Server-side developer access behavior flag.

Known values:

- `readonly`
- `full`

What to replace during migration:

- Usually keep `readonly` by default.
- Use `full` only in controlled environments where elevated developer behavior is intended.

#### `API_VERSION`

What it means:

- Internal API version label used by the server configuration.

What to replace during migration:

- Usually no change is needed during ownership transfer.
- Change only if the team introduces a versioning policy that depends on it.

### Admin bootstrap and handoff settings

#### `ADMIN_BOOTSTRAP_EMAILS`

What it means:

- Comma-separated allowlist of emails that can be auto-bootstrapped into admin access on login.

What to replace during migration:

- Replace the current team emails with the new owner, client, or internal admin emails.

Typical use during transfer:

- remove old vendor/team emails
- add new stakeholder/admin emails

Example pattern:

- old: `dev1@oldteam.com,ops@oldteam.com`
- new: `cto@client.com,marketing@client.com`

Important:

- This variable is one of the first things to review during project handoff.

## Migration checklist for env changes

If the project is migrated to another Firebase project, another company, or another deployment account, review these first:

1. `FIREBASE_PROJECT_ID`
2. `FIREBASE_CLIENT_EMAIL`
3. `FIREBASE_PRIVATE_KEY`
4. `FIREBASE_STORAGE_BUCKET`
5. `NEXT_PUBLIC_FIREBASE_API_KEY`
6. `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
7. `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
8. `NEXT_PUBLIC_FIREBASE_APP_ID`
9. `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
10. `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
11. `ADMIN_BOOTSTRAP_EMAILS`

## Migration patterns

### Case 1: same codebase, new Firebase project

Replace:

- all `FIREBASE_*` credentials
- all `NEXT_PUBLIC_FIREBASE_*` client values
- bucket values
- admin bootstrap emails if the owner/team changes

### Case 2: project handoff to a client

Replace:

- service-account credentials
- client Firebase web app config
- bootstrap admin emails
- Vercel project env values if hosting moves to the client account

Also verify:

- custom domains
- Vercel environment variables
- Firebase Auth allowed domains
- Storage / Firestore access and rules

### Case 3: local development only

Usually keep:

- `NODE_ENV=development`
- `INTERNAL_FIREBASE_CHECK_ENABLED=true`

Potentially replace:

- production Firebase credentials with safer development/staging credentials if the team decides to isolate local work from production

## Validation before commit

Run:

```bash
npm run check
```

If Firebase Rules were changed, also run:

```bash
npm run test:firestore:rules
npm run test:storage:rules
```

## Internal Firebase health check

For non-production environments, Firebase availability can be checked via:

```bash
curl http://localhost:3000/api/internal/firebase-check
```

This check is controlled by `INTERNAL_FIREBASE_CHECK_ENABLED`.

## Technical architecture

### High-level connection between admin, backend, Firebase, and website

- The public website is a Next.js application.
- The admin panel is part of the same application under `/admin`.
- Admin actions go through protected server routes under `/api/admin/...`.
- The server layer uses Firebase Admin SDK for secure access to Firestore and Firebase Storage.
- The public website reads data through backend application logic and renders the result for visitors.

### Vercel deployment model

- This repository is deployed on Vercel.
- Vercel preview deployments are used for branch validation and QA.
- The preview hostname for this project is `echocode-newsite.vercel.app` and branch previews may also use derived Vercel preview hosts.
- Production traffic for the main website is routed to the custom domains mapped to this project.

In practice:

- preview / branch verification happens on Vercel preview URLs
- production public traffic goes to `echocode.digital`
- admin operations are accessed through `https://www.echocode.digital/admin/...`

### Domain layout: public site and admin

The public marketing website and the admin area share a single domain:

- `echocode.digital` = public-facing marketing / client website and admin entry under `/admin`

### Client-side vs server-side Firebase usage

- Client-side Firebase config is used mainly for browser-side auth integration in the admin area.
- Server-side Firebase credentials are used for trusted operations such as reading and writing admin-managed data.
- Sensitive write operations must happen on the server, not directly from an anonymous browser client.

### Typical content update flow

1. Admin signs in.
2. Admin panel sends an authenticated request.
3. Server validates the admin token and permissions.
4. Server reads or writes data in Firestore / Storage.
5. Updated data becomes available to the public site on the next fetch/render cycle.

### Main Firebase roles in this project

- Firestore: admin-managed content, moderation data, dashboard aggregations, vacancy settings, portfolio metadata
- Storage: uploaded files and images
- Firebase Auth: admin identity verification
- Firebase Rules: client-side access boundaries

### Connection to the separate `.app` project

This repository also has a server-side relationship with the external `echocode.app` project.

Important points:

- `echocode.app` is treated as a separate site slice: `siteId = echocode_app`
- hosts such as `echocode.app`, `www.echocode.app`, and `web-echocode-app.vercel.app` are resolved into that `.app` slice
- `.app` traffic, page views, and form/submission analytics are intentionally separated from `.digital`
- the admin panel in this repository contains a dedicated `.app` analytics / submissions area under `/admin/echocode-app`

This means the current project is not only the `.digital` website and admin panel, but also part of the shared admin / analytics backend surface for the `.app` product.

### Practical architecture summary

- `.digital` public website: client-facing marketing site
- `.cloud` domain: operational/admin access to the same project
- `.app` website: separate external product site
- Firebase + shared admin backend: common data / analytics layer that lets admin view and manage both slices from one system

### Important implementation rule

When documenting, debugging, or extending the project, treat the server API layer as the main contract between admin UI and Firebase.

## Branch and deployment flow

- `main` = production branch
- `develop` = preview / QA branch
- feature work starts from `main` in a dedicated task branch

Required flow:

1. Create a task branch from `main`.
2. Implement the change.
3. Run validation locally.
4. Merge the task branch into `develop` for preview deployment and QA.
5. After approval, promote the validated state from `develop` to `main`.

## Deployment rules

- Do not push casual or unverified changes to `main`.
- `main` is used only for approved production-ready changes.
- Changes should be verified on `develop` before promotion to `main`.

## Lockfile rule

If `package.json` changes, update `package-lock.json` as well.

If Husky blocks the commit because `package-lock.json` is missing from staged files:

```bash
npm install
git add package-lock.json
```

Then commit again.
