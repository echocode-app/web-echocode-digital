import { trackEventBestEffort } from '@/server/analytics';
import { createEmailSubmissionRecord } from '@/server/forms/email-submission/emailSubmission.repository';
import { parseEmailSubmissionCreatePayload } from '@/server/forms/email-submission/emailSubmission.validation';
import type { CreateEmailSubmissionResponseDto } from '@/server/forms/email-submission/emailSubmission.types';

export async function createEmailSubmission(input: {
  rawBody: unknown;
  requestHeaders?: Headers;
}): Promise<CreateEmailSubmissionResponseDto> {
  const parsed = parseEmailSubmissionCreatePayload(input.rawBody);

  const created = await createEmailSubmissionRecord({
    payload: parsed,
  });

  await trackEventBestEffort({
    eventType: 'submit_email',
    headers: input.requestHeaders,
    metadata: {
      source: parsed.source ?? 'footer_mobile',
      submissionId: created.id,
    },
  });

  return created;
}
