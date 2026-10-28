import { useMemo, useState } from 'react';
import { AreaChart } from '../charts/AreaChart';
import { GlassMetric, GlassModal, GlassSegmented } from '../glass';
import { RANGES, chartPoints, changeOver, changeSinceJoining, type Change, type RangeKey } from '../../lib/analytics';
import { formatCompact, formatDate, formatDateTime, formatNumber, formatPct, formatSigned } from '../../lib/format';
import { makeSampleArtistStats } from '../../services/sample';
import type { Artist, ArtistListenerStats } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  artist: Artist;
  stats: ArtistListenerStats | null;
}

function hint(c: Change, missing: string) {
  if (c.pct == null || c.abs == null || !c.baselineDate) return missing;
  const up = c.abs >= 0;
  return (
    <>
      <span style={{ color: up ? 'var(--accent-text)' : 'var(--danger-text)' }} className="font-semibold">
        {up ? '▲' : '▼'} {formatSigned(c.abs)}
      </span>{' '}
      listeners vs {formatDate(c.baselineDate)}
    </>
  );
}

export function AnalyticsModal({ open, onClose, artist, stats }: Props) {
  const [range, setRange] = useState<RangeKey>('30d');
  const [sample, setSample] = useState(false);

  const hasReal = !!stats && stats.snapshots.length >= 2;
  const sampleStats = useMemo(() => (sample ? makeSampleArtistStats(artist.id) : null), [sample, artist.id]);
  const data = sampleStats ?? stats;
  const days = RANGES.find((r) => r.key === range)?.days ?? null;

  const rangeChange = useMemo(() => (data ? changeOver(data, days) : null), [data, days]);
  const joinChange = useMemo(() => (data ? changeSinceJoining(data) : null), [data]);
  const points = useMemo(() => (data ? chartPoints(data.snapshots, days) : []), [data, days]);
  const rangeLabel = RANGES.find((r) => r.key === range)?.label.toLowerCase() ?? '';

  return (
    <GlassModal open={open} onClose={onClose} title={`${artist.name} · Analytics`} className="max-w-2xl">
      <div className="grid gap-4">
        <GlassSegmented
          label="Date range"
          hideLabel
          value={range}
          onChange={setRange}
          options={RANGES.map((r) => ({ value: r.key, label: r.short, title: r.label }))}
        />

        {!hasReal && (
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold">
            <input
              type="checkbox"
              role="switch"
              checked={sample}
              onChange={(e) => setSample(e.target.checked)}
              className="h-5 w-5 accent-[var(--accent)]"
            />
            Preview with sample data
          </label>
        )}

        {!data ? (
          <p className="muted rounded-2xl p-6 text-center text-sm" style={{ boxShadow: 'inset 0 0 0 1px var(--glass-border)' }}>
            No listener stats recorded for {artist.name} yet. Add them in <code>src/data/artistStats.ts</code>, or turn on the sample
            preview to see how this view works.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <GlassMetric
                label="Monthly listeners"
                value={formatNumber(data.monthlyListeners)}
                sample={sample}
                variant="subtle"
              />
              <GlassMetric
                label="Total listeners"
                value={data.totalListeners != null ? formatNumber(data.totalListeners) : null}
                hint={data.totalListeners == null ? 'Not tracked yet' : undefined}
                variant="subtle"
              />
              <GlassMetric
                label={`Last ${rangeLabel}`}
                value={rangeChange?.pct != null ? formatPct(rangeChange.pct) : null}
                hint={rangeChange ? hint(rangeChange, 'Not enough history for this period') : undefined}
                variant="subtle"
              />
              <GlassMetric
                label="Since joining"
                value={joinChange?.pct != null ? formatPct(joinChange.pct) : null}
                hint={
                  joinChange?.baseline != null && joinChange.pct != null
                    ? `${formatCompact(joinChange.baseline)} → ${formatCompact(data.monthlyListeners)} since ${formatDate(data.joinedAt)}`
                    : 'Starting count not recorded'
                }
                variant="subtle"
              />
            </div>

            {points.length >= 2 ? (
              <AreaChart
                key={`${artist.id}-${range}-${sample}`}
                points={points}
                ariaLabel={`${artist.name} monthly listeners, ${rangeLabel}`}
                valueLabel="Listeners"
                sample={sample}
                height={240}
              />
            ) : (
              <p className="muted rounded-2xl p-6 text-center text-sm" style={{ boxShadow: 'inset 0 0 0 1px var(--glass-border)' }}>
                No listener history for this period yet. A chart appears once two readings are recorded.
              </p>
            )}

            {data.updatedAt && <p className="muted text-xs">Last updated {formatDateTime(data.updatedAt)}</p>}
          </>
        )}
      </div>
    </GlassModal>
  );
}
