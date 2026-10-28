/**
 * APPWRITE DATABASE BLUEPRINT (not connected yet).
 *
 * Create one Database, then these collections with these attributes. Each one
 * maps 1:1 to a type in src/types/index.ts, and mappers.ts converts documents
 * to those types.
 *
 * PERMISSIONS (this is what makes the admin studio secure — the browser is never trusted):
 *   • Create a Team called "admins" and add yourself.
 *   • playlists, artists, tracks, placements, testimonials, playlist_snapshots:
 *       read   → role:any          (public website)
 *       create/update/delete → team:admins
 *   • submissions (document security ON):
 *       create → role:any   (so artists can submit without an account)
 *       read/update/delete → team:admins ONLY
 *     Add an `unique` index on `fingerprint` so duplicates are rejected server-side.
 */

export type AttrType = 'string' | 'integer' | 'boolean' | 'datetime' | 'enum' | 'url' | 'email';

export interface AttrDef {
  key: string;
  type: AttrType;
  size?: number;
  required: boolean;
  array?: boolean;
  elements?: readonly string[];
  default?: string | number | boolean | null;
}

export interface IndexDef {
  key: string;
  type: 'key' | 'unique' | 'fulltext';
  attributes: readonly string[];
}

export interface CollectionDef {
  id: string;
  name: string;
  readAccess: 'public' | 'admins';
  writeAccess: 'admins' | 'public-create';
  attributes: readonly AttrDef[];
  indexes: readonly IndexDef[];
}

const s = (key: string, size: number, required = false, extra: Partial<AttrDef> = {}): AttrDef => ({
  key,
  type: 'string',
  size,
  required,
  ...extra,
});

export const COLLECTIONS = {
  playlists: {
    id: 'playlists',
    name: 'Playlists',
    readAccess: 'public',
    writeAccess: 'admins',
    attributes: [
      s('slug', 80, true),
      s('name', 120, true),
      s('tagline', 200, true),
      s('description', 2000),
      s('coverSrc', 500, true),
      s('coverPosition', 40),
      { key: 'spotifyUrl', type: 'url', size: 500, required: false },
      s('spotifyPlaylistId', 40),
      s('genres', 60, false, { array: true }),
      { key: 'followers', type: 'integer', required: false },
      s('followersSourceKind', 30),
      s('followersSourceLabel', 120),
      { key: 'followersUpdatedAt', type: 'datetime', required: false },
      { key: 'featured', type: 'boolean', required: false, default: false },
    ],
    indexes: [{ key: 'slug_unique', type: 'unique', attributes: ['slug'] }],
  },
  artists: {
    id: 'artists',
    name: 'Artists',
    readAccess: 'public',
    writeAccess: 'admins',
    attributes: [
      s('name', 120, true),
      s('imageSrc', 500, true),
      s('bio', 2000),
      s('tagline', 200),
      { key: 'spotifyUrl', type: 'url', size: 500, required: false },
      s('socialsJson', 1000),
      { key: 'featured', type: 'boolean', required: false, default: false },
    ],
    indexes: [{ key: 'name_search', type: 'fulltext', attributes: ['name'] }],
  },
  tracks: {
    id: 'tracks',
    name: 'Tracks',
    readAccess: 'public',
    writeAccess: 'admins',
    attributes: [
      s('title', 200, true),
      s('artistId', 64, true),
      s('coverSrc', 500),
      { key: 'spotifyUrl', type: 'url', size: 500, required: false },
      s('spotifyTrackId', 40),
      s('audioSrc', 500),
      s('playlistIds', 64, false, { array: true }),
      { key: 'releaseDate', type: 'datetime', required: false },
      { key: 'featured', type: 'boolean', required: false, default: false },
    ],
    indexes: [{ key: 'artist', type: 'key', attributes: ['artistId'] }],
  },
  playlist_snapshots: {
    id: 'playlist_snapshots',
    name: 'Playlist snapshots',
    readAccess: 'public',
    writeAccess: 'admins',
    attributes: [
      s('playlistId', 64, true),
      { key: 'capturedAt', type: 'datetime', required: true },
      { key: 'followers', type: 'integer', required: true },
      { key: 'source', type: 'enum', required: true, elements: ['spotify-web-api', 'manual-entry', 'appwrite'] },
    ],
    indexes: [{ key: 'playlist_time', type: 'key', attributes: ['playlistId', 'capturedAt'] }],
  },
  placements: {
    id: 'placements',
    name: 'Placements',
    readAccess: 'public',
    writeAccess: 'admins',
    attributes: [
      s('artistId', 64, true),
      s('trackId', 64),
      s('playlistId', 64, true),
      { key: 'addedAt', type: 'datetime', required: true },
      { key: 'verified', type: 'boolean', required: true },
      s('evidenceNote', 500),
    ],
    indexes: [{ key: 'playlist', type: 'key', attributes: ['playlistId'] }],
  },
  testimonials: {
    id: 'testimonials',
    name: 'Testimonials',
    readAccess: 'public',
    writeAccess: 'admins',
    attributes: [
      s('artistId', 64, true),
      s('quote', 600, true),
      { key: 'authorized', type: 'boolean', required: true },
    ],
    indexes: [],
  },
  submissions: {
    id: 'submissions',
    name: 'Submissions',
    readAccess: 'admins',
    writeAccess: 'public-create',
    attributes: [
      s('fingerprint', 16, true),
      s('artistName', 120, true),
      { key: 'email', type: 'email', size: 254, required: true },
      { key: 'spotifyUrl', type: 'url', size: 500, required: true },
      s('songTitle', 200, true),
      s('genre', 60, true),
      { key: 'releaseStatus', type: 'enum', required: true, elements: ['released', 'unreleased', 'scheduled'] },
      s('releaseDate', 20),
      s('socialUrl', 500),
      s('pitch', 600),
      { key: 'tier', type: 'enum', required: true, elements: ['free', 'priority'] },
      {
        key: 'status',
        type: 'enum',
        required: true,
        elements: ['new', 'in-review', 'accepted', 'declined', 'needs-info'],
        default: 'new',
      },
      s('internalNotes', 4000),
    ],
    indexes: [
      { key: 'fingerprint_unique', type: 'unique', attributes: ['fingerprint'] },
      { key: 'status', type: 'key', attributes: ['status'] },
    ],
  },
} as const satisfies Record<string, CollectionDef>;

export type CollectionId = keyof typeof COLLECTIONS;

export const APPWRITE_ENV = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT ?? '',
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID ?? '',
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID ?? '',
};

export const isAppwriteConfigured = () =>
  Boolean(APPWRITE_ENV.endpoint && APPWRITE_ENV.projectId && APPWRITE_ENV.databaseId);
