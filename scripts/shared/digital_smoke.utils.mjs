import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import {
  getFirebaseAdminApp,
  loadLocalEnv,
  normalizeOptionalString,
  parseArgs,
} from './firebase_admin_script.utils.mjs';

const SMOKE_MANIFEST_DIR = join(tmpdir(), 'echocode-digital-smoke');
const DEFAULT_BASE_URL = 'http://127.0.0.1:3000';
const ANALYTICS_SCAN_LIMIT = 1000;

export function generateRunId() {
  return `digital-${Date.now().toString(36)}-${randomUUID().slice(0, 8)}`;
}

export function resolveBaseUrl(value) {
  const raw = normalizeOptionalString(value) ?? normalizeOptionalString(process.env.BASE_URL);
  return raw ?? DEFAULT_BASE_URL;
}

export function buildDigitalSmokeArtifacts(runId) {
  const tag = `smoke-${runId}`;

  return {
    runId,
    tag,
    sessionId: `sess-${tag}`,
    attribution: {
      source: 'smoke_test',
      medium: 'automation',
      campaign: tag,
    },
    pageView: {
      path: `/smoke/${tag}`,
      title: `Smoke ${runId}`,
      referrer: 'https://www.google.com/search?q=echocode+smoke',
      source: `smoke_page_view_${runId}`,
    },
    emailSubmission: {
      email: `${tag}@echocode.test`,
      source: `smoke_footer_${runId}`,
    },
    clientProject: {
      firstName: 'Smoke',
      lastName: 'Digital',
      email: `client-${tag}@echocode.test`,
      description: `Smoke test client project ${runId}`,
    },
    vacancy: {
      profileUrl: `https://linkedin.com/in/${tag}`,
      vacancyId: `smoke-${runId}`,
      vacancySlug: `smoke-${runId}`,
      vacancyTitle: 'Smoke Test Vacancy',
      level: 'Senior',
      conditions: ['Engineering', 'Remote'],
      employmentType: 'Remote / Full-time',
      fileName: `${tag}.pdf`,
    },
  };
}

export async function ensureScriptEnv() {
  loadLocalEnv();
  return getFirebaseAdminApp();
}

export function getFirestoreDb() {
  return getFirestore(getFirebaseAdminApp());
}

export function getStorageBucket() {
  return getStorage(getFirebaseAdminApp()).bucket(
    process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  );
}

export function getSmokeManifestPath(runId) {
  return join(SMOKE_MANIFEST_DIR, `${runId}.json`);
}

export async function saveSmokeManifest(runId, payload) {
  await mkdir(SMOKE_MANIFEST_DIR, { recursive: true });
  await writeFile(getSmokeManifestPath(runId), JSON.stringify(payload, null, 2), 'utf8');
}

export async function readSmokeManifest(runId) {
  try {
    const raw = await readFile(getSmokeManifestPath(runId), 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function removeSmokeManifest(runId) {
  await rm(getSmokeManifestPath(runId), { force: true });
}

export async function waitFor(label, producer, options = {}) {
  const attempts = options.attempts ?? 12;
  const intervalMs = options.intervalMs ?? 500;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const result = await producer();
    if (result) {
      return result;
    }

    if (attempt < attempts) {
      await sleep(intervalMs);
    }
  }

  throw new Error(`Timed out while waiting for ${label}`);
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export function buildPdfBytes(runId) {
  const body = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 44 >>
stream
BT /F1 18 Tf 24 96 Td (${runId}) Tj ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000061 00000 n 
0000000118 00000 n 
0000000205 00000 n 
trailer
<< /Root 1 0 R /Size 5 >>
startxref
299
%%EOF`;

  return Buffer.from(body, 'utf8');
}

export async function cleanupDigitalSmokeData({ runId, uploadPath = null, verbose = true }) {
  await ensureScriptEnv();

  const firestore = getFirestoreDb();
  const bucket = getStorageBucket();
  const artifacts = buildDigitalSmokeArtifacts(runId);
  const manifest = await readSmokeManifest(runId);
  const trackedUploadPath = uploadPath ?? manifest?.uploadPath ?? null;
  const trackedSubmissionIds = Array.isArray(manifest?.submissionIds) ? manifest.submissionIds : [];

  const emailSnapshot = await firestore
    .collection('email_submissions')
    .where('email', '==', artifacts.emailSubmission.email)
    .get();
  await Promise.all(emailSnapshot.docs.map((doc) => doc.ref.delete()));

  const clientSnapshot = await firestore
    .collection('client_submissions')
    .where('email', '==', artifacts.clientProject.email)
    .get();
  await Promise.all(clientSnapshot.docs.map((doc) => doc.ref.delete()));

  const vacancySnapshot = await firestore
    .collection('vacancy_submissions')
    .where('profileUrl', '==', artifacts.vacancy.profileUrl)
    .get();
  await Promise.all(vacancySnapshot.docs.map((doc) => doc.ref.delete()));

  const submissionIds = new Set([
    ...trackedSubmissionIds,
    ...emailSnapshot.docs.map((doc) => doc.id),
    ...clientSnapshot.docs.map((doc) => doc.id),
    ...vacancySnapshot.docs.map((doc) => doc.id),
  ]);

  const analyticsSnapshot = await firestore
    .collection('analytics_events')
    .orderBy('timestamp', 'desc')
    .limit(ANALYTICS_SCAN_LIMIT)
    .get();

  const analyticsDocsToDelete = analyticsSnapshot.docs.filter((doc) => {
    const data = doc.data();
    const metadata = data.metadata && typeof data.metadata === 'object' ? data.metadata : {};
    const attribution =
      metadata.attribution && typeof metadata.attribution === 'object' ? metadata.attribution : {};

    return (
      metadata.path === artifacts.pageView.path ||
      metadata.sessionId === artifacts.sessionId ||
      metadata.source === artifacts.emailSubmission.source ||
      submissionIds.has(metadata.submissionId) ||
      attribution.campaign === artifacts.attribution.campaign
    );
  });

  await Promise.all(analyticsDocsToDelete.map((doc) => doc.ref.delete()));

  if (trackedUploadPath) {
    await bucket.file(trackedUploadPath).delete({ ignoreNotFound: true });
  }

  await removeSmokeManifest(runId);

  if (verbose) {
    console.log(`cleanup completed for ${runId}`);
  }
}

export async function fetchJson(url, init = {}) {
  const response = await fetch(url, init);
  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  return {
    ok: response.ok,
    status: response.status,
    headers: response.headers,
    data,
  };
}

export function parseSmokeArgs(argv) {
  return parseArgs(argv);
}
