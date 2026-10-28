import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, Copy } from 'lucide-react';
import { GENRES, SITE, TERMS, TIERS, formatPrice } from '../config/site';
import {
  GlassButton,
  GlassField,
  GlassModal,
  GlassPanel,
  GlassSegmented,
  GlassSelect,
  LiquidGlass,
} from '../components/glass';
import { SectionHeading } from '../components/sections/SectionHeading';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import {
  EMPTY_INPUT,
  PITCH_MAX,
  validateDetailsStep,
  validateReviewStep,
  validateTrackStep,
  type FieldErrors,
} from '../lib/validation';
import { api } from '../services';
import type { ReleaseStatus, SubmissionInput, SubmissionTier, SubmitResult } from '../types';

const STEPS = ['Song', 'Options', 'Review'] as const;

function Progress({ step }: { step: number }) {
  return (
    <LiquidGlass as="nav" aria-label="Submission progress" variant="subtle" radius={999} className="mb-6 p-2">
      <ol className="grid grid-cols-3 gap-1">
        {STEPS.map((s, i) => (
          <li
            key={s}
            aria-current={i === step ? 'step' : undefined}
            className="flex min-h-11 items-center justify-center gap-2 rounded-full px-2 text-[0.72rem] font-bold uppercase tracking-[0.08em] sm:text-xs"
            style={
              i === step
                ? { color: 'var(--accent-ink)', background: 'linear-gradient(180deg, rgba(255,255,255,.4), transparent 55%), var(--accent)' }
                : { color: i < step ? 'var(--accent-text)' : 'var(--ink-muted)' }
            }
          >
            {i < step ? <Check size={14} aria-hidden="true" /> : <span aria-hidden="true">{i + 1}</span>}
            <span className="truncate">{s}</span>
          </li>
        ))}
      </ol>
    </LiquidGlass>
  );
}

function ResultView({ result, onReset }: { result: SubmitResult; onReset: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard blocked: user can still use the visible text */
    }
  };

  if (result.status === 'stored')
    return (
      <div className="grid gap-4">
        <p className="text-base leading-7">
          Your submission has been received and saved. Reference: <strong>{result.id}</strong>.
        </p>
        <p className="muted text-sm">Every song is reviewed.</p>
        <GlassButton onClick={onReset}>Submit another song</GlassButton>
      </div>
    );

  if (result.status === 'handoff')
    return (
      <div className="grid gap-4">
        <p className="text-base font-semibold leading-7">Your song has not been delivered yet.</p>
        <p className="muted text-sm leading-6">
          We don’t have a server to receive it, so the final step is to send your details to Doba
          {result.channel === 'whatsapp' ? ' on WhatsApp' : ' by email'}. Tap the button — your message is already written.
        </p>
        <GlassButton href={result.url} kind="primary" size="lg">
          {result.channel === 'whatsapp' ? 'Send on WhatsApp' : 'Send email'}
        </GlassButton>
        <GlassButton kind="ghost" onClick={() => copy(result.message)}>
          {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />} {copied ? 'Copied' : 'Copy details instead'}
        </GlassButton>
      </div>
    );

  if (result.status === 'unavailable')
    return (
      <div className="grid gap-4">
        <p className="text-base font-semibold leading-7">Submissions aren’t connected yet, so nothing was sent.</p>
        <p className="muted text-sm leading-6">
          Please copy your details and send them to Doba directly. We’re sorry for the extra step.
        </p>
        <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-2xl p-4 text-xs leading-5" style={{ background: 'var(--input-bg)' }}>
          {result.message}
        </pre>
        <GlassButton kind="primary" onClick={() => copy(result.message)}>
          {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />} {copied ? 'Copied' : 'Copy details'}
        </GlassButton>
      </div>
    );

  if (result.status === 'duplicate')
    return (
      <div className="grid gap-4">
        <p className="text-base leading-7">
          It looks like you’ve already submitted this song from this email (reference <strong>{result.id}</strong>). We’ve
          blocked a second copy so your song isn’t counted twice.
        </p>
        <GlassButton onClick={onReset}>Submit a different song</GlassButton>
      </div>
    );

  return (
    <div className="grid gap-4">
      <p className="text-base leading-7" role="alert">Something went wrong: {result.error}</p>
      <GlassButton kind="primary" onClick={onReset}>Back to the form</GlassButton>
    </div>
  );
}

const resultTitle = (r: SubmitResult) =>
  ({
    stored: 'Submission received',
    handoff: 'One last step',
    unavailable: 'Not sent yet',
    duplicate: 'Already submitted',
    failed: 'Submission failed',
  })[r.status];

