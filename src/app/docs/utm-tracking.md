# UTM Tracking (First-Touch)

## What UTM is

UTM parameters are URL query tags used to identify where traffic comes from.

Supported tags:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

Example:
`https://www.echocode.digital/?utm_source=linkedin&utm_medium=social&utm_campaign=company_page`

## First-touch attribution model

The project uses first-touch attribution:

- On the first landing with `utm_source`, attribution is saved to localStorage under `echocode_attribution`.
- Existing stored attribution is not overwritten.
- Stored shape:

```json
{
  "source": "linkedin",
  "medium": "social",
  "campaign": "company_page",
  "content": "optional",
  "term": "optional",
  "timestamp": "2026-03-01T00:00:00.000Z"
}
```

## How dashboard uses attribution

`analytics_events` submit events include:

```json
{
  "metadata": {
    "attribution": {
      "source": "linkedin",
      "medium": "social",
      "campaign": "company_page"
    }
  }
}
```

Admin dashboard source analytics aggregates by:

- `metadata.attribution.source` (30d)
- leads per source
- share per source
- conversion per source (leads / page views for the same source, if page-view data exists)

If no attribution data exists, sources block returns an empty array and is hidden in UI.

## Predefined marketing links

Domain:
`https://www.echocode.digital/`

| Channel           | URL                                                                                                       |
| ----------------- | --------------------------------------------------------------------------------------------------------- |
| LinkedIn Company  | `https://www.echocode.digital/?utm_source=linkedin&utm_medium=social&utm_campaign=company_page`           |
| LinkedIn Personal | `https://www.echocode.digital/?utm_source=linkedin&utm_medium=social&utm_campaign=personal_profile`       |
| Instagram Bio     | `https://www.echocode.digital/?utm_source=instagram&utm_medium=social&utm_campaign=bio_link`              |
| Telegram Channel  | `https://www.echocode.digital/?utm_source=telegram&utm_medium=social&utm_campaign=channel_post`           |
| Freelancehunt     | `https://www.echocode.digital/?utm_source=freelancehunt&utm_medium=marketplace&utm_campaign=profile_link` |
| Upwork            | `https://www.echocode.digital/?utm_source=upwork&utm_medium=marketplace&utm_campaign=profile_link`        |
| Email Signature   | `https://www.echocode.digital/?utm_source=email&utm_medium=outbound&utm_campaign=signature_link`          |
| Clutch            | `https://www.echocode.digital/?utm_source=clutch&utm_medium=marketplace&utm_campaign=profile_link`        |
| Behance           | `https://www.echocode.digital/?utm_source=behance&utm_medium=social&utm_campaign=portfolio_link`          |
| Direct Outreach   | `https://www.echocode.digital/?utm_source=direct&utm_medium=outreach&utm_campaign=manual_outreach`        |
