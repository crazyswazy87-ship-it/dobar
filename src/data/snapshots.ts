import type { PlaylistSnapshot } from '../types';

/**
 * FOLLOWER SNAPSHOTS — real, dated follower counts, one per playlist per day (or week).
 * Growth charts need at least two readings in the chosen window. Empty until you record real ones:
 *
 *   { id: 's1', playlistId: 'pl-kenyan-hits', capturedAt: '2026-10-19T08:00:00Z', followers: 1234, source: 'manual-entry' }
 *
 * Later, an Appwrite scheduled function can write these automatically.
 */
export const SNAPSHOTS: PlaylistSnapshot[] = [];
