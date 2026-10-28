import type { ReactNode } from 'react';

export function SectionHeading({
  eyebrow,
  title,
  children,
  align = 'left',
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  align?: 'left' | 'center';
  id?: string;
}) {
  return (
    <header className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="display mt-3 text-[clamp(1.9rem,5vw,3.4rem)]">
        {title}
      </h2>
      {children && <p className="muted mt-4 text-base leading-7 sm:text-lg">{children}</p>}
    </header>
  );
}
