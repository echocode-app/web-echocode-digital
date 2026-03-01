import type { AuthContext } from '@/server/middlewares';
import { getAuthenticatedUserProfile } from '@/server/auth';
import { logAdminAction } from '@/server/admin/admin-logs.service';

export async function getAdminMe(auth: AuthContext) {
  const profile = await getAuthenticatedUserProfile(auth.uid);

  await logAdminAction({
    adminUid: auth.uid,
    actionType: 'admin.login',
    entityType: 'auth',
    entityId: auth.uid,
    metadata: {
      role: profile.role,
    },
  });

  return profile;
}
