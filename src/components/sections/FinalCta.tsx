import { ArrowRight } from 'lucide-react';
import { GlassButton, LiquidGlass } from '../glass';
import { Reveal } from '../Reveal';

const STRIP = ['/assets/images/codds.jpg', '/assets/images/ssaru.jpg', '/assets/images/moti.jpg', '/assets/images/maandy.jpg'];

export function FinalCta() {
  return (
    <section className="section" aria-labelledby="cta-title">
      <div className="wrap">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2.2rem]">
            <div aria-hidden="true" className="absolute inset-0 -z-10 grid grid-cols-4">
              {STRIP.map((s) => (
                <img key={s} src={s} alt="" loading="lazy" className="h-full w-full object-cover" />
              ))}
            </div>
            <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: 'var(--veil)', opacity: 0.55 }} />
            <div className="grid place-items-center px-4 py-20 sm:py-28">
              <LiquidGlass variant="floating" refract dense radius={32} className="max-w-2xl p-7 text-center sm:p-12">
                <h2 id="cta-title" className="display text-[clamp(1.8rem,5vw,3.2rem)]">
                  Ready to be heard?
                </h2>
                <p className="muted mx-auto mt-4 max-w-md text-base leading-7">
                  Send us your track. It takes a few minutes and costs nothing to be considered.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <GlassButton to="/submit" kind="primary" size="lg">
                    Submit your music <ArrowRight size={17} aria-hidden="true" />
                  </GlassButton>
                  <GlassButton to="/playlists" kind="ghost" size="lg">
                    Explore the playlists
                  </GlassButton>
                </div>
              </LiquidGlass>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
