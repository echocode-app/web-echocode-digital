import { env } from '@/server/config/env';
import { logger } from '@/server/lib/logger';
import type { ClientProjectCreateInput } from '@/server/forms/client-project/clientProject.types';
import { getClientProjectTrackingKeys } from '@/server/forms/client-project/clientProject.tracking';
import { buildPhoneE164 } from '@/shared/validation/submissions.common';

const DEFAULT_CRM_CAPTURE_LEAD_URL =
  'https://crmechodgtllead.netlify.app/.netlify/functions/capture-lead';
const CRM_CAPTURE_TIMEOUT_MS = 10_000;
const CRM_LEAD_PLATFORM = 'Сайт';

type CrmCaptureLeadPayload = {
  name: string;
  phone: string;
  email: string;
  platform: string;
  message?: string;
  gclid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
};

async function readResponseBodySafe(response: Response): Promise<string> {
  try {
    const text = await response.text();
    return text.slice(0, 1_000);
  } catch {
    return '';
  }
}

function buildCrmCaptureLeadPayload(parsed: ClientProjectCreateInput): CrmCaptureLeadPayload {
  const message = parsed.description?.trim();

  return {
    name: parsed.firstName,
    phone: buildPhoneE164(parsed.countryCode, parsed.phone),
    email: parsed.email,
    platform: CRM_LEAD_PLATFORM,
    ...(message ? { message } : {}),
    ...(parsed.gclid ? { gclid: parsed.gclid } : {}),
    ...(parsed.utm_source ? { utm_source: parsed.utm_source } : {}),
    ...(parsed.utm_medium ? { utm_medium: parsed.utm_medium } : {}),
    ...(parsed.utm_campaign ? { utm_campaign: parsed.utm_campaign } : {}),
    ...(parsed.utm_term ? { utm_term: parsed.utm_term } : {}),
    ...(parsed.utm_content ? { utm_content: parsed.utm_content } : {}),
  };
}

export async function sendClientProjectLeadToCrmBestEffort(input: {
  parsed: ClientProjectCreateInput;
  submissionId: string;
  source: 'client_project_modal' | 'client_project_footer';
  hasAttachment: boolean;
}): Promise<void> {
  const crmCaptureLeadUrl = env.crmCaptureLeadUrl ?? DEFAULT_CRM_CAPTURE_LEAD_URL;

  const payload = buildCrmCaptureLeadPayload(input.parsed);
  const trackingKeys = getClientProjectTrackingKeys(input.parsed);
  const payloadKeys = Object.keys(payload).sort();

  logger.info('client_project_crm_capture_started', {
    submissionId: input.submissionId,
    source: input.source,
    hasAttachment: input.hasAttachment,
    hasTracking: trackingKeys.length > 0,
    trackingKeys,
    payloadKeys,
    crmCaptureLeadUrl,
    platform: payload.platform,
  });

  try {
    const response = await fetch(crmCaptureLeadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(CRM_CAPTURE_TIMEOUT_MS),
    });

    const responseText = await readResponseBodySafe(response);

    if (!response.ok) {
      logger.warn('client_project_crm_capture_failed', {
        submissionId: input.submissionId,
        source: input.source,
        status: response.status,
        statusText: response.statusText,
        crmCaptureLeadUrl,
        responseText,
        platform: payload.platform,
        hasAttachment: input.hasAttachment,
        hasTracking: trackingKeys.length > 0,
        trackingKeys,
        payloadKeys,
      });
      return;
    }

    logger.info('client_project_crm_capture_succeeded', {
      submissionId: input.submissionId,
      source: input.source,
      status: response.status,
      statusText: response.statusText,
      crmCaptureLeadUrl,
      responseText,
      platform: payload.platform,
      hasAttachment: input.hasAttachment,
      hasTracking: trackingKeys.length > 0,
      trackingKeys,
      payloadKeys,
    });
  } catch (error) {
    logger.warn('client_project_crm_capture_failed', {
      submissionId: input.submissionId,
      source: input.source,
      crmCaptureLeadUrl,
      platform: payload.platform,
      hasAttachment: input.hasAttachment,
      hasTracking: trackingKeys.length > 0,
      trackingKeys,
      payloadKeys,
      error,
    });
  }
}
