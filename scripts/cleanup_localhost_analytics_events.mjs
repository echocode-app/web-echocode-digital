import { getFirestore } from 'firebase-admin/firestore';
import {
  getFirebaseAdminApp,
  loadLocalEnv,
  parseArgs,
  parseBooleanFlag,
} from './shared/firebase_admin_script.utils.mjs';

const SCAN_PAGE_SIZE = 500;
const DELETE_BATCH_SIZE = 400;

function normalizeHostCandidate(value) {
  const normalized = typeof value === 'string' ? value.trim() : '';
  if (!normalized) return null;

  try {
    return new URL(normalized).host.toLowerCase();
  } catch {
    return normalized
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '')
      .trim();
  }
}

function isLocalhostHost(host) {
  const normalized = normalizeHostCandidate(host);
  if (!normalized) return false;

  return (
    normalized === 'localhost' ||
    normalized.startsWith('localhost:') ||
    normalized === '127.0.0.1' ||
    normalized.startsWith('127.0.0.1:') ||
    normalized === '0.0.0.0' ||
    normalized.startsWith('0.0.0.0:') ||
    normalized === '[::1]' ||
    normalized.startsWith('[::1]:') ||
    normalized === '::1'
  );
}

function readMetadata(record) {
  const value = record?.metadata;
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value;
}

function readString(record, key) {
  const value = record?.[key];
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function isLocalhostAnalyticsEvent(record) {
  const metadata = readMetadata(record) ?? {};

  if (metadata.isLocalhost === true) {
    return true;
  }

  return [
    readString(record, 'siteHost'),
    readString(metadata, 'siteHost'),
    readString(metadata, 'runtimeHost'),
    readString(metadata, 'requestHost'),
    readString(metadata, 'url'),
    readString(metadata, 'referrer'),
  ].some((candidate) => isLocalhostHost(candidate));
}

function buildInput(argv) {
  const args = parseArgs(argv);

  return {
    apply: parseBooleanFlag(args.get('apply'), false),
  };
}

async function main() {
  loadLocalEnv();

  const input = buildInput(process.argv.slice(2));
  const firestore = getFirestore(getFirebaseAdminApp());

  let cursor = null;
  let scanned = 0;
  let matched = 0;
  let deleted = 0;
  const matchedRefs = [];
  const sample = [];
  const eventTypeCounts = new Map();

  while (true) {
    let query = firestore
      .collection('analytics_events')
      .orderBy('__name__')
      .limit(SCAN_PAGE_SIZE);

    if (cursor) {
      query = query.startAfter(cursor);
    }

    const snapshot = await query.get();
    if (snapshot.empty) break;

    for (const doc of snapshot.docs) {
      scanned += 1;
      const data = doc.data();

      if (!isLocalhostAnalyticsEvent(data)) {
        continue;
      }

      matched += 1;
      matchedRefs.push(doc.ref);

      const eventType = readString(data, 'eventType') ?? 'unknown';
      eventTypeCounts.set(eventType, (eventTypeCounts.get(eventType) ?? 0) + 1);

      if (sample.length < 12) {
        const metadata = readMetadata(data) ?? {};
        sample.push({
          id: doc.id,
          eventType,
          siteHost: readString(data, 'siteHost'),
          runtimeHost: readString(metadata, 'runtimeHost'),
          url: readString(metadata, 'url'),
          referrer: readString(metadata, 'referrer'),
        });
      }
    }

    cursor = snapshot.docs[snapshot.docs.length - 1] ?? null;
    if (snapshot.size < SCAN_PAGE_SIZE) break;
  }

  const eventTypeBreakdown = Array.from(eventTypeCounts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([eventType, count]) => ({ eventType, count }));

  console.log(
    JSON.stringify(
      {
        mode: input.apply ? 'apply' : 'dry-run',
        scanned,
        matched,
        deleted: 0,
        eventTypeBreakdown,
        sample,
      },
      null,
      2,
    ),
  );

  if (!input.apply || matchedRefs.length === 0) {
    if (!input.apply) {
      console.log('next terminal command: npm run cleanup:analytics-localhost -- --apply');
    }

    return;
  }

  for (let index = 0; index < matchedRefs.length; index += DELETE_BATCH_SIZE) {
    const batch = firestore.batch();
    const chunk = matchedRefs.slice(index, index + DELETE_BATCH_SIZE);

    chunk.forEach((ref) => batch.delete(ref));
    await batch.commit();
    deleted += chunk.length;
  }

  console.log(JSON.stringify({ mode: 'apply', scanned, matched, deleted }, null, 2));
}

main().catch((error) => {
  console.error('localhost analytics cleanup failed');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
