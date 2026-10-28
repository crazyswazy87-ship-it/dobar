/**
 * Domain models for Doba.
 *
 * These mirror the Appwrite collections described in
 * src/services/appwrite/schema.ts, so moving between static files
 * and Appwrite does not change component contracts.
 */

export type DataSourceKind =
  | 'spotify-web-api'
  | 'manual-entry'
  | 'sample'
  | 'appwrite';

export interface DataSource {
  kind: DataSourceKind;
  label: string;
  /** ISO timestamp of the last time this value was refreshed. */
  updatedAt: string | null;
  note?: string;
}

export interface Playlist {
  id: string;
  slug: string;
  name: string;
  /** Short line shown on cards. */
  tagline: string;
  /** Longer description; null until written. */
  description: string | null;
  /** Image shown on playlist cards. */
  coverSrc: string;
  /** CSS object-position for the cover. */
  coverPosition?: string;

  /** Full Spotify playlist URL, copied from Spotify's Share menu. */
  spotifyUrl: string | null;

  /** Spotify playlist ID, used for embedded playback. */
  spotifyPlaylistId: string | null;

  genres: string[];

  /** Current follower count. Null means not yet known. */
  followers: number | null;
  followersSource: DataSource | null;

  /** Whether this playlist appears in featured sections. */
  featured: boolean;
}

export interface ArtistSocials {
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  x?: string;
}

export interface Artist {
  id: string;
  name: string;
  imageSrc: string;
  bio: string | null;
  tagline: string | null;
  spotifyUrl: string | null;
  socials: ArtistSocials;
  featured: boolean;
  /** Hex colour for the profile header gradient. Optional. */
  accent?: string;
  /** Shows the verified badge on the artist profile. Optional. */
  verified?: boolean;
}

export interface Track {
  id: string;
  title: string;
  artistId: string;
  coverSrc: string | null;

  /** Full Spotify track URL. */
  spotifyUrl: string | null;

  /** Spotify track ID, used for embedded playback. */
  spotifyTrackId: string | null;

  /** Local audio path, e.g. "/assets/audio/song.mp3". */
  audioSrc: string | null;

  playlistIds: string[];
  releaseDate: string | null;
  featured: boolean;

  /** Optional, shown on the artist profile song list. */
  durationSec?: number;
  /** Optional play count shown on the artist profile. */
  plays?: number;
}

/** One dated follower reading for one playlist. */
export interface PlaylistSnapshot {
  id: string;
  playlistId: string;
  /** ISO timestamp the reading was taken. */
  capturedAt: string;
  followers: number;
  source: DataSourceKind;
}

/** A verified placement of a song on a playlist. */
export interface Placement {
  id: string;
  artistId: string;
  trackId: string | null;
  playlistId: string;
  /** ISO date the song was added. */
  addedAt: string;
  verified: boolean;
  evidenceNote: string | null;
}

/** Only render testimonials when authorized is true. */
export interface Testimonial {
  id: string;
  artistId: string;
  quote: string;
  authorized: boolean;
}

export type SubmissionTier = 'free' | 'priority';

export type SubmissionStatus =
  | 'new'
  | 'in-review'
  | 'accepted'
  | 'declined'
  | 'needs-info';

export type ReleaseStatus = 'released' | 'unreleased' | 'scheduled';

export interface SubmissionInput {
  artistName: string;
  email: string;
  spotifyUrl: string;
  songTitle: string;
  genre: string;
  releaseStatus: ReleaseStatus;
  /** ISO date; only for scheduled or released tracks. */
  releaseDate: string;
  socialUrl: string;
  pitch: string;
  tier: SubmissionTier;
  acceptedTerms: boolean;
}

export interface Submission extends Omit<SubmissionInput, 'acceptedTerms'> {
  id: string;
  /** Stable hash used to block duplicates (email + Spotify track). */
  fingerprint: string;
  status: SubmissionStatus;
  internalNotes: string;
  createdAt: string;
  updatedAt: string;
}

/** Outcome of submitting. Never claim saved unless persisted is true. */
export type SubmitResult =
  | { status: 'stored'; persisted: true; id: string }
  | {
      status: 'handoff';
      persisted: false;
      id: string;
      channel: 'whatsapp' | 'email';
      url: string;
      message: string;
    }
  | { status: 'unavailable'; persisted: false; id: string; message: string }
  | { status: 'duplicate'; persisted: false; id: string }
  | { status: 'failed'; persisted: false; error: string };

/** One dated monthly-listener reading for one artist. */
export interface ListenerSnapshot {
  /** ISO timestamp the reading was taken. */
  capturedAt: string;
  listeners: number;
}

/** Listener stats for one artist, shown on the profile and in its Analytics view. */
export interface ArtistListenerStats {
  artistId: string;
  monthlyListeners: number;
  /** Unique listeners all-time, if tracked. */
  totalListeners: number | null;
  /** ISO date the artist joined Doba. */
  joinedAt: string;
  /** Monthly listeners when they joined, if recorded. */
  listenersAtJoin: number | null;
  /** ISO timestamp of the latest update. */
  updatedAt: string | null;
  /** Dated readings, oldest or newest first (sorted on read). */
  snapshots: ListenerSnapshot[];
}
