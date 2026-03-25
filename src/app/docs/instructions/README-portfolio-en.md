# Portfolio Management

## Purpose

This page is used to add and remove dynamic preview cards in the public portfolio section.

Admin URL: `/admin/portfolio`

Important: this tool creates a portfolio preview card only. It does not create a full case-study page.

## How to add a portfolio card

1. Open `/admin/portfolio`.
2. In the **Add preview project** form, fill in all 4 required steps:
3. Enter **Project title**.
4. Upload **Project image**.
5. Select at least one **Platform**.
6. Select at least one **Category**.
7. Click **Create card**.

After saving, the new card appears in the admin list and in the public portfolio preview section.

## Required fields

- Title
- Image
- At least one platform
- At least one category

The **Create card** button stays disabled until all required fields are valid.

## Available platform values

- iOS
- Android
- Web
- Unity

## Available category values

- E-commerce
- Utility
- iGaming
- Health & Well-being
- Education
- Lifestyle
- Creative
- Travel

## Image requirements

- Maximum file size: `5 MB`
- Supported image formats: `JPEG`, `PNG`, `WebP`, `GIF`, `AVIF`, `BMP`, `TIFF`, `HEIC`, `HEIF`
- Recommended image size for the best visual result: `1024 x 1024`, or another image with a similar square proportion

If the uploaded file is too large or has an unsupported format, the admin panel will show an error.

## Internal behavior

- The system generates a safe internal ID automatically from the project title.
- The image is uploaded first.
- After upload, the preview card is created and linked to the uploaded image.

## Technical flow

### How admin, Firebase, and the public site are connected

1. The admin user opens `/admin/portfolio` and works in the admin panel UI.
2. The admin panel sends authenticated requests to the admin API under `/api/admin/portfolio`.
3. The backend verifies admin access and the required `portfolio.manage` permission.
4. For a new card, the backend first creates a signed upload URL for Firebase Storage.
5. The image is uploaded to Firebase Storage.
6. After a successful upload, the backend creates the portfolio preview card record in Firebase / Firestore.
7. The public website reads the published portfolio data and displays the preview card in the portfolio section.

### What is stored where

- Image file: Firebase Storage
- Preview card metadata: Firestore
- Public card rendering: client-facing website reads prepared portfolio data from the backend

### Access model

- Admin write actions are available only through authenticated admin API routes.
- Public visitors can see only the content exposed by the public website flow.
- The admin panel does not write directly to Firebase from the browser; writes go through protected server endpoints.

## How to delete a portfolio card

1. Open `/admin/portfolio`.
2. Find the needed card in the list.
3. Click the delete action.
4. Confirm deletion in the browser dialog.

Deletion removes the dynamic preview card from the admin list and from the public portfolio preview section.
