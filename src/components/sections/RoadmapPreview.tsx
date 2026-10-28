import { useId, useState, type KeyboardEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GlassPanel } from '../glass';
import { Reveal } from '../Reveal';
import { SectionHeading } from './SectionHeading';

const STEPS = [
  {
    key: 'submit',
    title: 'Submit',
    body: 'Paste your Spotify track link and tell us about the song. Free to submit.',
    detail: 'A short form: artist name, email, track link, genre and release status.',
    cta: { to: '/submit', label: 'Open the form' },
  },
  {
    key: 'review',
    title: 'Review',
    body: 'We listen and look at how your song fits the playlists we curate.',
    detail: 'The paid priority option moves your song ahead of the standard queue. It does not change the outcome.',
    cta: { to: '/how-it-works', label: 'Free vs priority' },
  },
  {
    key: 'consider',
    title: 'Consideration',
    body: 'Songs that fit are considered for a playlist.',
    detail: 'We would rather be honest about odds than promise streams or reach.',
  },
  {
    key: 'evidence',
    title: 'Evidence',
    body: 'Placements are recorded with their date, and playlist follower history is shown where we have it.',
    detail: 'The Audience page labels every number with its source and last update.',
    cta: { to: '/audience', label: 'View audience data' },
  },
] as const;

/** Interactive journey: tabs with arrow-key support and an animated progress rail. */
export function RoadmapPreview() {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const id = useId();
  const step = STEPS[i];

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') setI((n) => (n + 1) % STEPS.length);
    else if (e.key === 'ArrowLeft') setI((n) => (n - 1 + STEPS.length) % STEPS.length);
    else return;
    e.preventDefault();
    requestAnimationFrame(() => document.getElementById(`${id}-tab-${(i + (e.key === 'ArrowRight' ? 1 : STEPS.length - 1)) % STEPS.length}`)?.focus());
  };

  return (
    <section className="section" aria-labelledby="roadmap-title">
      <div className="wrap">
        <Reveal>
          <SectionHeading eyebrow="The listener roadmap" title="From your link to the listener." id="roadmap-title">
            Follow the path a song takes through Doba.
          </SectionHeading>
        </Reveal>

        <Reveal delay={0.08} className="mt-10">
          <div className="relative" role="tablist" aria-label="Roadmap steps" onKeyDown={onKey}>
            <div className="absolute left-0 right-0 top-[1.55rem] h-[3px] rounded-full" style={{ background: 'var(--glass-border)' }} aria-hidden="true">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'var(--accent)', transformOrigin: 'left' }}
                animate={{ width: `${(i / (STEPS.length - 1)) * 100}%` }}
                transition={reduce ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="relative grid grid-cols-4">
              {STEPS.map((s, n) => (
                <button
                  key={s.key}
                  id={`${id}-tab-${n}`}
                  role="tab"
                  type="button"
                  aria-selected={n === i}
                  aria-controls={`${id}-panel`}
                  tabIndex={n === i ? 0 : -1}
                  onClick={() => setI(n)}
                  className="group flex min-h-[4.5rem] flex-col items-center gap-2 px-1"
                >
                  <span
                    className="grid h-[3.1rem] w-[3.1rem] place-items-center rounded-full text-sm font-black transition-all duration-500"
                    style={
                      n <= i
                        ? {
                            color: 'var(--accent-ink)',
                            background: 'linear-gradient(180deg, rgba(255,255,255,.4), transparent 55%), var(--accent)',
                            boxShadow: '0 8px 22px -8px color-mix(in srgb, var(--accent) 70%, transparent)',
                          }
                        : {
                            background: 'var(--glass-surface-strong)',
                            boxShadow: 'inset 0 0 0 1px var(--glass-border)',
                          }
                    }
                  >
                    {n + 1}
                  </span>
                  <span className={`text-[0.7rem] font-bold uppercase tracking-[0.1em] sm:text-xs ${n === i ? '' : 'muted'}`}>{s.title}</span>
                </button>
              ))}
            </div>
          </div>

          <GlassPanel
            as="div"
            variant="strong"
            id={`${id}-panel`}
            aria-labelledby={`${id}-tab-${i}`}
            className="mt-6"
          >
            <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${i}`}>
              <h3 className="display text-2xl sm:text-3xl">{step.title}</h3>
              <p className="mt-3 max-w-2xl text-base leading-7 sm:text-lg">{step.body}</p>
              <p className="muted mt-2 max-w-2xl text-sm leading-6">{step.detail}</p>
              {'cta' in step && (
                <Link to={step.cta.to} className="mt-5 inline-flex min-h-11 items-center text-sm font-bold" style={{ color: 'var(--accent-text)' }}>
                  {step.cta.label} →
                </Link>
              )}
            </div>
          </GlassPanel>
        </Reveal>
      </div>
    </section>
  );
}
