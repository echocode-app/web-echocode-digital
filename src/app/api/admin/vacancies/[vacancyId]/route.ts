import {
  managedVacancyIdSchema,
  updateAdminVacancy,
  updateAdminVacancySchema,
} from '@/server/vacancies';
import { withAdminApi } from '@/server/lib';
import { ApiError } from '@/server/lib/errors';

export const runtime = 'nodejs';

export const PATCH = withAdminApi(
  async ({ auth, body, req }) => {
    const segments = req.nextUrl.pathname.split('/').filter(Boolean);
    const vacancyId = decodeURIComponent(segments[segments.length - 1] ?? '').trim();

    if (!vacancyId) {
      throw ApiError.fromCode('BAD_REQUEST', 'Missing vacancyId path parameter');
    }

    const parsedVacancyId = managedVacancyIdSchema.parse(vacancyId);

    return updateAdminVacancy({
      vacancyId: parsedVacancyId,
      isPublished: body.isPublished,
      hotPosition: body.hotPosition,
      level: Object.prototype.hasOwnProperty.call(body, 'level') ? (body.level ?? null) : undefined,
      adminUid: auth.uid,
      adminEmail: auth.email,
    });
  },
  {
    permissions: 'vacancies.manage',
    bodySchema: updateAdminVacancySchema,
  },
);
