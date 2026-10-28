
import { Headphones, Link2, ListMusic, Send } from 'lucide-react';
import { LiquidGlass } from '../glass';
import { Reveal } from '../Reveal';
import { SectionHeading } from './SectionHeading';
import ScrollStack, { ScrollStackItem } from '../layout/ScrollStack';
import "../../styles/howitsworks.css"

const STEPS = [
  {
    icon: ListMusic,
    title: 'Explore',
    body: 'Browse the playlists we curate and find the ones that fit your sound.',
  },
  {
    icon: Link2,
    title: 'Check the evidence',
    body: 'Review playlist audience data, with the source and date of every number.',
  },
  {
    icon: Send,
    title: 'Submit your track',
    body: 'Send your Spotify track link. Submit for free or pay for priority review.',
  },
  {
    icon: Headphones,
    title: 'We listen',
    body: 'Your song is reviewed against our playlist criteria. Placement follows the selected submission plan and its terms.',
  },
] as const;

export function HowItWorks({
  standalone = false,
}: {
  standalone?: boolean;
}) {
  return (
    <section
      className={standalone ? 'section pt-36' : 'section'}
      aria-labelledby="how-title"
    >
      <div className="wrap">
        <Reveal>
          <SectionHeading
            eyebrow="How Doba works"
            title="Simple, honest, artist-first."
            id="how-title"
          >
            No hype, no fake numbers. Here is exactly what happens to your song.
          </SectionHeading>
        </Reveal>

        <div className="mt-12">
          <ScrollStack
            className="doba-how-stack"
            useWindowScroll
            itemDistance={110}
            itemStackDistance={28}
            stackPosition="12%"
            itemScale={0.035}
            baseScale={0.92}
            dimAmount={0.14}
            blurAmount={0}
            tiltAmount={0}
            rotationAmount={0}
            holdDistance={260}
            smoothScroll
            snap={false}
          >
            {STEPS.map(({ icon: Icon, title, body }, index) => (
              <ScrollStackItem
                key={title}
                itemClassName="doba-how-stack-item"
                style={{
                  height: 'clamp(250px, 34vh, 310px)',
                  padding: 0,
                  background: 'transparent',
                  color: 'inherit',
                  boxShadow: 'none',
                }}
              >
                <LiquidGlass
                  as="div"
                  variant="standard"
                  radius={26}
                  className="doba-how-glass flex h-full flex-col justify-between p-6 sm:p-8 md:p-10"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="grid h-12 w-12 place-items-center rounded-2xl"
                      style={{
                        color: 'var(--accent-text)',
                        boxShadow: 'inset 0 0 0 1px var(--glass-border)',
                        background: 'var(--glass-surface-strong)',
                      }}
                    >
                      <Icon size={22} aria-hidden="true" />
                    </span>

                    <span
                      className="font-[family-name:var(--font-display)] text-5xl font-bold"
                      style={{ color: 'var(--accent-text)', opacity: 0.24 }}
                      aria-label={`Step ${index + 1}`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="max-w-2xl">
                    <p
                      className="mb-2 text-xs font-semibold uppercase tracking-[0.2em]"
                      style={{ color: 'var(--accent-text)' }}
                    >
                      Step {index + 1} of {STEPS.length}
                    </p>

                    <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                      {title}
                    </h3>

                    <p className="muted mt-3 max-w-xl text-sm leading-7 sm:text-base">
                      {body}
                    </p>
                  </div>
                </LiquidGlass>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>
      </div>
    </section>
  );
}
