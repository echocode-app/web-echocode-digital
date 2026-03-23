import { parseClientProjectCreatePayload } from '@/server/forms/client-project/clientProject.validation';
import { createClientSubmissionRecord } from '@/server/forms/client-project/clientProject.repository';
import { resolveEventAttribution, trackEventBestEffort } from '@/server/analytics';
import { resolveClientSubmissionImageUrl } from '@/server/forms/client-project/clientProject.upload.service';
import type { CreateClientSubmissionResponseDto } from '@/server/forms/client-project/clientProject.types';

export async function createClientProjectSubmission(input: {
  rawBody: unknown;
  requestHeaders?: Headers;
}): Promise<CreateClientSubmissionResponseDto> {
  const eventAttribution = resolveEventAttribution({
    rawBody: input.rawBody,
    headers: input.requestHeaders,
  });
  const parsed = parseClientProjectCreatePayload(input.rawBody);

  const imageUrl = await resolveClientSubmissionImageUrl(parsed.image);

  const created = await createClientSubmissionRecord({
    payload: parsed,
    imageUrl,
  });

  const sessionId = input.requestHeaders?.get('x-client-session-id')?.trim() || null;

  await trackEventBestEffort({
    eventType: 'submit_project',
    headers: input.requestHeaders,
    metadata: {
      source: 'client_project_modal',
      submissionId: created.id,
      hasAttachment: Boolean(parsed.image),
      ...(eventAttribution
        ? {
            attribution: {
              source: eventAttribution.source,
              medium: eventAttribution.medium ?? null,
              campaign: eventAttribution.campaign ?? null,
            },
          }
        : {}),
      ...(sessionId ? { sessionId } : {}),
    },
  });

  return created;
}
