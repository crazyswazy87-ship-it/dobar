import { useState } from 'react';
import { useCatalog } from '../hooks/useCatalog';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import type { Playlist } from '../types';
import { PlaylistCard } from '../components/playlist/PlaylistCard';
import { PlaylistDialog } from '../components/playlist/PlaylistDialog';
import { SectionHeading } from '../components/sections/SectionHeading';
import { GlassButton, GlassPanel } from '../components/glass';

export default function PlaylistsPage() {
  useDocumentTitle('Playlists — Doba Music');
  const cat = useCatalog();
  const [open, setOpen] = useState<Playlist | null>(null);

  return (
    <div className="wrap section pt-36 sm:pt-40">
      <SectionHeading eyebrow="Playlists" title="Every playlist we curate." id="pl-title">
        Tap a playlist to see more, listen, and check where its numbers come from.
      </SectionHeading>

      {cat.status === 'loading' && (
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading playlists">
          {Array.from({ length: 6 }, (_, i) => (
            <li key={i} className="aspect-[4/5] animate-pulse rounded-[28px]" style={{ background: 'var(--glass-surface)' }} />
          ))}
        </ul>
      )}

      {cat.status === 'error' && (
        <GlassPanel className="mt-10" title="We couldn't load the playlists">
          <p className="muted text-sm">{cat.error.message}</p>
          <GlassButton className="mt-4" onClick={() => window.location.reload()}>
            Try again
          </GlassButton>
        </GlassPanel>
      )}

      {cat.status === 'ready' && cat.data.playlists.length === 0 && (
        <GlassPanel className="mt-10" title="Playlists are coming soon">
          <p className="muted text-sm">We are getting the playlist showcase ready.</p>
        </GlassPanel>
      )}

      {cat.status === 'ready' && cat.data.playlists.length > 0 && (
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {cat.data.playlists.map((p) => (
            <li key={p.id}>
              <PlaylistCard playlist={p} onOpen={setOpen} />
            </li>
          ))}
        </ul>
      )}

      <PlaylistDialog playlist={open} onClose={() => setOpen(null)} />
    </div>
  );
}
