import { useState } from 'react';
import { cn } from '../../lib/utils';

interface Props {
  src?: string | null;
  alt: string;
  label: string;
  className?: string;
  round?: boolean;
  position?: string;
  /** Load immediately (use for above-the-fold images). */
  eager?: boolean;
}

/** Image with a letter fallback when the file is missing or fails to load. */
export function Artwork({ src, alt, label, className, round, position = 'center top', eager }: Props) {
  const [failed, setFailed] = useState(false);
  const shape = round ? 'rounded-full' : 'rounded-lg';
  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn('grid place-items-center font-bold', shape, className)}
        style={{ background: 'var(--glass-surface-strong)', color: 'var(--ink-muted)' }}
      >
        {label.trim().charAt(0).toUpperCase() || '♪'}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={cn('object-cover', shape, className)}
      style={{ objectPosition: position }}
    />
  );
}
