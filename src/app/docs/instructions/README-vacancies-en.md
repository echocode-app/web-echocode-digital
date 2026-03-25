# Vacancy Management

## Purpose

This page is used to manage public settings for the predefined vacancies shown on the website.

Admin URL: `/admin/vacancies`

Important: vacancies are not created dynamically in admin. The system supports only 3 predefined vacancies:

- `iosdev` -> iOS Developer
- `qaengineer` -> QA Engineer
- `designer` -> UI/UX Designer

## What can be changed

For each vacancy, the admin panel allows:

- Show or hide the vacancy on the public career page
- Enable or disable the **Hot position** label
- Change the displayed **Candidate level**

## What cannot be changed from admin

This page does not create new vacancies and does not rename existing ones.

The following values are fixed in code and are not managed from this page:

- Vacancy ID
- Vacancy slug
- Vacancy title
- Conditions / tags
- Employment type
- Location

## How to update a vacancy

1. Open `/admin/vacancies`.
2. Find the required vacancy card.
3. In the **Change values** block, update the needed settings:
4. Toggle **Show on career page** on or off.
5. Toggle **Hot position** on or off.
6. Select a value in **Candidate level**, or leave **Not specified**.
7. Click **Save** for that vacancy card.

After saving, the updated values are applied to the public vacancy card and vacancy details page.

## Available candidate levels

- Intern
- Trainee
- Junior
- Middle
- Senior
- Lead
- Principal
- Head

You can also leave the field empty by selecting **Not specified**.

## Visibility logic

- If **Show on career page** is enabled, the vacancy is public.
- If **Show on career page** is disabled, the vacancy is hidden from the public career section.

## Current vacancy URLs

- `/career/iosdev`
- `/career/qaengineer`
- `/career/designer`

## Technical flow

### How admin, Firebase, and the public site are connected

1. The admin user opens `/admin/vacancies`.
2. The admin panel loads vacancy settings through `GET /api/admin/vacancies`.
3. When a vacancy is updated, the admin panel sends a protected `PATCH` request to `/api/admin/vacancies/{vacancyId}`.
4. The backend verifies admin access and the required `vacancies.manage` permission.
5. The backend updates the predefined vacancy record in Firestore.
6. The public career pages read the prepared vacancy data from the backend and render only the vacancies that are marked as published.

### What is stored in Firebase

For each managed vacancy, Firebase / Firestore stores the editable public settings such as:

- `isPublished`
- `isHot`
- `level`
- update metadata such as `updatedAt` and `updatedBy`

Static vacancy definitions such as ID, slug, title, location, tags, and employment type are defined in code and merged with Firebase data on the backend.

### Access model

- Admin changes go through protected server API routes.
- Public users do not edit vacancy data.
- The admin panel does not create arbitrary vacancy documents; it updates only the supported predefined vacancy IDs.

## Notes

- This page manages only the public settings of the 3 predefined vacancies.
- If the business needs a new vacancy type, it must be added in code first.
