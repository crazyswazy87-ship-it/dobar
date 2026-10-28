
"use client";

import { useEffect, useRef, useState } from "react";

const BALL_SIZE = 380;

type WRef = React.RefObject<HTMLDivElement | null>;

export default function InversionCircleScrollAnimation() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Styles />

      <div ref={wrapperRef} className="icsa-wrap">
        <HeroSection wrapperRef={wrapperRef} />
        <ContentSection wrapperRef={wrapperRef} />
      </div>
    </>
  );
}

// ─── HeroSection ──────────────────────────────────────────────────────────────

function HeroSection({ wrapperRef }: { wrapperRef: WRef }) {
  const [scrollY, setScrollY] = useState(0);
  const [viewH, setViewH] = useState(600);
  const [viewW, setViewW] = useState(800);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    let animationFrame = 0;

    const measure = () => {
      setViewH(window.innerHeight);
      setViewW(window.innerWidth);
    };

    const updateScroll = () => {
      /*
       * IMPORTANT:
       * We use the document's scroll position.
       * There is NO internal scrollbar on this component.
       */

      const rect = el.getBoundingClientRect();

      /*
       * rect.top tells us where this component currently is
       * relative to the browser viewport.
       *
       * When the component reaches the top:
       *
       * rect.top = 0
       *
       * When it is above the viewport:
       *
       * rect.top = negative
       *
       * Therefore:
       *
       * -rect.top
       *
       * gives us the amount this animation has been scrolled.
       */
      const relativeScroll = Math.max(0, -rect.top);

      setScrollY(relativeScroll);

      animationFrame = requestAnimationFrame(updateScroll);
    };

    measure();

    window.addEventListener("resize", measure);

    animationFrame = requestAnimationFrame(updateScroll);

    return () => {
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(animationFrame);
    };
  }, [wrapperRef]);

  // ─── phase progress 0 → 1 ─────────────────────────────────────────────────

  const p1 = clamp(scrollY / viewH);
  const p2 = clamp((scrollY - viewH) / viewH);

  // ─── Power4 InOut ─────────────────────────────────────────────────────────

  const p1e =
    p1 < 0.5
      ? 8 * p1 ** 4
      : 1 - (-2 * p1 + 2) ** 4 / 2;

  // ─── ease-in² ────────────────────────────────────────────────────────────

  const p2e = p2 * p2;

  // ─── geometry ────────────────────────────────────────────────────────────

  const yOff =
    (1 - p1e) *
    (viewH / 2 + BALL_SIZE / 2);

  const coverSize =
    Math.max(viewW, viewH) * 2.8;

  const ballSize =
    BALL_SIZE +
    p2e * (coverSize - BALL_SIZE);

  const clipX = viewW / 2;
  const clipY = viewH / 2 + yOff;
  const clipR = ballSize / 2;

  return (
    <div className="icsa-track">
      <section className="icsa-hero">

        {/* expanding black circle */}
        <div
          className="icsa-ball"
          style={{
            width: ballSize,
            height: ballSize,
            transform: `translate(-50%, calc(-50% + ${yOff}px))`,
          }}
        />

        {/* black text */}
        <div className="icsa-layer icsa-dark">
          <h1>BLOCK SEVEN ECOSYSTEM</h1>
          <p>Scroll to explore.</p>
        </div>

        {/* white text clipped to circle */}
        <div
          className="icsa-layer icsa-light"
          style={{
            clipPath: `circle(${clipR}px at ${clipX}px ${clipY}px)`,
          }}
        >
          <h1>Design that moves.</h1>
          <p>Scroll to reveal the future.</p>
        </div>

      </section>
    </div>
  );
}

// ─── ContentSection ───────────────────────────────────────────────────────────

