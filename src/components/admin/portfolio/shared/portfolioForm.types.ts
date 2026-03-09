import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_BYTES,
} from '@/shared/validation/submissions.files';

export type PortfolioCreateFormState = {
  title: string;
  imageFile: File | null;
  platforms: string[];
  categories: string[];
};

export type PortfolioCreateFormErrors = {
  title: string | null;
  image: string | null;
  platforms: string | null;
  categories: string | null;
};

export const INITIAL_PORTFOLIO_CREATE_FORM_STATE: PortfolioCreateFormState = {
  title: '',
  imageFile: null,
  platforms: [],
  categories: [],
};

export function validatePortfolioCreateForm(
  value: PortfolioCreateFormState,
): PortfolioCreateFormErrors {
  const trimmedTitle = value.title.trim();
  const title =
    trimmedTitle.length === 0
      ? 'Enter the project title.'
      : trimmedTitle.length > 120
        ? 'Project title is too long. Use up to 120 characters.'
        : null;

  let image: string | null = null;
  if (!value.imageFile) {
    image = 'Select an image file.';
  } else if (
    !ALLOWED_IMAGE_MIME_TYPES.includes(
      value.imageFile.type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number],
    )
  ) {
    image =
      'Unsupported image format. Use JPEG, PNG, WebP, GIF, AVIF, BMP, TIFF, HEIC, or HEIF.';
  } else if (value.imageFile.size > MAX_IMAGE_SIZE_BYTES) {
    image = 'Image is too large. Maximum allowed size is 5 MB.';
  }

  return {
    title,
    image,
    platforms: value.platforms.length === 0 ? 'Select at least one platform.' : null,
    categories: value.categories.length === 0 ? 'Select at least one category.' : null,
  };
}

export function isPortfolioCreateFormValid(
  errors: PortfolioCreateFormErrors,
): boolean {
  return !errors.title && !errors.image && !errors.platforms && !errors.categories;
}
