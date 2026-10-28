import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

interface Shared {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
}

type InputProps = Shared & Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & { multiline?: false };
type AreaProps = Shared & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> & { multiline: true };

/** Labelled input / textarea with hint + error wiring (aria-describedby, aria-invalid, role=alert). */
export function GlassField(props: InputProps | AreaProps) {
  const id = useId();
  const { label, hint, error, optional, multiline, ...rest } = props;
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  return (
    <div className="gfield">
      <label htmlFor={id}>
        {label}
        {optional && <span className="muted font-medium"> (optional)</span>}
      </label>
      {multiline ? (
        <textarea
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          id={id}
          className="ginput"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
      ) : (
        <input
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          id={id}
          className="ginput"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
      )}
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
