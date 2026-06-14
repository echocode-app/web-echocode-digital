// 'use client';

// import Script from 'next/script';
// import { useCallback, useEffect, useRef, useState } from 'react';

// declare global {
//   interface Window {
//     turnstile?: {
//       render: (element: HTMLElement, options: Record<string, unknown>) => string;
//       remove: (widgetId: string) => void;
//       reset: (widgetId?: string) => void;
//     };
//   }
// }

// type TurnstileWidgetProps = {
//   action: string;
//   onVerify: (token: string) => void;
//   onError?: () => void;
// };

// export default function TurnstileWidget({ action, onVerify, onError }: TurnstileWidgetProps) {
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const widgetIdRef = useRef<string | null>(null);
//   const [shouldLoadScript, setShouldLoadScript] = useState(false);

//   const renderWidget = useCallback(() => {
//     if (!shouldLoadScript || !containerRef.current || !window.turnstile || widgetIdRef.current) {
//       return;
//     }

//     const sitekey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;
//     if (!sitekey) {
//       onError?.();
//       return;
//     }

//     widgetIdRef.current = window.turnstile.render(containerRef.current, {
//       sitekey,
//       action,
//       size: 'flexible',
//       theme: 'dark',
//       callback: onVerify,
//       'expired-callback': () => onVerify(''),
//       'error-callback': () => {
//         onVerify('');
//         onError?.();
//       },
//     });
//   }, [action, onError, onVerify, shouldLoadScript]);

//   useEffect(() => {
//     renderWidget();

//     return () => {
//       if (widgetIdRef.current && window.turnstile) {
//         window.turnstile.remove(widgetIdRef.current);
//         widgetIdRef.current = null;
//       }
//     };
//   }, [renderWidget]);

//   useEffect(() => {
//     const node = containerRef.current;
//     if (!node) return;

//     const activateWidget = () => setShouldLoadScript(true);
//     const parentForm = node.closest('form');

//     if (!('IntersectionObserver' in window)) {
//       const fallbackTimerId = globalThis.setTimeout(() => setShouldLoadScript(true), 0);
//       return () => globalThis.clearTimeout(fallbackTimerId);
//     }

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (!entry?.isIntersecting) return;

//         setShouldLoadScript(true);
//         observer.disconnect();
//       },
//       {
//         rootMargin: '360px 0px',
//       },
//     );

//     observer.observe(node);
//     // Load on form interaction as a fallback for zero-height or modal-mounted widgets.
//     parentForm?.addEventListener('focusin', activateWidget);
//     parentForm?.addEventListener('pointerdown', activateWidget);

//     return () => {
//       observer.disconnect();
//       parentForm?.removeEventListener('focusin', activateWidget);
//       parentForm?.removeEventListener('pointerdown', activateWidget);
//     };
//   }, []);

//   return (
//     <>
//       {shouldLoadScript && (
//         <Script
//           src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
//           strategy="afterInteractive"
//           onLoad={renderWidget}
//         />
//       )}
//       <div ref={containerRef} />
//     </>
//   );
// }
