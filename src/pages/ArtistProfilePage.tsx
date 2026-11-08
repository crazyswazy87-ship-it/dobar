import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArtistHeader } from '../components/artists/ArtistHeader';
import { useAudio } from '../hooks/usePlayer';
import { useArtistProfile } from '../hooks/useArtistProfile';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { SocialCard } from '../components/ui/SocialCard';



export default function ArtistProfilePage() {
  const { artistId } = useParams();
  const state = useArtistProfile(artistId);
  const [currentId] = useState<string | null>(null);

  const tracks = state.status === 'ready' ? state.tracks : [];
  const current = tracks.find((t) => t.id === currentId) ?? null;
  const audio = useAudio(current?.audioSrc ?? null);
  const { toggle } = audio;
  const pendingPlay = useRef(false);

  // After a different track is picked, start it once its <audio> element exists.
  useEffect(() => {
    if (pendingPlay.current && current?.audioSrc) {
      pendingPlay.current = false;
      toggle();
    }
  }, [current, toggle]);

  useDocumentTitle(state.status === 'ready' ? `${state.artist.name} — Doba Music` : 'Artist — Doba Music');


  if (state.status === 'loading') {
    return (
      <div className="wrap section pt-36" aria-busy="true">
        <div className="h-72 animate-pulse rounded-[36px]" style={{ background: 'var(--glass-surface)' }} />
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="wrap section pt-36" role="alert">
        <h1 className="display text-3xl">Could not load this artist</h1>
        <p className="muted mt-3">{state.error.message}</p>
        <Link to="/artists" className="mt-6 inline-flex min-h-11 items-center font-semibold underline">
          Back to artists
        </Link>
      </div>
    );
  }

  if (state.status === 'not-found') {
    return (
      <div className="wrap section pt-36">
        <h1 className="display text-3xl">Artist not found</h1>
        <Link to="/artists" className="mt-6 inline-flex min-h-11 items-center font-semibold underline">
          Back to artists
        </Link>
      </div>
    );
  }

  const { artist, stats } = state;

  return (
    <div className="wrap pb-24 pt-28 sm:pt-36  justify-center flex-col ali">
      <ArtistHeader artist={artist} stats={stats} />
      <br/>

     <SocialCard artist={artist} />


    </div>
  );
}