function ContentSection({ wrapperRef }: { wrapperRef: WRef }) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
        }
      },
      {
        threshold: 0.35,
      }
    );

    io.observe(el);

    return () => io.disconnect();
  }, [wrapperRef]);

  return (
    <>
    <section
    ref={ref}
    className={`icsa-cs${on ? " on" : ""}`}
  >
    <div className="icsa-inner">

      <span className="icsa-label">
        Playlist Placement
      </span>

      <h2>
        Your music deserves
        <br />
        the right playlist.
      </h2>

      <p>
        Get your music in front of Kenyan listeners through playlists
        built around the sounds, artists, and moments they care about.
        Submit your track and give it a chance to be discovered.
      </p>

      <CTAButton />

    </div>
    
  </section>
        <footer
        className="border-t px-5 py-8 text-center text-xs sm:px-6 sm:text-sm"
        style={{
          borderColor: "var(--theme-border)",
          color: "var(--theme-text-muted)",
          background: "var(--theme-bg)",
        }}
      >
        © {new Date().getFullYear()} Doba. All rights reserved.
      </footer>
      </>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────
function CTAButton() {
  return (
    <button className="icsa-btn">
      Submit your music
    </button>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const clamp = (v: number) =>
  Math.min(1, Math.max(0, v));

// ─── Styles ───────────────────────────────────────────────────────────────────

function Styles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap');

      .icsa-wrap *,
      .icsa-wrap *::before,
      .icsa-wrap *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      /*
       * IMPORTANT:
       *
       * This is NOT a scroll container.
       *
       * The Home page owns the scroll.
       */
      .icsa-wrap {
        width: 100%;
        position: relative;

        overflow: visible;
        overflow-x: clip;

        font-family: Inter, sans-serif;
        background: #fff;
      }

      /*
       * This creates the scroll distance for the animation.
       */
      .icsa-track {
        height: 300vh;
        position: relative;
      }

      /*
       * The hero stays pinned while the document
       * continues scrolling through the 300vh track.
       */
      .icsa-hero {
        position: sticky;
        top: 0;

        width: 100%;
        height: 100vh;

        overflow: hidden;
      }

      /* ─────────────────────────────────────────────────────────────
         BALL
      ───────────────────────────────────────────────────────────── */

      .icsa-ball {
        position: absolute;

        top: 50%;
        left: 50%;

        border-radius: 50%;
        background: #000;

        will-change: transform, width, height;
      }

      /* ─────────────────────────────────────────────────────────────
         TEXT
      ───────────────────────────────────────────────────────────── */

      .icsa-layer {
        position: absolute;
        inset: 0;

        display: flex;
        flex-direction: column;

        align-items: center;
        justify-content: center;

        text-align: center;

        padding: 0 2rem;

        pointer-events: none;
      }

      .icsa-dark {
        color: #000;
        z-index: 2;
      }

      .icsa-light {
        color: #fff;
        z-index: 3;

        will-change: clip-path;
      }

      .icsa-layer h1 {
        font-size: clamp(2.5rem, 7vw, 6rem);

        font-weight: 900;

        letter-spacing: -0.03em;
        line-height: 1.05;
      }

      .icsa-layer p {
        font-size: clamp(1rem, 2.5vw, 1.5rem);

        font-weight: 400;

        margin-top: 1.25rem;

        opacity: 0.7;
      }

      /* ─────────────────────────────────────────────────────────────
         CONTENT
      ───────────────────────────────────────────────────────────── */

      .icsa-cs {
        min-height: 100vh;

        display: flex;
        align-items: center;
        justify-content: center;

        padding: 6rem 2rem;

        background: #000;
        color: #fff;

        transition:
          background 2.4s cubic-bezier(.25, 0, .1, 1),
          color 2.4s cubic-bezier(.25, 0, .1, 1);
      }

      .icsa-cs.on {
        background: #fff;
        color: #000;
      }

      .icsa-inner {
        max-width: 720px;

        text-align: center;

        display: flex;
        flex-direction: column;

        align-items: center;

        gap: 1.75rem;
      }

      .icsa-inner > * {
        opacity: 0;

        transform: translateY(24px);

        transition:
          opacity .7s ease,
          transform .7s ease;
      }

      .icsa-cs.on .icsa-inner > * {
        opacity: 1;
        transform: translateY(0);
      }

      .icsa-cs.on .icsa-label {
        transition-delay: .10s;
      }

      .icsa-cs.on h2 {
        transition-delay: .24s;
      }

      .icsa-cs.on p {
        transition-delay: .38s;
      }

      .icsa-cs.on .icsa-btn {
        transition-delay: .52s;
      }

      .icsa-label {
        font-size: .75rem;

        font-weight: 600;

        letter-spacing: .18em;

        text-transform: uppercase;

        opacity: .45;
      }

      .icsa-inner h2 {
        font-size: clamp(2rem, 6vw, 4rem);

        font-weight: 900;

        letter-spacing: -.03em;

        line-height: 1.08;
      }

      .icsa-inner p {
        font-size: clamp(1rem, 2vw, 1.2rem);

        line-height: 1.75;

        opacity: .6;

        max-width: 560px;
      }

      /* ─────────────────────────────────────────────────────────────
         BUTTON
      ───────────────────────────────────────────────────────────── */

      .icsa-btn {
        background: #ff3e00;
        color: #fff;

        padding: 10px 28px;

        border-radius: 8px;
        border: none;

        cursor: pointer;

        font-family: Inter, sans-serif;

        font-size: 1rem;
        font-weight: 600;

        letter-spacing: .01em;

        transition:
          opacity .2s ease,
          transform .2s ease;
      }

      .icsa-btn:hover {
        opacity: .85;
        transform: translateY(-1px);
      }

      .icsa-btn:active {
        opacity: 1;
        transform: translateY(0);
      }

      /* ─────────────────────────────────────────────────────────────
         MOBILE
      ───────────────────────────────────────────────────────────── */

      @media (max-width: 640px) {
        .icsa-hero {
          height: 100svh;
        }
      }
    `}</style>
  );
}
