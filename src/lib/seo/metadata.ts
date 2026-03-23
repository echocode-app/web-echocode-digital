import type { Metadata } from 'next';

const BASE_URL = 'https://echocode.digital';
const TWITTER_IMAGE = '/favicon/fulllogo.png';

const LOCALE_ALTERNATES = {
  'x-default': BASE_URL,
  'en-US': BASE_URL,
  'uk-UA': BASE_URL,
  'de-DE': BASE_URL,
  'es-ES': BASE_URL,
} as const;

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

export function buildLanguageAlternates(path: string): NonNullable<Metadata['alternates']>['languages'] {
  const absoluteUrl = `${BASE_URL}${path}`;

  return {
    'x-default': absoluteUrl,
    'en-US': absoluteUrl,
    'uk-UA': absoluteUrl,
    'de-DE': absoluteUrl,
    'es-ES': absoluteUrl,
  };
}

export function buildPageMetadata({
  title,
  description,
  path,
  image = '/images/rabbits/hero/design.png',
}: PageMetadataInput): Metadata {
  const absoluteUrl = `${BASE_URL}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl,
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      title: `${title} | Echocode`,
      description,
      url: absoluteUrl,
      siteName: 'Echocode',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${title} | Echocode`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Echocode`,
      description,
      images: [TWITTER_IMAGE],
    },
  };
}

export const seoBaseUrl = BASE_URL;
export const seoLocaleAlternates = LOCALE_ALTERNATES;
