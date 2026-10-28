import { useMemo, useState } from 'react';
import { Info } from 'lucide-react';
import { AreaChart, type ChartPoint } from '../components/charts/AreaChart';
import { GlassMetric, GlassPanel, GlassSegmented, GlassSelect, LiquidGlass } from '../components/glass';
import { SectionHeading } from '../components/sections/SectionHeading';
import { TrackCard } from '../components/TrackCard';
import { useAsync } from '../hooks/useAsync';
import { useCatalog } from '../hooks/useCatalog';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { formatDate, formatDateTime, formatNumber } from '../lib/format';
import { api } from '../services';
import { makeSampleSnapshots } from '../services/sample';
import type { Playlist, PlaylistSnapshot } from '../types';

const DAY = 86_400_000;
type Range = 7 | 30 | 90;
const RANGES: Range[] = [7, 30, 90];

const SOURCE_LABEL: Record<PlaylistSnapshot['source'], string> = {
  'spotify-web-api': 'Spotify',
  'manual-entry': 'Entered by Doba',
  appwrite: 'Doba database',
  sample: 'Sample data',
};

export default function AudiencePage() {
  useDocumentTitle('Audience — Doba Music');
  const cat = useCatalog();
  const [playlistId, setPlaylistId] = useState<string>('');
  const [range, setRange] = useState<Range>(30);
  const [sample, setSample] = useState(false);

  const playlists = cat.data?.playlists ?? [];
  const current: Playlist | undefined = playlists.find((p) => p.id === playlistId) ?? playlists[0];

  const snaps = useAsync(
    () => (current ? api.catalog.listSnapshots(current.id) : Promise.resolve([])),
    [current?.id]
  );

  const real = useMemo(() => snaps.data ?? [], [snaps.data]);
  const series: PlaylistSnapshot[] = useMemo(
    () => (sample && current ? makeSampleSnapshots(current.id) : real),
    [sample, current, real]
  );

  // Which ranges does the history actually cover?
  const spanDays = series.length > 1 ? (Date.parse(series.at(-1)!.capturedAt) - Date.parse(series[0].capturedAt)) / DAY : 0;
  const rangeOk = (r: Range) => series.length > 1 && spanDays >= r - 1;
  const effective: Range | null = rangeOk(range) ? range : ([...RANGES].reverse().find(rangeOk) ?? null);

  const points: ChartPoint[] = useMemo(() => {
    if (!series.length || !effective) return [];
    const end = Date.parse(series.at(-1)!.capturedAt);
    return series.filter((s) => Date.parse(s.capturedAt) >= end - effective * DAY).map((s) => ({ t: Date.parse(s.capturedAt), v: s.followers }));
  }, [series, effective]);

  const latest = series.at(-1);
  const followersNow = sample ? (latest?.followers ?? null) : (latest?.followers ?? current?.followers ?? null);
  const change = points.length > 1 ? points.at(-1)!.v - points[0].v : null;
  const srcKind = sample ? 'sample' : (latest?.source ?? current?.followersSource?.kind);
  const updatedAt = sample ? null : (latest?.capturedAt ?? current?.followersSource?.updatedAt ?? null);

  const tracksOnPlaylist = (cat.data?.tracks ?? []).filter((t) => current && t.playlistIds.includes(current.id));

  return (
    <div className="wrap section pt-36 sm:pt-40">
      <SectionHeading eyebrow="Audience intelligence" title="The audience behind the playlists." id="aud-title">
        Real, dated follower readings for each playlist. Where we don’t have history yet, we say so instead of drawing a
        curve.
      </SectionHeading>

      {cat.status === 'loading' && <p className="muted mt-10" aria-busy="true">Loading playlists…</p>}
      {cat.status === 'error' && <p className="mt-10" role="alert">Could not load data: {cat.error.message}</p>}
      {cat.status === 'ready' && playlists.length === 0 && (
        <GlassPanel className="mt-10" title="No playlists yet">
          <p className="muted text-sm">Audience data appears once playlists are added.</p>
        </GlassPanel>
      )}

      {current && (
        <>
          {/* controls */}
          <LiquidGlass as="section" aria-label="Audience controls" variant="floating" radius={28} className="mt-10 grid gap-4 p-4 sm:p-5 md:grid-cols-[1.3fr_1fr_auto] md:items-end">
            <GlassSelect
              label="Playlist"
              compact
              value={current.id}
              onChange={setPlaylistId}
              options={playlists.map((p) => ({ value: p.id, label: p.name }))}
            />
            <GlassSegmented
              label="Time range"
              value={effective ?? range}
              onChange={setRange}
              options={RANGES.map((r) => ({
                value: r,
                label: `${r}d`,
                disabled: !rangeOk(r),
                title: rangeOk(r) ? `Last ${r} days` : `Needs ${r} days of recorded history`,
              }))}
            />
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold">
              <input type="checkbox" role="switch" checked={sample} onChange={(e) => setSample(e.target.checked)} className="h-5 w-5 accent-[var(--accent)]" />
              Preview with sample data
            </label>
          </LiquidGlass>

          {sample && (
            <p className="g-chip mt-4 !normal-case !tracking-normal" data-tone="warn" role="status">
              <Info size={14} aria-hidden="true" /> Sample data: illustrative only, not real Doba numbers.
            </p>
          )}

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.7fr_1fr]">
            {/* chart */}
            <GlassPanel
              as="section"
              aria-label={`${current.name} follower history`}
              title={`${current.name} — follower history`}
              eyebrow={effective ? `Last ${effective} days` : 'History'}
            >
              {snaps.status === 'loading' && <div className="h-[280px] animate-pulse rounded-2xl" style={{ background: 'var(--glass-surface)' }} aria-busy="true" />}
              {snaps.status === 'ready' && points.length > 1 && (
                <AreaChart
                  key={`${current.id}-${effective}-${sample}`}
                  points={points}
                  sample={sample}
                  ariaLabel={`${current.name} playlist followers over the last ${effective} days, from ${formatNumber(points[0].v)} to ${formatNumber(points.at(-1)!.v)}`}
                />
              )}
              {snaps.status === 'ready' && points.length <= 1 && (
                <div className="grid min-h-[280px] place-content-center gap-3 rounded-2xl p-6 text-center" style={{ boxShadow: 'inset 0 0 0 1px var(--glass-border)' }}>
                  <p className="text-lg font-bold">Growth history isn’t available for this playlist yet.</p>
                  <p className="muted mx-auto max-w-md text-sm leading-6">
                    We only chart real, dated follower readings, and we haven’t recorded enough for a trend. At least two
                    readings in the chosen window are needed. Today’s count is shown on the right.
                  </p>
                  {import.meta.env.DEV && (
                    <p className="muted mx-auto max-w-md text-xs">
                      Dev note: add entries to <code>src/data/snapshots.ts</code> (or connect Appwrite) to draw this chart.
                    </p>
                  )}
                </div>
              )}
              {snaps.status === 'error' && <p role="alert">Could not load history: {snaps.error.message}</p>}
            </GlassPanel>

            {/* metrics */}
            <div className="grid content-start gap-4">
              <GlassMetric
                label="Playlist followers"
                value={followersNow !== null ? formatNumber(followersNow) : null}
                sample={sample}
                hint={followersNow === null ? 'No follower reading has been recorded for this playlist yet.' : 'Followers are not unique listeners or streams.'}
              />
              {change !== null && effective && (
                <GlassMetric
                  label={`Change · ${effective} days`}
                  value={`${change >= 0 ? '+' : ''}${formatNumber(change)}`}
                  sample={sample}
                />
              )}
              <GlassPanel variant="subtle" title="Data source" className="text-sm">
                <dl className="grid gap-2">
                  <div className="flex justify-between gap-3">
                    <dt className="muted">Source</dt>
                    <dd className="text-right font-semibold">{srcKind ? SOURCE_LABEL[srcKind] : 'Not connected'}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="muted">Last updated</dt>
                    <dd className="text-right font-semibold">{updatedAt ? formatDateTime(updatedAt) : '—'}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="muted">Readings recorded</dt>
                    <dd className="text-right font-semibold">{sample ? 'Sample' : real.length}</dd>
                  </div>
                </dl>
              </GlassPanel>
            </div>
          </div>

          {/* all playlists */}
          <GlassPanel as="section" aria-label="All playlists" title="All playlists" className="mt-5">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[30rem] text-left text-sm">
                <thead className="muted text-xs uppercase tracking-[0.12em]">
                  <tr>
                    <th scope="col" className="pb-3 font-bold">Playlist</th>
                    <th scope="col" className="pb-3 text-right font-bold">Followers</th>
                    <th scope="col" className="pb-3 pl-4 font-bold">Source</th>
                    <th scope="col" className="pb-3 text-right font-bold">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {playlists.map((p) => (
                    <tr key={p.id} className="border-t" style={{ borderColor: 'var(--glass-border)' }}>
                      <th scope="row" className="py-3 font-semibold">{p.name}</th>
                      <td className="py-3 text-right tabular-nums">{p.followers !== null ? formatNumber(p.followers) : '—'}</td>
                      <td className="muted py-3 pl-4">{p.followersSource?.label ?? '—'}</td>
                      <td className="muted py-3 text-right">{p.followersSource?.updatedAt ? formatDate(p.followersSource.updatedAt) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassPanel>

          {/* tracks */}
          <GlassPanel as="section" aria-label="Track information" title="Track-level performance" className="mt-5">
            <p className="muted mb-4 text-sm leading-6">
              Per-track streams and listeners come from each artist’s own Spotify for Artists account, which Doba does not
              have access to. We show the tracks placed on this playlist, without invented performance numbers.
            </p>
            {tracksOnPlaylist.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {tracksOnPlaylist.map((t) => (
                  <TrackCard key={t.id} track={t} artist={cat.data?.artists.find((a) => a.id === t.artistId)} />
                ))}
              </div>
            ) : (
              <p className="text-sm font-semibold">No tracks have been listed for this playlist yet.</p>
            )}
          </GlassPanel>
        </>
      )}
    </div>
  );
}
