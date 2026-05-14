import { env } from '@/server/config/env';
import { logger } from '@/server/lib/logger';
import type { ClientProjectCreateInput } from '@/server/forms/client-project/clientProject.types';
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
  };
}

export async function sendClientProjectLeadToCrmBestEffort(input: {
  parsed: ClientProjectCreateInput;
}): Promise<void> {
  const crmCaptureLeadUrl = env.crmCaptureLeadUrl ?? DEFAULT_CRM_CAPTURE_LEAD_URL;

  const payload = buildCrmCaptureLeadPayload(input.parsed);

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
        status: response.status,
        statusText: response.statusText,
        crmCaptureLeadUrl,
        responseText,
        platform: payload.platform,
      });
      return;
    }

    logger.info('client_project_crm_capture_succeeded', {
      status: response.status,
      statusText: response.statusText,
      crmCaptureLeadUrl,
      responseText,
      platform: payload.platform,
    });
  } catch (error) {
    logger.warn('client_project_crm_capture_failed', {
      crmCaptureLeadUrl,
      platform: payload.platform,
      error,
    });
  }
}
