# echocode-newsite

Dev Vercel: https://echocode-newsite.vercel.app/

## Quick setup

- Node `20.19.6`
- npm `11.7.0`
- If you use nvm: `nvm use`

## Commit checklist

1. `git pull`
2. `npm ci` (fresh clone / after dependency changes)
3. Make your changes
4. If you changed `package.json` -> run `npm install` (updates `package-lock.json`)
5. `npm run check`
6. `git add ...`
7. `git commit -m "message"`

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
