export const MAX_CLIENT_PROJECT_ATTACHMENT_SIZE_BYTES = 10 * 1024 * 1024;

export const ALLOWED_CLIENT_PROJECT_ATTACHMENT_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'text/plain',
  'text/csv',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/rtf',
  'text/rtf',
  'application/zip',
  'application/x-zip-compressed',
] as const;

export const ALLOWED_CLIENT_PROJECT_ATTACHMENT_EXTENSIONS = [
  'jpg',
  'jpeg',
  'png',
  'webp',
  'pdf',
  'txt',
  'csv',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'rtf',
  'zip',
] as const;

export const CLIENT_PROJECT_ATTACHMENT_ACCEPT = ALLOWED_CLIENT_PROJECT_ATTACHMENT_MIME_TYPES.join(',');

