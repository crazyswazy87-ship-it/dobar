const ID = '[0-9A-Za-z]{22}';

/** Extracts the 22-character track ID from a Spotify track link or URI. */
export function parseSpotifyTrackId(input: string): string | null {
  const v = input.trim();
  const uri = v.match(new RegExp(`^spotify:track:(${ID})$`));
  if (uri) return uri[1];
  try {
    const url = new URL(v);
    if (url.protocol !== 'https:' || url.hostname !== 'open.spotify.com') return null;
    const m = url.pathname.match(new RegExp(`^/(?:intl-[a-z-]+/)?track/(${ID})/?$`, 'i'));
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

export const spotifyEmbedUrl = (kind: 'track' | 'playlist', id: string) =>
  `https://open.spotify.com/embed/${kind}/${id}?utm_source=generator`;
