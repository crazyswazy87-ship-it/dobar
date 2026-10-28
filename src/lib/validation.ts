import type { SubmissionInput } from '../types';
import { parseSpotifyTrackId } from './spotify';

export type FieldErrors = Partial<Record<keyof SubmissionInput, string>>;

export const EMPTY_INPUT: SubmissionInput = {
  artistName: '',
  email: '',
  spotifyUrl: '',
  songTitle: '',
  genre: '',
  releaseStatus: 'released',
  releaseDate: '',
  socialUrl: '',
  pitch: '',
  tier: 'free',
  acceptedTerms: false,
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PITCH_MAX = 600;

export function validateTrackStep(v: SubmissionInput): FieldErrors {
  const e: FieldErrors = {};
  if (v.artistName.trim().length < 2) e.artistName = 'Enter your artist name.';
  if (!EMAIL.test(v.email.trim())) e.email = 'Enter a valid email so we can reach you.';
  if (v.songTitle.trim().length < 1) e.songTitle = 'Enter the song title.';
  if (!parseSpotifyTrackId(v.spotifyUrl))
    e.spotifyUrl = 'Paste a Spotify track link, like https://open.spotify.com/track/…';
  if (!v.genre) e.genre = 'Choose the closest genre.';
  if (v.releaseStatus !== 'unreleased' && !v.releaseDate) e.releaseDate = 'Add the release date.';
  return e;
}

export function validateDetailsStep(v: SubmissionInput): FieldErrors {
  const e: FieldErrors = {};
  const social = v.socialUrl.trim();
  if (social) {
    try {
      const u = new URL(social.startsWith('http') ? social : `https://${social}`);
      if (!u.hostname.includes('.')) throw new Error();
    } catch {
      e.socialUrl = 'Enter a valid link, like instagram.com/yourname.';
    }
  }
  if (v.pitch.length > PITCH_MAX) e.pitch = `Keep your pitch under ${PITCH_MAX} characters.`;
  return e;
}

export function validateReviewStep(v: SubmissionInput): FieldErrors {
  const e: FieldErrors = {};
  if (!v.acceptedTerms) e.acceptedTerms = 'Please confirm to continue.';
  return e;
}

export const validateAll = (v: SubmissionInput): FieldErrors => ({
  ...validateTrackStep(v),
  ...validateDetailsStep(v),
  ...validateReviewStep(v),
});
