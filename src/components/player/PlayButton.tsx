import { Pause, Play } from 'lucide-react';
import { useAudio } from '../../hooks/usePlayer';

/** Round play/pause button + thin progress bar for a local audio file. */
export function PlayButton({ src, label }: { src: string; label: string }) {
  const { playing, progress, error, toggle } = useAudio(src);
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={toggle}
        disabled={error}
        aria-label={error ? `${label}: audio unavailable` : `${playing ? 'Pause' : 'Play'} ${label}`}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full disabled:opacity-50"
        style={{
          color: 'var(--accent-ink)',
          background: 'linear-gradient(180deg, rgba(255,255,255,.42), transparent 55%), var(--accent)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,.6), 0 6px 16px -6px color-mix(in srgb, var(--accent) 70%, transparent)',
        }}
      >
        {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" className="translate-x-px" />}
      </button>
      <div className="h-1 flex-1 overflow-hidden rounded-full" style={{ background: 'var(--glass-border)' }} aria-hidden="true">
        <div className="h-full rounded-full" style={{ width: `${progress * 100}%`, background: 'var(--accent)' }} />
      </div>
    </div>
  );
}
