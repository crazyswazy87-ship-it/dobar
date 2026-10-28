import { useId, type KeyboardEvent } from 'react';
import { cn } from '../../lib/utils';

interface Opt<T extends string | number> {
  value: T;
  label: string;
  disabled?: boolean;
  title?: string;
}

interface Props<T extends string | number> {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: readonly Opt<T>[];
  className?: string;
  hideLabel?: boolean;
}

/** Radio-group segmented control with roving tabindex and arrow-key support. */
export function GlassSegmented<T extends string | number>({ label, value, onChange, options, className, hideLabel }: Props<T>) {
  const id = useId();
  const enabled = options.filter((o) => !o.disabled);

  const onKey = (e: KeyboardEvent) => {
    const idx = enabled.findIndex((o) => o.value === value);
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % enabled.length;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx - 1 + enabled.length) % enabled.length;
    if (next < 0) return;
    e.preventDefault();
    onChange(enabled[next].value);
    requestAnimationFrame(() => document.getElementById(`${id}-${enabled[next].value}`)?.focus());
  };

  return (
    <div className={cn('gfield', className)}>
      <span id={`${id}-l`} className={hideLabel ? 'sr-only' : 'glabel muted !text-[0.68rem] uppercase tracking-[0.14em]'}>
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={`${id}-l`}
        onKeyDown={onKey}
        className="inline-flex w-full max-w-full gap-1 overflow-x-auto rounded-full p-1"
        style={{ background: 'var(--input-bg)', boxShadow: 'inset 0 0 0 1px var(--glass-border)' }}
      >
        {options.map((o) => {
          const on = o.value === value;
          return (
            <button
              key={o.value}
              id={`${id}-${o.value}`}
              type="button"
              role="radio"
              aria-checked={on}
              disabled={o.disabled}
              title={o.title}
              tabIndex={on ? 0 : -1}
              onClick={() => onChange(o.value)}
              className="min-h-10 flex-1 whitespace-nowrap rounded-full px-4 text-[0.8rem] font-bold transition-all disabled:cursor-not-allowed disabled:opacity-40"
              style={
                on
                  ? {
                      color: 'var(--accent-ink)',
                      background: 'linear-gradient(180deg, rgba(255,255,255,.4), transparent 55%), var(--accent)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,.55)',
                    }
                  : { color: 'var(--ink-muted)' }
              }
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
