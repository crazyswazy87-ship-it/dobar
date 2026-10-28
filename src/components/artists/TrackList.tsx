import { Check, ExternalLink, Pause, Play } from 'lucide-react';
import { formatDuration, formatNumber } from '../../lib/format';
import type { Artist, Track } from '../../types';
import { Artwork } from './Artwork';

interface Props {
  tracks: Track[];
  artist: Artist;
  currentId: string | null;
  playing: boolean;
  progress: number;
  audioError: boolean;
  onPlay: (track: Track) => void;
}

export function TrackList({ tracks, artist, currentId, playing, progress, audioError, onPlay }: Props) {
  const showPlays = tracks.some((t) => t.plays != null);

  return (
    <ol className="-mx-2 sm:-mx-3">
      {tracks.map((t, i) => {
        const current = t.id === currentId;
        const isPlaying = current && playing;
        const playable = !!t.audioSrc;
        return (
          <li key={t.id} className="group relative rounded-2xl px-2 py-2 hover:bg-[var(--glass-surface)] sm:px-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                disabled={!playable}
                onClick={() => onPlay(t)}
                aria-label={playable ? `${isPlaying ? 'Pause' : 'Play'} ${t.title}` : `${t.title} has no audio file`}
                className="relative grid h-11 w-8 shrink-0 place-items-center text-sm tabular-nums muted disabled:cursor-default"
              >
                <span
                  className={playable ? 'group-hover:invisible group-focus-within:invisible' : ''}
                  style={current ? { color: 'var(--accent-text)' } : undefined}
                >
                  {isPlaying ? <Pause size={15} aria-hidden="true" /> : i + 1}
                </span>
                {playable && (
                  <span className="invisible absolute group-hover:visible group-focus-within:visible" style={{ color: 'var(--ink)' }}>
                    {isPlaying ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
                  </span>
                )}
              </button>

              <Artwork src={t.coverSrc ?? artist.imageSrc} alt="" label={t.title} className="h-11 w-11 shrink-0 text-base" />

              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold" style={current ? { color: 'var(--accent-text)' } : undefined}>
                  {t.title}
                </p>
                <p className="muted truncate text-sm">{artist.name}</p>
              </div>

              {showPlays && (
                <span className="muted hidden w-24 text-right text-sm tabular-nums sm:block">
                  {t.plays != null ? formatNumber(t.plays) : ''}
                </span>
              )}

              <span className="hidden h-5 w-5 shrink-0 place-items-center sm:grid">
                {t.playlistIds.length > 0 && (
                  <span
                    className="grid h-5 w-5 place-items-center rounded-full"
                    style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}
                    title="On a Doba playlist"
                  >
                    <Check size={13} strokeWidth={3} aria-label="On a Doba playlist" />
                  </span>
                )}
              </span>

              {t.spotifyUrl ? (
                <a
                  href={t.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${t.title} on Spotify`}
                  className="grid h-11 w-9 shrink-0 place-items-center muted hover:text-[var(--ink)]"
                >
                  <ExternalLink size={16} aria-hidden="true" />
                </a>
              ) : (
                <span className="w-9 shrink-0" aria-hidden="true" />
              )}

              {t.durationSec != null && (
                <span className="muted w-11 shrink-0 text-right text-sm tabular-nums">{formatDuration(t.durationSec)}</span>
              )}
            </div>

            {current && (
              <div className="mt-1 pl-11 sm:pl-12" aria-hidden={!audioError}>
                {audioError ? (
                  <p role="alert" className="text-xs" style={{ color: 'var(--danger-text)' }}>
                    Audio file unavailable.
                  </p>
                ) : (
                  <div className="h-1 overflow-hidden rounded-full" style={{ background: 'var(--glass-border)' }}>
                    <div className="h-full rounded-full" style={{ width: `${progress * 100}%`, background: 'var(--accent)' }} />
                  </div>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
