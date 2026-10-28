import { useMemo } from 'react';
import { getArtistStats } from '../data/artistStats';
import type { Artist, ArtistListenerStats, Track } from '../types';
import { useCatalog } from './useCatalog';

export type ArtistProfileState =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'not-found' }
  | { status: 'ready'; artist: Artist; tracks: Track[]; stats: ArtistListenerStats | null };

/**
 * One artist + ONLY the songs listed on Doba for them (src/data/tracks.ts).
 * Stats come from src/data/artistStats.ts. When Appwrite is plugged in the
 * catalog hook changes, this hook and every component below stay the same.
 */
export function useArtistProfile(artistId?: string): ArtistProfileState {
  const cat = useCatalog();
  return useMemo<ArtistProfileState>(() => {
    if (cat.status === 'loading') return { status: 'loading' };
    if (cat.status === 'error') return { status: 'error', error: cat.error };
    const artist = cat.data.artists.find((a) => a.id === artistId);
    if (!artist) return { status: 'not-found' };
    const tracks = cat.data.tracks
      .filter((t) => t.artistId === artist.id)
      .sort((a, b) => (b.plays ?? -1) - (a.plays ?? -1) || (b.releaseDate ?? '').localeCompare(a.releaseDate ?? ''));
    return { status: 'ready', artist, tracks, stats: getArtistStats(artist.id) };
  }, [cat, artistId]);
}
