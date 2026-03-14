import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/docs/api'],
    },
    sitemap: 'https://echocode.digital/sitemap.xml',
    host: 'https://echocode.digital',
  };
}
