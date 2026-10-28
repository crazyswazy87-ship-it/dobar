import { useId, useState, type ReactNode } from 'react';
import { LiquidGlass } from './LiquidGlass';

interface GlassTooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: 'top' | 'bottom';
}

/** Hover / focus tooltip. Escape dismisses it. Works with keyboard and touch (via focus). */
export function GlassTooltip({ content, children, side = 'top' }: GlassTooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <span
      className="relative inline-flex"
      aria-describedby={open ? id : undefined}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={() => setOpen(false)}
      onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
    >
      {children}
      {open && (
        <LiquidGlass
          id={id}
          role="tooltip"
          variant="strong"
          radius={14}
          className={`pointer-events-none absolute left-1/2 z-50 w-max max-w-[16rem] -translate-x-1/2 px-3 py-2 text-xs leading-snug ${
            side === 'top' ? 'bottom-[calc(100%+10px)]' : 'top-[calc(100%+10px)]'
          }`}
        >
          {content}
        </LiquidGlass>
      )}
    </span>
  );
}
