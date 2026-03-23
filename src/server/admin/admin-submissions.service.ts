import { z } from 'zod';
import { logAdminAction } from '@/server/admin/admin-logs.service';
import { listSubmissions } from '@/server/submissions/submissions.list.service';
import { updateSubmissionStatusRecord } from '@/server/submissions/submissions.repository';
import { SUBMISSION_LIST_STATUSES } from '@/server/submissions/submissions.types';
import type {
  ListSubmissionsQueryInput,
  UpdateSubmissionStatusResponseDto,
} from '@/server/submissions/submissions.types';

export async function getAdminSubmissionsList(query: ListSubmissionsQueryInput) {
  return listSubmissions({ query });
}

export const updateSubmissionStatusSchema = z.object({
  status: z.enum(SUBMISSION_LIST_STATUSES),
});

type UpdateSubmissionStatusInput = z.infer<typeof updateSubmissionStatusSchema>;

export async function setAdminSubmissionStatus(input: {
  submissionId: string;
  payload: UpdateSubmissionStatusInput;
  adminUid: string;
}): Promise<UpdateSubmissionStatusResponseDto> {
  const updated = await updateSubmissionStatusRecord({
    submissionId: input.submissionId,
    status: input.payload.status,
    updatedBy: input.adminUid,
  });

  await logAdminAction({
    adminUid: input.adminUid,
    actionType: 'submissions.status.update',
    entityType: 'submission',
    entityId: updated.updated.id,
    metadata: {
      status: updated.updated.status,
    },
  });

  return updated.updated;
}
