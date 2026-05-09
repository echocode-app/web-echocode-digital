import type { FormValues } from '@/components/modals/ContactUsModal/ContactUsForm/clientProjectForm.types';
import {
  ALLOWED_CLIENT_PROJECT_ATTACHMENT_MIME_TYPES,
  CLIENT_PROJECT_ATTACHMENT_ACCEPT,
  MAX_CLIENT_PROJECT_ATTACHMENT_SIZE_BYTES,
} from '@/shared/forms/clientProjectUpload.constants';

export const SUCCESS_AUTO_CLOSE_MS = 3000;
export const MAX_ATTACHMENT_SIZE_BYTES = MAX_CLIENT_PROJECT_ATTACHMENT_SIZE_BYTES;
export const ALLOWED_ATTACHMENT_MIME_TYPES = ALLOWED_CLIENT_PROJECT_ATTACHMENT_MIME_TYPES;
export const ATTACHMENT_ACCEPT = CLIENT_PROJECT_ATTACHMENT_ACCEPT;

const DEFAULT_COUNTRY_CODE_BY_LOCALE = {
  en: '+1',
  ua: '+380',
  pl: '+48',
  de: '+49',
  es: '+34',
} as const;

export function resolveDefaultCountryCode(locale: string): string {
  return (
    DEFAULT_COUNTRY_CODE_BY_LOCALE[locale as keyof typeof DEFAULT_COUNTRY_CODE_BY_LOCALE] ??
    DEFAULT_COUNTRY_CODE_BY_LOCALE.en
  );
}

export function createInitialValues(locale: string): FormValues {
  return {
    firstName: '',
    countryCode: resolveDefaultCountryCode(locale),
    phone: '',
    email: '',
    description: '',
    image: null,
  };
}
