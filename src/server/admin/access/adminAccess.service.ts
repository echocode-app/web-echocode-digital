import type { AuthContext } from '@/server/middlewares';
import {
  getFirebaseUser,
  listFirebaseUsers,
  setFirebaseCustomUserClaims,
} from '@/server/firebase/auth';
import { ApiError } from '@/server/lib/errors';
import { getRoleLabel, isRole, type Role } from '@/server/auth/roles';
import {
  getAdminAccessEntryByEmail,
  listAdminAccessEntries,
  normalizeAdminAccessEmail,
  persistAdminAccessEntry,
} from '@/server/admin/access/adminAccess.repository';
import type {
  AdminAccessEntryDto,
  AdminAccessListDto,
  AdminAccessSource,
  CreateAdminAccessInput,
  UpdateAdminAccessInput,
} from '@/server/admin/access/adminAccess.types';
import {
  listAdminUserProfiles,
  upsertAdminUserProfile,
} from '@/server/admin/admin-users.service';
import { env } from '@/server/config/env';

function normalizeOptionalString(value: string | null | undefined): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

async function setUserRoleClaim(uid: string, nextRole: Role | null): Promise<void> {
  const user = await getFirebaseUser(uid);
  const currentClaims = user.customClaims ?? {};

  if (nextRole === null) {
    if (!('role' in currentClaims)) {
      return;
    }

    const restClaims = { ...currentClaims };
    delete restClaims.role;
    await setFirebaseCustomUserClaims(uid, restClaims);
    return;
  }

  if (currentClaims.role === nextRole) {
    return;
  }

  await setFirebaseCustomUserClaims(uid, {
    ...currentClaims,
    role: nextRole,
  });
}

async function syncAdminUserProfile(input: {
  uid: string;
  email: string;
  displayName: string | null;
  role: Role;
}): Promise<void> {
  await upsertAdminUserProfile({
    uid: input.uid,
    email: input.email,
    displayName: input.displayName,
    roleLabel: getRoleLabel(input.role),
  });
}

async function applyAccessEntryToUid(
  entry: AdminAccessEntryDto,
  uid: string,
  fallbackDisplayName: string | null,
): Promise<void> {
  await setUserRoleClaim(uid, entry.status === 'active' ? entry.role : null);

  if (entry.status !== 'active') {
    return;
  }

  const nextDisplayName = entry.displayName ?? fallbackDisplayName;

  await persistAdminAccessEntry({
    email: entry.email,
    normalizedEmail: entry.normalizedEmail,
    displayName: nextDisplayName,
    position: entry.position,
    role: entry.role,
    status: entry.status,
    source: entry.source,
    uid,
    invitedByUid: null,
    invitedByEmail: null,
    updatedByUid: uid,
    updatedByEmail: entry.email,
    preserveCreatedAt: true,
    markLoginAt: true,
  });

  await syncAdminUserProfile({
    uid,
    email: entry.email,
    displayName: nextDisplayName,
    role: entry.role,
  });
}

function inferRoleFromLabel(roleLabel: string | null): Role | null {
  const normalized = normalizeOptionalString(roleLabel)?.toLowerCase();

  if (normalized === 'admin') return 'admin';
  if (normalized === 'developer') return 'developer';
  if (normalized === 'manager') return 'manager';

  return null;
}

async function ensureLegacyAdminProfilesInRegistry(
  existingEntries: AdminAccessEntryDto[],
): Promise<AdminAccessEntryDto[]> {
  const profiles = await listAdminUserProfiles();
  const existingEmails = new Set(existingEntries.map((entry) => entry.normalizedEmail));
  let didSeed = false;

  for (const profile of profiles) {
    const email = normalizeOptionalString(profile.email);
    const role = inferRoleFromLabel(profile.roleLabel);

    if (!email || !role) {
      continue;
    }

    const normalizedEmail = normalizeAdminAccessEmail(email);
    if (existingEmails.has(normalizedEmail)) {
      continue;
    }

    // Backfill legacy admin_users records into the access registry
    // so existing team members appear in Settings before their next login.
    await persistAdminAccessEntry({
      email,
      normalizedEmail,
      displayName: profile.displayName,
      position: profile.position,
      role,
      status: 'active',
      source: resolveSystemSource(email, role),
      uid: profile.uid,
      invitedByUid: null,
      invitedByEmail: null,
      updatedByUid: profile.uid,
      updatedByEmail: email,
      preserveCreatedAt: false,
    });

    existingEmails.add(normalizedEmail);
    didSeed = true;
  }

  if (!didSeed) {
    return existingEntries;
  }

  return listAdminAccessEntries();
}

async function ensureFirebaseRoleClaimsInRegistry(
  existingEntries: AdminAccessEntryDto[],
): Promise<AdminAccessEntryDto[]> {
  const users = await listFirebaseUsers();
  const existingEmails = new Set(existingEntries.map((entry) => entry.normalizedEmail));
  let didSeed = false;

  for (const user of users) {
    const role = isRole(user.customClaims?.role) ? user.customClaims.role : null;
    const email = normalizeOptionalString(user.email);

    if (!role || !email) {
      continue;
    }

    const normalizedEmail = normalizeAdminAccessEmail(email);
    if (existingEmails.has(normalizedEmail)) {
      continue;
    }

    const displayName = normalizeOptionalString(user.displayName);

    // Claims-based users are already allowed into admin,
    // so Settings must surface them even before manual edits.
    await persistAdminAccessEntry({
      email,
      normalizedEmail,
      displayName,
      position: null,
      role,
      status: 'active',
      source: resolveSystemSource(email, role),
      uid: user.uid,
      invitedByUid: null,
      invitedByEmail: null,
      updatedByUid: user.uid,
      updatedByEmail: email,
      preserveCreatedAt: false,
    });

    await syncAdminUserProfile({
      uid: user.uid,
      email,
      displayName,
      role,
    });

    existingEmails.add(normalizedEmail);
    didSeed = true;
  }

  if (!didSeed) {
    return existingEntries;
  }

  return listAdminAccessEntries();
}

