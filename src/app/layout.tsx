import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import { poppins, wadik, inter, rubik } from '@/styles/fonts/fonts';
import { buildLanguageAlternates, seoBaseUrl } from '@/lib/seo/metadata';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://echocode.digital'),
  title: {
    default: 'Echocode',
    template: '%s | Echocode',
  },
  description:
    'Echocode is a software development company building iOS, Android, web and iGaming products, with design, QA and product-focused engineering services.',
  applicationName: 'Echocode',
  keywords: [
    'Echocode',
    'software development company',
    'mobile app development',
    'web development',
    'iOS development',
    'Android development',
    'iGaming development',
    'QA services',
    'product design',
  ],
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon/favicon.ico',
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/favicon/site.webmanifest',
  appleWebApp: {
    title: 'Echocode',
  },
  alternates: {
    canonical: 'https://echocode.digital',
    languages: buildLanguageAlternates(''),
  },
  openGraph: {
    title: 'Echocode — iOS, Android, Web & iGaming Development',
    description:
      'Custom software development for mobile, web and iGaming products. Product design, QA and engineering focused on performance, scalability and growth.',
    url: 'https://echocode.digital',
    siteName: 'Echocode',
    images: [
      {
        url: '/images/rabbits/hero/design.png',
        width: 1200,
        height: 630,
        alt: 'Echocode — Software Development Company',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echocode — iOS, Android, Web & iGaming Development',
    description:
      'Software development company for mobile, web and iGaming products. Design, QA and product-focused engineering.',
    images: ['/favicon/fulllogo.png'],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Echocode',
    url: seoBaseUrl,
    logo: `${seoBaseUrl}/favicon/fulllogo.png`,
    sameAs: [
      'https://linkedin.com/company/echocode',
      'https://t.me/echocode_app',
      'https://instagram.com/echocode.app',
      'https://www.behance.net/valeriimelnikov',
      'https://freelancehunt.com/freelancer/echocode.html',
      'https://www.upwork.com/agencies/2038889063349600711/',
    ],
  };
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Echocode',
    url: seoBaseUrl,
    inLanguage: ['en', 'ua', 'de', 'es'],
  };
  const professionalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Echocode',
    url: seoBaseUrl,
    image: `${seoBaseUrl}/favicon/fulllogo.png`,
    description:
      'Software development company delivering iOS, Android, web and iGaming products with design, QA and product-focused engineering services.',
    areaServed: 'Worldwide',
    serviceType: [
      'iOS development',
      'Android development',
      'Web development',
      'iGaming development',
      'Product design',
      'Quality assurance',
    ],
  };

  return (
    <html lang={locale}>
      <body
        className={`${poppins.variable} ${inter.variable} ${wadik.variable} ${rubik.variable} antialiased relative`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
