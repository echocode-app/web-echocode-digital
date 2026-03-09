import { getFirestore } from 'firebase-admin/firestore';
import {
  getFirebaseAdminApp,
  loadLocalEnv,
  normalizeOptionalString,
  normalizeRequiredString,
  parseArgs,
  parseBooleanFlag,
} from './shared/firebase_admin_script.utils.mjs';

// Usage:
// npm run seed:admin-users -- --uid *** --name "***" --role developer
// Optional flags:
// --email ***@example.com
// --active true|false
// --dry-run
//
// What to change for a new user:
// 1. Replace --uid with the Firebase Auth UID.
// 2. Replace --name with the display name you want to show in admin moderation.
// 3. Replace --role with the label you want to show under the name.
// 4. Run the command. The script will upsert admin_users/{uid} in Firestore.

function buildAdminUserPayload(argv) {
  const args = parseArgs(argv);

  return {
    uid: normalizeRequiredString(args.get('uid'), 'uid'),
    displayName: normalizeRequiredString(args.get('name'), 'name'),
    roleLabel: normalizeRequiredString(args.get('role'), 'role'),
    email: normalizeOptionalString(args.get('email')),
    isActive: parseBooleanFlag(args.get('active'), true),
    dryRun: parseBooleanFlag(args.get('dry-run'), false),
  };
}

async function upsertAdminUser() {
  loadLocalEnv();

  const input = buildAdminUserPayload(process.argv.slice(2));
  const payload = {
    displayName: input.displayName,
    roleLabel: input.roleLabel,
    isActive: input.isActive,
    ...(input.email ? { email: input.email } : {}),
  };

  if (input.dryRun) {
    console.log('dry-run admin_users payload');
    console.log(JSON.stringify({ docPath: `admin_users/${input.uid}`, payload }, null, 2));
    return;
  }

  const app = getFirebaseAdminApp();
  const firestore = getFirestore(app);

  await firestore.collection('admin_users').doc(input.uid).set(payload, { merge: true });

  console.log(`upserted admin_users/${input.uid} (${input.displayName})`);
}

upsertAdminUser().catch((error) => {
  console.error('failed to upsert admin_users profile');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
