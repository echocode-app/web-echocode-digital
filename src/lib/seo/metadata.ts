import type { Metadata } from 'next';

const BASE_URL = 'https://echocode.digital';
const TWITTER_IMAGE = '/favicon/fulllogo.png';

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

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
