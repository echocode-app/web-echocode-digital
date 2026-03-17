import { getFirestore } from 'firebase-admin/firestore';
import { ensureScriptEnv } from './shared/digital_smoke.utils.mjs';
import { parseArgs, parseBooleanFlag, normalizeOptionalString } from './shared/firebase_admin_script.utils.mjs';

const ANALYTICS_COLLECTION = 'analytics_events';
const SCAN_LIMIT = 5000;
const TARGET_EVENT_TYPES = new Set(['submit_project', 'submit_vacancy']);

function isUploadInitAnalyticsDoc(data) {
  if (!data || typeof data !== 'object') return false;
  if (!TARGET_EVENT_TYPES.has(typeof data.eventType === 'string' ? data.eventType : '')) {
    return false;
  }

  const metadata = data.metadata;
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    return false;
  }

  return metadata.stage === 'upload_init';
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const apply = parseBooleanFlag(args.get('apply'), false);
  const verbose = parseBooleanFlag(args.get('verbose'), true);
  const siteIdFilter = normalizeOptionalString(args.get('site-id'));

  await ensureScriptEnv();

  const firestore = getFirestore();
  const snapshot = await firestore
    .collection(ANALYTICS_COLLECTION)
    .orderBy('timestamp', 'desc')
    .limit(SCAN_LIMIT)
    .get();

  const matchedDocs = snapshot.docs.filter((doc) => {
    const data = doc.data();
    if (!isUploadInitAnalyticsDoc(data)) return false;
    if (siteIdFilter && data.siteId !== siteIdFilter) return false;
    return true;
  });

  const summary = {
    mode: apply ? 'apply' : 'dry-run',
    siteIdFilter: siteIdFilter ?? 'all',
    scanned: snapshot.size,
    matched: matchedDocs.length,
    sample: matchedDocs.slice(0, 20).map((doc) => {
      const data = doc.data();
      const metadata =
        data.metadata && typeof data.metadata === 'object' && !Array.isArray(data.metadata)
          ? data.metadata
          : {};

      return {
        id: doc.id,
        eventType: data.eventType ?? null,
        siteId: data.siteId ?? null,
        siteHost: data.siteHost ?? null,
        source: data.source ?? null,
        stage: metadata.stage ?? null,
        formType: metadata.formType ?? null,
        timestamp: data.timestamp?.toDate?.()?.toISOString?.() ?? null,
      };
    }),
    deleted: 0,
  };

  if (verbose) {
    console.log(JSON.stringify(summary, null, 2));
  }

  if (!apply) {
    return;
  }

  for (const doc of matchedDocs) {
    await doc.ref.delete();
    summary.deleted += 1;
  }

  console.log(
    JSON.stringify(
      {
        ...summary,
        mode: 'applied',
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
