import type { ClientProjectCreateInput } from '@/server/forms/client-project/clientProject.types';

export const CLIENT_PROJECT_TRACKING_KEYS = [
  'gclid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const satisfies readonly (keyof ClientProjectCreateInput)[];

export type ClientProjectTrackingKey = (typeof CLIENT_PROJECT_TRACKING_KEYS)[number];

export function getClientProjectTrackingKeys(
  input: ClientProjectCreateInput,
): ClientProjectTrackingKey[] {
  return CLIENT_PROJECT_TRACKING_KEYS.filter((key) => Boolean(input[key]));
}
