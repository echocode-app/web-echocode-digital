import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Usage:
// npm run seed:admin-users -- --uid eyBl0nEM6PUkCU6HJwPttWPuvyv1 --name "Анна" --role developer
// Optional flags:
// --email anna@example.com
// --active true|false
// --dry-run
//
// What to change for a new user:
// 1. Replace --uid with the Firebase Auth UID.
// 2. Replace --name with the display name you want to show in admin moderation.
// 3. Replace --role with the label you want to show under the name.
// 4. Run the command. The script will upsert admin_users/{uid} in Firestore.

function parseDotEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return;
  }

  const content = readFileSync(filePath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const separatorIndex = line.indexOf('=');
    if (separatorIndex <= 0) continue;

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function loadLocalEnv() {
  parseDotEnvFile(resolve(process.cwd(), '.env.local'));
  parseDotEnvFile(resolve(process.cwd(), '.env'));
}

function buildFirebaseOptions() {
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY?.trim();
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET?.trim();

  const options = {};

  if (projectId && clientEmail && privateKeyRaw) {
    options.credential = cert({
      projectId,
      clientEmail,
      privateKey: privateKeyRaw.replace(/\\n/g, '\n'),
    });
  } else {
    options.credential = applicationDefault();
  }

  if (storageBucket) {
    options.storageBucket = storageBucket;
  }

  return options;
}

function parseBooleanFlag(value, fallback) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'y'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'n'].includes(normalized)) return false;
  return fallback;
}

function parseArgs(argv) {
  const args = new Map();

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;

    const key = token.slice(2);
    const next = argv[index + 1];

    if (!next || next.startsWith('--')) {
      args.set(key, 'true');
      continue;
    }

    args.set(key, next);
    index += 1;
  }

  return args;
}

function normalizeRequiredString(value, label) {
  if (typeof value !== 'string') {
    throw new Error(`Missing required argument: --${label}`);
  }

  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`Argument --${label} cannot be empty`);
  }

  return normalized;
}

function normalizeOptionalString(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

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

  const app = getApps()[0] ?? initializeApp(buildFirebaseOptions());
  const firestore = getFirestore(app);

  await firestore.collection('admin_users').doc(input.uid).set(payload, { merge: true });

  console.log(`upserted admin_users/${input.uid} (${input.displayName})`);
}

upsertAdminUser().catch((error) => {
  console.error('failed to upsert admin_users profile');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
