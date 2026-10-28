import {

  useCallback,

  useEffect,

  useMemo,

  useRef,

  useState,

} from "react";

import type {

  CSSProperties,

  KeyboardEvent,

  PointerEvent as ReactPointerEvent,

  ReactElement,

} from "react";


import "../../styles/youtubereels.css";
import { createPortal } from "react-dom";



export interface YouTubeReel {

  id: string;

  video: string;

  caption?: string;

  label?: string;

}



export interface YouTubeReelsCarouselProps {

  reels: YouTubeReel[];

  initialIndex?: number;

  autoPlay?: boolean;

  startMuted?: boolean;

  startVolume?: number;

  onChange?: (index: number, reel: YouTubeReel) => void;

  className?: string;

  style?: CSSProperties;

}



interface Item extends YouTubeReel {

  videoId: string;

}



type LoopMode = 0 | 1 | 2;



const MIN_ITEMS = 5;

const COMPACT_BREAKPOINT = 760;

const VIDEO_ASPECT_RATIO = 9 / 16;

const YOUTUBE_ORIGIN = "https://www.youtube-nocookie.com";

const YOUTUBE_ID_REGEX = /^[\w-]{11}$/;



export function parseYouTubeId(input: string): string | null {

  const value = input.trim();



  if (YOUTUBE_ID_REGEX.test(value)) return value;



  try {

    const url = new URL(

      /^[a-z][a-z\d+.-]*:\/\//i.test(value)

        ? value

        : `https://${value}`,

    );



   const host = url.hostname.toLowerCase().replace(/^www\./, "");



    if (host === "youtu.be") {

      const id = url.pathname.split("/").filter(Boolean)[0];

      return id && YOUTUBE_ID_REGEX.test(id) ? id : null;

    }



    if (

      host === "youtube.com" ||

      host.endsWith(".youtube.com") ||

      host === "youtube-nocookie.com" ||

      host.endsWith(".youtube-nocookie.com")

    ) {

      const id = url.searchParams.get("v");



      if (id && YOUTUBE_ID_REGEX.test(id)) return id;



      const match = url.pathname.match(
        /^\/(?:embed|shorts|live|v)\/([\w-]{11})(?:\/|$)/
      );



      return match?.[1] ?? null;

    }

  } catch {

    return null;

  }



  return null;

}



function thumbnail(id: string): string {

  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

}



function embedSrc(

  id: string,

  autoPlay: boolean,

  muted = true,

): string {

  const params = new URLSearchParams({

    autoplay: autoPlay ? "1" : "0",

    mute: muted ? "1" : "0",

    controls: "1",

    playsinline: "1",

    rel: "0",

    enablejsapi: "1",

    origin:

      typeof window !== "undefined"

        ? window.location.origin

        : "",

  });



  return `${YOUTUBE_ORIGIN}/embed/${id}?${params.toString()}`;

}



function sendCommand(

  frame: HTMLIFrameElement | null,

  func: string,

  args: unknown[] = [],

): void {

  if (!frame?.contentWindow) return;



  frame.contentWindow.postMessage(

    JSON.stringify({

      event: "command",

      func,

      args,

    }),

    YOUTUBE_ORIGIN,

  );

}



function subscribeToPlayer(

  frame: HTMLIFrameElement | null,

  playerId: string,

): void {

  if (!frame?.contentWindow) return;



  frame.contentWindow.postMessage(

    JSON.stringify({

      event: "listening",

      id: playerId,

    }),

    YOUTUBE_ORIGIN,

  );



  sendCommand(frame, "addEventListener", ["onStateChange"]);

  sendCommand(frame, "addEventListener", ["onReady"]);

}



function getMetrics(width: number) {

  const compact = width < COMPACT_BREAKPOINT;

  const radius = compact ? 1 : 2;



  const centerWidth = compact

    ? Math.min(Math.max(width * 0.76, 160), 420)

    : Math.min(Math.max(width * 0.32, 200), 480);



  return {

    radius,

    centerWidth,

    step: centerWidth * (compact ? 0.9 : 1.03),

    stageHeight: Math.ceil(

      centerWidth * VIDEO_ASPECT_RATIO + 48,

    ),

  };

}



function circularOffset(

  index: number,

  active: number,

  total: number,

): number {

  let distance = (((index - active) % total) + total) % total;



  if (distance > total / 2) distance -= total;



  return distance;

}



