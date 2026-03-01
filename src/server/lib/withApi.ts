import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ADMIN_ACCESS_PERMISSION } from '@/server/auth/roles';
import { requireAuth, requirePermission, type AuthContext } from '@/server/middlewares';
import { ApiError } from '@/server/lib/errors';
import { handleApiRoute } from '@/server/lib/http';
import { parsePaginationQuery, type PaginationQuery } from '@/server/lib/pagination';
import { getOrCreateRequestId } from '@/server/lib/requestId';
import { validate } from '@/server/lib/validate';

type AnyZodSchema = z.ZodTypeAny;
type InferSchema<TSchema extends AnyZodSchema | undefined> = TSchema extends AnyZodSchema
  ? z.infer<TSchema>
  : undefined;
type PermissionRequirement = Parameters<typeof requirePermission>[1];
type PermissionMode = Parameters<typeof requirePermission>[2];

type AuthOptions = {
  bootstrapAdmin?: boolean;
};

type WithApiOptions<
  TQuerySchema extends AnyZodSchema | undefined,
  TBodySchema extends AnyZodSchema | undefined,
> = {
  auth?: boolean;
  permissions?: PermissionRequirement;
  permissionMode?: PermissionMode;
  querySchema?: TQuerySchema;
  bodySchema?: TBodySchema;
  pagination?: boolean;
  authOptions?: AuthOptions;
};

type WithProtectedApiOptions<
  TQuerySchema extends AnyZodSchema | undefined,
  TBodySchema extends AnyZodSchema | undefined,
> = Omit<WithApiOptions<TQuerySchema, TBodySchema>, 'auth'> &
  (
    | {
        auth: true;
      }
    | {
        auth?: boolean;
        permissions: PermissionRequirement;
      }
  );

type WithPaginatedApiOptions<
  TQuerySchema extends AnyZodSchema | undefined,
  TBodySchema extends AnyZodSchema | undefined,
> = Omit<WithApiOptions<TQuerySchema, TBodySchema>, 'pagination'>;

type WithAdminApiOptions<
  TQuerySchema extends AnyZodSchema | undefined,
  TBodySchema extends AnyZodSchema | undefined,
> = Omit<WithApiOptions<TQuerySchema, TBodySchema>, 'auth' | 'permissions'> & {
  permissions?: PermissionRequirement;
  permissionMode?: PermissionMode;
};

export type ApiHandlerContext<TQuery = undefined, TBody = undefined> = {
  req: NextRequest;
  requestId: string;
  auth: AuthContext | null;
  query: TQuery;
  body: TBody;
  pagination: PaginationQuery | null;
};

export type ProtectedApiHandlerContext<TQuery = undefined, TBody = undefined> = Omit<
  ApiHandlerContext<TQuery, TBody>,
  'auth'
> & {
  auth: AuthContext;
};

export type PaginatedApiHandlerContext<TQuery = undefined, TBody = undefined> = Omit<
  ApiHandlerContext<TQuery, TBody>,
  'pagination'
> & {
  pagination: PaginationQuery;
};

export type ProtectedPaginatedApiHandlerContext<TQuery = undefined, TBody = undefined> = Omit<
  ProtectedApiHandlerContext<TQuery, TBody>,
  'pagination'
> & {
  pagination: PaginationQuery;
};

function parseOptionalSchema<TSchema extends AnyZodSchema | undefined>(
  schema: TSchema,
  input: unknown,
): InferSchema<TSchema> {
  if (!schema) return undefined as InferSchema<TSchema>;
  return validate(schema, input) as InferSchema<TSchema>;
}

async function readJsonBody(req: NextRequest): Promise<unknown> {
  const rawBody = await req.text();
  if (!rawBody.trim()) return undefined;

  try {
    return JSON.parse(rawBody) as unknown;
  } catch (cause) {
    throw ApiError.fromCode('INVALID_JSON_BODY', 'Failed to parse request JSON body', {
      cause,
    });
  }
}

/**
 * Unified API route wrapper with request-id, auth, permission checks and input parsing.
 * This keeps endpoint handlers thin and contract-driven.
 */
export function withApi<
  TData,
  TQuerySchema extends AnyZodSchema | undefined = undefined,
  TBodySchema extends AnyZodSchema | undefined = undefined,
