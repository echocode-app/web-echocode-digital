'use client';

import { useState } from 'react';
import InfoTooltip from '@/components/admin/dashboard/ui/InfoTooltip';

type UtmPreset = {
  label: string;
  channel: string;
  source: string;
  medium: string;
  campaign: string;
  usage: string;
};

type UtmSection = {
  id: 'app' | 'digital';
  title: string;
  baseUrl: string;
  objective: string;
  presets: UtmPreset[];
};

const sections: UtmSection[] = [
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
    ],
  },
];

function buildUtmUrl(baseUrl: string, preset: UtmPreset): string {
  const url = new URL(baseUrl);
  url.searchParams.set('utm_source', preset.source);
  url.searchParams.set('utm_medium', preset.medium);
  url.searchParams.set('utm_campaign', preset.campaign);
  return url.toString();
}

function CopyButton({
  value,
  copied,
  onCopy,
}: {
  value: string;
  copied: boolean;
  onCopy: (value: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onCopy(value)}
      className="inline-flex h-9 w-9 items-center justify-center rounded-(--radius-secondary) border border-gray16 text-gray75 transition duration-main hover:border-gray60 hover:text-white focus-visible:border-gray60 focus-visible:text-white"
      aria-label={copied ? 'Copied' : 'Copy UTM link'}
      title={copied ? 'Copied' : 'Copy UTM link'}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="h-4.5 w-4.5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="7" y="3" width="9" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="4" y="6" width="9" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </button>
  );
}

export default function AdminInfoPage() {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(value);
      window.setTimeout(() => {
        setCopiedValue((current) => (current === value ? null : current));
      }, 1600);
    } catch (error) {
      console.error('Failed to copy UTM link', error);
    }
  };

  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <h1 className="font-title text-title-2xl text-white">Info</h1>
        <p className="max-w-220 font-main text-main-sm text-gray60">
          Use tagged links consistently to keep traffic, lead and conversion attribution clean in
          the admin dashboards. The links below are ready to copy and share.
        </p>
      </div>

      <article className="rounded-(--radius-base) border border-gray16 bg-base-gray p-4 shadow-main">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <h2 className="font-title text-title-base text-white">
              How to use UTM links correctly
            </h2>
            <p className="max-w-180 font-main text-main-sm text-gray60">
              Keep naming consistent, preserve full tagged URLs and use separate campaigns for each
              placement you want to compare.
            </p>
          </div>
          <InfoTooltip
            label="UTM usage rules"
            text="Always share the full tagged URL without removing query params. Keep one naming convention for each channel, split campaigns by launch or placement, do not mix paid, social, referral and outbound traffic under one medium, and avoid opening campaign links from internal team chats or routine test flows because that pollutes attribution."
          />
        </div>
      </article>

      <div className="space-y-5">
        {sections.map((section) => (
          <article
            key={section.id}
            className="rounded-(--radius-base) border border-gray16 bg-base-gray p-4 shadow-main"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <h2 className="font-title text-title-base text-white">{section.title}</h2>
                <p className="font-main text-main-sm text-gray60">{section.objective}</p>
              </div>
              <InfoTooltip label={`${section.title} guidance`} text={section.objective} />
            </div>

            <div className="mt-4 space-y-3">
              {section.presets.map((preset) => {
                const link = buildUtmUrl(section.baseUrl, preset);
                const copied = copiedValue === link;

                return (
                  <div
                    key={`${section.id}-${preset.label}`}
                    className="rounded-(--radius-secondary) border border-gray16 bg-black/20 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-title text-title-xs text-white">{preset.label}</h3>
                          <InfoTooltip label={`${preset.label} usage`} text={preset.usage} />
                        </div>
                        <p className="font-main text-main-xs text-gray60">{preset.channel}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {copied ? (
                          <span className="font-main text-main-xs text-accent-hover">Copied</span>
                        ) : null}
                        <CopyButton value={link} copied={copied} onCopy={handleCopy} />
                      </div>
                    </div>

                    <div className="mt-3 rounded-(--radius-secondary) border border-gray16/80 bg-black/30 px-3 py-2 font-main text-main-xs text-gray75">
                      <p className="break-all">{link}</p>
                    </div>

                    <div className="mt-3 grid gap-2 font-main text-main-xs text-gray75 sm:grid-cols-3">
                      <p>
                        <span className="text-gray60">source:</span> {preset.source}
                      </p>
                      <p>
                        <span className="text-gray60">medium:</span> {preset.medium}
                      </p>
                      <p>
                        <span className="text-gray60">campaign:</span> {preset.campaign}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
