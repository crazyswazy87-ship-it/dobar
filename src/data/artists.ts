import type { Artist } from '../types';

/**
 * ARTISTS — names and photos come from your existing "Featured Artists"
 * sphere. Add `bio`, `spotifyUrl` and `socials` as you collect them;
 * empty fields are simply not shown.
 */

const a = (
  id: string,
  name: string,
  imageSrc: string,
  tagline: string | null = null,
  featured = true
): Artist => ({
  id,
  name,
  imageSrc,
  bio: null,
  tagline,
  spotifyUrl: null,
  socials: {},
  featured,
});

export const ARTISTS: Artist[] = [
  a('dyana-cods', 'Dyana Cods', '/assets/images/codds.jpg' ),
  a('cosign-black', 'Cosign Black', '/assets/images/cosignblack.jpg'),
  a('virusi-mbaya', 'Virusi Mbaya', '/assets/images/carzyv.png'),
  a('sewersydaa-mkadinali', 'Sewersydaa Mkadinali', '/assets/images/img-05.jpg'),
  a('mejja-genge', 'Mejja Genge', '/assets/images/img-11.jpg'),
  a('little-maina', 'Little Maina', '/assets/images/lilmaina.jpg'),
  a('toxic-lyrikali', 'Toxic Lyrikali', '/assets/images/manat.jpg'),
  a('metro-stunna', 'Metro Stunna', '/assets/images/metro.webp'),
  a('moti-the-nrg', 'Moti The NRG', '/assets/images/moti.jpg'),
  a('domani-munga', 'Domani Munga', '/assets/images/munga.jpg'),
  a('only-moh', 'Only Moh 34 Brick', '/assets/images/onlymoh.jpg'),
  a('scar-mkadinali', 'Scar Mkadinali', '/assets/images/scar.jpg'),
  a('sylvia-ssaru', 'Sylvia Ssaru', '/assets/images/ssaru.jpg'),
  a('original-zula', 'Original Zula', '/assets/images/zula.webp'),
  a('zzero-sufuri', 'Zzero Sufuri', '/assets/images/zzero.jpg'),
  a('sofiya-nzau', 'Sofiya Nzau', '/assets/images/nzau.jpg'),
  a('maandy', 'Maandy', '/assets/images/maandy.jpg'),
  a('mykey lb', 'Mykey Lb', '/assets/featured/mykeylb.png'),
  a('tgl', 'Tgl', '/assets/featured/tgl.png'),
];