const svgProps = {

  viewBox: "0 0 24 24",

  fill: "none",

  stroke: "currentColor",

  strokeWidth: 2,

  strokeLinecap: "round" as const,

  strokeLinejoin: "round" as const,

  "aria-hidden": true as const,

};




function ShuffleIcon(): ReactElement {
  return (
    <img
      className="yrc-custom-icon"
      src="/assets/icons/shuffle.png"
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  );
}



function RepeatIcon(): ReactElement {
  return (
    <img
      className="yrc-custom-icon"
      src="/assets/icons/repeat.png"
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  );
}



function PlayIcon(): ReactElement {
  return (
    <img
      className="yrc-custom-icon"
      src="/assets/icons/play.png"
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  );
}



function PauseIcon(): ReactElement {
  return (
    <img
      className="yrc-custom-icon"
      src="/assets/icons/pause.png"
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  );
}



function VolumeOnIcon(): ReactElement {

  return (

    <svg {...svgProps}>

      <path

        d="M11 5L6 9H2v6h4l5 4V5z"

        fill="currentColor"

      />

      <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />

    </svg>

  );

}



function VolumeOffIcon(): ReactElement {

  return (

    <svg {...svgProps}>

      <path

        d="M11 5L6 9H2v6h4l5 4V5z"

        fill="currentColor"

      />

      <path d="M22 9l-6 6M16 9l6 6" />

    </svg>

  );

}



function ExpandIcon(): ReactElement {

  return (

    <svg {...svgProps}>

      <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3M21 16v3a2 2 0 0 1-2 2h-3" />

    </svg>

  );

}



function CloseIcon(): ReactElement {

  return (

    <svg {...svgProps}>

      <path d="m18 6-12 12M6 6l12 12" />

    </svg>

  );

}

