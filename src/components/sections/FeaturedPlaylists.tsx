import { useState } from 'react';
import { useCatalog } from '../../hooks/useCatalog';
import type { Playlist } from '../../types';
import { GlassButton } from '../glass';
import { PlaylistCard } from '../playlist/PlaylistCard';
import { PlaylistDialog } from '../playlist/PlaylistDialog';
import { Reveal } from '../Reveal';
import { SectionHeading } from './SectionHeading';

export function FeaturedPlaylists() {
  const { data } = useCatalog();
  const [open, setOpen] = useState<Playlist | null>(null);

  const list = (data?.playlists ?? []).filter((p) => p.featured);

  if (!list.length) return null;

  return (
    <section className="section" aria-labelledby="playlists-title">
      <div className="wrap">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Featured playlists"
            title="Get your track featured on one of  these playlists"
            id="playlists-title"
          >
            The playlists we curate for Kenyan listeners. Tap one to see more.
          </SectionHeading>

          <GlassButton to="/playlists" kind="glass">
            All playlists
          </GlassButton>
        </Reveal>

        <Reveal delay={0.08}>
          <ul className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3 lg:gap-6">
            {list.map((p) => (
              <li
                key={p.id}
                className="w-[78%] shrink-0 snap-center sm:w-auto"
              >
                <PlaylistCard playlist={p} onOpen={setOpen} />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <PlaylistDialog playlist={open} onClose={() => setOpen(null)} />
    </section>
  );
}