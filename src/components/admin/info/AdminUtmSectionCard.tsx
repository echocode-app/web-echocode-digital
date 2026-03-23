'use client';

import InfoTooltip from '@/components/admin/dashboard/ui/InfoTooltip';
import type { AdminUtmPreset, AdminUtmSection } from '@/components/admin/info/adminUtm.config';
import { ADMIN_INFO_SECTION_CARD_CLASS_NAME } from '@/components/admin/info/adminInfo.config';

function buildUtmUrl(baseUrl: string, preset: AdminUtmPreset): string {
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
      className="
        inline-flex h-9 w-9 items-center justify-center
        rounded-(--radius-secondary)
        border border-gray16
        text-gray75
        transition duration-main
        hover:border-gray60 hover:text-white
        focus-visible:border-gray60 focus-visible:text-white
      "
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

export default function AdminUtmSectionCard({
  section,
  copiedValue,
  onCopy,
}: {
  section: AdminUtmSection;
  copiedValue: string | null;
  onCopy: (value: string) => void;
}) {
  return (
    <article className={ADMIN_INFO_SECTION_CARD_CLASS_NAME}>
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
                  <CopyButton value={link} copied={copied} onCopy={onCopy} />
                </div>
              </div>

              <div className="mt-3 rounded-(--radius-secondary) border border-gray16/80 bg-black/30 px-3 py-2 font-main text-main-xs text-gray75">
                <p className="break-all">{link}</p>
              </div>

              <div className="mt-3 grid gap-2 font-main text-main-xs text-gray75 lg:grid-cols-3">
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
  );
}
