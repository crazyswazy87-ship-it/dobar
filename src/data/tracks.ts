import type { Track } from '../types';

/**
 * YOUR SONGS — add them here. This list is empty on purpose (nothing is invented).
 *
 * To add a song:
 *  1. (Optional) put the audio in  public/assets/audio/  and the cover in  public/assets/images/
 *  2. Add an entry below. `artistId` must match an `id` in artists.ts,
 *     and `playlistIds` must match ids in playlists.ts.
 *
 * You can use a Spotify link (embedded player), a local audio file
 * (built-in player), or both:
 *
 *   {
 *     id: 'trk-example',
 *     title: 'Song name',
 *     artistId: 'toxic-lyrikali',
 *     coverSrc: '/assets/images/manat.jpg',
 *     spotifyUrl: 'https://open.spotify.com/track/XXXXXXXXXXXXXXXXXXXXXX',
 *     spotifyTrackId: 'XXXXXXXXXXXXXXXXXXXXXX',
 *     audioSrc: '/assets/audio/song-name.mp3',
 *     playlistIds: ['pl-mboka-doba'],
 *     releaseDate: '2026-05-01',
 *     featured: true,
 *     durationSec: 175,   // optional, shown on the artist profile
 *     plays: 4199,        // optional, shown on the artist profile
 *   }
 */
export const TRACKS: Track[] = [];
