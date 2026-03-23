import { z } from 'zod';
import {
  ALLOWED_ATTACHMENT_MIME_TYPES,
  MAX_ATTACHMENT_SIZE_BYTES,
} from '@/components/modals/ContactUsModal/ContactUsForm/clientProjectForm.constants';
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
  .regex(/^[\p{L}\p{M}' -]+$/u, 'name.pattern');

const emailSchema = z.string().trim().email('email.invalid').max(120, 'email.max');

const descriptionSchema = z.string().trim().max(2000, 'description.max');

export function normalize(values: FormValues) {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
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

  if (field === 'lastName') {
    const result = nameSchema.safeParse(normalized.lastName);
    return result.success ? undefined : result.error.issues[0]?.message;
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
  const fields: FieldName[] = ['firstName', 'lastName', 'email', 'description', 'image'];

  fields.forEach((field) => {
    const error = validateField(field, values);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
}
