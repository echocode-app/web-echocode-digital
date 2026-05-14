import { z } from 'zod';
import {
  ALLOWED_ATTACHMENT_MIME_TYPES,
  MAX_ATTACHMENT_SIZE_BYTES,
} from '@/components/modals/ContactUsModal/ContactUsForm/clientProjectForm.constants';
import {
  hasSuspiciousMixedCaseNameToken,
  hasValidFullPhoneLength,
} from '@/shared/validation/submissions.common';
import type {
  FieldName,
  FormErrors,
  FormValues,
} from '@/components/modals/ContactUsModal/ContactUsForm/clientProjectForm.types';

const nameSchema = z
  .string()
  .trim()
  .min(2, 'name.min')
  .max(40, 'name.max')
  .regex(/^[\p{L}\p{M}' -]+$/u, 'name.pattern')
  .refine((value) => !hasSuspiciousMixedCaseNameToken(value), 'name.suspicious');

const emailSchema = z.string().trim().email('email.invalid').max(120, 'email.max');

const descriptionSchema = z.string().trim().max(2000, 'description.max');
const countryCodeSchema = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{0,3}$/, 'phone.countryCode');
const phoneSchema = z
  .string()
  .trim()
  .min(4, 'phone.min')
  .max(24, 'phone.max')
  .regex(/^[0-9\s().-]+$/, 'phone.pattern')
  .refine((value) => {
    const digits = value.replace(/\D/g, '');
    return digits.length >= 4 && digits.length <= 15;
  }, 'phone.digits');

export function normalize(values: FormValues) {
  return {
    firstName: values.firstName.trim(),
    countryCode: values.countryCode.trim(),
    phone: values.phone.trim(),
    email: values.email.trim(),
    description: values.description.trim(),
    image: values.image,
  };
}

export function validateAttachmentFile(file: File | null): string | undefined {
  if (!file) return undefined;

  if (
    !ALLOWED_ATTACHMENT_MIME_TYPES.includes(
      file.type as (typeof ALLOWED_ATTACHMENT_MIME_TYPES)[number],
    )
  ) {
    return 'attachment.invalidType';
  }

  if (file.size <= 0 || file.size > MAX_ATTACHMENT_SIZE_BYTES) {
    return 'attachment.size';
  }

  return undefined;
}

export function validateField(field: FieldName, values: FormValues): string | undefined {
  const normalized = normalize(values);

  if (field === 'firstName') {
    const result = nameSchema.safeParse(normalized.firstName);
    return result.success ? undefined : result.error.issues[0]?.message;
  }

  if (field === 'countryCode') {
    const result = countryCodeSchema.safeParse(normalized.countryCode);
    if (!result.success) return result.error.issues[0]?.message;
    return hasValidFullPhoneLength(normalized.countryCode, normalized.phone)
      ? undefined
      : 'phone.digits';
  }

  if (field === 'phone') {
    const result = phoneSchema.safeParse(normalized.phone);
    if (!result.success) return result.error.issues[0]?.message;
    return hasValidFullPhoneLength(normalized.countryCode, normalized.phone)
      ? undefined
      : 'phone.digits';
  }

  if (field === 'email') {
    const result = emailSchema.safeParse(normalized.email);
    return result.success ? undefined : result.error.issues[0]?.message;
  }

  if (field === 'description') {
    if (!normalized.description) return undefined;
    const result = descriptionSchema.safeParse(normalized.description);
    return result.success ? undefined : result.error.issues[0]?.message;
  }

  if (field === 'image') {
    return validateAttachmentFile(normalized.image);
  }

  return undefined;
}

export function validateAll(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const fields: FieldName[] = [
    'firstName',
    'countryCode',
    'phone',
    'email',
    'description',
    'image',
  ];

  fields.forEach((field) => {
    const error = validateField(field, values);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
}
