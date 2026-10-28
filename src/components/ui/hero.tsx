import React from "react";
import { motion } from "motion/react";

const HEADLINE_FONT = '"Arial Black", Impact, sans-serif';

const AVATAR_A = "/assets/images/img-11.jpg";
const AVATAR_B = "/assets/images/img-14.jpg";

const ArrowGreenLeft = () => (
  <svg
    viewBox="0 0 100 100"
    className="h-full w-full overflow-visible text-black dark:text-[#1ed760]"
    fill="none"
    stroke="currentColor"
    strokeWidth="6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10,90 C 10,40 40,20 60,50 C 70,65 80,75 95,70" />
    <path d="M80,55 L95,70 L85,85" />
  </svg>
);

const ArrowGreenRight = () => (
  <svg
    viewBox="0 0 100 100"
    className="h-full w-full overflow-visible text-black dark:text-[#1ed760]"
    fill="none"
    stroke="currentColor"
    strokeWidth="6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M90,10 C 80,60 60,80 40,60 C 20,40 40,20 60,30 C 80,40 70,70 50,80" />
    <path d="M65,75 L50,80 L55,65" />
  </svg>
);

const CircularBadge = () => (
  <div
    className="relative flex h-24 w-24 rotate-12 items-center justify-center rounded-full border-[3px] border-black/10 shadow-xl transition-transform hover:scale-105 sm:h-28 sm:w-28 md:h-36 md:w-36"
    style={{
      background: "var(--doba-green)",
    }}
  >
    <div className="absolute inset-1 animate-[spin_10s_linear_infinite]">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <path
          id="circlePath"
          d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
          fill="none"
        />

        <text
          className="text-[11px] font-black uppercase tracking-[0.18em]"
          fill="black"
        >
          <textPath
            href="#circlePath"
            startOffset="0%"
          >
            GET HEARD • GET DISCOVERED •
          </textPath>
        </text>
      </svg>
    </div>

    <div className="absolute inset-0 flex items-center justify-center">
      <svg
        viewBox="0 0 100 100"
        className="h-9 w-9 text-black"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20,80 Q 40,50 30,30 T 80,20" />
        <path d="M60,10 L80,20 L70,40" />
      </svg>
    </div>
  </div>
);

const headline = (): React.CSSProperties => ({
  fontFamily: HEADLINE_FONT,
});

