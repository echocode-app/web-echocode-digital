import {
  getClientAnalyticsContextPayload,
  getClientAnalyticsHeaders,
} from '@/components/analytics/clientAnalytics';
import { CandidateSubmissionPayload } from '../types/candidate';

export async function submitCandidate(
  payload: CandidateSubmissionPayload,
  turnstileToken: string,
) {
  const analyticsContext = getClientAnalyticsContextPayload();
  const res = await fetch('/api/forms/vacancy-submissions', {
    method: 'POST',
    headers: getClientAnalyticsHeaders(),
    body: JSON.stringify({
      ...payload,
      ...analyticsContext,
      turnstileToken,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Submission failed:', text);
    throw new Error(`Submission failed: ${res.status}`);
  }

  return { success: true };
}
