'use client';

import { useEffect } from 'react';

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

  useEffect(() => {
    if (document.querySelector(`script[src="${GOODFIRMS_SCRIPT_SRC}"]`)) return;

    const script = document.createElement('script');
    script.src = GOODFIRMS_SCRIPT_SRC;
    script.async = true;
    script.type = 'text/javascript';

    document.body.appendChild(script);
  }, []);

  return (
    <div className="flex min-h-[61px] justify-start">
      <div
        className="goodfirm-widget"
        data-widget-type={config.type}
        data-widget-pattern={config.pattern}
        data-height={config.height}
        data-company-id="211069"
      />
    </div>
  );
}
