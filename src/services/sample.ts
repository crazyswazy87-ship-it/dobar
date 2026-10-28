import type { ArtistListenerStats, PlaylistSnapshot } from '../types';

/**
 * ILLUSTRATIVE DEMO DATA — NOT REAL.
 * Used only when the visitor flips "Preview with sample data". Every chart that
 * shows it carries a SAMPLE DATA badge. Deterministic, so it looks the same every time.
 */
export function makeSampleSnapshots(playlistId: string, days = 90): PlaylistSnapshot[] {
  let seed = 0;
  for (const c of playlistId) seed = (seed * 31 + c.charCodeAt(0)) >>> 0;
  const rand = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const start = 800 + Math.floor(rand() * 1800);
  const now = Date.now();
  const out: PlaylistSnapshot[] = [];
  let v = start;
  for (let i = days; i >= 0; i--) {
    v += Math.round(rand() * 14 - 2 + (days - i) * 0.05);
    out.push({
      id: `sample-${playlistId}-${i}`,
      playlistId,
      capturedAt: new Date(now - i * 86_400_000).toISOString(),
      followers: Math.max(0, v),
      source: 'sample',
    });
  }
  return out;
}

/** ILLUSTRATIVE DEMO DATA — NOT REAL. Used only by the Analytics "Preview with sample data" switch. */
export function makeSampleArtistStats(artistId: string, days = 120): ArtistListenerStats {
  let seed = 7;
  for (const c of artistId) seed = (seed * 31 + c.charCodeAt(0)) >>> 0;
  const rand = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const now = Date.now();
  let v = 600 + Math.floor(rand() * 1800);
  const snapshots = [];
  for (let i = days; i >= 0; i -= 2) {
    v += Math.round(rand() * 70 - 8 + (days - i) * 0.4);
    snapshots.push({ capturedAt: new Date(now - i * 86_400_000).toISOString(), listeners: Math.max(0, v) });
  }
  return {
    artistId,
    monthlyListeners: snapshots[snapshots.length - 1].listeners,
    totalListeners: null,
    joinedAt: snapshots[0].capturedAt,
    listenersAtJoin: snapshots[0].listeners,
    updatedAt: null,
    snapshots,
  };
}
