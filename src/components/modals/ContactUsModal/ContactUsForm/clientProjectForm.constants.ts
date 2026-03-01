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

export const INITIAL_VALUES: FormValues = {
  firstName: '',
  lastName: '',
  email: '',
  description: '',
  image: null,
};
