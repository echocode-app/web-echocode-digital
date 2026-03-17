import { getFirestore } from 'firebase-admin/firestore';
import {
  ensureScriptEnv,
  getStorageBucket,
} from './shared/digital_smoke.utils.mjs';
import {
  normalizeOptionalString,
  parseBooleanFlag,
  parseArgs,
} from './shared/firebase_admin_script.utils.mjs';

const VACANCY_SUBMISSIONS_COLLECTION = 'vacancy_submissions';
const ANALYTICS_COLLECTION = 'analytics_events';
const EVENT_SCAN_LIMIT = 4000;
const SUBMISSION_SCAN_LIMIT = 4000;
const STORAGE_PREFIXES = ['uploads/submissions/tmp/', 'uploads/submissions/vacancy/'];

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function startsWithInsensitive(value, needle) {
  return normalizeString(value).toLowerCase().startsWith(needle);
}

function extractMetadata(data) {
  return data?.metadata && typeof data.metadata === 'object' ? data.metadata : {};
}

function extractAttribution(metadata) {
  return metadata?.attribution && typeof metadata.attribution === 'object'
    ? metadata.attribution
    : {};
}

function isVacancySubmissionTestDoc(data) {
  const profileUrl = normalizeString(data.profileUrl).toLowerCase();
  const cvName = normalizeString(data.cvName).toLowerCase();
  const cvPath = normalizeString(data.cvPath).toLowerCase();
  const vacancy = data?.vacancy && typeof data.vacancy === 'object' ? data.vacancy : {};
  const vacancyId = normalizeString(vacancy.vacancyId).toLowerCase();
  const vacancySlug = normalizeString(vacancy.vacancySlug).toLowerCase();
  const vacancyTitle = normalizeString(vacancy.vacancyTitle).toLowerCase();
  const vacancyKey = normalizeString(data.vacancyKey).toLowerCase();

  return (
    profileUrl.includes('linkedin.com/in/mock') ||
    profileUrl.includes('linkedin.com/in/smoke-') ||
    cvName.includes('mock-vacancy') ||
    cvName.includes('smoke-') ||
    cvPath.includes('/tmp/') ||
    startsWithInsensitive(vacancyId, 'smoke-') ||
    startsWithInsensitive(vacancySlug, 'smoke-') ||
    vacancyTitle.includes('smoke test vacancy') ||
    startsWithInsensitive(vacancyKey, 'smoke-')
  );
}

function isVacancyAnalyticsTestDoc(data, linkedSubmissionIds) {
  const metadata = extractMetadata(data);
  const attribution = extractAttribution(metadata);
  const submissionId = normalizeString(metadata.submissionId);
  const vacancyKey = normalizeString(metadata.vacancyKey).toLowerCase();
  const vacancyId = normalizeString(metadata.vacancyId).toLowerCase();
  const vacancySlug = normalizeString(metadata.vacancySlug).toLowerCase();
  const vacancyTitle = normalizeString(metadata.vacancyTitle).toLowerCase();
  const source = normalizeString(metadata.source).toLowerCase();
  const stage = normalizeString(metadata.stage).toLowerCase();
  const campaign = normalizeString(attribution.campaign).toLowerCase();
  const attributionSource = normalizeString(attribution.source).toLowerCase();

  return (
    linkedSubmissionIds.has(submissionId) ||
    attributionSource === 'smoke_test' ||
    source.includes('smoke_') ||
    campaign.includes('smoke-') ||
    stage === 'candidate_not_implemented' ||
    startsWithInsensitive(vacancyKey, 'smoke-') ||
    startsWithInsensitive(vacancyId, 'smoke-') ||
    startsWithInsensitive(vacancySlug, 'smoke-') ||
    vacancyTitle.includes('smoke test vacancy')
  );
}

function shouldDeleteStorageObject(path) {
  const normalized = normalizeString(path).toLowerCase();
  if (!normalized) return false;

  return (
    STORAGE_PREFIXES.some((prefix) => normalized.startsWith(prefix)) &&
    (normalized.includes('mock-vacancy') || normalized.includes('smoke-'))
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const apply = parseBooleanFlag(args.get('apply'), false);
  const verbose = parseBooleanFlag(args.get('verbose'), true);
  const only = normalizeOptionalString(args.get('only'))?.toLowerCase();

  await ensureScriptEnv();

  const firestore = getFirestore();
  const bucket = getStorageBucket();

  const summary = {
    scannedVacancySubmissions: 0,
    matchedVacancySubmissions: 0,
    scannedAnalytics: 0,
    matchedAnalytics: 0,
    matchedStorageObjects: 0,
    deletedVacancySubmissions: 0,
    deletedAnalytics: 0,
    deletedStorageObjects: 0,
  };

  const vacancyDocsToDelete = [];
  const linkedSubmissionIds = new Set();
  const storagePaths = new Set();

  if (!only || only === 'submissions' || only === 'all') {
    const vacancySnapshot = await firestore
      .collection(VACANCY_SUBMISSIONS_COLLECTION)
      .limit(SUBMISSION_SCAN_LIMIT)
      .get();

    summary.scannedVacancySubmissions = vacancySnapshot.size;

    for (const doc of vacancySnapshot.docs) {
      const data = doc.data();
      if (!isVacancySubmissionTestDoc(data)) continue;
      vacancyDocsToDelete.push(doc);
      linkedSubmissionIds.add(doc.id);
      summary.matchedVacancySubmissions += 1;

      const cvPath = normalizeString(data.cvPath);
      if (shouldDeleteStorageObject(cvPath)) {
        storagePaths.add(cvPath);
      }
    }
  }

  const analyticsDocsToDelete = [];

  if (!only || only === 'analytics' || only === 'all') {
    const analyticsSnapshot = await firestore
      .collection(ANALYTICS_COLLECTION)
      .orderBy('timestamp', 'desc')
      .limit(EVENT_SCAN_LIMIT)
      .get();

    summary.scannedAnalytics = analyticsSnapshot.size;

    for (const doc of analyticsSnapshot.docs) {
      const data = doc.data();
      const eventType = normalizeString(data.eventType);
      if (!['submit_vacancy', 'apply_vacancy'].includes(eventType)) continue;
      if (!isVacancyAnalyticsTestDoc(data, linkedSubmissionIds)) continue;
      analyticsDocsToDelete.push(doc);
      summary.matchedAnalytics += 1;
    }
  }

  summary.matchedStorageObjects = storagePaths.size;

  if (verbose) {
    console.log(
      JSON.stringify(
        {
          mode: apply ? 'apply' : 'dry-run',
          only: only ?? 'all',
          ...summary,
          sampleVacancySubmissionIds: vacancyDocsToDelete.slice(0, 10).map((doc) => doc.id),
          sampleAnalyticsIds: analyticsDocsToDelete.slice(0, 10).map((doc) => doc.id),
          sampleStoragePaths: Array.from(storagePaths).slice(0, 10),
        },
        null,
        2,
      ),
    );
  }

  if (!apply) {
    return;
  }

  for (const doc of vacancyDocsToDelete) {
    await doc.ref.delete();
    summary.deletedVacancySubmissions += 1;
  }

  for (const doc of analyticsDocsToDelete) {
    await doc.ref.delete();
    summary.deletedAnalytics += 1;
  }

  for (const path of storagePaths) {
    try {
      await bucket.file(path).delete({ ignoreNotFound: true });
      summary.deletedStorageObjects += 1;
    } catch {
      // Ignore missing or already-cleaned storage objects.
    }
  }

  console.log(
    JSON.stringify(
      {
        mode: 'applied',
        only: only ?? 'all',
        ...summary,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
