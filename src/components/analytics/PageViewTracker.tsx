'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  getClientAnalyticsContextPayload,
  postClientAnalyticsEvent,
} from '@/components/analytics/clientAnalytics';

function buildRelativeUrl(pathname: string, searchParams: URLSearchParams): string {
  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    const relativeUrl = buildRelativeUrl(pathname, new URLSearchParams(searchParams.toString()));
    const absoluteUrl = typeof window !== 'undefined' ? window.location.href : relativeUrl;
    const analyticsContext = getClientAnalyticsContextPayload();

    void postClientAnalyticsEvent('/api/analytics/page-view', {
      path: pathname,
      url: absoluteUrl,
      title: typeof document !== 'undefined' ? document.title : null,
      referrer: typeof document !== 'undefined' ? document.referrer || null : null,
      source: 'website',
      ...analyticsContext,
    });
  }, [pathname, searchParams]);

  return null;
}
