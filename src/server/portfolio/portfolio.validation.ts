import { z } from 'zod';
import {
  isImageMimeType,
  MAX_IMAGE_SIZE_BYTES,
  uploadFileBaseSchema,
} from '@/shared/validation/submissions.files';
import {
  PORTFOLIO_CATEGORY_VALUES,
  PORTFOLIO_PLATFORM_VALUES,
} from '@/shared/portfolio/portfolio.constants';

function uniqueArray<TValue>(values: TValue[]): boolean {
  return new Set(values).size === values.length;
}

export const portfolioProjectIdSchema = z.object({
  projectId: z.string().trim().min(1).max(120),
});

export const portfolioImageUploadInitSchema = z.object({
  file: z.object({
    originalName: z.string().trim().min(1).max(255),
    mimeType: z.string().trim().min(1).max(128),
    sizeBytes: z.number().int().positive().max(MAX_IMAGE_SIZE_BYTES),
  }),
});

const portfolioUploadedImageSchema = uploadFileBaseSchema
  .refine((value) => isImageMimeType(value.mimeType), {
    message: 'Unsupported image MIME type',
    path: ['mimeType'],
  })
  .refine((value) => value.sizeBytes <= MAX_IMAGE_SIZE_BYTES, {
    message: 'Image exceeds allowed size',
    path: ['sizeBytes'],
  });

export const createAdminPortfolioPreviewProjectSchema = z.object({
  title: z.string().trim().min(1).max(120),
  platforms: z
    .array(z.enum(PORTFOLIO_PLATFORM_VALUES))
    .min(1, 'Select at least one platform')
    .max(PORTFOLIO_PLATFORM_VALUES.length)
    .refine(uniqueArray, 'Platform values must be unique'),
  categories: z
    .array(z.enum(PORTFOLIO_CATEGORY_VALUES))
    .min(1, 'Select at least one category')
    .max(PORTFOLIO_CATEGORY_VALUES.length)
    .refine(uniqueArray, 'Category values must be unique'),
  image: portfolioUploadedImageSchema,
});
