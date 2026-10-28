import type { ArtistListenerStats } from '../types';

/**
 * ARTIST LISTENER STATS — real numbers only (nothing is invented).
 * Artists without an entry simply show an empty state in Analytics.
 *
 * To add one, copy this into the array. `artistId` must match an id in artists.ts.
 * Add a new snapshot every day or week; growth charts need at least two.
 *
 *   {
 *     artistId: 'toxic-lyrikali',
 *     monthlyListeners: 5700,
 *     totalListeners: null,                 // leave null if you don't track it
 *     joinedAt: '2026-06-15',
 *     listenersAtJoin: 1800,                // null if not recorded
 *     updatedAt: '2026-10-27T06:00:00Z',
 *     snapshots: [
 *       { capturedAt: '2026-09-27T06:00:00Z', listeners: 4800 },
 *       { capturedAt: '2026-10-27T06:00:00Z', listeners: 5700 },
 *     ],
 *   },
 */
export const ARTIST_STATS: ArtistListenerStats[] = [];

export const getArtistStats = (artistId: string): ArtistListenerStats | null =>
  ARTIST_STATS.find((s) => s.artistId === artistId) ?? null;
