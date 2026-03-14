import type { MetadataRoute } from 'next';

const baseUrl = 'https://echocode.digital';

const staticRoutes = [
  '',
  '/career',
  '/contact',
  '/partnership',
  '/portfolio',
  '/portfolio/cleaning',
  '/portfolio/e-commers',
  '/portfolio/food',
  '/service-direction/design',
  '/service-direction/game-development',
  '/service-direction/igaming',
  '/service-direction/mobile-development',
  '/service-direction/qa',
  '/service-direction/web-development',
  '/team',
];

const vacancyRoutes = ['/career/designer', '/career/ios-dev', '/career/qa'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [...staticRoutes, ...vacancyRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route.startsWith('/service-direction/') ? 0.8 : 0.7,
  }));
}
