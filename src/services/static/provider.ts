import { ARTISTS } from '../../data/artists';
import { PLACEMENTS } from '../../data/placements';
import { PLAYLISTS } from '../../data/playlists';
import { SNAPSHOTS } from '../../data/snapshots';
import { TESTIMONIALS } from '../../data/testimonials';
import { TRACKS } from '../../data/tracks';
import { SITE } from '../../config/site';
import { fnv1a } from '../../lib/format';
import { parseSpotifyTrackId } from '../../lib/spotify';
import type { Submission, SubmissionInput, SubmitResult } from '../../types';
import type { CatalogApi, DataProvider, SubmissionPatch } from '../contracts';

/**
 * STATIC PROVIDER — used today (no database).
 *
 *  • Catalog: reads the typed files in src/data.
 *  • Submissions: there is no server, so nothing is "stored". We keep a copy in
 *    THIS browser only (to block accidental duplicates and to preview the admin
 *    studio in development) and hand the details to WhatsApp/email for the artist
 *    to send. The UI is told `persisted: false` and never claims it was saved.
 *  • Auth: unconfigured — real admin protection needs a backend.
 */

const KEY = 'doba:local-submissions:v1';

const readLocal = (): Submission[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Submission[]) : [];
  } catch {
    return [];
  }
};

const writeLocal = (list: Submission[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage full or blocked: the hand-off still works */
  }
};

export const fingerprintOf = (i: Pick<SubmissionInput, 'email' | 'spotifyUrl'>) =>
  fnv1a(`${i.email.trim().toLowerCase()}|${parseSpotifyTrackId(i.spotifyUrl) ?? i.spotifyUrl.trim()}`);

export function composeMessage(s: Submission): string {
  const lines = [
    `New Doba submission (${s.tier === 'priority' ? 'PRIORITY review' : 'Free submission'})`,
    `Artist: ${s.artistName}`,
    `Song: ${s.songTitle}`,
    `Spotify: ${s.spotifyUrl}`,
    `Genre: ${s.genre}`,
    `Release: ${s.releaseStatus}${s.releaseDate ? ` (${s.releaseDate})` : ''}`,
    `Email: ${s.email}`,
  ];
  if (s.socialUrl) lines.push(`Social: ${s.socialUrl}`);
  if (s.pitch) lines.push(`Pitch: ${s.pitch}`);
  lines.push(`Ref: ${s.id}`);
  return lines.join('\n');
}

const catalog: CatalogApi = {
  listPlaylists: async () => PLAYLISTS,
  getPlaylistBySlug: async (slug) => PLAYLISTS.find((p) => p.slug === slug) ?? null,
  listArtists: async () => ARTISTS,
  listTracks: async () => TRACKS,
  listPlacements: async () => PLACEMENTS,
  listTestimonials: async () => TESTIMONIALS.filter((t) => t.authorized),
  listSnapshots: async (playlistId) =>
    SNAPSHOTS.filter((s) => !playlistId || s.playlistId === playlistId).sort((a, b) =>
      a.capturedAt.localeCompare(b.capturedAt)
    ),
};

export function createStaticProvider(): DataProvider {
  return {
    id: 'static',
    capabilities: { hasBackend: false, canEditCatalog: false },
    catalog,
    submissions: {
      async submit(input): Promise<SubmitResult> {
        try {
          const fingerprint = fingerprintOf(input);
          const existing = readLocal();
          const dup = existing.find((s) => s.fingerprint === fingerprint);
          if (dup) return { status: 'duplicate', persisted: false, id: dup.id };

          const now = new Date().toISOString();
          const { acceptedTerms: _ignored, ...rest } = input;
          void _ignored;
          const submission: Submission = {
            ...rest,
            artistName: input.artistName.trim(),
            email: input.email.trim(),
            songTitle: input.songTitle.trim(),
            spotifyUrl: input.spotifyUrl.trim(),
            socialUrl: input.socialUrl.trim(),
            pitch: input.pitch.trim(),
            id: `sub-${fingerprint}-${Date.now().toString(36)}`,
            fingerprint,
            status: 'new',
            internalNotes: '',
            createdAt: now,
            updatedAt: now,
          };
          writeLocal([submission, ...existing]);

          const message = composeMessage(submission);
          const { whatsapp, email } = SITE.contact;
          if (whatsapp)
            return {
              status: 'handoff',
              persisted: false,
              id: submission.id,
              channel: 'whatsapp',
              url: `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`,
              message,
            };
          if (email)
            return {
              status: 'handoff',
              persisted: false,
              id: submission.id,
              channel: 'email',
              url: `mailto:${email}?subject=${encodeURIComponent(
                `Doba submission: ${submission.songTitle} — ${submission.artistName}`
              )}&body=${encodeURIComponent(message)}`,
              message,
            };
          return {
            status: 'unavailable',
            persisted: false,
            id: submission.id,
            message,
          };
        } catch (err) {
          return { status: 'failed', persisted: false, error: err instanceof Error ? err.message : 'Unknown error' };
        }
      },

      adminList: async () => readLocal(),

      async adminUpdate(id: string, patch: SubmissionPatch) {
        const list = readLocal();
        const i = list.findIndex((s) => s.id === id);
        if (i < 0) throw new Error('Submission not found');
        const updated: Submission = { ...list[i], ...patch, updatedAt: new Date().toISOString() };
        list[i] = updated;
        writeLocal(list);
        return updated;
      },
    },
    auth: {
      getState: async () => ({ mode: 'unconfigured' }),
      signIn: async () => ({ mode: 'unconfigured' }),
      signOut: async () => ({ mode: 'unconfigured' }),
    },
  };
}
