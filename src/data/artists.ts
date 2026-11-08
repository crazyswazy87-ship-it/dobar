
import type { Artist } from '../types';

type ArtistLinks = {
  spotifyUrl?: string | null;
  youtubeUrl?: string | null;
  appleMusicUrl?: string | null;
  socials?: Artist['socials'];
};

const a = (
  id: string,
  name: string,
  imageSrc: string,
  tagline: string | null = null,
  featured = true,
  links: ArtistLinks = {}
): Artist => ({
  id,
  name,
  imageSrc,
  bio: null,
  tagline,

  spotifyUrl: links.spotifyUrl ?? null,
  appleMusicUrl: links.appleMusicUrl ?? null,

  socials: {
    ...links.socials,
    youtube: links.youtubeUrl ?? links.socials?.youtube,
  },

  featured,
});

export const ARTISTS: Artist[] = [
  a('dyana-cods', 'Dyana Cods', '/assets/images/codds.jpg', null, true, {
    spotifyUrl: 'https://open.spotify.com/artist/1TMFrPAmqxTK5rVS8ujqMR?si=hZ876IXHT7u7soLnpC6ZEQ',
    youtubeUrl: 'https://youtube.com/@thedyanacods?si=ug4SCWI7ZQc9mhKP',
    appleMusicUrl: 'https://music.apple.com/ke/artist/dyana-cods/1713436650',
  }),

  a('cosign-black', 'Cosign Black', '/assets/images/cosignblack.jpg', null, true, {
    spotifyUrl: 'https://open.spotify.com/artist/4nxqNYiBaijuEs9xjwEFrz?si=JOeYSj82Qu2zSQ19YyaT1w',
    youtubeUrl: 'https://youtube.com/@cosignblack?si=ppTF6vMoaWd0Wtg6',
    appleMusicUrl: 'https://music.apple.com/ke/artist/cosign-black/1641225924',
  }),

  a('virusi-mbaya', 'Virusi Mbaya', '/assets/images/carzyv.png', null, true, {
    spotifyUrl: 'https://open.spotify.com/artist/7uKGDfPXV6j016BRQlLBZq?si=5qKORJ2pTsKU0b_o1eaQIQ',
    youtubeUrl: 'https://youtube.com/@virusimbaya?si=VoZwEwYgzFCWhYVC',
    appleMusicUrl: 'https://music.apple.com/ke/artist/virusi-mbaya/1525380007',
  }),

  a('sewersydaa-mkadinali', 'Sewersydaa Mkadinali', '/assets/images/img-05.jpg', null, true, {
    spotifyUrl: 'https://open.spotify.com/artist/22QTuSGYc0Yt7anJ6dfWW9?si=nStCLZJeQdm5evlNJTTe6A',
    youtubeUrl: 'https://youtube.com/@scarmkadinali1?si=MNOUOFRJPq3rA0Df',
    appleMusicUrl: 'https://music.apple.com/ke/artist/sewersydaa/1655371326',
  }),

  a('mejja-genge', 'Mejja Genge', '/assets/images/img-11.jpg', null, true, {
    spotifyUrl: 'https://open.spotify.com/artist/5VnDOE1MEaJ0VOgSypOi3u?si=PzXjlAGLTKGQVN2ROHIY1A',
    youtubeUrl: 'https://youtube.com/@mejjagenge_official?si=MwoBa1Jxp0p1_ELm',
    appleMusicUrl: 'https://music.apple.com/ke/artist/mejja/979606924',
  }),

  a('little-maina', 'Little Maina', '/assets/images/lilmaina.jpg', null, true, {
    spotifyUrl: 'https://open.spotify.com/artist/1GF4G0q7pW65JWvuKWKDzv?si=bGs6Y5EgS0G0xIjDJA4ZNw',
    youtubeUrl: 'https://youtube.com/@lilmainastunna?si=3kQm5u1pJb7r0En_',
    appleMusicUrl: 'https://music.apple.com/ke/artist/lilmaina/1534272288',
  }),

  a('toxic-lyrikali', 'Toxic Lyrikali', '/assets/images/manat.jpg', null, true, {
    spotifyUrl: 'https://open.spotify.com/artist/53nMUZwbwGd2cdY8P8EsHD?si=c9lQo5JqT0-kzo0g0S0gKA',
    youtubeUrl: 'https://youtube.com/@mbokadoba?si=-UAioz4SrqKV55UJ',
    appleMusicUrl: 'https://music.apple.com/ke/artist/toxic-lyrikali/1667118048',
  }),

  a('metro-stunna', 'Metro Stunna', '/assets/images/metro.webp', null, true, {
    spotifyUrl: 'https://open.spotify.com/artist/5ye0OD76QHm0hKFg1QRWy9?si=5_isylSdTE2Lq4_A8rcJMg',
    youtubeUrl: null,
    appleMusicUrl: 'https://music.apple.com/ke/artist/metro-stunna/1776032428',
  }),

  a('moti-the-nrg', 'Moti The NRG', '/assets/images/moti.jpg', null, true, {
    spotifyUrl: 'https://open.spotify.com/artist/6sDVFYZNKm4ptJrKaJo2CI?si=MsQQ7eErTeqfscv6NH1JxA',
    youtubeUrl: 'https://youtube.com/@motithenrgmusic161?si=0KvoAoiDtGqObUyY',
    appleMusicUrl: 'https://music.apple.com/ke/artist/moti-the-nrg/1656979712',
  }),

  a('domani-munga', 'Domani Munga', '/assets/images/munga.jpg', null, true, {
    spotifyUrl: 'https://open.spotify.com/artist/5QzkdCjCrO3OpfLTHvqnNb?si=kCasDne_TvKvAhOLvb8XJw',
    youtubeUrl: 'https://youtube.com/@domanimkadinali5297?si=3ST7KpQlp97dyxoJ',
    appleMusicUrl: 'https://music.apple.com/ke/artist/domani-munga/1479489895',
  }),

  a('only-moh', 'Only Moh 34 Brick', '/assets/images/onlymoh.jpg', null, true, {
    spotifyUrl: 'https://open.spotify.com/artist/149Vvknd1wqjE0cEPgW8TK?si=PQrlTP5WTlqed0oc0Sx8xA',
    youtubeUrl: 'https://youtube.com/@onlymoh34?si=odB3FtZjm_BIs1-X',
    appleMusicUrl: 'https://music.apple.com/ke/artist/onlymoh/1755757349',
  }),

  a('scar-mkadinali', 'Scar Mkadinali', '/assets/images/scar.jpg', null, true, {
    spotifyUrl: 'https://open.spotify.com/artist/61npyqrvQo2AGnjNqIV6E7?si=dSPrJNNGQsWuvIa1gD7Vmw',
    youtubeUrl: 'https://youtube.com/@scarmkadinali1?si=lgmvvNx0H-KUpc3R',
    appleMusicUrl: 'https://music.apple.com/ke/artist/scar-mkadinali/1450233825',
  }),

  a('sylvia-ssaru', 'Sylvia Ssaru', '/assets/images/ssaru.jpg', null, true, {
    spotifyUrl: 'https://open.spotify.com/artist/1ARD1FbyU6v65XIlpYLbMW?si=OKyrzvVcT9i9M8UbqWBYlQ',
    youtubeUrl: 'https://youtube.com/@sylvia_saru?si=gfFiPL_0bWW7lpSi',
    appleMusicUrl: 'https://music.apple.com/ke/artist/ssaru/1491367131',
  }),

  a('original-zula', 'Original Zula', '/assets/images/zula.webp', null, true, {
    spotifyUrl: 'https://open.spotify.com/artist/12SPFnH2gJwVRLl6e9WqFh?si=rCdFytqgRbegQ5NdIEcySg',
    youtubeUrl: 'https://youtube.com/@originalzula?si=svCe49qxq2UHX9ps',
    appleMusicUrl: 'https://music.apple.com/ke/artist/original-zula/6801199696',
  }),

  a('zzero-sufuri', 'Zzero Sufuri', '/assets/images/zzero.jpg', null, true, {
    spotifyUrl: 'https://open.spotify.com/artist/46LcXz6xUVZWnQILSNgLT7?si=8w17ZUYMQDCJh24juk0M4Q',
    youtubeUrl: 'https://youtube.com/@sofiyanzau?si=VBmvbNAu2b1a3LiR',
    appleMusicUrl: 'https://music.apple.com/ke/artist/zzero-sufuri/1463223194',
  }),

  a('sofiya-nzau', 'Sofiya Nzau', '/assets/images/nzau.jpg', null, true, {
    spotifyUrl: 'https://open.spotify.com/artist/5Y2FS5YbGf7yRDumzD5nY3?si=dIaevR7YSta1rMkLvwXuuw',
    youtubeUrl: 'https://youtube.com/@sofiyanzau?si=OW0JR8yVT8neAAzE',
    appleMusicUrl: 'https://music.apple.com/ke/artist/sofiya-nzau/1607473541',
  }),

  a('maandy', 'Maandy', '/assets/images/maandy.jpg', null, true, {
    spotifyUrl: 'https://open.spotify.com/artist/3AaXIAk5OkIRmHnoEP4XmP?si=v3lRphh9TYSEjAZJulX9LQ',
    youtubeUrl: 'https://youtube.com/@maandy?si=uvKaMSbg3I-oMDzi',
    appleMusicUrl: 'https://music.apple.com/ke/artist/maandy/1490696206',
  }),

  a('mykey lb', 'Mykey Lb', '/assets/featured/mykeylb.png', null, true, {
    spotifyUrl: 'https://open.spotify.com/artist/7f9Zy1eWs21mrCBCtwjRzN?si=wm5tOwEyRkG3h-AdB0UHXQ',
    youtubeUrl: 'https://youtube.com/@mykey_lb?si=eOz-dJ_quY8EJRWj',
    appleMusicUrl: 'https://music.apple.com/ke/artist/mykey-lb/1802657204',
  }),

  a('tgl', 'Tgl', '/assets/featured/tgl.png', null, true, {
    spotifyUrl: 'https://open.spotify.com/artist/4an9kHDmaS2lOMyoYMesbL?si=3j1kjINSSh-hgN6ehqyiEg',
    youtubeUrl: 'https://youtube.com/@teamgoodlifeny031?si=QgLRn7EDnFdprmoX',
    appleMusicUrl: null,
  }),
];
