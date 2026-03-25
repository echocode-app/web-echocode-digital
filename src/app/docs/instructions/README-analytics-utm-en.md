# Analytics, Metrics, and UTM Guide

### Purpose

This document explains:

- how analytics works in the project
- how metrics are formed in the admin area
- how UTM attribution works
- which tagged link should be used for each channel for `echocode.digital` and `echocode.app`

### Main admin pages

- `.digital` analytics: `/admin/dashboard`
- `.app` analytics: `/admin/echocode-app`
- ready-to-use UTM links: `/admin/info/utm`

### High-level analytics flow

1. A user opens a page on `echocode.digital` or `echocode.app`.
2. The public frontend sends a page-view event to `/api/analytics/page-view`.
3. The request includes:
   - `siteId`
   - `siteHost`
   - `referrer`
   - stored first-touch attribution, if it exists
4. The backend resolves which site the request belongs to.
5. The backend writes analytics events to Firebase / Firestore in `analytics_events`.
6. Admin dashboards aggregate these events and show KPIs, traffic slices, referrers, UTM source share, top pages, geography, and lead-related metrics.

### How form and lead analytics work

Analytics is not only page views.

The project also sends analytics context together with public form flows, including:

- email submissions
- vacancy submissions
- client-project submissions

This means leads can be connected back to the original first-touch UTM source when attribution is available.

### How metrics are formed

The dashboards use analytics and submission data to build metrics such as:

- page views
- top pages
- countries / geography
- referrer and UTM source share
- source-based lead volume
- conversion estimates where page-view and lead data can be matched
- vacancy lead activity

Important:

- `.digital` metrics are isolated under `siteId = echocode_digital`
- `.app` metrics are isolated under `siteId = echocode_app`

So traffic and leads from the two sites are intentionally separated.

### How UTM works

The project uses a first-touch attribution model.

Supported parameters:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

Example:

`https://www.echocode.digital/?utm_source=linkedin&utm_medium=social&utm_campaign=digital_outreach`

### First-touch principle

- On the first landing where `utm_source` exists, attribution is saved in browser `localStorage`
- Storage key: `echocode_attribution`
- Existing stored attribution is not overwritten
- The stored attribution is reused later for page-view and lead events

In practice this means:

- if a user first came from LinkedIn, that source can still be attached to a later form submission
- if the team opens tagged links internally, analytics can be polluted

### UTM naming rules

- Always share the full tagged URL
- Keep one naming convention for each channel
- Use different `campaign` values for different placements you want to compare
- Do not mix social, paid, referral, marketplace, and outbound traffic under the same `medium`
- Do not open marketing links repeatedly from internal chats, QA testing, or team browsers

### Channel table for both sites

