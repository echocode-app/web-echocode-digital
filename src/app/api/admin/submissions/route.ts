import { ApiError, withApi } from '@/server/lib';
import { listSubmissions, listSubmissionsQuerySchema } from '@/server/submissions/submissions.list.service';

export const runtime = 'nodejs';

export const GET = withApi(
  async ({ query }) => {
    if (!query) {
      throw ApiError.fromCode(
        'INTERNAL_ERROR',
        'Validated query is required for submissions list endpoint',
      );
    }

    return listSubmissions({
      query,
    });
  },
  {
    auth: true,
    permissions: 'submissions.read',
    querySchema: listSubmissionsQuerySchema,
  },
);
