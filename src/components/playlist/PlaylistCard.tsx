import { Play } from 'lucide-react';
import { LiquidGlass } from '../glass';
import { formatCompact } from '../../lib/format';
import type { Playlist } from '../../types';


export function PlaylistCard({
  playlist,
  onOpen,
}: {
  playlist: Playlist;
  onOpen: (p: Playlist) => void;
}) {
  const spotifyUrl = 'spotifyUrl' in playlist
    ? (playlist as Playlist & { spotifyUrl?: string }).spotifyUrl
    : undefined;

  const openSpotify = () => {
    if (!spotifyUrl) return;

    window.open(spotifyUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="group relative block aspect-[4/5] w-full overflow-hidden rounded-[28px]"
      style={{
        boxShadow:
          'inset 0 0 0 1px var(--glass-border), 0 24px 50px -28px var(--glass-shadow)',
        background: 'var(--glass-surface-strong)',
      }}
    >
      <button
        type="button"
        onClick={() => onOpen(playlist)}
        aria-label={`${playlist.name} playlist — open details`}
        className="absolute inset-0 h-full w-full cursor-pointer text-left"
      >
        <img
          src={playlist.coverSrc}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
          style={{ objectPosition: playlist.coverPosition ?? 'center' }}
        />
      </button>

      <LiquidGlass
        as="div"
        variant="floating"
        dense
        radius={20}
        className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 px-4 py-3 transition-transform duration-500 group-hover:-translate-y-1"
      >
        <span className="min-w-0">
          <span className="block truncate text-[0.95rem] font-bold tracking-tight">
            {playlist.name}
          </span>
          <span className="muted block truncate text-xs">
            {playlist.followers !== null
              ? `${formatCompact(playlist.followers)} followers`
              : 'Doba playlist'}
          </span>
        </span>
      </LiquidGlass>

      <button
        type="button"
        onClick={openSpotify}
        disabled={!spotifyUrl}
        aria-label={`Play ${playlist.name} on Spotify`}
        title={spotifyUrl ? 'Listen on Spotify' : 'Spotify link not configured'}
        className="absolute bottom-6 right-6 z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full transition-transform duration-200 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          color: 'var(--accent-ink)',
          background:
            'linear-gradient(180deg, rgba(255,255,255,.4), transparent 55%), var(--accent)',
        }}
      >
        <Play size={16} className="translate-x-px" aria-hidden="true" />
      </button>
    </div>
  );
}