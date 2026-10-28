import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface Common {
  kind?: 'primary' | 'glass' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: ReactNode;
}

type AsButton = Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Common> & { to?: undefined; href?: undefined };
type AsRoute = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Common | 'href'> & { to: string; href?: undefined };
type AsAnchor = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Common> & { href: string; to?: undefined };

export type GlassButtonProps = AsButton | AsRoute | AsAnchor;

/** Pill button. Renders a <button>, a router <Link> (`to`) or an <a> (`href`). */
export function GlassButton(props: GlassButtonProps) {
  const { kind = 'glass', size = 'md', className, children, ...rest } = props;
  const cls = cn('gbtn', className);

  if (props.to !== undefined) {
    const { to, ...anchor } = rest as Omit<AsRoute, keyof Common>;
    return (
      <Link {...anchor} to={to} className={cls} data-kind={kind} data-size={size}>
        {children}
      </Link>
    );
  }
  if (props.href !== undefined) {
    const { href, ...anchor } = rest as Omit<AsAnchor, keyof Common>;
    const external = /^https?:/.test(href);
    return (
      <a
        {...anchor}
        href={href}
        className={cls}
        data-kind={kind}
        data-size={size}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }
  const { type = 'button', ...button } = rest as Omit<AsButton, keyof Common>;
  return (
    <button {...button} type={type} className={cls} data-kind={kind} data-size={size}>
      {children}
    </button>
  );
}
