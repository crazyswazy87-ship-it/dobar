import type { Playlist } from '../types';

/**
 * DOBA PLAYLIST CATALOG
 *
 * Add each playlist's real Spotify URL in the spotifyUrl field.
 * spotifyPlaylistId is derived automatically from that URL.
 *
 * To get a link:
 * Spotify → open playlist → Share → Copy link to playlist.
 */

const TOP = 'center top';

function createPlaylist(
  playlist: Omit<Playlist, 'spotifyPlaylistId'> & {
    spotifyPlaylistId?: string | null;
  },
): Playlist {
  const spotifyUrl = playlist.spotifyUrl?.trim() || null;

  const match = spotifyUrl?.match(
    /open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)/,
  );

  return {
    ...playlist,
    spotifyUrl,
    spotifyPlaylistId:
      match?.[1] ?? playlist.spotifyPlaylistId ?? null,
  };
}

const base = {
  description: null,
  spotifyUrl: null as string | null,
  spotifyPlaylistId: null as string | null,
  genres: [] as string[],
  followers: null,
  followersSource: null,
  coverPosition: TOP,
};

export const PLAYLISTS: Playlist[] = [
  createPlaylist({
    ...base,
    id: 'pl-kenyan-hits',
    slug: 'kenyan-hits',
    name: 'Kenyan Hits',
    tagline: "Get featured alongside Kenya's biggest sounds.",
    coverSrc: '/assets/playlists/kenyanhits.jpg',
    spotifyUrl: `https://open.spotify.com/playlist/0EqOvlPjXnWCXULExlmp6x?si=0BCGeLTTQ2yhJ33EE1QRig`,
    featured: false,
  }),
  createPlaylist({
    ...base,
    id: 'pl-mejja',
    slug: 'mejja-okwonko',
    name: 'Mejja Okwonko',
    tagline: 'Get your song featured where Kenyan listeners are.',
    coverSrc: '/assets/playlists/mejja.jpg',
    spotifyUrl: `https://open.spotify.com/playlist/4WkyzAyrhvRzWuIzVmMVoH?si=KI0i7S9uReGoyiSRxW7asA`,
    featured: true,
  }),
  createPlaylist({
    ...base,
    id: 'pl-mboka-doba',
    slug: 'toxic-lyrikali',
    name: 'Toxic Lyrikali',
    tagline: 'Put your music in front of more Kenyan listeners.',
    coverSrc: '/assets/playlists/mbokadoba.jpg',
    spotifyUrl: `https://open.spotify.com/playlist/1rDHJnbgJD989heRy6UMhs?si=fffNUQtGRDWQDPLJJ48lwg`,
    featured: true,
  }),
    createPlaylist({
    ...base,
    id: 'pl-kapitani',
    slug: 'kapitani',
    name: 'Kapitani',
    tagline: 'Put your sound in front of listeners across Kenya.',
    coverSrc: '/assets/playlists/kapitani.png',
    spotifyUrl: `https://open.spotify.com/playlist/7fDZJRv0znucNAzpLnqKh2?si=Svq3HNteRUaZs7ncY9AtRA`,
    featured: false,
  }),
  createPlaylist({
    ...base,
    id: 'pl-nganya',
    slug: 'nganya-mixtape',
    name: 'Nganya Mixtape',
    tagline: 'Get your track heard by the Kenyan music crowd.',
    coverSrc: '/assets/playlists/nganya.jpg',
    spotifyUrl: `https://open.spotify.com/playlist/0hVxCXYTd6dg1ZotPQp0bD?si=y5A_Ubg7Twu7KvHFFwRJrw`,
    featured: true,
  }),
  createPlaylist({
    ...base,
    id: 'pl-nzau',
    slug: 'sofia-nzau',
    name: 'Sofia Nzau',
    tagline: 'Get featured and put your sound on the map.',
    coverSrc: '/assets/playlists/nzau.jpg',
    spotifyUrl: null, // Paste Sofia Nzau playlist URL here.
    featured: true,
  }),
  createPlaylist({
    ...base,
    id: 'pl-onlymoh',
    slug: 'onlymoh',
    name: 'OnlyMoh',
    tagline: 'Give your music a chance to reach new listeners.',
    coverSrc: '/assets/playlists/onlymoh.jpg',
    spotifyUrl: `https://open.spotify.com/playlist/5EIl4fetTUjfShtnq2RwLb?si=LO2OHqodR_emaZcopMDY6Q`,
    featured: true,
  }),
    createPlaylist({
    ...base,
    id: 'pl-nikita-kering',
    slug: 'nikita-kering',
    name: 'Nikita Kering',
    tagline: 'Get your music heard by a new audience.',
    coverSrc: '/assets/playlists/kering.jpg',
    spotifyUrl: `https://open.spotify.com/playlist/1LzpEL4odBIjX3vL0FZ2f5?si=rKEmzhdSQfyU7znJOJGkAw`,
    featured: true,
  }),
  createPlaylist({
    ...base,
    id: 'pl-moti-nrg',
    slug: 'moti-the-nrg',
    name: 'Moti The NRG',
    tagline: 'Get your next release in front of fresh ears.',
    coverSrc: '/assets/playlists/motinrg.jpg',
    spotifyUrl: `https://open.spotify.com/playlist/6TNBKol5KIWyxGZID1l63V?si=7mH4iQz6R5-NXXwVKQuPmw`,
    featured: false,
  }),
    createPlaylist({
    ...base,
    id: 'pl-virusi-mbaya',
    slug: 'virusi-mbaya',
    name: 'Virusi Mbaya',
    tagline: "Get featured alongside Kenya's biggest sounds.",
    coverSrc: '/assets/playlists/kenyanhits.jpg',
    spotifyUrl:`https://open.spotify.com/playlist/6z0Acw6JNB6SdvTE1NCbhU?si=rgTxOmWdTwOPQtu_estrMg`,
    featured: false,
  }),
  createPlaylist({
    ...base,
    id: 'pl-bedroom-jams',
    slug: 'bedroom-jams',
    name: 'Bedroom Jams',
    tagline: 'Take your music from your bedroom to new listeners.',
    coverSrc: '/assets/playlists/bedroom.jpg',
    spotifyUrl:`https://open.spotify.com/playlist/3pDyWTAghHjyvq7nAQlIsC?si=sh2QeqeBQJ-1wrreKOOteQ`,
    featured: false,
  }),
  createPlaylist({
    ...base,
    id: 'pl-cosign-black',
    slug: 'cosign-black',
    name: 'Cosign Black',
    tagline: 'Get your music a cosign from a new audience.',
    coverSrc: '/assets/playlists/cosign.jpg',
    spotifyUrl: `https://open.spotify.com/playlist/0YG3GClosYLCP68MTVkuVK?si=cSWYaP4mTg2zUF47LZndcA`,
    featured: false,
  }),
  createPlaylist({
    ...base,
    id: 'pl-gonga-utat',
    slug: 'gonga-utat',
    name: 'Gonga Utat',
    tagline: 'Put your sound in front of listeners across Kenya.',
    coverSrc: '/assets/playlists/gongautat.jpg',
    spotifyUrl: `https://open.spotify.com/playlist/4WsEKKu8Mau8lrqoIGfC9v?si=fqy72c21SQaKRf9EsToosw`,
    featured: false,
  }),
];
