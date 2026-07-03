'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';

const Spline = dynamic(() => import('@splinetool/react-spline/next'), {
  ssr: false,
  loading: () => null,
});

interface Props {
  sceneUrl?: string;
  fallbackColor?: string;
  className?: string;
}

export default function SplineBackground({ sceneUrl, fallbackColor = '#072333', className = '' }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [canLoad, setCanLoad] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !sceneUrl) return;

    const isMobile = window.innerWidth < 768;
    const isLowEnd = (navigator.hardwareConcurrency || 0) <= 2;

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    const hasWebGL = !!gl;
    // Clean up test canvas
    (canvas as any).width = 0;

    setCanLoad(!isMobile && !isLowEnd && hasWebGL);
  }, [sceneUrl]);

  // 8s timeout fallback
  useEffect(() => {
    if (!canLoad) return;
    timeoutRef.current = setTimeout(() => {
      if (!loaded) setFailed(true);
    }, 8000);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [canLoad, loaded]);

  const showSpline = canLoad && !failed && !!sceneUrl;

  return (
    <div
      className={`fixed inset-0 z-0 ${className}`}
      style={{
        background: fallbackColor,
        contain: 'strict',
        overflow: 'hidden',
      }}
    >
      {/* Gradient overlay — keeps fallback from looking flat */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(7,35,51,0.6) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Spline scene */}
      {showSpline && (
        <div className="absolute inset-0 z-0" style={{ contain: 'strict' }}>
          <Spline
            scene={sceneUrl}
            onLoad={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              setLoaded(true);
            }}
            style={{
              width: '100%',
              height: '100%',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.6s ease-in-out',
              pointerEvents: 'none',
            }}
          />
        </div>
      )}
    </div>
  );
}
