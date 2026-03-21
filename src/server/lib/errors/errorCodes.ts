type ErrorCatalogEntry = {
  status: number;
  publicMessage: string;
};

/**
 * Canonical API error catalog used across route boundaries.
 * Each code owns its HTTP status + safe public message.
 */
export const API_ERROR_CATALOG = {
  BAD_REQUEST: { status: 400, publicMessage: 'Invalid request payload' },
  VALIDATION_FAILED: { status: 400, publicMessage: 'Invalid request payload' },
  INVALID_JSON_BODY: { status: 400, publicMessage: 'Invalid JSON body' },
  INVALID_PAGINATION: { status: 400, publicMessage: 'Invalid pagination query' },
  ATTACHMENT_NOT_SUPPORTED_YET: {
    status: 400,
    publicMessage: 'Attachment upload is not supported yet',
  },
  ATTACHMENT_VERIFICATION_FAILED: {
    status: 400,
    publicMessage: 'Attachment verification failed',
  },
  UNAUTHORIZED: { status: 401, publicMessage: 'Unauthorized' },
  AUTH_MISSING_TOKEN: { status: 401, publicMessage: 'Unauthorized' },
  AUTH_INVALID_TOKEN: { status: 401, publicMessage: 'Unauthorized' },
  AUTH_REVOKED_TOKEN: { status: 401, publicMessage: 'Unauthorized' },
  FORBIDDEN: { status: 403, publicMessage: 'Forbidden' },
  PERMISSION_DENIED: { status: 403, publicMessage: 'Forbidden' },
  INTERNAL_ENDPOINT_DISABLED: { status: 403, publicMessage: 'Forbidden' },
  NOT_FOUND: { status: 404, publicMessage: 'Not found' },
  NOT_IMPLEMENTED: { status: 501, publicMessage: 'Not implemented' },
  INTERNAL_ERROR: { status: 500, publicMessage: 'Unexpected server error' },
  SERVICE_UNAVAILABLE: { status: 503, publicMessage: 'Service unavailable' },
  FIREBASE_UNAVAILABLE: { status: 503, publicMessage: 'Service unavailable' },
} as const satisfies Record<string, ErrorCatalogEntry>;

export type ApiErrorCode = keyof typeof API_ERROR_CATALOG;

/** Lookup helper to keep code-to-metadata access type-safe. */
export function getApiErrorCatalogEntry(code: ApiErrorCode): ErrorCatalogEntry {
  return API_ERROR_CATALOG[code];
}
