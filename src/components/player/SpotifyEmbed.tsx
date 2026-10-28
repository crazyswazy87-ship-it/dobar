import { useState } from 'react';
import { Play } from 'lucide-react';
import { spotifyEmbedUrl } from '../../lib/spotify';
import { GlassButton } from '../glass';

interface Props {
  kind: 'track' | 'playlist';
  id: string;
  title: string;
}

/** Loads Spotify's player only after a tap, so the page stays fast and no third-party loads uninvited. */
export function SpotifyEmbed({ kind, id, title }: Props) {
  const [on, setOn] = useState(false);
  const height = kind === 'track' ? 152 : 352;
  if (!on)
    return (
      <div className="grid place-items-center rounded-2xl p-6 text-center" style={{ minHeight: height, boxShadow: 'inset 0 0 0 1px var(--glass-border)' }}>
        <div>
          <p className="muted mb-3 text-sm">Spotify player</p>
          <GlassButton kind="primary" onClick={() => setOn(true)}>
            <Play size={16} aria-hidden="true" /> Load player
          </GlassButton>
        </div>
      </div>
    );
  return (
    <iframe
      title={`Spotify player: ${title}`}
      src={spotifyEmbedUrl(kind, id)}
      width="100%"
      height={height}
      style={{ border: 0, borderRadius: 16 }}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
}
