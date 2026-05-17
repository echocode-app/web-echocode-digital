import type { ResolvedSiteContext, SiteId } from '@/server/sites/siteContext';

const CAPTCHA_POLICY = {
  echocode_digital: 'required',
  echocode_app: 'disabled',
} as const satisfies Record<SiteId, 'required' | 'disabled'>;

export function requiresCaptcha(siteContext: ResolvedSiteContext): boolean {
  return CAPTCHA_POLICY[siteContext.siteId] === 'required';
}
