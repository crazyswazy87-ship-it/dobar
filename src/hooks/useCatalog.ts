import { api } from '../services';
import type { Artist, Placement, Playlist, Testimonial, Track } from '../types';
import { useAsync } from './useAsync';

export interface Catalog {
  playlists: Playlist[];
  artists: Artist[];
  tracks: Track[];
  placements: Placement[];
  testimonials: Testimonial[];
}

let cached: Promise<Catalog> | null = null;

/** One load for the whole public site; later components reuse the same promise. */
export function loadCatalog(): Promise<Catalog> {
  cached ??= Promise.all([
    api.catalog.listPlaylists(),
    api.catalog.listArtists(),
    api.catalog.listTracks(),
    api.catalog.listPlacements(),
    api.catalog.listTestimonials(),
  ])
    .then(([playlists, artists, tracks, placements, testimonials]) => ({
      playlists,
      artists,
      tracks,
      placements,
      testimonials,
    }))
    .catch((e: unknown) => {
      cached = null; // allow retry
      throw e;
    });
  return cached;
}

export const useCatalog = () => useAsync(loadCatalog, []);
