'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';

/**
 * Lazy-load Spline on the Next.js /next path (SSR-friendly).
 * Falls back to null while loading so nothing renders on server.
 */
const Spline = dynamic(() => import('@splinetool/react-spline/next'), {
  ssr: false,
  loading: () => null,
});

interface SplineBackgroundProps {
  /** URL to the .splinecode scene. When undefined/falsy, only the fallback shows. */
  sceneUrl?: string;
  /** Background colour used behind the 3D scene and as fallback. Default: SadaPay navy (#072333). */
  fallbackColor?: string;
  /** Additional class names forwarded to the wrapper div. */
  className?: string;
}

/**
 * Production-ready Spline 3D background wrapper.
 *
 * Features:
 * - SSR‑safe dynamic import
 * - Mobile detection (<768px)
 * - Low‑end device detection (≤2 cores)
 * - WebGL support check
 * - 8‑second timeout fallback
 * - Fade‑in on successful load
 * - `pointer-events: none` so the canvas doesn't block interaction
 * - `contain: strict` + explicit height to prevent layout shift
 * - Graceful fallback colour when no scene URL is given or loading fails
 */
export default function SplineBackground({
  sceneUrl,
  fallbackColor = '#072333',
  className = '',
}: SplineBackgroundProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [canLoad, setCanLoad] = useState(false);
  const [clientReady, setClientReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only evaluate on the client
    setClientReady(true);
  }, []);

  useEffect(() => {
    if (!clientReady) return;

    // Mobile / low-end / no-WebGL detection
    const isMobile = window.innerWidth < 768;
    const isLowEnd = (navigator.hardwareConcurrency ?? 0) <= 2;
    const canvas = document.createElement('canvas');
    const hasWebGL = !!(
      canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    );

    setCanLoad(!!sceneUrl && !isMobile && !isLowEnd && hasWebGL);
  }, [sceneUrl, clientReady]);

  // 8-second timeout fallback
  useEffect(() => {
    if (!canLoad) return;
    const timer = setTimeout(() => {
      if (!loaded) setFailed(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [canLoad, loaded]);

  const showSpline = canLoad && !failed && clientReady;

  // Fix container height once we know the viewport
  const [vh, setVh] = useState(0);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const update = () => setVh(window.innerHeight);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-0 ${className}`}
      style={{
        background: fallbackColor,
        contain: 'strict',
        height: vh > 0 ? `${vh}px` : '100%',
        overflow: 'hidden',
      }}
    >
      {/* Subtle gradient overlay so the fallback isn't flat */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(0,180,216,0.08) 0%, transparent 60%),' +
            'radial-gradient(ellipse at 50% 100%, rgba(0,0,0,0.3) 0%, transparent 50%)',
        }}
      />

      {/* Spline 3D canvas (decorative, pointer-events: none) */}
      {showSpline && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.6s ease-in-out',
          }}
        >
          <Spline
            scene={sceneUrl!}
            onLoad={() => setLoaded(true)}
            style={{
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          />
        </div>
      )}
    </div>
  );
}
