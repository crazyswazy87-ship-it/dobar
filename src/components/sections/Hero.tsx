import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SITE } from '../../config/site';
import { useCatalog } from '../../hooks/useCatalog';
import { formatCompact } from '../../lib/format';
import { GlassButton, GlassMetric, LiquidGlass } from '../glass';
import { PlayButton } from '../player/PlayButton';
//pdjggpzr40
function PlaylistPreview() {
  const cat = useCatalog();
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const list = useMemo(() => (cat.data?.playlists ?? []).filter((p) => p.featured).slice(0, 5), [cat.data]);

  useEffect(() => {
    if (reduce || paused || list.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % list.length), 5200);
    return () => clearInterval(t);
  }, [reduce, paused, list.length]);

  if (!list.length) return null;
  const p = list[i % list.length];

  return (
    <LiquidGlass
      as="section"
      aria-label="Featured playlist preview"
      variant="floating"
      refract
      radius={32}
      className="w-full max-w-[19rem] p-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative aspect-[4/4.4] overflow-hidden rounded-[22px]">
        {list.map((pl, idx) => (
          <img
            key={pl.id}
            src={pl.coverSrc}
            alt={idx === i % list.length ? `${pl.name} playlist artwork` : ''}
            aria-hidden={idx !== i % list.length}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            style={{ objectPosition: pl.coverPosition ?? 'center', opacity: idx === i % list.length ? 1 : 0 }}
            loading={idx === 0 ? 'eager' : 'lazy'}
          />
        ))}
      </div>
      <div className="flex items-end justify-between gap-3 px-2 pb-1 pt-3">
        <div className="min-w-0">
          <p className="eyebrow !text-[0.62rem]">Now featuring</p>
          <p className="truncate text-base font-bold tracking-tight">{p.name}</p>
          <p className="muted text-xs">{p.followers !== null ? `${formatCompact(p.followers)} followers` : 'Doba playlist'}</p>
        </div>
        <div className="flex gap-1" role="group" aria-label="Choose featured playlist">
          {list.map((pl, idx) => (
            <button
              key={pl.id}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Show ${pl.name}`}
              aria-pressed={idx === i % list.length}
              className="grid h-7 w-5 place-items-center"
            >
              <span
                className="block h-1.5 rounded-full transition-all"
                style={{ width: idx === i % list.length ? 16 : 6, background: idx === i % list.length ? 'var(--accent)' : 'var(--ink-faint)' }}
              />
            </button>
          ))}
        </div>
      </div>
    </LiquidGlass>
  );
}

function HeroStats() {
  const cat = useCatalog();
  const d = cat.data;
  if (!d) return null;
  return (
    <div className="grid grid-cols-2 gap-3">
      <GlassMetric variant="floating" label="Playlists" value={d.playlists.length} />
      <GlassMetric variant="floating" label="Artists featured" value={d.artists.length} />
    </div>
  );
}

function HeroPlayer() {
  const cat = useCatalog();
  const track = cat.data?.tracks.find((t) => t.audioSrc);
  if (!track || !track.audioSrc) return null;
  const artist = cat.data?.artists.find((a) => a.id === track.artistId);
  return (
    <LiquidGlass as="section" aria-label="Featured track player" variant="floating" dense radius={26} className="p-4">
      <p className="eyebrow !text-[0.62rem]">Listen</p>
      <p className="mb-3 truncate text-sm font-bold">
        {track.title} <span className="muted font-medium">· {artist?.name}</span>
      </p>
      <PlayButton src={track.audioSrc} label={`${track.title}${artist ? ` by ${artist.name}` : ''}`} />
    </LiquidGlass>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden pb-16 pt-32 sm:pt-40 lg:pb-24">
      {/* cinematic imagery */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <img
          src="/assets/images/img-13.jpg"
          alt=""
          fetchPriority="high"
          className="absolute -right-[18%] top-0 h-full w-[88%] object-cover sm:right-0 sm:w-[62%]"
          style={{
            opacity: 'var(--hero-img-opacity)',
            WebkitMaskImage: 'radial-gradient(70% 70% at 60% 45%, #000 28%, transparent 78%)',
            maskImage: 'radial-gradient(70% 70% at 60% 45%, #000 28%, transparent 78%)',
          }}
        />
        <div className="absolute inset-0" style={{ background: 'var(--veil)', opacity: 0.55 }} />
      </div>

      <div className="wrap grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <motion.p {...rise(0)} className="eyebrow">
            {SITE.eyebrow}
          </motion.p>
          <motion.h1 {...rise(0.08)} id="hero-title" className="display mt-5 text-[clamp(2.4rem,7vw,5.4rem)]">
            Your music deserves to be{' '}
            <span style={{ color: 'var(--accent-text)' }}>discovered.</span>
          </motion.h1>
          <motion.p {...rise(0.16)} className="muted mt-6 max-w-xl text-base leading-7 sm:text-lg sm:leading-8">
            {SITE.description}
          </motion.p>
          <motion.div {...rise(0.24)} className="mt-9 flex flex-wrap gap-3">
            <GlassButton to="/submit" kind="primary" size="lg">
              Submit your music <ArrowRight size={17} aria-hidden="true" />
            </GlassButton>
            <GlassButton to="/playlists" kind="glass" size="lg">
              Explore the playlists
            </GlassButton>
          </motion.div>
          <motion.p {...rise(0.32)} className="muted mt-6 max-w-md text-sm">
            Free to submit. Every song is reviewed and considered.
          </motion.p>
        </div>

        <motion.div {...rise(0.2)} className="mx-auto grid w-full max-w-[22rem] gap-4 lg:mx-0 lg:ml-auto">
          <div className="flex justify-center lg:justify-end">
            <PlaylistPreview />
          </div>
          <HeroStats />
          <HeroPlayer />
        </motion.div>
      </div>
    </section>
  );
}
