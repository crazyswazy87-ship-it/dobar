import { ExternalLink } from 'lucide-react';
import { LiquidGlass } from './glass';
import { PlayButton } from './player/PlayButton';
import { SpotifyEmbed } from './player/SpotifyEmbed';
import type { Artist, Track } from '../types';

export function TrackCard({ track, artist }: { track: Track; artist?: Artist }) {
  const cover = track.coverSrc ?? artist?.imageSrc ?? null;
  return (
    <LiquidGlass as="article" variant="standard" radius={24} className="grid gap-4 p-4">
      <div className="flex items-center gap-4">
        {cover && <img src={cover} alt="" loading="lazy" className="h-16 w-16 shrink-0 rounded-2xl object-cover" />}
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold tracking-tight">{track.title}</h3>
          <p className="muted truncate text-sm">{artist?.name ?? 'Unknown artist'}</p>
        </div>
      </div>
      {track.audioSrc && <PlayButton src={track.audioSrc} label={`${track.title} by ${artist?.name ?? 'artist'}`} />}
      {!track.audioSrc && track.spotifyTrackId && <SpotifyEmbed kind="track" id={track.spotifyTrackId} title={track.title} />}
      {track.spotifyUrl && (
        <a
          href={track.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold"
          style={{ color: 'var(--accent-text)' }}
        >
          Open on Spotify <ExternalLink size={14} aria-hidden="true" />
        </a>
      )}
    </LiquidGlass>
  );
}
