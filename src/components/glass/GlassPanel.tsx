import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { LiquidGlass, type GlassTag, type GlassVariant } from './LiquidGlass';

interface GlassPanelProps {
  as?: GlassTag;
  variant?: GlassVariant;
  title?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  padded?: boolean;
  radius?: number;
  className?: string;
  children?: ReactNode;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

/** A glass container with an optional header row. */
export function GlassPanel({
  title,
  eyebrow,
  actions,
  padded = true,
  className,
  children,
  ...glass
}: GlassPanelProps) {
  return (
    <LiquidGlass {...glass} className={cn(padded && 'p-5 sm:p-7', className)}>
      {(title || eyebrow || actions) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
            {title && <h3 className="text-lg font-bold tracking-tight sm:text-xl">{title}</h3>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </LiquidGlass>
  );
}