export default function SubmitPage() {
  useDocumentTitle('Submit your music — Doba Music');
  const [params] = useSearchParams();
  const presetTier = params.get('tier') === 'priority' ? 'priority' : 'free';

  const [step, setStep] = useState(0);
  const [v, setV] = useState<SubmissionInput>({ ...EMPTY_INPUT, tier: presetTier });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [dialog, setDialog] = useState(false);
  const [terms, setTerms] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lock = useRef(false); // blocks double-submits even before state updates

  const set = <K extends keyof SubmissionInput>(k: K, val: SubmissionInput[K]) => {
    setV((s) => ({ ...s, [k]: val }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  // move focus to the step heading when the step changes
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false; // don't steal focus on page load
      return;
    }
    headingRef.current?.focus();
  }, [step, result]);

  const focusFirstError = () =>
    requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());

  const next = () => {
    const e = step === 0 ? validateTrackStep(v) : validateDetailsStep(v);
    setErrors(e);
    if (Object.keys(e).length) return focusFirstError();
    setStep((s) => s + 1);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (lock.current || sending) return;
    const err = validateReviewStep(v);
    setErrors(err);
    if (Object.keys(err).length) return;
    lock.current = true;
    setSending(true);
    try {
      const r = await api.submissions.submit({ ...v, acceptedTerms: true });
      setResult(r);
      setDialog(true);
    } finally {
      setSending(false);
      lock.current = false;
    }
  };

  const reset = () => {
    setResult(null);
    setDialog(false);
    setV({ ...EMPTY_INPUT, tier: presetTier });
    setTerms(false);
    setStep(0);
  };

  const tiers = Object.values(TIERS).filter((t) => t.enabled);
  const tier = TIERS[v.tier];

  return (
    <div className="wrap section pt-36 sm:pt-40">
      <div className="mx-auto max-w-2xl">
        <SectionHeading eyebrow="Submit music" title="Send us your song." id="sub-title">
          A few details and your Spotify track link. Free to submit.
        </SectionHeading>

        <div className="mt-8">
          {result ? (
            <GlassPanel as="section" variant="strong" aria-label="Submission result" title={resultTitle(result)} eyebrow="Status">
              <div role="status" tabIndex={-1} ref={headingRef as never}>
                <ResultView result={result} onReset={reset} />
              </div>
            </GlassPanel>
          ) : (
            <>
              <Progress step={step} />
              <form onSubmit={submit} noValidate>
                <GlassPanel variant="strong" radius={30} padded className="grid gap-5">
                  <h2 ref={headingRef} tabIndex={-1} className="text-xl font-bold tracking-tight outline-none">
                    {step === 0 && 'About your song'}
                    {step === 1 && 'Choose how to submit'}
                    {step === 2 && 'Review and send'}
                  </h2>

                  {step === 0 && (
                    <>
                      <GlassField label="Artist name" name="artistName" autoComplete="nickname" value={v.artistName} error={errors.artistName} onChange={(e) => set('artistName', e.target.value)} />
                      <GlassField label="Contact email" name="email" type="email" inputMode="email" autoComplete="email" value={v.email} error={errors.email} onChange={(e) => set('email', e.target.value)} />
                      <GlassField label="Song title" name="songTitle" value={v.songTitle} error={errors.songTitle} onChange={(e) => set('songTitle', e.target.value)} />
                      <GlassField
                        label="Spotify track link"
                        name="spotifyUrl"
                        type="url"
                        inputMode="url"
                        placeholder="https://open.spotify.com/track/…"
                        hint="In Spotify: ••• → Share → Copy Song Link"
                        value={v.spotifyUrl}
                        error={errors.spotifyUrl}
                        onChange={(e) => set('spotifyUrl', e.target.value)}
                      />
                      <GlassSelect label="Genre" value={v.genre} placeholder="Choose a genre" error={errors.genre} onChange={(g) => set('genre', g)} options={GENRES.map((g) => ({ value: g, label: g }))} />
                      <GlassSegmented
                        label="Release status"
                        value={v.releaseStatus}
                        onChange={(s: ReleaseStatus) => set('releaseStatus', s)}
                        options={[
                          { value: 'released', label: 'Released' },
                          { value: 'scheduled', label: 'Scheduled' },
                          { value: 'unreleased', label: 'Unreleased' },
                        ]}
                      />
                      {v.releaseStatus !== 'unreleased' && (
                        <GlassField
                          label={v.releaseStatus === 'released' ? 'Release date' : 'Planned release date'}
                          name="releaseDate"
                          type="date"
                          value={v.releaseDate}
                          error={errors.releaseDate}
                          onChange={(e) => set('releaseDate', e.target.value)}
                        />
                      )}
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <fieldset className="grid gap-3">
                        <legend className="glabel mb-2 text-sm font-bold">Submission type</legend>
                        {tiers.map((t) => {
                          const on = v.tier === t.id;
                          return (
                            <label
                              key={t.id}
                              className="relative block cursor-pointer rounded-2xl p-4 transition-shadow has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--accent-text)]"
                              style={{
                                background: on ? 'color-mix(in srgb, var(--accent) 14%, var(--input-bg))' : 'var(--input-bg)',
                                boxShadow: on ? 'inset 0 0 0 2px var(--accent-text)' : 'inset 0 0 0 1px var(--glass-border)',
                              }}
                            >
                              <input type="radio" name="tier" value={t.id} checked={on} onChange={() => set('tier', t.id as SubmissionTier)} className="sr-only" />
                              <span className="flex items-start justify-between gap-3">
                                <span>
                                  <span className="block text-base font-bold">{t.name}</span>
                                  <span className="muted mt-1 block text-sm">{t.summary}</span>
                                </span>
                                <span className="shrink-0 text-right text-sm font-bold">{formatPrice(t)}</span>
                              </span>
                              <ul className="muted mt-3 grid gap-1 text-xs leading-5">
                                {t.disclaimers.map((d) => (
                                  <li key={d}>• {d}</li>
                                ))}
                              </ul>
                            </label>
                          );
                        })}
                      </fieldset>
                      <GlassField label="Social profile" optional name="socialUrl" inputMode="url" placeholder="instagram.com/yourname" value={v.socialUrl} error={errors.socialUrl} onChange={(e) => set('socialUrl', e.target.value)} />
                      <GlassField
                        multiline
                        label="Your pitch"
                        optional
                        name="pitch"
                        placeholder="Tell us about the song in a few lines."
                        maxLength={PITCH_MAX + 50}
                        hint={`${v.pitch.length}/${PITCH_MAX}`}
                        value={v.pitch}
                        error={errors.pitch}
                        onChange={(e) => set('pitch', e.target.value)}
                      />
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <dl className="grid gap-3 text-sm">
                        {(
                          [
                            ['Artist', v.artistName],
                            ['Song', v.songTitle],
                            ['Email', v.email],
                            ['Spotify', v.spotifyUrl],
                            ['Genre', v.genre],
                            ['Release', `${v.releaseStatus}${v.releaseDate ? ` · ${v.releaseDate}` : ''}`],
                            ['Type', `${tier.name} · ${formatPrice(tier)}`],
                            ...(v.socialUrl ? [['Social', v.socialUrl]] : []),
                            ...(v.pitch ? [['Pitch', v.pitch]] : []),
                          ] as [string, string][]
                        ).map(([k, val]) => (
                          <div key={k} className="grid gap-0.5 border-b pb-3 sm:grid-cols-[7rem_1fr] sm:gap-3" style={{ borderColor: 'var(--glass-border)' }}>
                            <dt className="muted font-semibold">{k}</dt>
                            <dd className="break-words font-medium">{val}</dd>
                          </div>
                        ))}
                      </dl>

                      <button type="button" onClick={() => setStep(0)} className="justify-self-start text-sm font-bold underline" style={{ color: 'var(--accent-text)' }}>
                        Edit details
                      </button>

                      <div className="gfield">
                        <label className="flex cursor-pointer items-start gap-3 text-sm font-medium leading-6">
                          <input
                            type="checkbox"
                            checked={terms}
                            onChange={(e) => {
                              setTerms(e.target.checked);
                              set('acceptedTerms', e.target.checked);
                            }}
                            aria-invalid={errors.acceptedTerms ? true : undefined}
                            aria-describedby="terms-list"
                            className="mt-1 h-5 w-5 shrink-0 accent-[var(--accent)]"
                          />
                          <span>I confirm the terms below.</span>
                        </label>
                        <ul id="terms-list" className="muted ml-8 grid gap-1 text-xs leading-5">
                          {TERMS.map((t) => (
                            <li key={t}>• {t}</li>
                          ))}
                        </ul>
                        {errors.acceptedTerms && <p className="gerror ml-8" role="alert">{errors.acceptedTerms}</p>}
                      </div>
                      {!SITE.contact.whatsapp && !SITE.contact.email && (
                        <p className="g-chip !normal-case !tracking-normal" data-tone="warn">
                          Heads-up: no delivery channel is configured yet, so you will be asked to copy your details.
                        </p>
                      )}
                    </>
                  )}

                  <div className="flex flex-wrap justify-between gap-3 pt-2">
                    {step > 0 ? (
                      <GlassButton kind="ghost" onClick={() => setStep((s) => s - 1)}>
                        Back
                      </GlassButton>
                    ) : (
                      <span />
                    )}
                    {step < 2 ? (
                      <GlassButton kind="primary" size="lg" onClick={next}>
                        Continue
                      </GlassButton>
                    ) : (
                      <GlassButton type="submit" kind="primary" size="lg" disabled={sending} aria-busy={sending}>
                        {sending ? 'Sending…' : 'Submit song'}
                      </GlassButton>
                    )}
                  </div>
                </GlassPanel>
              </form>
            </>
          )}
        </div>
      </div>

      <GlassModal open={dialog && !!result} onClose={() => setDialog(false)} title={result ? resultTitle(result) : ''}>
        {result && <ResultView result={result} onReset={reset} />}
      </GlassModal>
    </div>
  );
}
