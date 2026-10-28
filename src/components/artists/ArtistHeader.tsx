import { BadgeCheck } from 'lucide-react';
import { changeOver } from '../../lib/analytics';
import { formatCompact, formatPct } from '../../lib/format';
import type { Artist, ArtistListenerStats } from '../../types';
import { Artwork } from './Artwork';

const DEFAULT_ACCENT = '#1f6b43';

export function ArtistHeader({ artist, stats }: { artist: Artist; stats: ArtistListenerStats | null }) {
  const accent = artist.accent ?? DEFAULT_ACCENT;
  const month = stats ? changeOver(stats, 30) : null;

  return (
    <section
      aria-labelledby="artist-name"
      className="overflow-hidden rounded-[28px] px-5 pb-7 pt-8 text-white sm:rounded-[36px] sm:px-10 sm:pb-10 sm:pt-12"
      style={{ background: `linear-gradient(180deg, ${accent} 0%, color-mix(in srgb, ${accent} 42%, #000) 100%)` }}
    >
      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-end sm:gap-8 sm:text-left">
        <Artwork
          src={artist.imageSrc}
          alt={artist.name}
          label={artist.name}
          round
          eager
          className="h-40 w-40 shrink-0 text-6xl shadow-[0_18px_50px_-12px_rgba(0,0,0,0.6)] sm:h-52 sm:w-52"
        />
        <div className="min-w-0 flex-1">
          {artist.verified && (
            <p className="mb-1 flex items-center justify-center gap-1.5 text-sm font-semibold sm:justify-start">
              <BadgeCheck size={20} aria-hidden="true" className="text-sky-300" /> Verified artist
            </p>
          )}
          <h1
            id="artist-name"
            className="line-clamp-3 break-words font-[family-name:var(--font-display)] text-[clamp(2.25rem,8vw,5.5rem)] leading-[1.02] tracking-tight"
          >
            {artist.name}
          </h1>
          {stats ? (
            <p className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-base font-medium sm:justify-start">
              <span>{formatCompact(stats.monthlyListeners)} monthly listeners</span>
              {month?.pct != null && (
                <span
                  className="rounded-full bg-black/35 px-2.5 py-0.5 text-xs font-bold"
                  style={{ color: month.pct >= 0 ? '#5cf08f' : '#ffb4b4' }}
                >
                  {formatPct(month.pct)} in 30 days
                </span>
              )}
            </p>
          ) : (
            artist.tagline && <p className="mt-3 text-base font-medium opacity-90">{artist.tagline}</p>
          )}
        </div>
      </div>
    </section>
  );
}
