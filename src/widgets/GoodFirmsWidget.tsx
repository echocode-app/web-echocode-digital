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

export default function GoodFirmsWidget({ variant = 'horizontal' }: GoodFirmsWidgetProps) {
  const config = WIDGET_CONFIG[variant];

  return (
    <div className="mb-4 lg:mb-0 min-h-[61px] w-fit mx-auto">
      <div
        className="goodfirm-widget translate-x-8"
        data-widget-type={config.type}
        data-widget-pattern={config.pattern}
        data-height={config.height}
        data-company-id="211069"
      />
    </div>
  );
}
