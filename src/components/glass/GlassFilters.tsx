import { useEffect } from 'react';

/**
 * One shared SVG filter used ONLY by elements that opt in with `refract`.
 *
 * feTurbulence → feDisplacementMap bends whatever sits behind the glass a few
 * pixels, like looking through a thick water droplet. It is supported in the
 * `backdrop-filter` of Chromium browsers on desktop only, so we flag the
 * document (data-refract) only there. Everywhere else the same surfaces fall
 * back to the normal blur — which is a diffusion, not real refraction.
 */
export function GlassFilters() {
  useEffect(() => {
    const root = document.documentElement;
    const nav = navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } };
    const chromium =
      nav.userAgentData?.brands.some((b) => b.brand === 'Chromium') ?? /Chrome\/\d+/.test(navigator.userAgent);
    const desktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (chromium && desktop && !calm) root.setAttribute('data-refract', '');
    return () => root.removeAttribute('data-refract');
  }, []);

  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
      <defs>
        <filter id="doba-refract" x="-4%" y="-4%" width="108%" height="108%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.011 0.018" numOctaves="2" seed="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="16" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}
