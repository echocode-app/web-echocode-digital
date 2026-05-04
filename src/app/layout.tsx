import type { Metadata } from 'next';
import Script from 'next/script';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import { poppins, wadik, inter, rubik } from '@/styles/fonts/fonts';
import { seoBaseUrl } from '@/lib/seo/metadata';

import './globals.css';

// Google Tag Manager container. Manage ads and marketing tags inside GTM.
// GA4 (G-ZB7Y7RC890) is loaded via the GTM container, not directly here.
const GTM_ID = 'GTM-NCF8LH26';

// Global SEO metadata. Page-level metadata should override this where needed.
export const metadata: Metadata = {
  metadataBase: new URL('https://echocode.digital'),
  title: {
    default: 'Echocode',
    template: '%s | Echocode',
  },
  description:
    'Echocode is a software development company building iOS, Android, web and iGaming products, with design, QA and product-focused engineering services.',
  applicationName: 'Echocode Digital',
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
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    title: 'Echocode Digital',
  },
  alternates: {
    canonical: 'https://echocode.digital',
  },
  openGraph: {
    title: 'Echocode — iOS, Android, Web & iGaming Development',
    description:
      'Custom software development for mobile, web and iGaming products. Product design, QA and engineering focused on performance, scalability and growth.',
    url: 'https://echocode.digital',
    siteName: 'Echocode',
    images: [
      {
        url: '/favicon/fulllogo.png',
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

  // Structured data for search engines. Keep values aligned with public SEO metadata.
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Echocode',
    url: seoBaseUrl,
    logo: `${seoBaseUrl}/favicon/fulllogo.png`,
    description:
      'Echocode is a software development studio building iOS, Android, web and iGaming products with design, QA and product-focused engineering services.',
    foundingDate: '2023',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      minValue: 11,
      maxValue: 50,
    },
    email: 'hello@echocode.digital',
    address: [
      {
        '@type': 'PostalAddress',
        addressCountry: 'UA',
        addressLocality: 'Kyiv',
      },
      {
        '@type': 'PostalAddress',
        addressCountry: 'DE',
        addressLocality: 'Berlin',
      },
    ],
    sameAs: [
      'https://linkedin.com/company/echocode',
      'https://t.me/echocodeHQ',
      'https://www.instagram.com/echocodeHQ',
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
    inLanguage: ['en', 'uk', 'de', 'es', 'pl'],
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
      <head>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
      </head>
      <body
        className={`${poppins.variable} ${inter.variable} ${wadik.variable} ${rubik.variable} antialiased relative`}
      >
        {/* GTM fallback for users with JavaScript disabled. */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>

        {/* SEO structured data scripts. */}
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

        {/* App providers and global runtime features. */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
