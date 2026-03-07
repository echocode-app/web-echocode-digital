'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { postClientAnalyticsEvent } from '@/components/analytics/clientAnalytics';

function buildRelativeUrl(pathname: string, searchParams: URLSearchParams): string {
  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Mount this tracker in the public layout when the page-view rollout is enabled.
    if (!pathname) return;

    const relativeUrl = buildRelativeUrl(pathname, new URLSearchParams(searchParams.toString()));

    void postClientAnalyticsEvent('/api/analytics/page-view', {
      path: pathname,
      url: relativeUrl,
      title: typeof document !== 'undefined' ? document.title : null,
      referrer: typeof document !== 'undefined' ? document.referrer || null : null,
      source: 'website',
    });
  }, [pathname, searchParams]);

  return null;
}
