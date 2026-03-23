'use client';

import { useState } from 'react';
import InfoTooltip from '@/components/admin/dashboard/ui/InfoTooltip';
import AdminUtmSectionCard from '@/components/admin/info/AdminUtmSectionCard';
import { ADMIN_INFO_SECTION_CARD_CLASS_NAME } from '@/components/admin/info/adminInfo.config';
import { ADMIN_UTM_SECTIONS } from '@/components/admin/info/adminUtm.config';

export default function AdminUtmLinksGuide() {
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
    <div className="space-y-5">
      <article className={ADMIN_INFO_SECTION_CARD_CLASS_NAME}>
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
        {ADMIN_UTM_SECTIONS.map((section) => (
          <AdminUtmSectionCard
            key={section.id}
            section={section}
            copiedValue={copiedValue}
            onCopy={handleCopy}
          />
        ))}
      </div>
    </div>
  );
}
