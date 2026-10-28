import { useCatalog } from '../../hooks/useCatalog';
import { useAsync } from '../../hooks/useAsync';
import { GlassPanel } from '../../components/glass';
import { formatDate, formatNumber } from '../../lib/format';
import { api } from '../../services';

export default function AdminCatalog() {
  const cat = useCatalog();
  const snaps = useAsync(() => api.catalog.listSnapshots(), []);
  const d = cat.data;
  const all = snaps.data ?? [];

  return (
    <div className="grid gap-4">
      <h1 className="display text-3xl">Playlists & data</h1>
      {!api.capabilities.canEditCatalog && (
        <p className="muted text-sm leading-6">
          Content is edited in code today: <code>src/data/playlists.ts</code>, <code>snapshots.ts</code>,{' '}
          <code>placements.ts</code>. In-app editing turns on with the Appwrite provider.
        </p>
      )}

      <GlassPanel variant="subtle" title="Playlists & statistics">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[42rem] text-left text-sm">
            <thead className="muted text-xs uppercase tracking-[0.12em]">
              <tr>{['Playlist', 'Followers', 'Source', 'Updated', 'Spotify link', 'Snapshots'].map((h) => <th key={h} scope="col" className="pb-3 font-bold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {d?.playlists.map((p) => {
                const mine = all.filter((s) => s.playlistId === p.id);
                return (
                  <tr key={p.id} className="border-t" style={{ borderColor: 'var(--glass-border)' }}>
                    <th scope="row" className="py-3 font-semibold">{p.name}</th>
                    <td className="py-3 tabular-nums">{p.followers !== null ? formatNumber(p.followers) : '—'}</td>
                    <td className="muted py-3">{p.followersSource?.label ?? '—'}</td>
                    <td className="muted py-3">{p.followersSource?.updatedAt ? formatDate(p.followersSource.updatedAt) : '—'}</td>
                    <td className="py-3">{p.spotifyUrl ? 'Yes' : <span className="muted">Missing</span>}</td>
                    <td className="py-3 tabular-nums">{mine.length}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassPanel>

      <GlassPanel variant="subtle" title="Placement records">
        {d && d.placements.length === 0 ? (
          <p className="muted text-sm">No placements recorded yet.</p>
        ) : (
          <ul className="grid gap-2 text-sm">
            {d?.placements.map((p) => (
              <li key={p.id}>
                {d.artists.find((a) => a.id === p.artistId)?.name} → {d.playlists.find((x) => x.id === p.playlistId)?.name} · {formatDate(p.addedAt)} · {p.verified ? 'verified' : 'unverified'}
              </li>
            ))}
          </ul>
        )}
      </GlassPanel>
    </div>
  );
}
