# OpenAPI Docs

## Files
- `docs/openapi/openapi.yaml` - main OpenAPI entrypoint
- `docs/openapi/paths/*.yaml` - route sections split by domain
- `docs/openapi/SCENARIOS.md` - most common integration flows

## Validation
Run:

```bash
npm run openapi:lint
```

This validates the spec with Redocly CLI.

## Notes
- The spec documents all active API routes from `src/app/api/*`.
- Admin endpoints require `Authorization: Bearer <Firebase ID token>`.
- Public form endpoints are open and protected by server-side rate limiting/validation.
