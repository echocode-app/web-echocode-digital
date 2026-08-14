'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

type GoodFirmsWidgetProps = {
  variant?: 'horizontal' | 'stars';
};

const WIDGET_CONFIG = {
  horizontal: {
    type: 'goodfirms-widget-t9',
    pattern: 'horizontal-inline',
    height: '61',
  },
  stars: {
    type: 'goodfirms-widget-t6',
    pattern: 'star-no-review',
    height: '100',
  },
};

const GOODFIRMS_SCRIPT_SRC = 'https://assets.goodfirms.co/assets/js/widget.min.js';

export default function GoodFirmsWidget({ variant = 'horizontal' }: GoodFirmsWidgetProps) {
  const config = WIDGET_CONFIG[variant];
  const pathname = usePathname();
  const widgetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    const isRendered = () => {
      const widget = widgetRef.current;

      return Boolean(widget && widget.innerHTML.trim().length > 0);
    };

    const reloadGoodFirms = () => {
      if (isRendered()) return;

      document
        .querySelectorAll<HTMLScriptElement>(`script[src="${GOODFIRMS_SCRIPT_SRC}"]`)
        .forEach((script) => script.remove());

      const script = document.createElement('script');
      script.src = GOODFIRMS_SCRIPT_SRC;
      script.async = true;
      script.type = 'text/javascript';
      script.setAttribute('data-cookieconsent', 'ignore');

      document.body.appendChild(script);
    };

    const scheduleReload = () => {
      [100, 700, 1600, 3000, 6000].forEach((delay) => {
        timers.push(setTimeout(reloadGoodFirms, delay));
      });
    };

    widgetRef.current?.replaceChildren();
    scheduleReload();

    window.addEventListener('load', scheduleReload);
    window.addEventListener('pageshow', scheduleReload);
    window.addEventListener('CookiebotOnAccept', scheduleReload);
    window.addEventListener('CookiebotOnConsentReady', scheduleReload);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('load', scheduleReload);
      window.removeEventListener('pageshow', scheduleReload);
      window.removeEventListener('CookiebotOnAccept', scheduleReload);
      window.removeEventListener('CookiebotOnConsentReady', scheduleReload);
    };
  }, [pathname]);

  return (
    <div className="mb-4 lg:mb-0 min-h-[61px] w-fit mx-auto">
      <div
        ref={widgetRef}
        className="goodfirm-widget translate-x-8"
        data-widget-type={config.type}
        data-widget-pattern={config.pattern}
        data-height={config.height}
        data-company-id="211069"
      />
    </div>
  );
}
