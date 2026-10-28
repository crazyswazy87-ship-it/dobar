import type { Playlist, Submission, SubmissionInput } from '../../types';

/** Appwrite adds these to every document. */
export interface AwDoc {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}

type Raw = AwDoc & Record<string, unknown>;

const str = (v: unknown, fallback = ''): string => (typeof v === 'string' ? v : fallback);
const strOrNull = (v: unknown): string | null => (typeof v === 'string' && v ? v : null);

export function playlistFromDoc(d: Raw): Playlist {
  return {
    id: d.$id,
    slug: str(d.slug),
    name: str(d.name),
    tagline: str(d.tagline),
    description: strOrNull(d.description),
    coverSrc: str(d.coverSrc),
    coverPosition: strOrNull(d.coverPosition) ?? undefined,
    spotifyUrl: strOrNull(d.spotifyUrl),
    spotifyPlaylistId: strOrNull(d.spotifyPlaylistId),
    genres: Array.isArray(d.genres) ? (d.genres as string[]) : [],
    followers: typeof d.followers === 'number' ? d.followers : null,
    followersSource: d.followersSourceKind
      ? {
          kind: d.followersSourceKind as 'spotify-web-api' | 'manual-entry' | 'appwrite',
          label: str(d.followersSourceLabel, 'Doba'),
          updatedAt: strOrNull(d.followersUpdatedAt),
        }
      : null,
    featured: d.featured === true,
  };
}

/** Document body for `databases.createDocument('submissions', …)`. */
export function submissionToDocData(
  input: SubmissionInput,
  fingerprint: string
): Record<string, unknown> {
  const { acceptedTerms, ...rest } = input;
  void acceptedTerms;
  return { ...rest, fingerprint, status: 'new', internalNotes: '' };
}

export function submissionFromDoc(d: Raw): Submission {
  return {
    id: d.$id,
    fingerprint: str(d.fingerprint),
    artistName: str(d.artistName),
    email: str(d.email),
    spotifyUrl: str(d.spotifyUrl),
    songTitle: str(d.songTitle),
    genre: str(d.genre),
    releaseStatus: (str(d.releaseStatus, 'released') as Submission['releaseStatus']),
    releaseDate: str(d.releaseDate),
    socialUrl: str(d.socialUrl),
    pitch: str(d.pitch),
    tier: str(d.tier, 'free') as Submission['tier'],
    status: str(d.status, 'new') as Submission['status'],
    internalNotes: str(d.internalNotes),
    createdAt: d.$createdAt,
    updatedAt: d.$updatedAt,
  };
}
