import type {
  Artist,
  Placement,
  Playlist,
  PlaylistSnapshot,
  Submission,
  SubmissionInput,
  SubmissionStatus,
  SubmitResult,
  Testimonial,
  Track,
} from '../types';

/** Read-only content shown on the public website. */
export interface CatalogApi {
  listPlaylists(): Promise<Playlist[]>;
  getPlaylistBySlug(slug: string): Promise<Playlist | null>;
  listArtists(): Promise<Artist[]>;
  listTracks(): Promise<Track[]>;
  listPlacements(): Promise<Placement[]>;
  listTestimonials(): Promise<Testimonial[]>;
  /** Snapshots newest-last. Omit `playlistId` for all playlists. */
  listSnapshots(playlistId?: string): Promise<PlaylistSnapshot[]>;
}

export interface SubmissionPatch {
  status?: SubmissionStatus;
  internalNotes?: string;
}

export interface SubmissionsApi {
  /** Public: any visitor may create a submission. */
  submit(input: SubmissionInput): Promise<SubmitResult>;
  /** Admin only. Must be enforced SERVER-SIDE by the provider. */
  adminList(): Promise<Submission[]>;
  adminUpdate(id: string, patch: SubmissionPatch): Promise<Submission>;
}

export type AuthState =
  | { mode: 'unconfigured' }
  | { mode: 'signed-out' }
  | { mode: 'signed-in'; email: string; isAdmin: boolean };

export interface AuthApi {
  getState(): Promise<AuthState>;
  signIn(email: string, password: string): Promise<AuthState>;
  signOut(): Promise<AuthState>;
}

export interface ProviderCapabilities {
  /** True only when a real backend stores data and enforces admin permissions. */
  hasBackend: boolean;
  /** Admin can edit playlists/placements/snapshots from the UI (needs a backend). */
  canEditCatalog: boolean;
}

export interface DataProvider {
  id: 'static' | 'appwrite';
  capabilities: ProviderCapabilities;
  catalog: CatalogApi;
  submissions: SubmissionsApi;
  auth: AuthApi;
}

export class NotConfiguredError extends Error {
  constructor(what: string) {
    super(`${what} is not configured yet.`);
    this.name = 'NotConfiguredError';
  }
}