export const Component = () => {
  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-hidden font-sans"
      style={{
        background: "var(--theme-bg)",
        color: "var(--theme-text)",
      }}
    >
      {/* Background Grid */}

      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--theme-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--theme-grid) 1px, transparent 1px)",
          backgroundSize: "4rem 4rem",
        }}
      />

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="relative z-20 mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-6 sm:px-6 md:px-10 md:py-8">
        <div className="flex items-center gap-1">
          <div
            className="relative rounded-2xl rounded-bl-sm px-3 py-1.5 text-xs font-black tracking-tight"
            style={{
              background: "var(--theme-text)",
              color: "var(--theme-bg)",
            }}
          >
            DOBA
          </div>

          <div
            className="rounded-full px-3 py-1.5 text-xs font-black"
            style={{
              background: "var(--doba-green)",
              color: "#000",
              border: "1.5px solid var(--theme-text)",
            }}
          >
            MUSIC
          </div>
        </div>

        <div className="hidden items-center space-x-2 md:flex">
          {[
            "Artists",
            "Playlists",
            "How It Works",
            "Earn",
          ].map((item) => (
            <a
              key={item}
              href="#"
              className="rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors hover:opacity-70"
              style={{
                borderColor: "var(--theme-border)",
                color: "var(--theme-text)",
              }}
            >
              {item}
            </a>
          ))}
        </div>

        
      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}

      <main className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center justify-center px-4 pb-28 pt-8 sm:px-6 md:pb-48 md:pt-12">
        <div className="relative mb-16 mt-4 flex w-full max-w-5xl flex-col items-center justify-center text-center">
          <div className="relative z-10 flex w-full flex-col items-center space-y-1 sm:space-y-2 md:space-y-4">
            
            <div className="relative z-30 flex w-full justify-start pl-[4%] sm:pl-[10%] md:pl-[25%]">
              <h1
                className="m-0 p-0 text-[clamp(3.5rem,12vw,160px)] font-black uppercase leading-[0.85] tracking-tighter"
                style={{
                  ...headline(),
                  color: "var(--theme-text)",
                }}
              >
                DISCOVER TOP
              </h1>
            </div>

            <div className="relative z-20 flex w-full justify-center">
              <h1
                className="m-0 p-0 text-[clamp(4rem,15vw,220px)] font-black uppercase leading-[0.85] tracking-tighter"
                style={{
                  ...headline(),
                  color: "var( --doba-green)",
                }}
              >
                KENYAN
              </h1>
            </div>

            <div className="relative z-10 flex w-full justify-start pl-[8%] sm:pl-[15%] md:pl-[30%]">
              <h1
                className="m-0 p-0 text-[clamp(3.5rem,12vw,160px)] font-black uppercase leading-[0.85] tracking-tighter"
                style={{
                  ...headline(),
                  color: "var(--theme-text)",
                }}
              >
                PLAYLISTS
              </h1>
            </div>
          </div>

          {/* =================================================
              FLOATING CARDS
          ================================================= */}

          <div className="pointer-events-none absolute inset-0 h-full w-full">
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="pointer-events-auto absolute bottom-[-50%] left-0 z-30 sm:left-[5%] md:left-[20%]"
            >
              <div
                className="w-32 rounded-[1.5rem] border p-3 shadow-2xl backdrop-blur-md sm:w-40 sm:p-4 md:w-52 md:rounded-[2rem] md:p-5"
                style={{
                  background:
                    "color-mix(in srgb, var(--theme-card) 1%, transparent)",
                  borderColor: "var(--theme-border)",
                }}
              >
                <div className="mx-auto mb-3 h-14 w-14 overflow-hidden rounded-full sm:h-16 sm:w-16 md:h-24 md:w-24">
                  <img
                    src={AVATAR_A}
                    alt="Artist"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="text-center">
                  <p
                    className="text-xs font-bold sm:text-sm md:text-lg"
                    style={{
                      color: "var(--theme-text)",
                    }}
                  >
                    New Playlist
                  </p>

                  <p
                    className="mt-1 text-[9px] sm:text-[10px] md:text-xs"
                    style={{
                      color: "var(--theme-text)",
                    }}
                  >
                    84K new listeners
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="pointer-events-auto absolute right-0 top-[-20%] z-30 sm:right-[5%] md:right-[22%]"
            >
              <div
                className="w-32 rounded-[1.5rem] border p-3 shadow-2xl backdrop-blur-md sm:w-40 sm:p-4 md:w-52 md:rounded-[2rem] md:p-5"
                style={{
                  background:
                    "color-mix(in srgb, var(--theme-card) 1%, transparent)",
                  borderColor: "var(--theme-border)",
                }}
              >
                <div className="mx-auto mb-3 h-14 w-14 overflow-hidden rounded-full sm:h-16 sm:w-16 md:h-24 md:w-24">
                  <img
                    src={AVATAR_B}
                    alt="Playlist curator"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="text-center">
                  <p
                    className="text-xs font-bold sm:text-sm md:text-lg"
                    style={{
                      color: "var(--theme-text)",
                    }}
                  >
                    Playlist Curator
                  </p>

                  <p
                    className="mt-1 text-[9px] sm:text-[10px] md:text-xs"
                    style={{
                      color: "var(--theme-text-muted)",
                    }}
                  >
                    Building an audience
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="absolute bottom-0 left-0 z-20 h-16 w-16 sm:h-24 sm:w-24 md:left-[10%] md:h-32 md:w-32">
              <ArrowGreenLeft />
            </div>

            <div className="absolute right-0 top-[5%] z-20 h-16 w-16 sm:h-24 sm:w-24 md:right-[10%] md:h-32 md:w-32">
              <ArrowGreenRight />
            </div>

            <div className="absolute bottom-[-5%] right-0 z-40 pointer-events-auto md:right-[15%]">
              <CircularBadge />
            </div>
          </div>
        </div>
      </main>

      {/* =====================================================
          BOTTOM FEATURES
      ===================================================== */}

      <section
        className="relative z-20 mt-auto w-full rounded-t-[2rem] px-5 py-10 shadow-[0_-20px_50px_rgba(0,0,0,0.12)] sm:px-6 sm:py-12 md:rounded-t-[3.5rem] md:px-10 md:py-16"
        style={{
          background: "var(--theme-surface)",
          color: "var(--theme-text)",
        }}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-3 md:gap-8">

          <div
            className="relative flex min-h-[240px] flex-col items-center rounded-[1.5rem] border p-6 text-center sm:p-8 md:h-64"
            style={{
              background: "var(--theme-card)",
              borderColor: "var(--theme-border)",
            }}
          >
            <h3
              className="text-xl font-black uppercase leading-tight md:text-2xl"
              style={{
                color: "var(--theme-text)",
              }}
            >
              GET YOUR SONG
              <br />
              HEARD
            </h3>

            <p
              className="mb-auto mt-2 text-[10px] font-bold sm:text-xs"
              style={{
                color: "var(--theme-text-muted)",
              }}
            >
              Reach listeners who are already looking for new music.
            </p>

            <div
              className="mt-6 flex items-center rounded-2xl p-2 pr-8 shadow-lg"
              style={{
                background: "var(--theme-text)",
                color: "var(--theme-bg)",
              }}
            >
              <div className="mr-3 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
                <img
                  src={AVATAR_A}
                  alt="Artist"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="text-left">
                <p className="text-[10px] font-bold">
                  Your next listener
                </p>

                <p
                  className="mt-1 text-[8px]"
                  style={{
                    color: "var(--theme-text-muted)",
                  }}
                >
                  discovered through Doba
                </p>
              </div>
            </div>
          </div>

          <div
            className="relative flex min-h-[240px] flex-col items-center rounded-[1.5rem] border p-6 text-center sm:p-8 md:h-64"
            style={{
              background: "var(--theme-card)",
              borderColor: "var(--theme-border)",
            }}
          >
            <h3 className="text-xl font-black uppercase leading-tight md:text-2xl"
             style={{
                color: "var(--theme-text)",
              }}>
              JOIN THE
              <br />
              RIGHT PLAYLIST
            </h3>

            <p
              className="mb-auto mt-2 text-[10px] font-bold sm:text-xs"
              style={{
                color: "var(--theme-text-muted)",
              }}
            >
              Put your music where your audience already listens.
            </p>

            <div
              className="mt-6 rounded-full px-5 py-3 text-sm font-black shadow-lg"
              style={{
                background: "var(--doba-green)",
                color: "#000",
              }}
            >
              NEW AUDIENCE
            </div>
          </div>

          <div
            className="relative flex min-h-[240px] flex-col items-center rounded-[1.5rem] border p-6 text-center sm:p-8 md:h-64"
            style={{
              background: "var(--theme-card)",
              borderColor: "var(--theme-border)",
            }}
          >
            <h3 className="text-xl font-blackplay uppercase leading-tight md:text-2xl"
             style={{
                color: "var(--theme-text)",
              }}>
              OWN A
              <br />
              PLAYLIST?
            </h3>

            <p
              className="mb-auto mt-2 text-[10px] font-bold sm:text-xs"
              style={{
                color: "var(--theme-text-muted)",
              }}
            >
              Collaborate with Doba and earn from the audience you build.
            </p>

            <div
              className="relative mt-6 w-full max-w-[200px] rounded-[1.5rem] px-6 py-4 shadow-lg"
              style={{
                background: "var(--doba-green)",
                color: "#000",
              }}
            >
              <p className="mb-1 text-[9px] font-bold uppercase tracking-wider">
                PLAYLIST PARTNER
              </p>

              <p className="text-lg font-black">
                EARN WITH DOBA
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Component;