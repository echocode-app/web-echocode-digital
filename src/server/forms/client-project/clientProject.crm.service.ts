import { env } from '@/server/config/env';
import { logger } from '@/server/lib/logger';
import type { ClientProjectCreateInput } from '@/server/forms/client-project/clientProject.types';
import { buildPhoneE164 } from '@/shared/validation/submissions.common';

const CRM_CAPTURE_TIMEOUT_MS = 1_500;
const CRM_LEAD_PLATFORM = 'Сайт';

type CrmCaptureLeadPayload = {
  name: string;
  phone: string;
  email: string;
  platform: string;
  message?: string;
};

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
  const crmCaptureLeadUrl = env.crmCaptureLeadUrl;
  if (!crmCaptureLeadUrl) {
    logger.warn('client_project_crm_capture_skipped', {
      reason: 'missing_crm_capture_lead_url',
    });
    return;
  }

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

    if (!response.ok) {
      const responseText = await response.text().catch(() => '');
      logger.warn('client_project_crm_capture_failed', {
        status: response.status,
        crmCaptureLeadUrl,
        responseText: responseText.slice(0, 500),
        platform: payload.platform,
      });
    }
  } catch (error) {
    logger.warn('client_project_crm_capture_failed', {
      crmCaptureLeadUrl,
      platform: payload.platform,
      error,
    });
  }
}
