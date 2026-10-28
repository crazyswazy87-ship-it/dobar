import { useCallback, useEffect, useRef, useState } from 'react';

/** Only one track plays at a time across the whole page. */
let active: HTMLAudioElement | null = null;

export function useAudio(src: string | null) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;
    const a = new Audio();
    a.preload = 'none';
    a.src = src;
    ref.current = a;
    const onTime = () => setProgress(a.duration ? a.currentTime / a.duration : 0);
    const onEnd = () => {
      setPlaying(false);
      setProgress(0);
    };
    const onErr = () => {
      setError(true);
      setPlaying(false);
    };
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('ended', onEnd);
    a.addEventListener('error', onErr);
    return () => {
      a.pause();
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('ended', onEnd);
      a.removeEventListener('error', onErr);
      if (active === a) active = null;
      ref.current = null;
    };
  }, [src]);

  const toggle = useCallback(() => {
    const a = ref.current;
    if (!a) return;
    if (a.paused) {
      if (active && active !== a) active.pause();
      active = a;
      a.play().then(
        () => setPlaying(true),
        () => setError(true)
      );
    } else {
      a.pause();
      setPlaying(false);
    }
  }, []);

  const seek = useCallback((ratio: number) => {
    const a = ref.current;
    if (a && a.duration) a.currentTime = ratio * a.duration;
  }, []);

  // reflect pauses caused by another player taking over
  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    const onPause = () => setPlaying(false);
    a.addEventListener('pause', onPause);
    return () => a.removeEventListener('pause', onPause);
  }, [src]);

  return { playing, progress, error, toggle, seek };
}
