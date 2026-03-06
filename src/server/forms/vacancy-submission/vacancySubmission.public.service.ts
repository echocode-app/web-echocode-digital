import { trackEventBestEffort } from '@/server/analytics';
import { verifyUploadedProjectAttachment } from '@/server/submissions/submissions.upload.service';
import { createVacancySubmissionRecord, toVacancyKey } from '@/server/forms/vacancy-submission/vacancySubmission.repository';
import {
  assertSafeCvFileName,
  parseVacancySubmissionCreatePayload,
} from '@/server/forms/vacancy-submission/vacancySubmission.validation';
import type { CreateVacancySubmissionResponseDto } from '@/server/forms/vacancy-submission/vacancySubmission.types';

export async function createVacancySubmission(input: {
  rawBody: unknown;
  requestHeaders?: Headers;
}): Promise<CreateVacancySubmissionResponseDto> {
  const parsed = parseVacancySubmissionCreatePayload(input.rawBody);

  assertSafeCvFileName(parsed.cvFile.originalName);

  await verifyUploadedProjectAttachment({
    path: parsed.cvFile.path,
    mimeType: parsed.cvFile.mimeType,
    sizeBytes: parsed.cvFile.sizeBytes,
  });

  const created = await createVacancySubmissionRecord({
    payload: parsed,
  });

  const vacancyKey = toVacancyKey(parsed.vacancy);

  await trackEventBestEffort({
    eventType: 'submit_vacancy',
    headers: input.requestHeaders,
    metadata: {
      submissionId: created.id,
      vacancyKey,
      vacancyId: parsed.vacancy.vacancyId,
      vacancySlug: parsed.vacancy.vacancySlug ?? null,
      vacancyTitle: parsed.vacancy.vacancyTitle ?? null,
      level: parsed.vacancy.level ?? null,
      employmentType: parsed.vacancy.employmentType ?? null,
      hasCv: true,
      hasProfileUrl: true,
    },
  });

  return created;
}
