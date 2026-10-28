import { GlassMetric, GlassPanel } from '../../components/glass';
import { useAsync } from '../../hooks/useAsync';
import { useCatalog } from '../../hooks/useCatalog';
import { api } from '../../services';

export default function AdminOverview() {
  const cat = useCatalog();
  const subs = useAsync(() => api.submissions.adminList(), []);
  const list = subs.data ?? [];
  const count = (s: string) => list.filter((x) => x.status === s).length;

  return (
    <div className="grid gap-4">
      <h1 className="display text-3xl">Overview</h1>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <GlassMetric variant="subtle" label="New submissions" value={subs.status === 'ready' ? count('new') : null} />
        <GlassMetric variant="subtle" label="In review" value={subs.status === 'ready' ? count('in-review') : null} />
        <GlassMetric variant="subtle" label="Priority" value={subs.status === 'ready' ? list.filter((x) => x.tier === 'priority').length : null} />
        <GlassMetric variant="subtle" label="Playlists" value={cat.data?.playlists.length ?? null} />
      </div>
      <GlassPanel variant="subtle" title="Backend status">
        <p className="muted text-sm leading-6">
          Provider: <strong className="text-[var(--ink)]">{api.id}</strong> ·{' '}
          {api.capabilities.hasBackend ? 'database connected' : 'no database — submissions are not stored on a server'}.
        </p>
      </GlassPanel>
    </div>
  );
}
