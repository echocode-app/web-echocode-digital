'use client';

import { useEffect, useRef, useState } from 'react';

import VideoLoader from '@/components/UI/loaders/VideoLoader';

const BasedOnVideo = () => {
  const [loaded, setLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;

    if (!('IntersectionObserver' in window)) {
      const fallbackTimerId = globalThis.setTimeout(() => setShouldLoadVideo(true), 0);
      return () => globalThis.clearTimeout(fallbackTimerId);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        setShouldLoadVideo(true);
        observer.disconnect();
      },
      {
        rootMargin: '480px 0px',
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative 
     w-full h-full sm:min-h-50 md:min-h-80 lg:min-h-120 mb-12.5 overflow-hidden bg-black rounded-secondary"
    >
      {!loaded && <VideoLoader />}

      {shouldLoadVideo && (
        <video
          loop
          autoPlay
          muted
          playsInline
          preload="metadata"
          onCanPlay={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-main ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src="/videos/based-on.mp4" type="video/mp4" />
        </video>
      )}

      <div className="absolute inset-0 z-10 bg-video-gradient pointer-events-none " />
    </div>
  );
};

export default BasedOnVideo;
