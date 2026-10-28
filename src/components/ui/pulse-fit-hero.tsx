import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface NavigationItem {
  label: string;
  hasDropdown?: boolean;
  onClick?: () => void;
}

interface ProgramCard {
  image: string;
  category: string;
  title: string;
  onClick?: () => void;
}

interface PulseFitHeroProps {
  logo?: string;
  navigation?: NavigationItem[];

  ctaButton?: {
    label: string;
    onClick: () => void;
  };

  title?: string;
  subtitle?: string;

  primaryAction?: {
    label: string;
    onClick: () => void;
  };

  secondaryAction?: {
    label: string;
    onClick: () => void;
  };

  disclaimer?: string;

  socialProof?: {
    avatars: string[];
    text: string;
  };

  programs?: ProgramCard[];
  className?: string;
  children?: React.ReactNode;
}

export function PulseFitHero({
  

  ctaButton,

  title = "Get heard by a new audience.",

  subtitle = `Discover fresh Kenyan music, place your songs on the right playlists, and build connections between artists, curators, and listeners. Own a playlist? Collaborate with us and earn from the audience you build.`,

  primaryAction,
  secondaryAction,
  disclaimer,
  socialProof,
  programs = [],
  className,
  children,
}: PulseFitHeroProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-screen w-full flex-col overflow-hidden",
        className
      )}
      style={{
        background: "var(--theme-bg)",
        color: "var(--theme-text)",
      }}
      role="banner"
      aria-label="Doba playlist music placement"
    >
      {/* ================= HEADER ================= */}

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 flex flex-row items-center justify-between px-4 py-5 sm:px-6 sm:py-7 lg:px-16 lg:py-8"
      >
        
        {/* CTA */}

        {ctaButton && (
          <button
            onClick={ctaButton.onClick}
            className="rounded-full px-4 py-2.5 text-xs font-semibold transition-all hover:scale-105 sm:px-6 sm:py-3 sm:text-sm"
            style={{
              background: "var(--doba-green)",
              color: "#000",
              border: "1px solid var(--doba-green)",
            }}
          >
            {ctaButton.label}
          </button>
        )}
      </motion.header>

      {/* ================= MAIN CONTENT ================= */}

      {children ? (
        <div className="relative z-10 flex w-full flex-1 items-center justify-center">
          {children}
        </div>
      ) : (
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 py-12 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex max-w-4xl flex-col items-center text-center"
            style={{
              gap: "clamp(20px, 3vw, 28px)",
            }}
          >
            {/* Eyebrow */}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[10px] font-semibold uppercase tracking-[0.14em] sm:text-xs"
              style={{
                color: "var(--doba-green)",
              }}
            >
              Music Discovery & Playlist Placement
            </motion.div>

            {/* Title */}

            <h1
              className="text-[clamp(42px,8vw,84px)] font-extrabold leading-[1.02] tracking-[-0.045em]"
              style={{
                color: "var(--theme-text)",
                maxWidth: "900px",
              }}
            >
              {title}
            </h1>

            {/* Subtitle */}

            <p
              className="max-w-2xl text-sm leading-7 sm:text-base md:text-lg"
              style={{
                color: "var(--theme-text-muted)",
              }}
            >
              {subtitle}
            </p>

            {/* Actions */}

            {(primaryAction || secondaryAction) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.4,
                }}
                className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4"
              >
                {/* Primary */}

                {primaryAction && (
                  <button
                    onClick={primaryAction.onClick}
                    className="flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all hover:scale-105 sm:w-auto sm:px-8 sm:py-4 sm:text-base"
                    style={{
                      background: "var(--doba-green)",
                      color: "#000",
                      boxShadow:
                        "0 10px 30px rgba(30, 215, 96, 0.18)",
                    }}
                  >
                    {primaryAction.label}

                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M7 10H13M13 10L10 7M13 10L10 13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}

                {/* Secondary */}

                {secondaryAction && (
                  <button
                    onClick={secondaryAction.onClick}
                    className="w-full rounded-full px-6 py-3.5 text-sm font-medium transition-all hover:scale-105 sm:w-auto sm:px-8 sm:py-4 sm:text-base"
                    style={{
                      background: "transparent",
                      border: "1px solid var(--theme-border)",
                      color: "var(--theme-text)",
                    }}
                  >
                    {secondaryAction.label}
                  </button>
                )}
              </motion.div>
            )}

            {/* Disclaimer */}

            {disclaimer && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.6,
                }}
                className="text-xs"
                style={{
                  color: "var(--theme-text-muted)",
                }}
              >
                {disclaimer}
              </motion.p>
            )}

            {/* Social Proof */}

            {socialProof && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.7,
                }}
                className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3"
              >
                <div className="flex -space-x-2">
                  {socialProof.avatars.map((avatar, index) => (
                    <img
                      key={index}
                      src={avatar}
                      alt={`Doba artist ${index + 1}`}
                      className="h-9 w-9 rounded-full object-cover sm:h-10 sm:w-10"
                      style={{
                        border:
                          "2px solid var(--theme-bg)",
                      }}
                    />
                  ))}
                </div>

                <span
                  className="text-xs font-medium sm:text-sm"
                  style={{
                    color: "var(--theme-text-muted)",
                  }}
                >
                  {socialProof.text}
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}

      {/* ================= PLAYLIST CAROUSEL ================= */}

      {programs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            delay: 0.8,
          }}
          className="relative z-10 w-full overflow-hidden py-10 sm:py-14"
        >
          {/* Left Gradient */}

          <div
            className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-16 sm:w-28 md:w-40"
            style={{
              background:
                "linear-gradient(90deg, var(--theme-bg), transparent)",
            }}
          />

          {/* Right Gradient */}

          <div
            className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-16 sm:w-28 md:w-40"
            style={{
              background:
                "linear-gradient(270deg, var(--theme-bg), transparent)",
            }}
          />

          {/* Scrolling Playlists */}

          <motion.div
            className="flex items-center"
            animate={{
              x: [0, -((programs.length * 380) / 2)],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: programs.length * 3,
                ease: "linear",
              },
            }}
            style={{
              gap: "16px",
              paddingLeft: "16px",
            }}
          >
            {[...programs, ...programs].map(
              (program, index) => (
                <motion.div
                  key={index}
                  whileHover={{
                    scale: 1.03,
                    y: -8,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  onClick={program.onClick}
                  className="relative flex-shrink-0 cursor-pointer overflow-hidden rounded-[20px] sm:rounded-[24px]"
                  style={{
                    width:
                      "clamp(250px, 76vw, 356px)",
                    height:
                      "clamp(350px, 105vw, 480px)",
                    boxShadow:
                      "0 8px 32px rgba(0, 0, 0, 0.16)",
                  }}
                >
                  <img
                    src={program.image}
                    alt={program.title}
                    className="h-full w-full object-cover"
                  />

                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)",
                    }}
                  />

                  <div className="codss absolute bottom-0 left-0 right-0 flex flex-col gap-2 p-5 sm:p-6">
                    <span className="yoyo text-[10px] font-semibold uppercase tracking-[0.1em] text-white/80 sm:text-xs">
                      {program.category}
                    </span>

                    <h3 className="yoyo text-xl font-semibold leading-tight text-red-400 sm:text-2xl">
                      {program.title}
                    </h3>
                  </div>
                </motion.div>
              )
            )}
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}