export async function listAdminAccess(): Promise<AdminAccessListDto> {
  const legacySeeded = await ensureLegacyAdminProfilesInRegistry(await listAdminAccessEntries());
  const items = await ensureFirebaseRoleClaimsInRegistry(legacySeeded);

  return {
    items,
  };
}

export async function createAdminAccess(
  auth: AuthContext,
  input: CreateAdminAccessInput,
): Promise<AdminAccessEntryDto> {
  const normalizedEmail = normalizeAdminAccessEmail(input.email);
  const existing = await getAdminAccessEntryByEmail(normalizedEmail);
  const email = input.email.trim();
  const displayName = normalizeOptionalString(input.displayName);
  const position = normalizeOptionalString(input.position);

  await persistAdminAccessEntry({
    email,
    normalizedEmail,
    displayName,
    position,
    role: input.role,
    status: 'active',
    source: existing?.source === 'manual' ? 'manual' : 'manual',
    uid: existing?.uid ?? null,
    invitedByUid: existing?.uid ? null : auth.uid,
    invitedByEmail: existing?.uid ? null : auth.email,
    updatedByUid: auth.uid,
    updatedByEmail: auth.email,
    preserveCreatedAt: Boolean(existing),
  });

  if (existing?.uid) {
    await setUserRoleClaim(existing.uid, input.role);
    await syncAdminUserProfile({
      uid: existing.uid,
      email,
      displayName,
      role: input.role,
    });
  }

  const nextEntry = await getAdminAccessEntryByEmail(normalizedEmail);
  if (!nextEntry) {
    throw ApiError.fromCode('INTERNAL_ERROR', 'Admin access entry was not saved');
  }

  return nextEntry;
}

export async function updateAdminAccess(
  auth: AuthContext,
  normalizedEmail: string,
  input: UpdateAdminAccessInput,
): Promise<AdminAccessEntryDto> {
  const existing = await getAdminAccessEntryByEmail(normalizedEmail);

  if (!existing) {
    throw ApiError.fromCode('NOT_FOUND', 'Admin access entry does not exist');
  }

  const displayName = normalizeOptionalString(input.displayName ?? existing.displayName);
  const position = normalizeOptionalString(input.position ?? existing.position);

  await persistAdminAccessEntry({
    email: existing.email,
    normalizedEmail: existing.normalizedEmail,
    displayName,
    position,
    role: input.role,
    status: input.status,
    source: existing.source,
    uid: existing.uid,
    invitedByUid: null,
    invitedByEmail: null,
    updatedByUid: auth.uid,
    updatedByEmail: auth.email,
    preserveCreatedAt: true,
  });

  if (existing.uid) {
    await setUserRoleClaim(existing.uid, input.status === 'active' ? input.role : null);

    if (input.status === 'active') {
      await syncAdminUserProfile({
        uid: existing.uid,
        email: existing.email,
        displayName,
        role: input.role,
      });
    }
  }

  const nextEntry = await getAdminAccessEntryByEmail(normalizedEmail);
  if (!nextEntry) {
    throw ApiError.fromCode('INTERNAL_ERROR', 'Admin access entry update failed');
  }

  return nextEntry;
}

function resolveSystemSource(email: string, role: Role): AdminAccessSource {
  if (role === 'developer' && env.adminBootstrapEmails.includes(email.toLowerCase())) {
    return 'bootstrap';
  }

  return 'claim_sync';
}

export async function syncAdminAccessForLogin(input: {
  uid: string;
  email: string | null;
  fallbackRole: Role | null;
}): Promise<Role | null> {
  const email = normalizeOptionalString(input.email);
  if (!email) {
    return input.fallbackRole;
  }

  const user = await getFirebaseUser(input.uid);
  const displayName = normalizeOptionalString(user.displayName);
  const normalizedEmail = normalizeAdminAccessEmail(email);
  const registryEntry = await getAdminAccessEntryByEmail(normalizedEmail);

  if (registryEntry) {
    await applyAccessEntryToUid(registryEntry, input.uid, displayName);
    return registryEntry.status === 'active' ? registryEntry.role : null;
  }

  if (!input.fallbackRole || !isRole(input.fallbackRole)) {
    return null;
  }

  const source = resolveSystemSource(email, input.fallbackRole);

  await persistAdminAccessEntry({
    email,
    normalizedEmail,
    displayName,
    position: null,
    role: input.fallbackRole,
    status: 'active',
    source,
    uid: input.uid,
    invitedByUid: null,
    invitedByEmail: null,
    updatedByUid: input.uid,
    updatedByEmail: email,
    preserveCreatedAt: false,
    markLoginAt: true,
  });

  await syncAdminUserProfile({
    uid: input.uid,
    email,
    displayName,
    role: input.fallbackRole,
  });

  return input.fallbackRole;
}
