import type { SubmissionTier } from '../types';

/**
 * Everything business-specific that is NOT a secret lives here.
 * Edit this file to change contact channels, prices and option copy.
 */

const digits = (v?: string) => (v ?? '').replace(/[^\d]/g, '');

export const SITE = {
  name: 'Doba Music',
  short: 'Doba',
  eyebrow: 'DOBA MUSIC — INDEPENDENT ARTIST DISCOVERY',
  headline: 'YOUR MUSIC DESERVES TO BE DISCOVERED.',
  description:
    'Explore our playlists, discover the audience behind the music, and submit your next release for consideration.',
  contact: {
    whatsapp: digits(import.meta.env.VITE_DOBA_WHATSAPP),
    email: (import.meta.env.VITE_DOBA_EMAIL ?? '').trim(),
    instagram: (import.meta.env.VITE_DOBA_INSTAGRAM ?? '').trim().replace(/^@/, ''),
  },
} as const;

export interface TierConfig {
  id: SubmissionTier;
  enabled: boolean;
  name: string;
  /** null = no price set yet (never invent one). */
  price: number | null;
  currency: string;
  summary: string;
  includes: string[];
  disclaimers: string[];
}


export const TIERS: Record<SubmissionTier, TierConfig> = {
  free: {
    id: 'free',
    enabled: true,
    name: 'Free submission',
    price: 0,
    currency: 'KES',
    summary: 'Your song joins the standard review process.',
    includes: [
      'Standard review queue',
      'Considered for the playlists that fit your sound',
    ],
    disclaimers: [
      'No guaranteed placement.',
      'Not every submission can receive feedback.',
    ],
  },

  priority: {
    id: 'priority',
    enabled: true,
    name: 'Guaranteed playlist placement',
    /** Set your actual price before enabling paid submissions. */
    price: null,
    currency: 'KES',
    summary: 'Get your music added to a suitable playlist for one full month.',
    includes: [
      'Guaranteed playlist placement for 1 month',
      'Your music is added to the selected, suitable Doba playlist',
      'Priority handling of your submission',
      'Payment goes directly to Doba',
    ],
    disclaimers: [
      'Your song is guaranteed a spot on a Doba playlist for one full month, giving your music more time to be discovered. Actual streams, reach, and follower growth depend on listener engagement.',
    ],
  },
};


export function formatPrice(t: TierConfig): string {
  if (t.price === null) return 'Price confirmed after you submit';
  if (t.price === 0) return 'Free';
  return `${t.currency} ${t.price.toLocaleString('en-KE')}`;
}

export const GENRES = [
  'Genge',
  'Gengetone',
  'Kenyan Drill',
  'Hip Hop / Rap',
  'Afrobeats',
  'Amapiano',
  'Bongo Flava',
  'Benga / Folk',
  'Gospel',
  'R&B / Soul',
  'Dancehall / Reggae',
  'Pop',
  'Other',
] as const;

/**
 * Plain-language terms shown on the submission review step.
 * TODO(owner): review this wording (ideally with a lawyer) before launch.
 */
export const TERMS = [
  'I own, or have the right to submit, this song.',
  'Doba may listen to it and contact me at the email I provided.',
  'Submitting does not guarantee playlist placement, streams, or any other result.',
  'Priority review (if chosen) pays only for a faster review. Payment is arranged directly with Doba.',
] as const;
