import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';

import LegalBlock from '../components/LegalBlock';
import LegalDropdown from '../components/LegalDropdown';

type PrivacySection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

const bulletDotClassName = 'w-1 h-1 bg-gray75 rounded-full mt-2 shrink-0';
const bulletTextClassName = 'text-primary-base text-gray75';
const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

function renderTextWithEmailLinks(text: string) {
  const matches = Array.from(text.matchAll(emailPattern));
  if (matches.length === 0) return text;

  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  matches.forEach((match, index) => {
    const email = match[0];
    const start = match.index ?? 0;

    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }

    nodes.push(
      <Link
        key={`${email}-${index}`}
        href={`mailto:${email}`}
        className="underline underline-offset-2"
      >
        {email}
      </Link>,
    );

    lastIndex = start + email.length;
  });

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

const LegalSection = () => {
  const t = useTranslations('PrivacyPolicyPage');
  const sections = t.raw('sections') as PrivacySection[];

  return (
    <section className="pt-10 pb-5 md:pb-19.5">
      <SectionContainer>
        <LegalBlock>{t('intro.summary')}</LegalBlock>
        <SectionGradientLine height="1" fullWidth />
        <ul className="flex flex-col gap-6 mb-6">
          {sections.map((section) => (
            <LegalDropdown key={section.title} title={section.title}>
              <div className="flex flex-col gap-4">
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>{renderTextWithEmailLinks(paragraph)}</p>
                ))}
                {section.bullets?.length ? (
                  <ul className="flex flex-col gap-3">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2">
                        <div className={bulletDotClassName} />
                        <p className={bulletTextClassName}>{renderTextWithEmailLinks(bullet)}</p>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </LegalDropdown>
          ))}
        </ul>
        <p className="mb-7 font-medium">{t('effectiveDate')}</p>
      </SectionContainer>
    </section>
  );
};

export default LegalSection;
