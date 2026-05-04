import type { Metadata } from 'next';

import ContactUsModal from '@/components/modals/ContactUsModal';
import Home from '../page';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://echocode.digital' },
};

export default function ContactPage() {
  return (
    <>
      <Home />
      <ContactUsModal />
    </>
  );
}
