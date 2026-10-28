import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { LiquidGlass, type GlassVariant } from './LiquidGlass';

interface GlassMetricProps {
  label: string;
  /** null renders an em dash — never a made-up number. */
  value: string | number | null;
  hint?: ReactNode;
  /** e.g. "Spotify · updated 12 Oct" or "Sample data" */
  source?: ReactNode;
  sample?: boolean;
  variant?: GlassVariant;
  className?: string;
}

/** A single headline number with its label and data-source line. */
export function GlassMetric({ label, value, hint, source, sample, variant = 'standard', className }: GlassMetricProps) {
  return (
    <LiquidGlass variant={variant} radius={20} className={cn('p-4 sm:p-5', className)}>
      <p className="muted text-[0.7rem] font-bold uppercase tracking-[0.14em]">{label}</p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-tight tabular-nums sm:text-4xl">
        {value ?? '—'}
      </p>
      {hint && <p className="muted mt-1.5 text-sm">{hint}</p>}
      {(source || sample) && (
        <p className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          {sample && (
            <span className="g-chip" data-tone="warn">
              Sample data
            </span>
          )}
          {source && <span className="muted">{source}</span>}
        </p>
      )}
    </LiquidGlass>
  );
}
