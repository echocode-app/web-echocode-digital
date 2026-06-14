'use client';

import Script from 'next/script';
import { useCallback, useEffect, useRef, useState } from 'react';

const RECAPTCHA_SCRIPT_ID = 'google-recaptcha-v2-script';

declare global {
  interface Window {
    grecaptcha?: {
      render?: (
        element: HTMLElement,
        options: {
          sitekey: string;
          theme?: 'light' | 'dark';
          callback: (token: string) => void;
          'expired-callback': () => void;
          'error-callback': () => void;
        },
      ) => number;
      reset?: (widgetId?: number) => void;
    };
    __recaptchaOnLoad?: () => void;
    __recaptchaReady?: boolean;
    __recaptchaReadyCallbacks?: Array<() => void>;
  }
}

type RecaptchaWidgetProps = {
  resetSignal?: number;
  onVerify: (token: string) => void;
  onError?: () => void;
};

export default function RecaptchaWidget({ resetSignal, onVerify, onError }: RecaptchaWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [shouldLoadScript, setShouldLoadScript] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);

  const renderWidget = useCallback(() => {
    if (
      !shouldLoadScript ||
      !scriptReady ||
      !containerRef.current ||
      widgetIdRef.current !== null
    ) {
      return;
    }

    const sitekey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (!sitekey || typeof window.grecaptcha?.render !== 'function') {
      onError?.();
      return;
    }

    widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
      sitekey,
      theme: 'dark',
      callback: onVerify,
      'expired-callback': () => onVerify(''),
      'error-callback': () => {
        onVerify('');
        onError?.();
      },
    });
  }, [onError, onVerify, scriptReady, shouldLoadScript]);

  useEffect(() => {
    const markReady = () => setScriptReady(true);

    if (window.__recaptchaReady || typeof window.grecaptcha?.render === 'function') {
      markReady();
      return;
    }

    window.__recaptchaReadyCallbacks ??= [];
    window.__recaptchaReadyCallbacks.push(markReady);

    window.__recaptchaOnLoad = () => {
      window.__recaptchaReady = true;

      window.__recaptchaReadyCallbacks?.forEach((callback) => callback());
      window.__recaptchaReadyCallbacks = [];
    };

    return () => {
      window.__recaptchaReadyCallbacks = window.__recaptchaReadyCallbacks?.filter(
        (callback) => callback !== markReady,
      );
    };
  }, []);

  useEffect(() => {
    renderWidget();
  }, [renderWidget]);

  useEffect(() => {
    if (widgetIdRef.current === null) return;

    window.grecaptcha?.reset?.(widgetIdRef.current);
    onVerify('');
  }, [resetSignal, onVerify]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const activateWidget = () => setShouldLoadScript(true);
    const parentForm = node.closest('form');

    if (!('IntersectionObserver' in window)) {
      setShouldLoadScript(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        setShouldLoadScript(true);
        observer.disconnect();
      },
      {
        rootMargin: '360px 0px',
      },
    );

    observer.observe(node);
    parentForm?.addEventListener('focusin', activateWidget);
    parentForm?.addEventListener('pointerdown', activateWidget);

    return () => {
      observer.disconnect();
      parentForm?.removeEventListener('focusin', activateWidget);
      parentForm?.removeEventListener('pointerdown', activateWidget);
    };
  }, []);

  return (
    <>
      {shouldLoadScript && (
        <Script
          id={RECAPTCHA_SCRIPT_ID}
          src="https://www.google.com/recaptcha/api.js?onload=__recaptchaOnLoad&render=explicit"
          strategy="afterInteractive"
        />
      )}

      <div ref={containerRef} />
    </>
  );
}
