import { useEffect, useMemo, useRef, useState } from 'react';
import SphereImageGrid, { type ImageData } from '../ui/img-sphere';
import type { Artist } from '../../types';

/** The project's original 3D artist sphere, sized to its container instead of window.innerWidth. */
export function ArtistSphere({ artists }: { artists: Artist[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(360);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.floor(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const images: ImageData[] = useMemo(
    () =>
      artists.map((a) => ({
        id: a.id,
        src: a.imageSrc,
        alt: `${a.name} — featured artist`,
        title: a.name,
        description: a.tagline ?? a.bio ?? '',
      })),
    [artists]
  );

  const size = Math.max(280, Math.min(600, w));
  return (
    <div ref={ref} className="flex w-full justify-center overflow-hidden">
      <SphereImageGrid
        images={images}
        containerSize={size}
        sphereRadius={size * 0.36}
        dragSensitivity={0.8}
        momentumDecay={0.96}
        maxRotationSpeed={6}
        baseImageScale={0.21}
        hoverScale={1.3}
        perspective={1000}
        autoRotate
        autoRotateSpeed={0.2}
      />
    </div>
  );
}
