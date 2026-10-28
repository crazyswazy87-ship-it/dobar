import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { LiquidGlass } from './LiquidGlass';
import { GlassButton } from './GlassButton';
import { GlassThemeToggle } from './GlassThemeToggle';
import { cn } from '../../lib/utils';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/playlists', label: 'Playlists' },
  { to: '/artists', label: 'Artists' },
  { to: '/audience', label: 'Audience' },
  { to: '/how-it-works', label: 'How it works' },
] as const;

export function Brand({ className }: { className?: string }) {
  return (
    <Link to="/" aria-label="Doba Music — home" className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        aria-hidden="true"
        className="grid h-9 w-9 place-items-center rounded-xl font-[family-name:var(--font-display)] text-lg"
        style={{
          color: 'var(--accent-text)',
          background: 'linear-gradient(155deg, var(--glass-sheen), transparent 60%), var(--glass-surface-strong)',
          boxShadow: 'inset 0 1px 0 var(--glass-highlight), inset 0 0 0 1px var(--glass-border)',
        }}
      >
        <img
          src="../assets/images/dobapic.png"
          alt='D'
          className='doba-pic'
        />
      </span>
      <span className="font-[family-name:var(--font-display)] text-lg tracking-tight">DOBA</span>
    </Link>
  );
}

/** Floating glass bar suspended above the page, with a compact drawer on phones. */
export function GlassNavigation() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // close when the route changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  // Escape closes and returns focus; outside tap closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!drawerRef.current?.contains(t) && !toggleRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    drawerRef.current?.querySelector<HTMLElement>('a,button')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  const link = ({ isActive }: { isActive: boolean }) =>
    cn(
      'block rounded-full px-3.5 py-2 text-[0.82rem] font-semibold transition-colors',
      isActive ? 'text-[var(--ink)]' : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
    );

  return (
    <header
      className="fixed inset-x-0 z-50 flex justify-center px-3"
      style={{ top: 'max(0.75rem, env(safe-area-inset-top))' }}
    >
      <div className="relative w-full max-w-[64rem]">
        <LiquidGlass
          as="nav"
          aria-label="Primary"
          variant="floating"
          dense
          refract
          radius={999}
          className="flex h-[3.75rem] items-center justify-between gap-2 pl-3 pr-2 sm:pl-4"
        >
          <Brand />

          <ul className="hidden items-center gap-0.5 lg:flex">
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={'end' in l ? l.end : false} className={link}>
                  {({ isActive }) => (
                    <span className="relative block">
                      {l.label}
                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="absolute -bottom-1 left-1/2 h-[3px] w-5 -translate-x-1/2 rounded-full"
                          style={{ background: 'var(--accent)' }}
                        />
                      )}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <GlassButton to="/submit" kind="primary" size="sm" className="hidden sm:inline-flex">
              Submit music
            </GlassButton>
            <GlassThemeToggle />
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
              className="grid h-11 w-11 place-items-center rounded-full lg:hidden"
              style={{ boxShadow: 'inset 0 0 0 1px var(--glass-border)' }}
            >
              {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </LiquidGlass>

        {open && (
          <div ref={drawerRef} id="mobile-menu" className="absolute inset-x-0 top-[calc(100%+0.5rem)] lg:hidden">
            <LiquidGlass variant="strong" radius={28} className="p-3" as="div">
              <ul className="grid">
                {LINKS.map((l) => (
                  <li key={l.to}>
                    <NavLink
                      to={l.to}
                      end={'end' in l ? l.end : false}
                      className={({ isActive }) =>
                        cn(
                          'flex min-h-12 items-center rounded-2xl px-4 text-base font-semibold',
                          isActive ? 'bg-[var(--glass-surface)] text-[var(--accent-text)]' : 'text-[var(--ink)]'
                        )
                      }
                    >
                      {l.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <GlassButton to="/submit" kind="primary" size="lg" className="mt-2 w-full">
                Submit music
              </GlassButton>
            </LiquidGlass>
          </div>
        )}
      </div>
    </header>
  );
}
