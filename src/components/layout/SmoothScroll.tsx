import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

/**
 * The project's original Lenis smooth scrolling, kept — but only on desktop
 * with a mouse and no reduced-motion preference. Touch scrolling stays native.
 */
export function SmoothScroll() {
  useEffect(() => {
    const ok =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!ok) return;
    const lenis = new Lenis();
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  return null;
}
