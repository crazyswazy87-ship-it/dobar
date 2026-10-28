import { useId, type ChangeEvent } from 'react';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface GlassSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly Option[];
  placeholder?: string;
  hint?: string;
  error?: string;
  name?: string;
  compact?: boolean;
}

/** A native <select> (best keyboard + mobile behaviour) styled to match the glass system. */
export function GlassSelect({ label, value, onChange, options, placeholder, hint, error, name, compact }: GlassSelectProps) {
  const id = useId();
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  return (
    <div className="gfield">
      <label htmlFor={id} className={compact ? 'muted !text-[0.68rem] uppercase tracking-[0.14em]' : undefined}>
        {label}
      </label>
      <select
        id={id}
        name={name}
        className="ginput"
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && !error && (
        <p id={`${id}-hint`} className="ghint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="gerror" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
