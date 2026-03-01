# Storage CORS presets

## Apply

```bash
gsutil cors set scripts/storage/cors.strict.json gs://echocode-web.firebasestorage.app
```

or

```bash
gsutil cors set scripts/storage/cors.dev-preview.json gs://echocode-web.firebasestorage.app
```

## Verify

```bash
gsutil cors get gs://echocode-web.firebasestorage.app
```