>(
  handler: (
    context: ApiHandlerContext<InferSchema<TQuerySchema>, InferSchema<TBodySchema>>,
  ) => Promise<TData> | TData,
  options: WithApiOptions<TQuerySchema, TBodySchema> = {},
): (req: NextRequest) => Promise<NextResponse> {
  return async function wrappedHandler(req: NextRequest): Promise<NextResponse> {
    const requestId = getOrCreateRequestId(req.headers);

    return handleApiRoute(
      async () => {
        const query = parseOptionalSchema(
          options.querySchema,
          Object.fromEntries(req.nextUrl.searchParams.entries()),
        );
        const body = parseOptionalSchema(options.bodySchema, await readJsonBody(req));
        const pagination = options.pagination
          ? parsePaginationQuery(req.nextUrl.searchParams)
          : null;

        let authContext: AuthContext | null = null;
        if (options.auth || options.permissions) {
          authContext = await requireAuth(req, options.authOptions);
        }
        if (authContext && options.permissions) {
          requirePermission(authContext, options.permissions, options.permissionMode ?? 'all');
        }

        return handler({
          req,
          requestId,
          auth: authContext,
          query: query as InferSchema<TQuerySchema>,
          body: body as InferSchema<TBodySchema>,
          pagination,
        });
      },
      { requestId },
    );
  };
}

export function withProtectedApi<
  TData,
  TQuerySchema extends AnyZodSchema | undefined = undefined,
  TBodySchema extends AnyZodSchema | undefined = undefined,
>(
  handler: (
    context: ProtectedApiHandlerContext<InferSchema<TQuerySchema>, InferSchema<TBodySchema>>,
  ) => Promise<TData> | TData,
  options: WithProtectedApiOptions<TQuerySchema, TBodySchema>,
): (req: NextRequest) => Promise<NextResponse> {
  return withApi(
    async (context) => {
      if (!context.auth) {
        throw ApiError.fromCode('UNAUTHORIZED', 'Protected API handler requires auth context');
      }

      return handler({
        ...context,
        auth: context.auth,
      });
    },
    options,
  );
}

/**
 * Specialized list-endpoint wrapper that always enables pagination parsing.
 * Handlers receive a non-null pagination contract by type and runtime guarantees.
 */
export function withPaginatedApi<
  TData,
  TQuerySchema extends AnyZodSchema | undefined = undefined,
  TBodySchema extends AnyZodSchema | undefined = undefined,
>(
  handler: (
    context: PaginatedApiHandlerContext<InferSchema<TQuerySchema>, InferSchema<TBodySchema>>,
  ) => Promise<TData> | TData,
  options: WithPaginatedApiOptions<TQuerySchema, TBodySchema> = {},
): (req: NextRequest) => Promise<NextResponse> {
  return withApi(
    async (context) => {
      if (!context.pagination) {
        throw ApiError.fromCode(
          'INTERNAL_ERROR',
          'Pagination context is required for paginated API handler',
        );
      }

      return handler({
        ...context,
        pagination: context.pagination,
      });
    },
    {
      ...options,
      pagination: true,
    },
  );
}

/**
 * Admin-only wrapper that enforces auth + admin access permission for route handlers.
 * Use this for every `/api/admin/*` endpoint to keep access policy consistent.
 */
export function withAdminApi<
  TData,
  TQuerySchema extends AnyZodSchema | undefined = undefined,
  TBodySchema extends AnyZodSchema | undefined = undefined,
>(
  handler: (
    context: ProtectedApiHandlerContext<InferSchema<TQuerySchema>, InferSchema<TBodySchema>>,
  ) => Promise<TData> | TData,
  options: WithAdminApiOptions<TQuerySchema, TBodySchema> = {},
): (req: NextRequest) => Promise<NextResponse> {
  const extraPermissions = options.permissions
    ? Array.isArray(options.permissions)
      ? options.permissions
      : [options.permissions]
    : [];
  const permissions = Array.from(new Set([ADMIN_ACCESS_PERMISSION, ...extraPermissions]));

  return withProtectedApi(handler, {
    ...options,
    auth: true,
    permissions,
    permissionMode: 'all',
    authOptions: {
      ...(options.authOptions ?? {}),
      bootstrapAdmin: true,
    },
  });
}
