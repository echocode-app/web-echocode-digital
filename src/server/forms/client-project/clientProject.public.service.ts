import { after } from 'next/server';
import { parseClientProjectCreatePayload } from '@/server/forms/client-project/clientProject.validation';
import { createClientSubmissionRecord } from '@/server/forms/client-project/clientProject.repository';
import { resolveEventAttribution, trackEventBestEffort } from '@/server/analytics';
import { sendClientProjectLeadToCrmBestEffort } from '@/server/forms/client-project/clientProject.crm.service';
import { getClientProjectTrackingKeys } from '@/server/forms/client-project/clientProject.tracking';
import { resolveClientSubmissionImageUrl } from '@/server/forms/client-project/clientProject.upload.service';
import { logger } from '@/server/lib/logger';
import { verifyTurnstileTokenFromBody } from '@/server/lib/turnstile';
import type { CreateClientSubmissionResponseDto } from '@/server/forms/client-project/clientProject.types';

function resolveClientProjectSource(rawBody: unknown): 'client_project_modal' | 'client_project_footer' {
  if (typeof rawBody !== 'object' || rawBody === null || Array.isArray(rawBody)) {
    return 'client_project_modal';
  }

  return (rawBody as Record<string, unknown>).source === 'client_project_footer'
    ? 'client_project_footer'
    : 'client_project_modal';
}

export async function createClientProjectSubmission(input: {
  rawBody: unknown;
  requestHeaders?: Headers;
}): Promise<CreateClientSubmissionResponseDto> {
  const source = resolveClientProjectSource(input.rawBody);
  const eventAttribution = resolveEventAttribution({
    rawBody: input.rawBody,
    headers: input.requestHeaders,
  });
  // Require Turnstile before payload validation, uploads, or records are written.
  await verifyTurnstileTokenFromBody({
    rawBody: input.rawBody,
    requestHeaders: input.requestHeaders,
    expectedAction: 'client-project',
  });
  const parsed = parseClientProjectCreatePayload(input.rawBody);

  const imageUrl = await resolveClientSubmissionImageUrl(parsed.image);

  const created = await createClientSubmissionRecord({
    payload: parsed,
    imageUrl,
  });

  const trackingKeys = getClientProjectTrackingKeys(parsed);
  const hasAttachment = Boolean(parsed.image);

  logger.info('client_project_submit_persisted', {
    submissionId: created.id,
    source,
    hasAttachment,
    hasTracking: trackingKeys.length > 0,
    trackingKeys,
    crmCaptureScheduled: true,
  });

  after(() =>
    sendClientProjectLeadToCrmBestEffort({
      parsed,
      submissionId: created.id,
      source,
      hasAttachment,
    }),
  );

  const sessionId = input.requestHeaders?.get('x-client-session-id')?.trim() || null;

  await trackEventBestEffort({
    eventType: 'submit_project',
    headers: input.requestHeaders,
    metadata: {
      source,
      submissionId: created.id,
      hasAttachment,
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
