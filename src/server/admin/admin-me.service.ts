import type { AuthContext } from '@/server/middlewares';

export async function getAdminMe(auth: AuthContext) {
  return {
    uid: auth.uid,
    email: auth.email,
    role: auth.role,
  };
}
