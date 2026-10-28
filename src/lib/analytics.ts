import type { ChartPoint } from '../components/charts/AreaChart';
import type { ArtistListenerStats, ListenerSnapshot } from '../types';

export type RangeKey = '7d' | '30d' | '90d' | 'all';

export const RANGES: { key: RangeKey; label: string; short: string; days: number | null }[] = [
  { key: '7d', label: '7 days', short: '7 days', days: 7 },
  { key: '30d', label: '30 days', short: '30 days', days: 30 },
  { key: '90d', label: '90 days', short: '90 days', days: 90 },
  { key: 'all', label: 'All time', short: 'All', days: null },
];

const DAY = 86_400_000;
const ms = (iso: string) => new Date(iso).getTime();

export interface Change {
  pct: number | null;
  abs: number | null;
  baseline: number | null;
  baselineDate: string | null;
}
const NONE: Change = { pct: null, abs: null, baseline: null, baselineDate: null };

/** ((current - previous) / previous) * 100. Null when previous is missing or zero. */
export function growthPct(current: number, previous: number | null | undefined): number | null {
  if (previous == null || !Number.isFinite(previous) || previous <= 0) return null;
  return ((current - previous) / previous) * 100;
}

const sorted = (s: ListenerSnapshot[]) => [...s].sort((a, b) => ms(a.capturedAt) - ms(b.capturedAt));

/** Chart points inside the selected range, ending at the newest snapshot. */
export function chartPoints(snapshots: ListenerSnapshot[], days: number | null): ChartPoint[] {
  const list = sorted(snapshots);
  if (!list.length) return [];
  const cutoff = days == null ? -Infinity : ms(list[list.length - 1].capturedAt) - days * DAY;
  return list.filter((p) => ms(p.capturedAt) >= cutoff).map((p) => ({ t: ms(p.capturedAt), v: p.listeners }));
}

/** Compares with the last reading on/before (newest - days). Never invents a baseline. */
export function changeOver(stats: ArtistListenerStats, days: number | null): Change {
  const list = sorted(stats.snapshots);
  if (list.length < 2) return NONE;
  let base: ListenerSnapshot | undefined;
  if (days == null) base = list[0];
  else {
    const cutoff = ms(list[list.length - 1].capturedAt) - days * DAY;
    for (const p of list) {
      if (ms(p.capturedAt) <= cutoff) base = p;
      else break;
    }
  }
  if (!base) return NONE;
  return {
    pct: growthPct(stats.monthlyListeners, base.listeners),
    abs: stats.monthlyListeners - base.listeners,
    baseline: base.listeners,
    baselineDate: base.capturedAt,
  };
}

export function changeSinceJoining(stats: ArtistListenerStats): Change {
  if (stats.listenersAtJoin == null) return NONE;
  return {
    pct: growthPct(stats.monthlyListeners, stats.listenersAtJoin),
    abs: stats.monthlyListeners - stats.listenersAtJoin,
    baseline: stats.listenersAtJoin,
    baselineDate: stats.joinedAt,
  };
}
