import type { Metadata } from 'next';

import ContactUsModal from '@/components/modals/ContactUsModal';
import { buildLocaleUrl } from '@/lib/seo/metadata';
import Home from '../page';

type GenerateMetadataProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    robots: { index: false, follow: true },
    alternates: { canonical: buildLocaleUrl(locale, '/') },
  };
}

export default function ContactPage() {
  return (
    <>
      <Home />
      <ContactUsModal />
    </>
  );
}
