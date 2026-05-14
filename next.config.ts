import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Keep old ISO-style Ukrainian URLs working after the public prefix moved to /ua.
      {
        source: '/uk',
        destination: '/ua',
        permanent: true,
      },
      {
        source: '/uk/:path*',
        destination: '/ua/:path*',
        permanent: true,
      },
    ];
  },
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
