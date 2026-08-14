type GoodFirmsWidgetProps = {
  variant?: 'horizontal' | 'stars';
};

const WIDGET_CONFIG = {
  horizontal: {
    type: 'goodfirms-widget-t9',
    pattern: 'horizontal-inline',
    height: 61,
    width: 300,
  },
  stars: {
    type: 'goodfirms-widget-t6',
    pattern: 'star-no-review',
    height: 100,
    width: 300,
  },
};

const GOODFIRMS_SCRIPT_SRC = 'https://assets.goodfirms.co/assets/js/widget.min.js';

export default function GoodFirmsWidget({ variant = 'horizontal' }: GoodFirmsWidgetProps) {
  const config = WIDGET_CONFIG[variant];

  const widgetHtml = `
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          html,
          body {
            margin: 0;
            padding: 0;
            width: ${config.width}px;
            height: ${config.height}px;
            overflow: hidden;
            background: transparent;
          }
        </style>
      </head>
      <body>
        <div
          class="goodfirm-widget"
          data-widget-type="${config.type}"
          data-widget-pattern="${config.pattern}"
          data-height="${config.height}"
          data-company-id="211069"
        ></div>

        <script type="text/javascript" src="${GOODFIRMS_SCRIPT_SRC}"></script>
      </body>
    </html>
  `;

  return (
    <div className="mb-4 lg:mb-0 min-h-[61px] w-fit mx-auto">
      <iframe
        title="GoodFirms Widget"
        srcDoc={widgetHtml}
        width={config.width}
        height={config.height}
        className="block border-0 translate-x-8"
        scrolling="no"
      />
    </div>
  );
}
