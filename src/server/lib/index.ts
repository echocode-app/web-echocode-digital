// This barrel defines the stable utility surface for backend route handlers.
export { handleApiRoute } from '@/server/lib/http';
export { logger } from '@/server/lib/logger';
export {
  buildPaginatedPayload,
  buildPaginationMeta,
  parsePaginationQuery,
  type PaginatedPayload,
  type PaginationMeta,
  type PaginationQuery,
} from '@/server/lib/pagination';
export {
  getOrCreateRequestId,
  getRequestIdHeaderName,
} from '@/server/lib/requestId';
export { fail, ok } from '@/server/lib/response';
export type { ApiFailure, ApiResponse, ApiSuccess } from '@/server/lib/response';
export { validate } from '@/server/lib/validate';
export {
  appendCorsHeaders,
  buildPublicIngestCorsPolicy,
  createCorsPreflightHandler,
  type CorsPolicy,
} from '@/server/lib/cors';
export { withApi } from '@/server/lib/withApi';
export { withProtectedApi } from '@/server/lib/withApi';
export { withAdminApi } from '@/server/lib/withApi';
export { withPaginatedApi } from '@/server/lib/withApi';
export type {
  ApiHandlerContext,
  PaginatedApiHandlerContext,
  ProtectedApiHandlerContext,
  ProtectedPaginatedApiHandlerContext,
} from '@/server/lib/withApi';
export type { ApiErrorCode } from '@/server/lib/errors';
export { ApiError, isApiError, toApiError } from '@/server/lib/errors';
export {
  getPublicIngestAllowedOriginPatterns,
  getPublicIngestAllowedOrigins,
  resolveRequestSiteContext,
  SITE_IDS,
  type SiteId,
} from '@/server/sites/siteContext';
