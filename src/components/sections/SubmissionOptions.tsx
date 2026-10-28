import { Check } from 'lucide-react';
import { TIERS, formatPrice } from '../../config/site';
import { GlassButton, LiquidGlass } from '../glass';
import { Reveal } from '../Reveal';
import { SectionHeading } from './SectionHeading';

export function SubmissionOptions() {
  const tiers = Object.values(TIERS).filter((t) => t.enabled);
  return (
    <section className="section" aria-labelledby="options-title">
      <div className="wrap">
        <Reveal>
          <SectionHeading eyebrow="Submission options" title=" in." id="options-title">
            Both get your song heard.
          </SectionHeading>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {tiers.map((t, n) => (
            <Reveal key={t.id} delay={n * 0.08} className="h-full">
              <LiquidGlass
                as="article"
                variant={t.id === 'priority' ? 'strong' : 'standard'}
                radius={30}
                className="flex h-full flex-col p-6 sm:p-8"
              >
                <p className="eyebrow">{t.id === 'priority' ? 'Priority' : 'Standard'}</p>
                <h3 className="display mt-2 text-2xl sm:text-3xl">{t.name}</h3>
                <p className="mt-3 text-xl font-bold">{formatPrice(t)}</p>
                <p className="muted mt-2 text-sm leading-6">{t.summary}</p>
                <ul className="mt-5 grid gap-2.5 text-sm">
                  {t.includes.map((x) => (
                    <li key={x} className="flex gap-2.5">
                      <Check size={17} aria-hidden="true" className="mt-0.5 shrink-0" style={{ color: 'var(--accent-text)' }} />
                      {x}
                    </li>
                  ))}
                </ul>
                <ul className="muted mt-5 grid gap-1.5 text-xs leading-5">
                  {t.disclaimers.map((x) => (
                    <li key={x}>• {x}</li>
                  ))}
                </ul>
                <div className="mt-auto pt-7">
                  <GlassButton to={`/submit?tier=${t.id}`} kind={t.id === 'priority' ? 'primary' : 'glass'} size="lg" className="w-full sm:w-auto">
                    {t.id === 'priority' ? 'Choose priority review' : 'Submit for free'}
                  </GlassButton>
                </div>
              </LiquidGlass>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
