import {
  useCallback,
  useRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type Ref,
} from 'react';
import { cn } from '../../lib/utils';
import { useSpecular } from '../../hooks/useSpecular';

export type GlassVariant = 'subtle' | 'standard' | 'strong' | 'floating' | 'interactive';
export type GlassTag = 'div' | 'section' | 'nav' | 'header' | 'aside' | 'article' | 'form' | 'ul' | 'li' | 'figure' | 'footer' | 'span';

export interface LiquidGlassProps extends HTMLAttributes<HTMLElement> {
  as?: GlassTag;
  variant?: GlassVariant;
  /** Corner radius in px (or any CSS length). Default 24. */
  radius?: number | string;
  /** Lifts on hover and tracks the pointer (desktop only). */
  interactive?: boolean;
  /** Adds the pointer highlight without lifting. */
  specular?: boolean;
  /** Opt into SVG water refraction (Chromium desktop only; use sparingly). */
  refract?: boolean;
  /** Higher-opacity fill, for chrome that sits over photography. */
  dense?: boolean;
  ref?: Ref<HTMLElement>;
}

/**
 * The one glass material. Every other glass component is built on this.
 * Colours come entirely from CSS variables, so light/dark switches automatically.
 */
export function LiquidGlass({
  as = 'div',
  variant = 'standard',
  radius,
  interactive = false,
  specular = false,
  refract = false,
  dense = false,
  className,
  style,
  ref,
  children,
  ...rest
}: LiquidGlassProps) {
  const local = useRef<HTMLElement | null>(null);
  const setRef = useCallback(
    (node: HTMLElement | null) => {
      local.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as { current: HTMLElement | null }).current = node;
    },
    [ref]
  );

  const tracks = interactive || specular || variant === 'interactive';
  useSpecular(local, tracks);

  const css: CSSProperties & Record<string, string | number> = { ...style };
  if (radius !== undefined) css['--glass-radius'] = typeof radius === 'number' ? `${radius}px` : radius;

  const Tag = as as ElementType;
  return (
    <Tag
      {...rest}
      ref={setRef}
      className={cn('glass', className)}
      style={css}
      data-variant={variant}
      data-interactive={interactive ? '' : undefined}
      data-specular={specular ? '' : undefined}
      data-refract={refract ? '' : undefined}
      data-dense={dense ? '' : undefined}
    >
      {children}
    </Tag>
  );
}
