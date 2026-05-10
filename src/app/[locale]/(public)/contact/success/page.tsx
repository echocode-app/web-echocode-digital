import type { Metadata } from 'next';

import Home from '../../page';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://echocode.digital' },
};

export default function ContactSuccessPage() {
  return <Home />;
}
