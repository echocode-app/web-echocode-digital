import { getAuth } from 'firebase-admin/auth';
import {
  getFirebaseAdminApp,
  loadLocalEnv,
  normalizeRequiredString,
  parseBooleanFlag,
  parseArgs,
} from './shared/firebase_admin_script.utils.mjs';

const ALLOWED_ROLES = new Set(['admin', 'developer', 'manager']);

// Usage:
// npm run seed:admin-claims -- --uid *** --role admin
// Optional flags:
// --dry-run
//
// How to reuse this script for another teammate:
// 1. Replace --uid with the Firebase Auth UID of the target user.
// 2. Replace --role with one of the allowed roles: admin, developer, manager.
// 3. Run the command from the project root so local Firebase env variables are loaded.
// 4. Ask the user to sign out/in or refresh the ID token after the claim update.

function normalizeRole(value) {
  const role = normalizeRequiredString(value, 'role').toLowerCase();
  if (!ALLOWED_ROLES.has(role)) {
    throw new Error('Argument --role must be one of: admin, developer, manager');
  }

  return role;
}

function buildClaimsInput(argv) {
  const args = parseArgs(argv);

  return {
    uid: normalizeRequiredString(args.get('uid'), 'uid'),
    role: normalizeRole(args.get('role')),
    dryRun: parseBooleanFlag(args.get('dry-run'), false),
  };
}

async function setAdminClaims() {
  loadLocalEnv();

  const input = buildClaimsInput(process.argv.slice(2));
  const auth = getAuth(getFirebaseAdminApp());
  const user = await auth.getUser(input.uid);

  const claims = {
    ...(user.customClaims ?? {}),
    role: input.role,
  };

  if (input.dryRun) {
    console.log('dry-run custom claims payload');
    console.log(JSON.stringify({ uid: input.uid, claims }, null, 2));
    return;
  }

  await auth.setCustomUserClaims(input.uid, claims);

  console.log(`updated custom claims for ${input.uid}`);
  console.log(`next terminal command: npm run seed:admin-users -- --uid ${input.uid} --name "User Name" --role ${input.role}`);
  console.log('ask the user to sign out/in or refresh the Firebase ID token');
}

setAdminClaims().catch((error) => {
  console.error('failed to update Firebase custom claims');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
