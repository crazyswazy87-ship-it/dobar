import { ExternalLink } from 'lucide-react';
import { GlassButton, GlassMetric, GlassModal } from '../glass';
import { SpotifyEmbed } from '../player/SpotifyEmbed';
import { formatDate } from '../../lib/format';
import type { Playlist } from '../../types';

export function PlaylistDialog({ playlist, onClose }: { playlist: Playlist | null; onClose: () => void }) {
  const p = playlist;
  return (
    <GlassModal open={!!p} onClose={onClose} title={p?.name ?? 'Playlist'} className="max-w-xl">
      {p && (
        <div className="grid gap-5">
          <div className="flex gap-4">
            <img
              src={p.coverSrc}
              alt={`${p.name} playlist artwork`}
              className="h-28 w-24 shrink-0 rounded-2xl object-cover"
              style={{ objectPosition: p.coverPosition ?? 'center' }}
            />
            <div>
              <p className="text-base font-semibold leading-snug">{p.tagline}</p>
              {p.description && <p className="muted mt-2 text-sm leading-6">{p.description}</p>}
            </div>
          </div>

          <GlassMetric
            variant="subtle"
            label="Playlist followers"
            value={p.followers !== null ? p.followers.toLocaleString('en') : null}
            hint={p.followers === null ? 'Follower count has not been connected yet.' : 'Followers are not the same as listeners or streams.'}
            source={
              p.followersSource
                ? `${p.followersSource.label}${p.followersSource.updatedAt ? ` · updated ${formatDate(p.followersSource.updatedAt)}` : ''}`
                : undefined
            }
          />

          {p.spotifyPlaylistId ? (
            <SpotifyEmbed kind="playlist" id={p.spotifyPlaylistId} title={p.name} />
          ) : p.spotifyUrl ? (
            <GlassButton href={p.spotifyUrl} kind="glass">
              Open on Spotify <ExternalLink size={15} aria-hidden="true" />
            </GlassButton>
          ) : (
            <p className="muted text-sm">The Spotify link for this playlist will appear here soon.</p>
          )}

          <GlassButton to="/submit" kind="primary" size="lg">
            Submit your music
          </GlassButton>
        </div>
      )}
    </GlassModal>
  );
}
