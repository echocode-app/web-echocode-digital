export type AdminUtmPreset = {
  label: string;
  channel: string;
  source: string;
  medium: string;
  campaign: string;
  usage: string;
};

export type AdminUtmSection = {
  id: 'app' | 'digital';
  title: string;
  baseUrl: string;
  objective: string;
  presets: AdminUtmPreset[];
};

export const ADMIN_UTM_SECTIONS: AdminUtmSection[] = [
  {
    id: 'app',
    title: 'echocode.app UTM Links',
    baseUrl: 'https://echocode.app',
    objective:
      'Use these links for app-focused traffic, install-oriented campaigns and product discovery flows.',
    presets: [
      {
        label: 'Instagram Bio',
        channel: 'Instagram',
        source: 'instagram',
        medium: 'social',
        campaign: 'app_profile_link',
        usage:
          'Place in bio, stories, link stickers or direct replies that drive users to the app site.',
      },
      {
        label: 'Telegram Post',
        channel: 'Telegram',
        source: 'telegram',
        medium: 'community',
        campaign: 'app_channel_post',
        usage: 'Use in channel posts, pinned messages or founder updates shared in Telegram.',
      },
      {
        label: 'Influencer Story',
        channel: 'Influencer / Creator',
        source: 'influencer',
        medium: 'paid_social',
        campaign: 'app_creator_drop',
        usage:
          'Share with creators exactly as-is so installs are attributed to influencer traffic.',
      },
      {
        label: 'Meta Ads',
        channel: 'Meta Ads',
        source: 'meta',
        medium: 'paid_social',
        campaign: 'app_meta_acquisition',
        usage:
          'Paste into ad destination URLs for paid acquisition campaigns on Instagram and Facebook.',
      },
      {
        label: 'Product Hunt',
        channel: 'Product Hunt',
        source: 'producthunt',
        medium: 'community',
        campaign: 'app_launch',
        usage:
          'Use for launch-day traffic, follow-up comments and Product Hunt profile references.',
      },
      {
        label: 'LinkedIn Post',
        channel: 'LinkedIn',
        source: 'linkedin',
        medium: 'social',
        campaign: 'app_founder_post',
        usage:
          'Use in founder posts, company posts and comments that introduce the product to a business audience.',
      },
      {
        label: 'X / Twitter Thread',
        channel: 'X / Twitter',
        source: 'x',
        medium: 'social',
        campaign: 'app_thread',
        usage:
          'Use in product threads, launch tweets and pinned posts shared from founder or brand accounts.',
      },
      {
        label: 'Reddit Post',
        channel: 'Reddit',
        source: 'reddit',
        medium: 'community',
        campaign: 'app_community_post',
        usage:
          'Use for subreddit posts or comments where product discovery is driven by community conversations.',
      },
      {
        label: 'YouTube Description',
        channel: 'YouTube',
        source: 'youtube',
        medium: 'video',
        campaign: 'app_video',
        usage: 'Place in video descriptions, pinned comments or creator collaboration links.',
      },
      {
        label: 'Newsletter Feature',
        channel: 'Newsletter',
        source: 'newsletter',
        medium: 'email',
        campaign: 'app_feature',
        usage:
          'Use for newsletter placements, launch roundups or community digest mentions that push to the app site.',
      },
    ],
  },
  {
    id: 'digital',
    title: 'echocode.digital UTM Links',
    baseUrl: 'https://echocode.digital',
    objective:
      'Use these links for agency traffic, lead generation, partnership outreach and all service-related promotion.',
    presets: [
      {
        label: 'LinkedIn Outreach',
        channel: 'LinkedIn',
        source: 'linkedin',
        medium: 'social',
        campaign: 'digital_outreach',
        usage:
          'Use in company posts, founder posts, direct outreach or comments that send traffic to the agency site.',
      },
      {
        label: 'Upwork Profile',
        channel: 'Upwork',
        source: 'upwork',
        medium: 'marketplace',
        campaign: 'digital_profile',
        usage:
          'Place in portfolio descriptions, profile CTA blocks or proposal follow-ups where allowed.',
      },
      {
        label: 'Freelancehunt',
        channel: 'Freelancehunt',
        source: 'freelancehunt',
        medium: 'marketplace',
        campaign: 'digital_profile',
        usage:
          'Use in profile links, bid follow-ups or presentation materials pointing back to the main site.',
      },
      {
        label: 'Email Signature',
        channel: 'Email',
        source: 'email',
        medium: 'outbound',
        campaign: 'digital_signature',
        usage:
          'Add to founder, sales or partnership email signatures for clean source attribution.',
      },
      {
        label: 'Partner Referral',
        channel: 'Partner / Referral',
        source: 'partner',
        medium: 'referral',
        campaign: 'digital_partner_referral',
        usage:
          'Share with external partners or friendly networks when they refer traffic to Echocode.',
      },
      {
        label: 'Clutch Profile',
        channel: 'Clutch',
        source: 'clutch',
        medium: 'marketplace',
        campaign: 'digital_profile',
        usage:
          'Use in profile links and review-platform traffic that should be separated from other directories.',
      },
      {
        label: 'Behance Profile',
        channel: 'Behance',
        source: 'behance',
        medium: 'portfolio',
        campaign: 'digital_showcase',
        usage:
          'Use for design showcase links that drive agency discovery from Behance project pages or profile CTAs.',
      },
      {
        label: 'Dribbble Profile',
        channel: 'Dribbble',
        source: 'dribbble',
        medium: 'portfolio',
        campaign: 'digital_showcase',
        usage:
          'Use for design-driven traffic from Dribbble shots, profile CTAs and designer outreach.',
      },
      {
        label: 'Cold Email',
        channel: 'Outbound Email',
        source: 'cold_email',
        medium: 'outbound',
        campaign: 'digital_outreach',
        usage:
          'Use in direct outbound emails where you want separate attribution from signature clicks and inbound referrals.',
      },
      {
        label: 'Meta Lead Ads',
        channel: 'Meta Ads',
        source: 'meta',
        medium: 'paid_social',
        campaign: 'digital_lead_ads',
        usage:
          'Use in paid traffic campaigns for agency lead generation on Instagram and Facebook.',
      },
    ],
  },
];
