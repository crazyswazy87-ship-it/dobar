
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ } from '../../data/faq';
import { LiquidGlass } from '../glass';
import { Reveal } from '../Reveal';
import { SectionHeading } from './SectionHeading';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section" aria-labelledby="faq-title">
      <div className="wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <SectionHeading
            eyebrow="GOT QUESTIONS?"
            title="Everything you need to know."
            id="faq-title"
          />

          <p className="muted mt-4 max-w-md text-sm leading-7">
            New music deserves a chance. Here is how Doba works,
            what our placement package includes, and what you can
            expect when you submit your song.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="grid content-start gap-3">
          {FAQ.map((f, index) => {
            const isOpen = openIndex === index;
            const answerId = `faq-answer-${index}`;
            const questionId = `faq-question-${index}`;

            return (
              <LiquidGlass
                key={f.q}
                as="div"
                variant="subtle"
                radius={22}
              >
                <div className="overflow-hidden">
                  <button
                    id={questionId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() =>
                      setOpenIndex(isOpen ? null : index)
                    }
                    className="flex min-h-14 w-full cursor-pointer
                      items-center justify-between gap-4 px-5 py-4
                      text-left text-[0.95rem] font-bold
                      transition-colors hover:text-white/75
                      focus-visible:outline-none
                      focus-visible:ring-2 focus-visible:ring-white/50"
                  >
                    <span>{f.q}</span>

                    <ChevronDown
                      size={18}
                      aria-hidden="true"
                      className={`shrink-0 transition-transform
                        duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                    />
                  </button>

                  <div
                    id={answerId}
                    role="region"
                    aria-labelledby={questionId}
                    hidden={!isOpen}
                  >
                    <p className="muted px-5 pb-5 text-sm leading-7">
                      {f.a}
                    </p>
                  </div>
                </div>
              </LiquidGlass>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
