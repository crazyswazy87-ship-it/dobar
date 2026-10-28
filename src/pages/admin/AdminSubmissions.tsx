import { useMemo, useState } from 'react';
import { GlassButton, GlassField, GlassModal, GlassPanel, GlassSelect, LiquidGlass } from '../../components/glass';
import { useAsync } from '../../hooks/useAsync';
import { formatDateTime } from '../../lib/format';
import { api } from '../../services';
import type { Submission, SubmissionStatus } from '../../types';

const STATUSES: { value: SubmissionStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'in-review', label: 'In review' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'declined', label: 'Declined' },
  { value: 'needs-info', label: 'Needs info' },
];

export default function AdminSubmissions() {
  const [version, setVersion] = useState(0);
  const subs = useAsync(() => api.submissions.adminList(), [version]);
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<Submission | null>(null);
  const [status, setStatus] = useState<SubmissionStatus>('new');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const rows = useMemo(
    () =>
      (subs.data ?? [])
        .filter((s) => filter === 'all' || s.status === filter)
        .filter((s) => !q || `${s.artistName} ${s.songTitle} ${s.email}`.toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => (a.tier === b.tier ? b.createdAt.localeCompare(a.createdAt) : a.tier === 'priority' ? -1 : 1)),
    [subs.data, filter, q]
  );

  const open = (s: Submission) => {
    setSel(s);
    setStatus(s.status);
    setNotes(s.internalNotes);
    setMsg('');
  };

  const save = async () => {
    if (!sel) return;
    setSaving(true);
    setMsg('');
    try {
      await api.submissions.adminUpdate(sel.id, { status, internalNotes: notes });
      setMsg(api.capabilities.hasBackend ? 'Saved.' : 'Saved in this browser only (no backend).');
      setVersion((v) => v + 1);
    } catch (e) {
      setMsg(`Could not save: ${e instanceof Error ? e.message : 'unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-4">
      <h1 className="display text-3xl">Submissions</h1>
      <LiquidGlass variant="floating" radius={20} className="grid gap-3 p-3 sm:grid-cols-[1fr_14rem] sm:items-end">
        <GlassField label="Search" placeholder="Artist, song or email" value={q} onChange={(e) => setQ(e.target.value)} />
        <GlassSelect label="Status" value={filter} onChange={setFilter} options={[{ value: 'all', label: 'All' }, ...STATUSES]} />
      </LiquidGlass>

      <GlassPanel variant="subtle" padded={false}>
        {subs.status === 'loading' && <p className="muted p-6" aria-busy="true">Loading…</p>}
        {subs.status === 'error' && <p className="p-6" role="alert">{subs.error.message}</p>}
        {subs.status === 'ready' && rows.length === 0 && <p className="muted p-6 text-sm">No submissions to show.</p>}
        {rows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="muted text-xs uppercase tracking-[0.12em]">
                <tr>{['Artist', 'Song', 'Type', 'Status', 'Received'].map((h) => <th key={h} scope="col" className="px-4 py-3 font-bold">{h}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.id} className="border-t" style={{ borderColor: 'var(--glass-border)' }}>
                    <th scope="row" className="px-4 py-3 font-semibold">
                      <button type="button" className="min-h-11 text-left underline-offset-2 hover:underline" onClick={() => open(s)}>{s.artistName}</button>
                    </th>
                    <td className="px-4 py-3">{s.songTitle}</td>
                    <td className="px-4 py-3">{s.tier === 'priority' ? <span className="g-chip" data-tone="accent">Priority</span> : 'Free'}</td>
                    <td className="px-4 py-3">{STATUSES.find((x) => x.value === s.status)?.label}</td>
                    <td className="muted px-4 py-3">{formatDateTime(s.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassPanel>

      <GlassModal open={!!sel} onClose={() => setSel(null)} title={sel ? `${sel.artistName} — ${sel.songTitle}` : 'Submission'} className="max-w-2xl">
        {sel && (
          <div className="grid gap-4">
            <dl className="grid gap-2 text-sm">
              {[['Email', sel.email], ['Spotify', sel.spotifyUrl], ['Genre', sel.genre], ['Release', `${sel.releaseStatus} ${sel.releaseDate}`], ['Social', sel.socialUrl || '—'], ['Pitch', sel.pitch || '—']].map(([k, v]) => (
                <div key={k} className="grid gap-0.5 sm:grid-cols-[6rem_1fr]"><dt className="muted font-semibold">{k}</dt><dd className="break-words">{v}</dd></div>
              ))}
            </dl>
            <GlassSelect label="Status" value={status} onChange={(v) => setStatus(v as SubmissionStatus)} options={STATUSES} />
            <GlassField multiline label="Internal notes" hint="Never shown to the artist." value={notes} onChange={(e) => setNotes(e.target.value)} />
            {msg && <p role="status" className="text-sm font-semibold">{msg}</p>}
            <GlassButton kind="primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</GlassButton>
          </div>
        )}
      </GlassModal>
    </div>
  );
}
