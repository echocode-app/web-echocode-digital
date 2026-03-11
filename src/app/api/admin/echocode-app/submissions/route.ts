import { z } from 'zod';
import { listAdminEchocodeAppSubmissions } from '@/server/admin';
import { withAdminApi } from '@/server/lib';
import { SUBMISSION_LIST_STATUSES } from '@/server/submissions/submissions.types';

export const runtime = 'nodejs';

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(20).default(20),
  cursor: z.string().trim().min(1).optional(),
  status: z.enum(SUBMISSION_LIST_STATUSES).optional(),
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
});

export const GET = withAdminApi(
  async ({ query }) => {
    return listAdminEchocodeAppSubmissions(query);
  },
  {
    permissions: 'submissions.read',
    querySchema,
  },
);
