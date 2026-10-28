import { Link } from 'react-router-dom';
import { useCatalog } from '../../hooks/useCatalog';
import { GlassButton } from '../glass';
import { Reveal } from '../Reveal';
import { TrackCard } from '../TrackCard';
import { ArtistSphere } from './ArtistSphere';
import { SectionHeading } from './SectionHeading';

export function FeaturedMusic() {
  const { data } = useCatalog();
  if (!data) return null;
  const tracks = data.tracks.filter((t) => t.featured).slice(0, 6);
  const artists = data.artists.filter((a) => a.featured);

  return (
    <>
      {tracks.length > 0 && (
        <section className="section" aria-labelledby="tracks-title">
          <div className="wrap">
            <Reveal>
              <SectionHeading eyebrow="Featured tracks" title="Press play." id="tracks-title" />
            </Reveal>
            <Reveal delay={0.08} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tracks.map((t) => (
                <TrackCard key={t.id} track={t} artist={data.artists.find((a) => a.id === t.artistId)} />
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {artists.length > 0 && (
        <section className="section" aria-labelledby="artists-title">
          <div className="wrap">
            <Reveal className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading eyebrow="Featured artists" title="The sound of Kenya." id="artists-title">
                Drag the sphere to spin it. Tap a face to meet the artist.
              </SectionHeading>
              <GlassButton to="/artists" kind="glass">
                All artists
              </GlassButton>
            </Reveal>
            <Reveal delay={0.08} className="mt-8">
              <ArtistSphere artists={artists} />
              <p className="muted mt-2 text-center text-sm">
                Prefer a list? <Link to="/artists" className="font-bold underline" style={{ color: 'var(--accent-text)' }}>Browse all artists</Link>
              </p>
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