export function YouTubeReelsCarousel({

  reels,

  initialIndex = 0,

  autoPlay = true,

  startMuted = true,

  startVolume = 50,

  onChange,

  className,

  style,

}: YouTubeReelsCarouselProps): ReactElement | null {

  const items = useMemo<Item[]>(() => {

    const valid = reels.flatMap((reel) => {

      const videoId = parseYouTubeId(reel.video);

      return videoId ? [{ ...reel, videoId }] : [];

    });



    if (valid.length === 0 || valid.length >= MIN_ITEMS) {

      return valid;

    }



    const repeated: Item[] = [];



    for (let copy = 0; repeated.length < MIN_ITEMS; copy++) {

      for (const item of valid) {

        repeated.push(

          copy === 0

            ? item

            : { ...item, id: `${item.id}-copy${copy}` },

        );



        if (repeated.length >= MIN_ITEMS) break;

      }

    }



    return repeated;

  }, [reels]);



  const total = items.length;



  const [active, setActive] = useState(() =>

    total

      ? ((initialIndex % total) + total) % total

      : 0,

  );



  const [playing, setPlaying] = useState(autoPlay);

  const [shuffle, setShuffle] = useState(false);

  const [loopMode, setLoopMode] = useState<LoopMode>(0);



  const [muted, setMuted] = useState(startMuted);

  const [volume, setVolume] = useState(() =>

    Math.min(100, Math.max(0, startVolume)),

  );



  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const [stageWidth, setStageWidth] = useState(1200);

  const [readyId, setReadyId] = useState<string | null>(null);



  const [expanded, setExpanded] = useState(false);

  const [zoom, setZoom] = useState<1 | 2 | 3>(1);

  const [expandedPlaying, setExpandedPlaying] = useState(autoPlay);

  const [expandedMuted, setExpandedMuted] = useState(startMuted);

  const [expandedVolume, setExpandedVolume] = useState(

    Math.min(100, Math.max(0, startVolume)),

  );



  const stageRef = useRef<HTMLDivElement | null>(null);

  const frameRef = useRef<HTMLIFrameElement | null>(null);

  const expandedFrameRef = useRef<HTMLIFrameElement | null>(null);



  const activeRef = useRef(active);

  const playingRef = useRef(playing);

  const shuffleRef = useRef(shuffle);

  const loopModeRef = useRef(loopMode);

  const mutedRef = useRef(muted);

  const volumeRef = useRef(volume);



  const lastEndedIdRef = useRef<string | null>(null);

  const lastVolumeRef = useRef(volume > 0 ? volume : 50);

  const dragStartX = useRef<number | null>(null);

  const didDrag = useRef(false);

  const loadTimerRef = useRef<number | null>(null);

  const expandWasPlayingRef = useRef(autoPlay);

  const expandedRef = useRef(false);



  useEffect(() => {

    activeRef.current = active;

  }, [active]);



  useEffect(() => {

    playingRef.current = playing;

  }, [playing]);



  useEffect(() => {

    shuffleRef.current = shuffle;

  }, [shuffle]);



  useEffect(() => {

    loopModeRef.current = loopMode;

  }, [loopMode]);



  useEffect(() => {

    mutedRef.current = muted;

  }, [muted]);



  useEffect(() => {

    volumeRef.current = volume;

  }, [volume]);



  useEffect(() => {

    expandedRef.current = expanded;

  }, [expanded]);



  useEffect(() => {

    setActive((current) =>

      total ? ((current % total) + total) % total : 0,

    );

  }, [total]);



  useEffect(() => {

    setShowVolumeSlider(false);

  }, [active]);



  useEffect(() => {

    const element = stageRef.current;

    if (!element) return;



    const updateWidth = () => {

      if (element.clientWidth > 0) {

        setStageWidth(element.clientWidth);

      }

    };



    updateWidth();



    if (typeof ResizeObserver === "undefined") {

      window.addEventListener("resize", updateWidth);

      return () => window.removeEventListener("resize", updateWidth);

    }



    const observer = new ResizeObserver(updateWidth);

    observer.observe(element);



    return () => observer.disconnect();

  }, []);



  useEffect(() => {

    if (!expanded) return;



    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";



    const onEscape = (event: globalThis.KeyboardEvent) => {

      if (event.key === "Escape") closeExpanded();

    };



    window.addEventListener("keydown", onEscape);



    return () => {

      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", onEscape);

    };

  }, [expanded]);



  useEffect(() => {

    return () => {

      if (loadTimerRef.current !== null) {

        window.clearTimeout(loadTimerRef.current);

      }

    };

  }, []);



  const metrics = useMemo(

    () => getMetrics(stageWidth),

    [stageWidth],

  );



  const syncPlayer = useCallback(() => {

    const frame = frameRef.current;

    if (!frame || expandedRef.current) return;



    sendCommand(frame, "setVolume", [volumeRef.current]);

    sendCommand(frame, mutedRef.current ? "mute" : "unMute");

    sendCommand(

      frame,

      playingRef.current ? "playVideo" : "pauseVideo",

    );

  }, []);



  const syncExpandedPlayer = useCallback(() => {

    const frame = expandedFrameRef.current;

    if (!frame) return;



    sendCommand(frame, "setVolume", [

      expandedMuted ? 0 : expandedVolume,

    ]);

    sendCommand(

      frame,

      expandedMuted ? "mute" : "unMute",

    );

    sendCommand(

      frame,

      expandedPlaying ? "playVideo" : "pauseVideo",

    );

  }, [expandedMuted, expandedPlaying, expandedVolume]);



  const goTo = useCallback(

    (index: number) => {

      if (!total) return;



      const nextIndex = ((index % total) + total) % total;



      if (nextIndex === activeRef.current) {

        lastEndedIdRef.current = null;

        playingRef.current = true;

        setPlaying(true);

        sendCommand(frameRef.current, "seekTo", [0, true]);

        sendCommand(frameRef.current, "playVideo");

        return;

      }



      if (loadTimerRef.current !== null) {

        window.clearTimeout(loadTimerRef.current);

        loadTimerRef.current = null;

      }



      activeRef.current = nextIndex;

      lastEndedIdRef.current = null;

      playingRef.current = true;



      setActive(nextIndex);

      setReadyId(null);

      setPlaying(true);

    },

    [total],

  );



  const next = useCallback(() => {

    if (total <= 1) return;



    const currentIndex = activeRef.current;



    if (loopModeRef.current === 2) {

      lastEndedIdRef.current = null;

      playingRef.current = true;

      setPlaying(true);

      sendCommand(frameRef.current, "seekTo", [0, true]);

      sendCommand(frameRef.current, "playVideo");

      return;

    }



    if (shuffleRef.current) {

      const choices = Array.from(

        { length: total },

        (_, index) => index,

      ).filter((index) => index !== currentIndex);



      const choice = choices[

        Math.floor(Math.random() * choices.length)

      ];



      goTo(choice);

      return;

    }



    if (currentIndex === total - 1) {

      if (loopModeRef.current === 0) {

        playingRef.current = false;

        setPlaying(false);

        sendCommand(frameRef.current, "pauseVideo");

        return;

      }



      goTo(0);

      return;

    }



    goTo(currentIndex + 1);

  }, [goTo, total]);



  const prev = useCallback(() => {

    if (total <= 1) return;



    const currentIndex = activeRef.current;



    if (shuffleRef.current) {

      const choices = Array.from(

        { length: total },

        (_, index) => index,

      ).filter((index) => index !== currentIndex);



      goTo(choices[Math.floor(Math.random() * choices.length)]);

      return;

    }



    goTo(currentIndex - 1);

  }, [goTo, total]);



  const togglePlay = useCallback(() => {

    const nextPlaying = !playingRef.current;



    playingRef.current = nextPlaying;

    setPlaying(nextPlaying);



    if (expandedRef.current) {

      setExpandedPlaying(nextPlaying);

      sendCommand(

        expandedFrameRef.current,

        nextPlaying ? "playVideo" : "pauseVideo",

      );

      return;

    }



    sendCommand(

      frameRef.current,

      nextPlaying ? "playVideo" : "pauseVideo",

    );

  }, []);



  const toggleShuffle = useCallback(() => {

    setShuffle((value) => !value);

  }, []);



  const toggleLoop = useCallback(() => {

    setLoopMode((mode) => ((mode + 1) % 3) as LoopMode);

  }, []);



  const onFrameLoad = useCallback(

    (id: string) => {

      if (loadTimerRef.current !== null) {

        window.clearTimeout(loadTimerRef.current);

      }



      const frame = frameRef.current;

      if (!frame) return;



      subscribeToPlayer(frame, id);



      // Re-subscribe after YouTube has initialized its player.

      loadTimerRef.current = window.setTimeout(() => {

        if (activeRef.current < 0) return;



        subscribeToPlayer(frameRef.current, id);



        sendCommand(frameRef.current, "setVolume", [

          volumeRef.current,

        ]);

        sendCommand(

          frameRef.current,

          mutedRef.current ? "mute" : "unMute",

        );

        sendCommand(

          frameRef.current,

          playingRef.current ? "playVideo" : "pauseVideo",

        );



        setReadyId(id);

      }, 900);

    },

    [],

  );



  // Detect YouTube's ENDED state and advance exactly once per video.

  useEffect(() => {

    const handleYouTubeMessage = (event: MessageEvent) => {

      if (event.origin !== YOUTUBE_ORIGIN) return;

      if (event.source !== frameRef.current?.contentWindow) return;

      if (typeof event.data !== "string") return;



      let data: {

        event?: string;

        info?: unknown;

        id?: string | number;

      };



      try {

        data = JSON.parse(event.data);

      } catch {

        return;

      }



      // YouTube state 0 = ended, 1 = playing, 2 = paused.

      if (data.event !== "onStateChange") return;



      const state = Number(data.info);



      if (state === 1) {

        playingRef.current = true;

        setPlaying(true);

        return;

      }



      if (state === 2) {

        playingRef.current = false;

        setPlaying(false);

        return;

      }



      if (state !== 0 || expandedRef.current) return;



      const endedId = items[activeRef.current]?.id;

      if (!endedId || lastEndedIdRef.current === endedId) return;



      lastEndedIdRef.current = endedId;

      next();

    };



    window.addEventListener("message", handleYouTubeMessage);



    return () => {

      window.removeEventListener("message", handleYouTubeMessage);

    };

  }, [items, next]);



  useEffect(() => {

    syncPlayer();

  }, [active, playing, muted, volume, syncPlayer]);



  useEffect(() => {

    syncExpandedPlayer();

  }, [syncExpandedPlayer]);



  const handleVolumeChange = (value: number) => {

    const nextVolume = Math.min(100, Math.max(0, value));



    volumeRef.current = nextVolume;

    setVolume(nextVolume);



    if (nextVolume > 0) {

      lastVolumeRef.current = nextVolume;

      mutedRef.current = false;

      setMuted(false);

    } else {

      mutedRef.current = true;

      setMuted(true);

    }



    syncPlayer();

    sendCommand(frameRef.current, "setVolume", [nextVolume]);

  };



  const toggleMute = () => {

    const nextMuted = !mutedRef.current;



    if (!nextMuted && volumeRef.current === 0) {

      volumeRef.current = lastVolumeRef.current;

      setVolume(lastVolumeRef.current);

      sendCommand(frameRef.current, "setVolume", [

        lastVolumeRef.current,

      ]);

    }



    mutedRef.current = nextMuted;

    setMuted(nextMuted);



    sendCommand(

      frameRef.current,

      nextMuted ? "mute" : "unMute",

    );

  };



  const openExpanded = () => {

    expandWasPlayingRef.current = playingRef.current;



    setZoom(1);

    setExpandedPlaying(playingRef.current);

    setExpandedMuted(mutedRef.current);

    setExpandedVolume(volumeRef.current);

    setExpanded(true);



    sendCommand(frameRef.current, "pauseVideo");

  };



  const closeExpanded = () => {

    setExpanded(false);



    const shouldResume = expandWasPlayingRef.current;



    playingRef.current = shouldResume;

    setPlaying(shouldResume);



    sendCommand(

      expandedFrameRef.current,

      "pauseVideo",

    );



    if (shouldResume) {

      sendCommand(frameRef.current, "playVideo");

    } else {

      sendCommand(frameRef.current, "pauseVideo");

    }

  };



  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {

    if (event.key === "ArrowLeft") {

      event.preventDefault();

      prev();

    } else if (event.key === "ArrowRight") {

      event.preventDefault();

      next();

    } else if (event.key === " ") {

      const target = event.target as HTMLElement;

      if (target.closest("button, input, iframe")) return;



      event.preventDefault();

      togglePlay();

    }

  };



  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {

    if (

      (event.target as HTMLElement).closest(

        "button, input, iframe, a",

      )

    ) {

      return;

    }



    dragStartX.current = event.clientX;

    didDrag.current = false;

  };



  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {

    if (dragStartX.current === null) return;



    const distance = event.clientX - dragStartX.current;

    dragStartX.current = null;



    if (Math.abs(distance) > 48) {

      didDrag.current = true;

      distance < 0 ? next() : prev();

    }

  };



  useEffect(() => {

    const onWindowBlur = () => {

      dragStartX.current = null;

    };



    window.addEventListener("blur", onWindowBlur);

    return () => window.removeEventListener("blur", onWindowBlur);

  }, []);



  useEffect(() => {

    const reel = items[active];

    if (reel) onChange?.(active, reel);

  }, [active, items, onChange]);



  if (!total) return null;



  const current = items[active];



  const expandedWidth =

    `min(calc(100vw - 32px), ${metrics.centerWidth * zoom}px, calc((100vh - 180px) * 16 / 9))`;



  return (

    <>

      <div

        className={["yrc-root", className].filter(Boolean).join(" ")}

        style={style}

        role="region"

        aria-roledescription="carousel"

        aria-label="Trending videos"

        tabIndex={0}

        onKeyDown={onKeyDown}

        onPointerDown={onPointerDown}

        onPointerUp={onPointerUp}

        onPointerCancel={() => {

          dragStartX.current = null;

        }}

      >

        <div

          ref={stageRef}

          className="yrc-stage"

          style={{ height: metrics.stageHeight }}

        >

          {items.map((reel, index) => {

            const offset = circularOffset(index, active, total);

            const distance = Math.abs(offset);

            const hidden = distance > metrics.radius;

            const clamped = Math.max(

              -(metrics.radius + 1),

              Math.min(metrics.radius + 1, offset),

            );



            const width =

              metrics.centerWidth *

              [1, 0.9, 0.79][Math.min(distance, 2)];



            const height = width * VIDEO_ASPECT_RATIO;

            const isCenter = index === active;



            return (

              <div

                key={reel.id}

                className="yrc-card"

                data-center={isCenter}

                data-hidden={hidden}

                aria-hidden={hidden}

                aria-label={

                  reel.label ??

                  reel.caption ??

                  `Video ${index + 1} of ${total}`

                }

                style={{

                  width,

                  height,

                  zIndex: 10 - distance,

                  transform: `translate(calc(-50% + ${

                    clamped * metrics.step

                  }px), -50%)`,

                }}

                onClick={() => {

                  if (didDrag.current) {

                    didDrag.current = false;

                    return;

                  }



                  if (!isCenter && !hidden) {

                    goTo(index);

                  }

                }}

              >

                <img

                  className="yrc-thumb"

                  src={thumbnail(reel.videoId)}

                  alt=""

                  loading={hidden ? "lazy" : "eager"}

                  draggable={false}

                />



                {isCenter && (

                  <iframe

                    key={reel.id}

                    ref={frameRef}

                    className="yrc-frame"

                    data-ready={readyId === reel.id}

                    src={embedSrc(reel.videoId, autoPlay, true)}

                    title={

                      reel.label ??

                      reel.caption ??

                      `YouTube video ${index + 1}`

                    }

                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"

                    allowFullScreen

                    referrerPolicy="strict-origin-when-cross-origin"

                    tabIndex={-1}

                    onLoad={() => onFrameLoad(reel.id)}

                  />

                )}



                {reel.caption && (

                  <p className="yrc-caption">{reel.caption}</p>

                )}



                {!hidden && (

                  <div className="yrc-controls">

                    <div className="yrc-volume-group">

                      <button

                        type="button"

                        className="yrc-ctl"

                        aria-label={muted ? "Unmute" : "Mute"}

                        aria-pressed={!muted}

                        onClick={(event) => {

                          event.stopPropagation();



                          if (!isCenter) {

                            goTo(index);

                            return;

                          }



                          toggleMute();

                        }}

                      >

                        {muted || volume === 0 ? (

                          <VolumeOffIcon />

                        ) : (

                          <VolumeOnIcon />

                        )}

                      </button>



                      {isCenter && (

                        <input

                          type="range"

                          className="yrc-volume"

                          min={0}

                          max={100}

                          value={muted ? 0 : volume}

                          aria-label="Volume"

                          onClick={(event) => event.stopPropagation()}

                          onPointerDown={(event) => event.stopPropagation()}

                          onChange={(event) =>

                            handleVolumeChange(

                              Number(event.target.value),

                            )

                          }

                        />

                      )}

                    </div>





                    {isCenter && (

                      <button

                        type="button"

                        className="yrc-ctl"

                        aria-label="Maximize video"

                        title="Maximize video"

                        onClick={(event) => {

                          event.stopPropagation();

                          openExpanded();

                        }}

                      >

                        <ExpandIcon />

                      </button>

                    )}

                  </div>

                )}

              </div>

            );

          })}

        </div>



        {total > 1 && (

          <div

            className="yrc-music-controls"

            aria-label="Playback controls"

          >

            <button

              type="button"

              className="yrc-music-control"

              data-active={shuffle}

              aria-pressed={shuffle}

              aria-label="Shuffle"

              title="Shuffle"

              onClick={toggleShuffle}

            >

              <ShuffleIcon />

            </button>



            <button

              type="button"

              className="yrc-music-control yrc-play-toggle"

              aria-label={playing ? "Pause" : "Play"}

              title={playing ? "Pause" : "Play"}

              onClick={togglePlay}

            >

              {playing ? <PauseIcon /> : <PlayIcon />}

            </button>



            <button

              type="button"

              className="yrc-music-control"

              data-active={loopMode !== 0}

              aria-pressed={loopMode !== 0}

              aria-label={

                loopMode === 2

                  ? "Repeat one"

                  : loopMode === 1

                    ? "Repeat all"

                    : "Repeat off"

              }

              title={

                loopMode === 2

                  ? "Repeat one"

                  : loopMode === 1

                    ? "Repeat all"

                    : "Repeat off"

              }

              onClick={toggleLoop}

            >

              <RepeatIcon />

              {loopMode === 2 && (

                <span className="yrc-repeat-one">1</span>

              )}

            </button>

          </div>

        )}



        <div

          className="yrc-navigation-count"

          aria-live="polite"

        >

          {active + 1} / {total}

        </div>



        <span className="yrc-sr-only" aria-live="polite">

          {current.label ?? current.caption ?? `Video ${active + 1}`}

        </span>

      </div>



      {expanded &&

        typeof document !== "undefined" &&

        createPortal(

          <div

            className="yrc-expand-overlay"

            role="dialog"

            aria-modal="true"

            aria-label="Expanded video player"

            onMouseDown={(event) => {

              if (event.target === event.currentTarget) {

                closeExpanded();

              }

            }}

          >

            <div className="yrc-expand-panel">

              <div className="yrc-expand-toolbar">

                <div className="yrc-expand-title">

                  {current.label ?? current.caption ?? "Now playing"}

                </div>



                <div

                  className="yrc-zoom-options"

                  aria-label="Video size"

                >

                  {([1, 2, 3] as const).map((level) => (

                    <button

                      key={level}

                      type="button"

                      className="yrc-zoom-button"

                      data-active={zoom === level}

                      aria-pressed={zoom === level}

                      onClick={() => setZoom(level)}

                    >

                      {level}×

                    </button>

                  ))}

                </div>



                <button

                  type="button"

                  className="yrc-expand-close"

                  aria-label="Close expanded video"

                  onClick={closeExpanded}

                >

                  <CloseIcon />

                </button>

              </div>



              <div

                className="yrc-expanded-video"

                style={{

                  width: expandedWidth,

                  maxWidth: "calc(100vw - 32px)",

                }}

              >

                <iframe

                  ref={expandedFrameRef}

                  key={`expanded-${current.id}`}

                  src={embedSrc(

                    current.videoId,

                    expandedPlaying,

                    expandedMuted,

                  )}

                  title={

                    current.label ??

                    current.caption ??

                    "Expanded YouTube video"

                  }

                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"

                  allowFullScreen

                  referrerPolicy="strict-origin-when-cross-origin"

                  onLoad={() => {

                    subscribeToPlayer(

                      expandedFrameRef.current,

                      `expanded-${current.id}`,

                    );



                    window.setTimeout(() => {

                      syncExpandedPlayer();

                    }, 700);

                  }}

                />

              </div>



              <div className="yrc-expand-bottom">

                <button

                  type="button"

                  className="yrc-expand-action"

                  onClick={() => {

                    const nextPlaying = !expandedPlaying;



                    setExpandedPlaying(nextPlaying);

                    playingRef.current = nextPlaying;

                    setPlaying(nextPlaying);



                    sendCommand(

                      expandedFrameRef.current,

                      nextPlaying ? "playVideo" : "pauseVideo",

                    );

                  }}

                >

                  {expandedPlaying ? <PauseIcon /> : <PlayIcon />}

                  {expandedPlaying ? "Pause" : "Play"}

                </button>



                <button

                  type="button"

                  className="yrc-expand-action"

                  onClick={() => {

                    const nextMuted = !expandedMuted;



                    setExpandedMuted(nextMuted);

                    mutedRef.current = nextMuted;

                    setMuted(nextMuted);



                    sendCommand(

                      expandedFrameRef.current,

                      nextMuted ? "mute" : "unMute",

                    );



                    sendCommand(

                      frameRef.current,

                      nextMuted ? "mute" : "unMute",

                    );

                  }}

                >

                  {expandedMuted ? (

                    <VolumeOffIcon />

                  ) : (

                    <VolumeOnIcon />

                  )}

                  {expandedMuted ? "Unmute" : "Mute"}

                </button>



                <input

                  className="yrc-expanded-volume"

                  type="range"

                  min={0}

                  max={100}

                  value={expandedMuted ? 0 : expandedVolume}

                  aria-label="Expanded video volume"

                  onChange={(event) => {

                    const value = Number(event.target.value);



                    setExpandedVolume(value);

                    setExpandedMuted(value === 0);



                    volumeRef.current = value;

                    setVolume(value);



                    mutedRef.current = value === 0;

                    setMuted(value === 0);



                    if (value > 0) {

                      lastVolumeRef.current = value;

                    }



                    sendCommand(

                      expandedFrameRef.current,

                      "setVolume",

                      [value],

                    );



                    sendCommand(

                      expandedFrameRef.current,

                      value === 0 ? "mute" : "unMute",

                    );



                    sendCommand(

                      frameRef.current,

                      "setVolume",

                      [value],

                    );



                    sendCommand(

                      frameRef.current,

                      value === 0 ? "mute" : "unMute",

                    );

                  }}

                />



                <span className="yrc-zoom-label">

                  {zoom}× size

                </span>

              </div>

            </div>

          </div>,

          document.body,

        )}

    </>

  );

}



export default YouTubeReelsCarousel;