| Channel | Use for `echocode.digital` | Use for `echocode.app` | Recommendation |
| --- | --- | --- | --- |
| LinkedIn | `https://echocode.digital/?utm_source=linkedin&utm_medium=social&utm_campaign=digital_outreach` | `https://echocode.app/?utm_source=linkedin&utm_medium=social&utm_campaign=app_founder_post` | Use `.digital` for agency/service promotion, `.app` for product discovery or app growth content. |
| Instagram | not primary preset in current admin set for `.digital` | `https://echocode.app/?utm_source=instagram&utm_medium=social&utm_campaign=app_profile_link` | Use mostly for `.app`; for `.digital`, create a dedicated social link only if Instagram is used for agency traffic consistently. |
| Telegram | not primary preset in current admin set for `.digital` | `https://echocode.app/?utm_source=telegram&utm_medium=community&utm_campaign=app_channel_post` | Use for founder/community posts; keep Telegram under `community` rather than `social` if you want it separated. |
| Upwork | `https://echocode.digital/?utm_source=upwork&utm_medium=marketplace&utm_campaign=digital_profile` | not recommended as a primary `.app` channel | Use only for agency lead generation and service traffic. |
| Freelancehunt | `https://echocode.digital/?utm_source=freelancehunt&utm_medium=marketplace&utm_campaign=digital_profile` | not recommended as a primary `.app` channel | Use only for agency traffic coming from marketplace profiles and bids. |
| Email signature | `https://echocode.digital/?utm_source=email&utm_medium=outbound&utm_campaign=digital_signature` | not primary preset | Good for founder, sales, and partnership signatures; keep separate from cold outreach. |
| Cold email | `https://echocode.digital/?utm_source=cold_email&utm_medium=outbound&utm_campaign=digital_outreach` | not primary preset | Use when you need outbound email attribution separate from signature clicks. |
| Partner referral | `https://echocode.digital/?utm_source=partner&utm_medium=referral&utm_campaign=digital_partner_referral` | not primary preset | Use for partner networks and warm referrals; do not merge with email or social traffic. |
| Clutch | `https://echocode.digital/?utm_source=clutch&utm_medium=marketplace&utm_campaign=digital_profile` | not recommended as a primary `.app` channel | Use for agency discovery and review-platform traffic. |
| Behance | `https://echocode.digital/?utm_source=behance&utm_medium=portfolio&utm_campaign=digital_showcase` | not primary preset | Best for design showcase traffic that should lead to agency inquiry pages. |
| Dribbble | `https://echocode.digital/?utm_source=dribbble&utm_medium=portfolio&utm_campaign=digital_showcase` | not primary preset | Use for portfolio-driven design traffic; keep separate from social channels. |
| Meta Ads | `https://echocode.digital/?utm_source=meta&utm_medium=paid_social&utm_campaign=digital_lead_ads` | `https://echocode.app/?utm_source=meta&utm_medium=paid_social&utm_campaign=app_meta_acquisition` | Use `.digital` for service leads, `.app` for product acquisition. Never mix these two goals under one campaign. |
| Influencer / Creator | not primary preset | `https://echocode.app/?utm_source=influencer&utm_medium=paid_social&utm_campaign=app_creator_drop` | Best for creator-driven app campaigns. Keep each creator placement split by campaign if comparison is needed. |
| Product Hunt | not recommended as a primary `.digital` channel | `https://echocode.app/?utm_source=producthunt&utm_medium=community&utm_campaign=app_launch` | Use only for app/product launch flows. |
| X / Twitter | not primary preset | `https://echocode.app/?utm_source=x&utm_medium=social&utm_campaign=app_thread` | Good for founder-led product content and launch threads. |
| Reddit | not primary preset | `https://echocode.app/?utm_source=reddit&utm_medium=community&utm_campaign=app_community_post` | Use only when traffic comes from specific subreddit/community discussions. |
| YouTube | not primary preset | `https://echocode.app/?utm_source=youtube&utm_medium=video&utm_campaign=app_video` | Best for video descriptions, creator integrations, and launch explainers. |
| Newsletter | not primary preset | `https://echocode.app/?utm_source=newsletter&utm_medium=email&utm_campaign=app_feature` | Use for product mentions in newsletters and digest placements. |

### Minimal recommendations by channel

- LinkedIn: best default channel for both B2B agency traffic and founder-led app announcements.
- Upwork / Freelancehunt / Clutch: use only for `echocode.digital`.
- Behance / Dribbble: route traffic to `echocode.digital`, because this is agency and portfolio intent.
- Product Hunt / Reddit / X / YouTube / creator campaigns: use mainly for `echocode.app`.
- Meta Ads: decide campaign goal first; service leads go to `.digital`, product growth goes to `.app`.
- Email signature and cold email should stay separate because they represent different intent and performance quality.
- If a channel is not used regularly, do not invent many new campaign names; keep naming stable first.

### Practical operating rule

When in doubt:

- send agency/service traffic to `echocode.digital`
- send product/app acquisition traffic to `echocode.app`

If one channel can send traffic to both sites, use different tagged URLs for each destination and compare them separately in admin.
