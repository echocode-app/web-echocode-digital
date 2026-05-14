import { z } from 'zod';

const NAME_PATTERN = /^[\p{L}\p{M}' -]+$/u;
const HTTP_URL_PATTERN = /^https?:\/\//i;
const PHONE_PATTERN = /^[0-9\s().-]+$/;
const COUNTRY_CODE_PATTERN = /^\+[1-9]\d{0,3}$/;
const NAME_TOKEN_PATTERN = /[\p{L}\p{M}]+/gu;
const UPPERCASE_LETTER_PATTERN = /\p{Lu}/u;
const LOWERCASE_LETTER_PATTERN = /\p{Ll}/u;

// Blocks long bot-like mixed-case tokens while allowing human casing like McDonald.
export function hasSuspiciousMixedCaseNameToken(value: string): boolean {
  const tokens = value.match(NAME_TOKEN_PATTERN) ?? [];

  return tokens.some((token) => {
    if (token.length < 8) return false;
    if (!UPPERCASE_LETTER_PATTERN.test(token) || !LOWERCASE_LETTER_PATTERN.test(token)) {
      return false;
    }

    const innerUppercaseCount = [...token.slice(1)].filter((char) =>
      UPPERCASE_LETTER_PATTERN.test(char),
    ).length;

    return innerUppercaseCount >= 3;
  });
}

/** Person name: trimmed, 2-20 chars, letters/spaces/apostrophe/hyphen only. */
export const personNameSchema = z
  .string()
  .trim()
  .min(2, 'Must contain at least 2 characters')
  .max(20, 'Must contain at most 20 characters')
  .regex(NAME_PATTERN, 'Only letters, spaces, apostrophes and hyphens are allowed')
  .refine((value) => !hasSuspiciousMixedCaseNameToken(value), {
    message: 'Name contains suspicious mixed-case pattern',
  });

/** Main optional project note field. */
export const projectNeedsSchema = z
  .string()
  .trim()
  .min(10, 'Must contain at least 10 characters')
  .max(1000, 'Must contain at most 1000 characters');

/** External profile link (LinkedIn/GitHub/etc), http/https only. */
export const profileUrlSchema = z
  .string()
  .trim()
  .url({ message: 'Must be a valid URL' })
  .max(2048, 'Must contain at most 2048 characters')
  .refine((value) => HTTP_URL_PATTERN.test(value), {
    message: 'URL must start with http:// or https://',
  });

export function normalizePhoneDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function buildPhoneE164(countryCode: string, phone: string): string {
  return `${countryCode}${normalizePhoneDigits(phone)}`;
}

export function hasValidFullPhoneLength(countryCode: string, phone: string): boolean {
  return normalizePhoneDigits(`${countryCode}${phone}`).length <= 15;
}

export const countryCodeSchema = z
  .string()
  .trim()
  .regex(COUNTRY_CODE_PATTERN, 'Country code must start with + and contain digits only')
  .max(5, 'Country code is too long');

export const phoneSchema = z
  .string()
  .trim()
  .min(4, 'Phone number is too short')
  .max(24, 'Phone number is too long')
  .regex(PHONE_PATTERN, 'Phone number contains unsupported characters')
  .refine((value) => {
    const digits = normalizePhoneDigits(value);
    return digits.length >= 4 && digits.length <= 15;
  }, 'Phone number must contain 4 to 15 digits');

export const phoneContactSchema = z
  .object({
    countryCode: countryCodeSchema,
    phone: phoneSchema,
  })
  .superRefine((value, ctx) => {
    if (!hasValidFullPhoneLength(value.countryCode, value.phone)) {
      ctx.addIssue({
        code: 'custom',
        path: ['phone'],
        message: 'Full phone number must contain at most 15 digits',
      });
    }
  });

/** Shared identity fields for project form. */
export const projectIdentitySchema = z.object({
  firstName: personNameSchema,
  lastName: personNameSchema,
  email: z.string().trim().email('Must be a valid email').max(30, 'Email is too long'),
});
