'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    Redoc?: {
      init: (specUrl: string, options: Record<string, unknown>, element: HTMLElement) => void;
    };
  }
}

const SPEC_URL = '/api/docs/openapi/openapi.yaml';
const redocContainerClassName = 'redoc-shell min-h-[calc(100vh-88px)] bg-[#05070b]';

export default function SwaggerDocClient() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isScriptReady, setIsScriptReady] = useState(false);

  useEffect(() => {
    if (!isScriptReady || !containerRef.current || !window.Redoc) {
      return;
    }

    // ReDoc resolves relative $refs against the served spec URL, so the API route
    // exposes the whole docs/openapi tree under /api/docs/openapi/*.
    window.Redoc.init(
      SPEC_URL,
      {
        hideDownloadButton: false,
        requiredPropsFirst: true,
        pathInMiddlePanel: true,
        theme: {
          typography: {
            fontSize: '15px',
            lineHeight: '1.6em',
            fontWeightRegular: '500',
            fontWeightBold: '700',
            headings: {
              fontFamily: 'var(--font-wadik), sans-serif',
              fontWeight: '700',
            },
            code: {
              fontSize: '14px',
              fontWeight: '600',
            },
            links: {
              color: '#f8fafc',
              hover: '#ffffff',
            },
          },
          colors: {
            primary: {
              main: '#fd266c',
            },
            text: {
              primary: '#f3f4f6',
              secondary: 'rgba(226,232,240,0.78)',
            },
            success: {
              main: '#22c55e',
            },
            warning: {
              main: '#f59e0b',
            },
            error: {
              main: '#f43f5e',
            },
            http: {
              get: '#38bdf8',
              post: '#22c55e',
              put: '#f59e0b',
              delete: '#f43f5e',
              patch: '#a855f7',
              options: '#94a3b8',
              head: '#94a3b8',
            },
          },
          sidebar: {
            backgroundColor: '#0a0c10',
            textColor: '#dbe4f0',
            activeTextColor: '#ffffff',
            width: '344px',
          },
          rightPanel: {
            backgroundColor: '#7d879a',
            textColor: '#f8fafc',
          },
          codeBlock: {
            backgroundColor: '#68748b',
          },
        },
      },
      containerRef.current,
    );
  }, [isScriptReady]);

  return (
    <>
      <Script
        src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"
        strategy="afterInteractive"
        onLoad={() => setIsScriptReady(true)}
      />

      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <div>
            <p className="font-main text-main-xs uppercase tracking-[0.18em] text-gray60">
              API Docs
            </p>
            <h1 className="font-title text-title-xl text-white">Swagger / OpenAPI</h1>
          </div>
          <a
            href={SPEC_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-(--radius-secondary) border border-gray16 bg-black/20 px-3 py-2 font-main text-main-xs text-gray75 transition duration-main hover:border-gray16 hover:text-white"
          >
            Open raw spec
          </a>
        </div>
        <div ref={containerRef} className={redocContainerClassName} />
      </div>

      <style jsx global>{`
        .redoc-shell {
          background:
            linear-gradient(180deg, rgba(15, 23, 42, 0.52), rgba(5, 7, 11, 0.94)), #05070b;
        }

        .redoc-shell .api-content {
          background:
            linear-gradient(180deg, rgba(17, 24, 39, 0.78), rgba(9, 11, 16, 0.96)), #090b10;
          color: #f3f4f6;
        }

        .redoc-shell .menu-content {
          background:
            linear-gradient(180deg, rgba(12, 14, 20, 0.98), rgba(7, 9, 14, 0.98)), #090b10;
        }

        .redoc-shell .right-panel {
          background:
            linear-gradient(180deg, rgba(129, 140, 158, 0.96), rgba(88, 101, 123, 0.98)), #7d879a;
          color: #f8fafc;
        }

        .redoc-shell .right-panel pre,
        .redoc-shell .right-panel code,
        .redoc-shell .api-content pre,
        .redoc-shell .api-content code {
          background-color: #68748b !important;
          color: #f8fafc !important;
          font-size: 14px !important;
          font-weight: 600 !important;
        }

        .redoc-shell .menu-content,
        .redoc-shell .menu-content label,
        .redoc-shell .menu-content span,
        .redoc-shell .menu-content li,
        .redoc-shell .menu-content a {
          color: #e5edf7 !important;
          font-size: 16px !important;
          font-weight: 500 !important;
        }

        .redoc-shell .menu-content li > label,
        .redoc-shell .menu-content li > a,
        .redoc-shell .menu-content ul[role='menu'] a,
        .redoc-shell .menu-content ul[role='menu'] label {
          font-family: var(--font-poppins), sans-serif !important;
          font-size: 13px !important;
          font-weight: 500 !important;
          line-height: 1.45 !important;
        }

        .redoc-shell .menu-content input,
        .redoc-shell .menu-content input::placeholder {
          color: #dbe4f0 !important;
          font-size: 15px !important;
        }

        .redoc-shell .api-content h1,
        .redoc-shell .api-content h2,
        .redoc-shell .api-content h3,
        .redoc-shell .api-content h4,
        .redoc-shell .api-content h5 {
          color: #ffffff !important;
          font-weight: 700 !important;
          letter-spacing: 0.01em !important;
        }

        .redoc-shell .api-content h1,
        .redoc-shell .api-content h2 {
          font-size: 34px !important;
          line-height: 1.15 !important;
        }

        .redoc-shell .api-content h3 {
          font-size: 24px !important;
          line-height: 1.2 !important;
        }

        .redoc-shell .api-content h4,
        .redoc-shell .api-content h5 {
          font-size: 18px !important;
          line-height: 1.3 !important;
        }

        .redoc-shell .api-content p,
        .redoc-shell .api-content li,
        .redoc-shell .api-content span,
        .redoc-shell .api-content td,
        .redoc-shell .api-content th,
        .redoc-shell .api-content div {
          color: #e5e7eb;
        }

        .redoc-shell .api-content p,
        .redoc-shell .api-content li,
        .redoc-shell .api-content td,
        .redoc-shell .api-content th {
          font-size: 15px !important;
          line-height: 1.6 !important;
        }

        .redoc-shell .api-content label,
        .redoc-shell .api-content button,
        .redoc-shell .api-content [role='button'] {
          font-size: 15px !important;
          font-weight: 600 !important;
        }

        .redoc-shell .api-content table,
        .redoc-shell .api-content tr,
        .redoc-shell .api-content td,
        .redoc-shell .api-content th {
          border-color: rgba(148, 163, 184, 0.28) !important;
        }

        .redoc-shell .right-panel,
        .redoc-shell .right-panel p,
        .redoc-shell .right-panel span,
        .redoc-shell .right-panel div,
        .redoc-shell .right-panel td,
        .redoc-shell .right-panel th {
          color: #f8fafc !important;
          font-family: var(--font-poppins), sans-serif !important;
          font-size: 15px !important;
          line-height: 1.6 !important;
        }

        .redoc-shell .right-panel button,
        .redoc-shell .right-panel label {
          color: #ffffff !important;
          font-family: var(--font-poppins), sans-serif !important;
          font-size: 15px !important;
          font-weight: 600 !important;
        }

        .redoc-shell .right-panel h5,
        .redoc-shell .right-panel strong,
        .redoc-shell .right-panel b,
        .redoc-shell .right-panel span,
        .redoc-shell .right-panel div {
          font-family: var(--font-poppins), sans-serif !important;
        }

        .redoc-shell .right-panel .react-tabs__tab,
        .redoc-shell .right-panel button[role='tab'],
        .redoc-shell .right-panel [role='tab'][aria-selected='false'] {
          color: #0f172a !important;
          -webkit-text-fill-color: #0f172a !important;
          background: #0f2747 !important;
          border-color: rgba(71, 85, 105, 0.35) !important;
          opacity: 1 !important;
          font-weight: 600 !important;
        }

        .redoc-shell .right-panel .react-tabs__tab--selected,
        .redoc-shell .right-panel [role='tab'][aria-selected='true'] {
          color: #111827 !important;
          -webkit-text-fill-color: #111827 !important;
          background: #f8fafc !important;
          font-weight: 700 !important;
          border-color: rgba(15, 23, 42, 0.12) !important;
          opacity: 1 !important;
        }

        .redoc-shell .http-verb,
        .redoc-shell [data-section-id] span[class*='operation-type'],
        .redoc-shell .menu-content li > a > span:first-child,
        .redoc-shell .menu-content li > label > span:first-child,
        .redoc-shell .menu-content ul[role='menu'] li span:first-child,
        .redoc-shell .menu-content span[class*='http'],
        .redoc-shell .menu-content span[class*='verb'],
        .redoc-shell .menu-content span[class*='operation'] {
          font-family: var(--font-wadik), sans-serif !important;
          font-size: 12px !important;
          font-weight: 700 !important;
          letter-spacing: 0.04em !important;
        }
      `}</style>
    </>
  );
}
