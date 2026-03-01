import { getAdminClientSubmissionDetails } from '@/server/forms/client-project';
import { withAdminApi } from '@/server/lib';
import { ApiError } from '@/server/lib/errors';

export const runtime = 'nodejs';

export const GET = withAdminApi(
  async ({ auth, req }) => {
    const segments = req.nextUrl.pathname.split('/').filter(Boolean);
    const submissionId = decodeURIComponent(segments[segments.length - 1] ?? '').trim();

    if (!submissionId) {
      throw ApiError.fromCode('BAD_REQUEST', 'Missing submissionId path parameter');
    }

    return getAdminClientSubmissionDetails({
      submissionId,
      adminUid: auth.uid,
      adminEmail: auth.email,
    });
  },
  {
    permissions: 'submissions.read',
  },
);
