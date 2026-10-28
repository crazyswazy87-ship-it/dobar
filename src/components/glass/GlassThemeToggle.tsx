import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../theme/context';

/** Accessible switch: announces "Dark mode, on/off". 44px touch target. */
export function GlassThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      onClick={toggle}
      className={`relative inline-grid h-11 w-[5.25rem] shrink-0 grid-cols-2 items-center rounded-full ${className ?? ''}`}
      style={{
        background: 'linear-gradient(155deg, var(--glass-sheen), transparent 60%), var(--glass-surface)',
        boxShadow: 'inset 0 1px 0 var(--glass-highlight), inset 0 0 0 1px var(--glass-border)',
      }}
    >
      <span
        aria-hidden="true"
        className="absolute left-1 top-1 h-9 w-9 rounded-full transition-transform duration-[450ms]"
        style={{
          transform: dark ? 'translateX(2.25rem)' : 'translateX(0)',
          transitionTimingFunction: 'var(--ease)',
          background: 'linear-gradient(180deg, rgba(255,255,255,.4), rgba(255,255,255,0) 55%), var(--accent)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,.6), 0 4px 12px -2px color-mix(in srgb, var(--accent) 60%, transparent)',
        }}
      />
      <Sun size={17} aria-hidden="true" className="relative z-10 mx-auto" style={{ color: dark ? 'var(--ink-muted)' : 'var(--accent-ink)' }} />
      <Moon size={17} aria-hidden="true" className="relative z-10 mx-auto" style={{ color: dark ? 'var(--accent-ink)' : 'var(--ink-muted)' }} />
    </button>
  );
}
