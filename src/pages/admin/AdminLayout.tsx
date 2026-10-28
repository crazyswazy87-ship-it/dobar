import { useState, type FormEvent } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Inbox, LayoutDashboard, ListMusic, LogOut, ShieldAlert } from 'lucide-react';
import { Backdrop } from '../../components/layout/Backdrop';
import { Brand, GlassButton, GlassField, GlassFilters, GlassPanel, GlassThemeToggle, LiquidGlass } from '../../components/glass';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { api, type AuthState } from '../../services';
import { cn } from '../../lib/utils';

const NAV = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/submissions', label: 'Submissions', icon: Inbox },
  { to: '/admin/catalog', label: 'Playlists & data', icon: ListMusic },
] as const;

function Login({ onState }: { onState: (s: AuthState) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const go = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      onState(await api.auth.signIn(email, password));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed');
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={go} className="mx-auto max-w-sm">
      <GlassPanel variant="strong" title="Studio sign-in" className="grid gap-4">
        <GlassField label="Email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
        <GlassField label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={error} />
        <GlassButton type="submit" kind="primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</GlassButton>
      </GlassPanel>
    </form>
  );
}

/**
 * Admin shell. IMPORTANT: this component only decides what to SHOW.
 * Real protection must come from the backend (Appwrite team permissions) —
 * see docs/APPWRITE.md. With the static provider there is no backend, so:
 *   • production builds show a "locked" screen;
 *   • development builds show a clearly-labelled, insecure preview.
 */
export default function AdminLayout() {
  useDocumentTitle('Studio — Doba Music');
  const auth = useAsync(() => api.auth.getState(), []);
  const [override, setOverride] = useState<AuthState | null>(null);
  const state = override ?? auth.data;

  const shell = (children: React.ReactNode, banner?: React.ReactNode) => (
    <div className="min-h-svh">
      <Backdrop />
      <GlassFilters />
      <div className="mx-auto grid max-w-[80rem] gap-4 p-3 sm:p-5 lg:grid-cols-[15rem_1fr]">
        <LiquidGlass as="aside" variant="standard" radius={22} className="flex flex-col gap-2 p-3 lg:sticky lg:top-5 lg:h-[calc(100svh-2.5rem)]">
          <div className="flex items-center justify-between px-1 py-1"><Brand /><GlassThemeToggle className="lg:hidden" /></div>
          <nav aria-label="Studio" className="flex gap-1 overflow-x-auto lg:grid lg:overflow-visible">
            {NAV.map(({ to, label, icon: Icon, ...r }) => (
              <NavLink key={to} to={to} end={'end' in r} className={({ isActive }) => cn('flex min-h-11 shrink-0 items-center gap-2.5 rounded-2xl px-3.5 text-sm font-semibold', isActive ? 'bg-[var(--glass-surface-strong)] text-[var(--accent-text)]' : 'text-[var(--ink-muted)] hover:text-[var(--ink)]')}>
                <Icon size={17} aria-hidden="true" />{label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto hidden items-center justify-between gap-2 lg:flex">
            <GlassThemeToggle />
            {state?.mode === 'signed-in' && (
              <button type="button" aria-label="Sign out" className="grid h-11 w-11 place-items-center rounded-full" onClick={async () => setOverride(await api.auth.signOut())}>
                <LogOut size={17} aria-hidden="true" />
              </button>
            )}
          </div>
        </LiquidGlass>
        <div className="min-w-0">
          {banner}
          {children}
        </div>
      </div>
    </div>
  );

  if (!state) return shell(<p className="muted p-6" aria-busy="true">Checking access…</p>);

  if (state.mode === 'unconfigured') {
    if (import.meta.env.DEV)
      return shell(
        <Outlet />,
        <p role="alert" className="g-chip mb-4 !normal-case !tracking-normal" data-tone="warn">
          <ShieldAlert size={15} aria-hidden="true" /> DEV PREVIEW — no authentication. Data below is local to this browser. This screen is hidden in production builds.
        </p>
      );
    return shell(
      <GlassPanel variant="strong" title="Studio is locked" eyebrow="Backend required">
        <p className="muted max-w-xl text-sm leading-7">
          The admin studio needs a backend that checks who you are on the server. None is connected yet, so this page
          shows nothing sensitive. Connect Appwrite (see <code>docs/APPWRITE.md</code>) to turn it on.
        </p>
      </GlassPanel>
    );
  }

  if (state.mode === 'signed-out') return shell(<Login onState={setOverride} />);

  if (!state.isAdmin)
    return shell(<GlassPanel variant="strong" title="No access"><p className="muted text-sm">{state.email} isn’t on the admins team.</p></GlassPanel>);

  return shell(<Outlet />);
}
