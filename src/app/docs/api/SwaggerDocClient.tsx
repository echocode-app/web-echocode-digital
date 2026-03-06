'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    Redoc?: {
      init: (
        specUrl: string,
        options: Record<string, unknown>,
        element: HTMLElement,
      ) => void;
    };
  }
}

const SPEC_URL = '/api/docs/openapi/openapi.yaml';

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
          colors: {
            primary: {
              main: '#fd266c',
            },
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
            <p className="font-main text-main-xs uppercase tracking-[0.18em] text-gray60">API Docs</p>
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

        <div ref={containerRef} className="min-h-[calc(100vh-88px)] bg-white" />
      </div>
    </>
  );
}
