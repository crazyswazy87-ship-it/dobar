// All images live in /public/assets/images

export const IMAGES = [
  "/assets/images/img-01.png",
  "/assets/images/img-03.jpg",
  "/assets/images/img-05.jpg",
  "/assets/images/img-07.jpg",
  "/assets/images/img-09.jpg",
  "/assets/images/img-11.jpg",
  "/assets/images/img-13.jpg",
];

export const ORBITS = [
  {
    id: "artist-01",
    src: "/assets/images/manat.jpg",
    alt: "Featured Kenyan artist",
    title: "Artist One",
    description: "Kenyan artist and songwriter.",
  },
  {
    id: "artist-02",
    src: "/assets/images/cosignblack.jpg",
    alt: "Featured Kenyan artist",
    title: "Artist Two",
    description: "Independent Kenyan artist.",
  },
  {
    id: "artist-03",
    src: "/assets/images/img-13.jpg",
    alt: "Featured Kenyan artist",
    title: "Artist Three",
    description: "New sound from Kenya.",
  },
  {
    id: "artist-04",
    src: "/assets/images/img-01.png",
    alt: "Featured Kenyan artist",
    title: "Artist Four",
    description: "Discover their latest music.",
  },
  {
    id: "artist-05",
    src: "/assets/images/img-07.jpg",
    alt: "Featured Kenyan artist",
    title: "Artist Five",
    description: "Fresh music for new listeners.",
  },
];

export const PARALLAX_IMAGES = [
  {
    src: "/assets/images/img-01.png",
    alt: "Kenyan music artist",
  },
  {
    src: "/assets/images/img-04.jpg",
    alt: "Kenyan music artist",
  },
  {
    src: "/assets/images/img-08.jpg",
    alt: "Kenyan music artist",
  },
  {
    src: "/assets/images/img-02.jpg",
    alt: "Kenyan music artist",
  },
  {
    src: "/assets/images/img-07.jpg",
    alt: "Kenyan music artist",
  },
  {
    src: "/assets/images/img-06.jpg",
    alt: "Kenyan music artist",
  },
  {
    src: "/assets/images/img-12.jpg",
    alt: "Kenyan music artist",
  },
];

/**
 * Specific images used by the Featured Artists sphere.
 */
export const SPHERE_IMAGES = [
  {
    id: "sphere-01",
    src: "/assets/images/codds.jpg",
    alt: "Featured Kenyan artist",
    title: "Dyana Cods",
    description: "Kenyan artist and songwriter.",
  },
  {
    id: "sphere-02",
    src: "/assets/images/cosignblack.jpg",
    alt: "Featured Kenyan artist",
    title: "Cosign black",
    description: "New sound from Kenya.",
  },
  {
    id: "sphere-03",
    src: "/assets/images/carzyv.png",
    alt: "Featured Kenyan artist",
    title: "VIRUSI MBAYA",
    description: "Independent Kenyan artist.",
  },
  {
    id: "sphere-04",
    src: "/assets/images/img-05.jpg",
    alt: "Featured Kenyan artist",
    title: "SEWERSYDAA MKADINALI",
    description: "Discover their latest music.",
  },
  {
    id: "sphere-05",
    src: "/assets/images/img-11.jpg",
    alt: "Featured Kenyan artist",
    title: "MEJJA GENGE",
    description: "Fresh music for new listeners.",
  },
  {
    id: "sphere-06",
    src: "/assets/images/lilmaina.jpg",
    alt: "Featured Kenyan artist",
    title: "LITTLE MAINA",
    description: "Discover their latest music.",
  },
  {
    id: "sphere-07",
    src: "/assets/images/manat.jpg",
    alt: "Featured Kenyan artist",
    title: "TOXIC LYRIKALI",
    description: "Discover their latest music.",
  },
  {
    id: "sphere-08",
    src: "/assets/images/metro.webp",
    alt: "Featured Kenyan artist",
    title: "METRO STUNNA",
    description: "Discover their latest music.",
  },
  {
    id: "sphere-09",
    src: "/assets/images/moti.jpg",
    alt: "Featured Kenyan artist",
    title: "MOTI THE NRG",
    description: "Discover their latest music.",
  },
  {
    id: "sphere-10",
    src: "/assets/images/munga.jpg",
    alt: "Featured Kenyan artist",
    title: "DOMANI MUNGA",
    description: "Discover their latest music.",
  },
  {
    id: "sphere-11",
    src: "/assets/images/onlymoh.jpg",
    alt: "Featured Kenyan artist",
    title: "ONLY MOH 34 BRICK",
    description: "Discover their latest music.",
  },
  {
    id: "sphere-12",
    src: "/assets/images/scar.jpg",
    alt: "Featured Kenyan artist",
    title: "SCAR MKADINALI",
    description: "Discover their latest music.",
  },
  {
    id: "sphere-13",
    src: "/assets/images/ssaru.jpg",
    alt: "Featured Kenyan artist",
    title: "SYLVIA SSARU",
    description: "Discover their latest music.",
  },
  {
    id: "sphere-14",
    src: "/assets/images/zula.webp",
    alt: "Featured Kenyan artist",
    title: "ORIGINAL ZULA",
    description: "Discover their latest music.",
  },
  {
    id: "sphere-15",
    src: "/assets/images/zzero.jpg",
    alt: "Featured Kenyan artist",
    title: "ZZERO SUFURI",
    description: "Discover their latest music.",
  },
  {
    id: "sphere-16",
    src: "/assets/images/nzau.jpg",
    alt: "Featured Kenyan artist",
    title: "SOFIYA NZAU",
    description: "Discover their latest music.",
  },
   {
    id: "sphere-17",
    src: "/assets/images/maandy.jpg",
    alt: "Featured Kenyan artist",
    title: "MAANDY",
    description: "Discover their latest music.",
  },
  
];

export function shuffled<T>(list: T[]): T[] {
  const a = [...list];

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
}