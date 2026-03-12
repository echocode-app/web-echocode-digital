import { CandidateSubmissionPayload } from '../types/candidate';

export async function submitCandidate(payload: CandidateSubmissionPayload) {
  const res = await fetch('/api/forms/vacancy-submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Submission failed:', text);
    throw new Error(`Submission failed: ${res.statusText}`);
  }

  return { success: true };
}
