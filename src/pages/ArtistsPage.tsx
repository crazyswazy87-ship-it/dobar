import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCatalog } from '../hooks/useCatalog';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { formatDate } from '../lib/format';
import { LiquidGlass } from '../components/glass';
import { SectionHeading } from '../components/sections/SectionHeading';
import { TrackCard } from '../components/TrackCard';

export default function ArtistsPage() {
  useDocumentTitle('Artists — Doba Music');
  const cat = useCatalog();
  const d = cat.data;

  return (
    <div className="wrap section pt-36 sm:pt-40">
      <SectionHeading eyebrow="Artists" title="The artists on Doba." id="ar-title">
        Independent Kenyan voices featured across our playlists.
      </SectionHeading>

      {cat.status === 'loading' && <p className="muted mt-10" aria-busy="true">Loading artists…</p>}
      {cat.status === 'error' && <p className="mt-10" role="alert">Could not load artists: {cat.error.message}</p>}

      {d && (
        <>
          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {d.artists.map((a) => (
              <li key={a.id}>
                <LiquidGlass as="article" variant="standard" radius={26} className="relative overflow-hidden p-2">
                  <div className="aspect-[4/5] overflow-hidden rounded-[20px]">
                    <img src={a.imageSrc} alt={`${a.name}`} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
                  </div>
                  <div className="px-2 pb-2 pt-3">
                    <h3 className="text-[0.95rem] font-bold leading-tight tracking-tight">
                      <Link
                        to={`/artists/${a.id}`}
                        className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-[26px] focus-visible:after:ring-2 focus-visible:after:ring-[var(--accent-text)]"
                      >
                        {a.name}
                      </Link>
                    </h3>
                    <p className="muted mt-1 text-xs">
                      {a.tagline ? `${a.tagline} · ` : ''}
                      {d.tracks.filter((t) => t.artistId === a.id).length} songs
                    </p>
                    {a.spotifyUrl && (
                      <a href={a.spotifyUrl} target="_blank" rel="noopener noreferrer" className="relative z-10 mt-2 inline-flex min-h-10 items-center gap-1 text-xs font-bold" style={{ color: 'var(--accent-text)' }}>
                        Spotify <ExternalLink size={12} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </LiquidGlass>
              </li>
            ))}
          </ul>

          {d.tracks.length > 0 && (
            <section className="mt-20" aria-labelledby="ar-tracks">
              <h2 id="ar-tracks" className="display text-3xl">Tracks</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {d.tracks.map((t) => (
                  <TrackCard key={t.id} track={t} artist={d.artists.find((a) => a.id === t.artistId)} />
                ))}
              </div>
            </section>
          )}

          {d.placements.some((p) => p.verified) && (
            <section className="mt-20" aria-labelledby="ar-placements">
              <h2 id="ar-placements" className="display text-3xl">Verified placements</h2>
              <ul className="mt-6 grid gap-3">
                {d.placements
                  .filter((p) => p.verified)
                  .map((p) => {
                    const artist = d.artists.find((a) => a.id === p.artistId);
                    const track = d.tracks.find((t) => t.id === p.trackId);
                    const pl = d.playlists.find((x) => x.id === p.playlistId);
                    return (
                      <li key={p.id}>
                        <LiquidGlass variant="subtle" radius={20} className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
                          <span>
                            <strong>{artist?.name}</strong>
                            {track && <> — {track.title}</>} on <strong>{pl?.name}</strong>
                          </span>
                          <span className="muted">Added {formatDate(p.addedAt)}</span>
                        </LiquidGlass>
                      </li>
                    );
                  })}
              </ul>
            </section>
          )}

          {d.testimonials.length > 0 && (
            <section className="mt-20" aria-labelledby="ar-quotes">
              <h2 id="ar-quotes" className="display text-3xl">In their words</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {d.testimonials.map((t) => (
                  <LiquidGlass as="figure" key={t.id} variant="standard" radius={24} className="p-6">
                    <blockquote className="text-base leading-7">“{t.quote}”</blockquote>
                    <figcaption className="muted mt-3 text-sm font-semibold">{d.artists.find((a) => a.id === t.artistId)?.name}</figcaption>
                  </LiquidGlass>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
