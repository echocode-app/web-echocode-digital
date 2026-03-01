import { z } from 'zod';

type NodeEnv = 'development' | 'test' | 'production';

type RequiredEnv = {
  firebaseCredentialSource: 'env' | 'adc';
};

type OptionalEnv = {
  nodeEnv: NodeEnv;
  developerAccessMode: 'full' | 'readonly';
  adminBootstrapEmails: string[];
  apiVersion: string;
  firebaseCheckStorage: boolean;
  internalFirebaseCheckEnabled: boolean;
  firebaseProjectId?: string;
  firebaseClientEmail?: string;
  firebasePrivateKey?: string;
  firebaseStorageBucket?: string;
};

export type Env = RequiredEnv & OptionalEnv;

class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DEVELOPER_ACCESS_MODE: z.enum(['full', 'readonly']).default('readonly'),
  FIREBASE_PROJECT_ID: z.string().trim().min(1).optional(),
  FIREBASE_CLIENT_EMAIL: z.string().trim().email().optional(),
  FIREBASE_PRIVATE_KEY: z.string().trim().min(1).optional(),
  FIREBASE_STORAGE_BUCKET: z.string().trim().min(1).optional(),
  FIREBASE_CHECK_STORAGE: z.string().trim().optional(),
  INTERNAL_FIREBASE_CHECK_ENABLED: z.string().trim().optional(),
  ADMIN_BOOTSTRAP_EMAILS: z.string().optional(),
  API_VERSION: z.string().trim().min(1).default('v1'),
});

function parseBooleanFlag(value: string | undefined, fallback: boolean): boolean {
  if (!value) return fallback;
  const normalized = value.trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes';
}

/** Normalizes bootstrap allowlist into a lowercase, deduplicated email array */
function normalizeBootstrapEmails(value: string | undefined): string[] {
  if (!value) return [];

  const emailSchema = z.string().email();
  const uniqueEmails = new Set<string>();

  for (const entry of value.split(',')) {
    const email = entry.trim().toLowerCase();
    if (!email) continue;

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      throw new ConfigurationError(
        `Invalid email in ADMIN_BOOTSTRAP_EMAILS: ${email}`,
      );
    }

    uniqueEmails.add(email);
  }

  return Array.from(uniqueEmails);
}

/** Parses and validates process environment once at module load (fail-fast) */
function parseEnvironment(raw: NodeJS.ProcessEnv): Env {
  const parsed = envSchema.safeParse(raw);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const path = firstIssue.path.join('.') || '(root)';
    throw new ConfigurationError(
      `Environment configuration error: ${path} ${firstIssue.message}`,
    );
  }

  const hasProjectId = !!parsed.data.FIREBASE_PROJECT_ID;
  const hasClientEmail = !!parsed.data.FIREBASE_CLIENT_EMAIL;
  const hasPrivateKey = !!parsed.data.FIREBASE_PRIVATE_KEY;
  const hasAnyFirebaseCredential = hasProjectId || hasClientEmail || hasPrivateKey;
  const hasAllFirebaseCredential = hasProjectId && hasClientEmail && hasPrivateKey;

  if (hasAnyFirebaseCredential && !hasAllFirebaseCredential) {
    throw new ConfigurationError(
      'Environment configuration error: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY must be set together',
    );
  }

  return {
    firebaseCredentialSource: hasAllFirebaseCredential ? 'env' : 'adc',
    nodeEnv: parsed.data.NODE_ENV,
    developerAccessMode: parsed.data.DEVELOPER_ACCESS_MODE,
    firebaseProjectId: parsed.data.FIREBASE_PROJECT_ID,
    firebaseClientEmail: parsed.data.FIREBASE_CLIENT_EMAIL,
    firebasePrivateKey: parsed.data.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    firebaseStorageBucket: parsed.data.FIREBASE_STORAGE_BUCKET,
    firebaseCheckStorage: parseBooleanFlag(parsed.data.FIREBASE_CHECK_STORAGE, false),
    internalFirebaseCheckEnabled: parseBooleanFlag(
      parsed.data.INTERNAL_FIREBASE_CHECK_ENABLED,
      false,
    ),
    adminBootstrapEmails: normalizeBootstrapEmails(parsed.data.ADMIN_BOOTSTRAP_EMAILS),
    apiVersion: parsed.data.API_VERSION,
  };
}

/** Canonical environment accessor for the entire server layer */
export const env = parseEnvironment(process.env);
export const requiredEnv: RequiredEnv = {
  firebaseCredentialSource: env.firebaseCredentialSource,
};
export const optionalEnv: OptionalEnv = {
  nodeEnv: env.nodeEnv,
  developerAccessMode: env.developerAccessMode,
  adminBootstrapEmails: env.adminBootstrapEmails,
  apiVersion: env.apiVersion,
  firebaseCheckStorage: env.firebaseCheckStorage,
  internalFirebaseCheckEnabled: env.internalFirebaseCheckEnabled,
  firebaseProjectId: env.firebaseProjectId,
  firebaseClientEmail: env.firebaseClientEmail,
  firebasePrivateKey: env.firebasePrivateKey,
  firebaseStorageBucket: env.firebaseStorageBucket,
};
