import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { LiquidGlass } from './LiquidGlass';
import { cn } from '../../lib/utils';

interface GlassModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

/**
 * Built on the native <dialog>, so focus trapping, Escape, and the inert
 * background come from the browser — not hand-rolled.
 */
export function GlassModal({ open, onClose, title, children, className }: GlassModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="gdialog"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <LiquidGlass variant="strong" radius={28} className={cn('relative w-full max-w-lg p-6 sm:p-8', className)}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full hover:bg-[var(--glass-surface)]"
        >
          <X size={20} aria-hidden="true" />
        </button>
        <h2 id={titleId} className="pr-10 text-xl font-bold tracking-tight sm:text-2xl">
          {title}
        </h2>
        <div className="mt-4">{children}</div>
      </LiquidGlass>
    </dialog>
  );
}
