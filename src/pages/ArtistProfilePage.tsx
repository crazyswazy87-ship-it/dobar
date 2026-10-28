import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Pause, Play, Shuffle } from 'lucide-react';
import { toast } from 'sonner';
import { AnalyticsModal } from '../components/artists/AnalyticsModal';
import { ArtistHeader } from '../components/artists/ArtistHeader';
import { ArtistMenu } from '../components/artists/ArtistMenu';
import { Artwork } from '../components/artists/Artwork';
import { TrackList } from '../components/artists/TrackList';
import { LiquidGlass } from '../components/glass';
import { useAudio } from '../hooks/usePlayer';
import { useArtistProfile } from '../hooks/useArtistProfile';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import type { Track } from '../types';

const btnPlay: React.CSSProperties = {
  color: 'var(--accent-ink)',
  background: 'linear-gradient(180deg, rgba(255,255,255,.42), transparent 55%), var(--accent)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,.6), 0 8px 22px -8px color-mix(in srgb, var(--accent) 70%, transparent)',
};

export default function ArtistProfilePage() {
  const { artistId } = useParams();
  const state = useArtistProfile(artistId);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

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

  const play = useCallback(
    (t: Track) => {
      if (!t.audioSrc) return;
      if (t.id === currentId) toggle();
      else {
        pendingPlay.current = true;
        setCurrentId(t.id);
      }
    },
    [currentId, toggle]
  );

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied');
    } catch {
      toast.error('Could not copy the link');
    }
  };

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
  const playable = tracks.filter((t) => t.audioSrc);
  const latest = [...playable].sort((a, b) => (b.releaseDate ?? '').localeCompare(a.releaseDate ?? ''))[0];
  const isPlaying = !!current && audio.playing;
  const hasPlays = tracks.some((t) => t.plays != null);

  const mainPlay = () => {
    const target = current ?? playable[0];
    if (target) play(target);
  };
  const shuffle = () => {
    if (!playable.length) return;
    play(playable[Math.floor(Math.random() * playable.length)]);
  };

  return (
    <div className="wrap pb-24 pt-28 sm:pt-36">
      <ArtistHeader artist={artist} stats={stats} />

      <div className="flex items-center gap-3 py-5 sm:gap-4">
        <button
          type="button"
          onClick={mainPlay}
          disabled={!playable.length}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="grid h-14 w-14 shrink-0 place-items-center rounded-full transition hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
          style={btnPlay}
        >
          {isPlaying ? <Pause size={24} aria-hidden="true" /> : <Play size={24} aria-hidden="true" className="translate-x-px" />}
        </button>

        {latest && (
          <button
            type="button"
            onClick={() => play(latest)}
            aria-label={`Play latest: ${latest.title}`}
            className="shrink-0 rounded-lg"
            style={{ boxShadow: '0 0 0 2px var(--glass-border)' }}
          >
            <Artwork src={latest.coverSrc ?? artist.imageSrc} alt="" label={latest.title} className="h-12 w-12 text-base" />
          </button>
        )}

        <button
          type="button"
          onClick={shuffle}
          disabled={playable.length < 2}
          aria-label="Shuffle"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full muted hover:text-[var(--ink)] disabled:opacity-40"
        >
          <Shuffle size={24} aria-hidden="true" />
        </button>

        <div className="ml-auto sm:ml-0">
          <ArtistMenu onOpenAnalytics={() => setAnalyticsOpen(true)} onCopyLink={copyLink} spotifyUrl={artist.spotifyUrl} />
        </div>
      </div>

      <section aria-labelledby="songs-title">
        <h2 id="songs-title" className="display text-2xl sm:text-3xl">
          {hasPlays ? 'Popular' : 'Songs on Doba'}
        </h2>
        <p className="muted mb-4 mt-1 text-sm">Only songs added to Doba for {artist.name}.</p>

        {tracks.length ? (
          <TrackList
            tracks={tracks}
            artist={artist}
            currentId={currentId}
            playing={audio.playing}
            progress={audio.progress}
            audioError={audio.error}
            onPlay={play}
          />
        ) : (
          <LiquidGlass variant="subtle" radius={24} className="p-8 text-center">
            <p className="font-bold">No songs listed yet</p>
            <p className="muted mt-1 text-sm">
              Songs added for {artist.name} in <code>src/data/tracks.ts</code> will appear here.
            </p>
          </LiquidGlass>
        )}
      </section>

      <AnalyticsModal open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} artist={artist} stats={stats} />
    </div>
  );
}
