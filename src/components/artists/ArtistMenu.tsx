import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ChartNoAxesCombined, ExternalLink, Link2, MoreHorizontal, type LucideIcon } from 'lucide-react';

interface Item {
  key: string;
  label: string;
  icon: LucideIcon;
  onSelect?: () => void;
  href?: string;
}

interface Props {
  onOpenAnalytics: () => void;
  onCopyLink: () => void;
  spotifyUrl?: string | null;
}

/** The three-dot overflow menu. Analytics lives here (no second menu). */
export function ArtistMenu({ onOpenAnalytics, onCopyLink, spotifyUrl }: Props) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const els = useRef<(HTMLElement | null)[]>([]);

  const items: Item[] = [
    { key: 'analytics', label: 'Analytics', icon: ChartNoAxesCombined, onSelect: onOpenAnalytics },
    { key: 'copy', label: 'Copy artist link', icon: Link2, onSelect: onCopyLink },
    ...(spotifyUrl ? [{ key: 'spotify', label: 'Open on Spotify', icon: ExternalLink, href: spotifyUrl }] : []),
  ];

  useEffect(() => {
    if (!open) return;
    els.current[0]?.focus();
    const away = (e: Event) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [open]);

  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) trigger.current?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    const list = els.current.filter(Boolean) as HTMLElement[];
    const i = list.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      list[(i + 1) % list.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      list[(i - 1 + list.length) % list.length]?.focus();
    } else if (e.key === 'Tab') setOpen(false);
  };

  const cls =
    'flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold hover:bg-[var(--glass-surface)] focus-visible:bg-[var(--glass-surface)] focus-visible:outline-none';

  return (
    <div ref={wrap} className="relative" onKeyDown={onKey}>
      <button
        ref={trigger}
        type="button"
        aria-label="More options"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="grid h-11 w-11 place-items-center rounded-full muted hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-[var(--accent-text)]"
      >
        <MoreHorizontal size={26} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Artist options"
          className="absolute right-0 top-full z-30 mt-1 w-56 max-w-[calc(100vw-2rem)] rounded-2xl p-1.5"
          style={{
            background: 'var(--glass-surface-strong)',
            boxShadow: 'inset 0 0 0 1px var(--glass-border), 0 18px 40px -12px var(--glass-shadow)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
          }}
        >
          {items.map((it, i) => {
            const Icon = it.icon;
            return it.href ? (
              <a
                key={it.key}
                ref={(el) => {
                  els.current[i] = el;
                }}
                role="menuitem"
                href={it.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cls}
                onClick={() => close(false)}
              >
                <Icon size={17} aria-hidden="true" /> {it.label}
              </a>
            ) : (
              <button
                key={it.key}
                ref={(el) => {
                  els.current[i] = el;
                }}
                role="menuitem"
                type="button"
                className={cls}
                onClick={() => {
                  it.onSelect?.();
                  close(it.key !== 'analytics');
                }}
              >
                <Icon size={17} aria-hidden="true" /> {it.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
