import { resolveEventAttribution, trackEventBestEffort } from '@/server/analytics';
import { createEmailSubmissionRecord } from '@/server/forms/email-submission/emailSubmission.repository';
import { parseEmailSubmissionCreatePayload } from '@/server/forms/email-submission/emailSubmission.validation';
import { verifyTurnstileToken } from '@/server/lib/turnstile';
import type { CreateEmailSubmissionResponseDto } from '@/server/forms/email-submission/emailSubmission.types';

export async function createEmailSubmission(input: {
  rawBody: unknown;
  requestHeaders?: Headers;
}): Promise<CreateEmailSubmissionResponseDto> {
  const eventAttribution = resolveEventAttribution({
    rawBody: input.rawBody,
    headers: input.requestHeaders,
  });
  const parsed = parseEmailSubmissionCreatePayload(input.rawBody);

  // Require Turnstile before records are written.
  await verifyTurnstileToken({
    token: parsed.turnstileToken,
    requestHeaders: input.requestHeaders,
  });

  const created = await createEmailSubmissionRecord({
    payload: parsed,
  });

  await trackEventBestEffort({
    eventType: 'submit_email',
    headers: input.requestHeaders,
    metadata: {
      source: parsed.source ?? 'footer_mobile',
      submissionId: created.id,
      ...(eventAttribution
        ? {
            attribution: {
              source: eventAttribution.source,
              medium: eventAttribution.medium ?? null,
              campaign: eventAttribution.campaign ?? null,
            },
          }
        : {}),
    },
  });

  return created;
}
