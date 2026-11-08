export type SocialId = "spotify" | "youtube" | "apple-music" | "audiomack" | "doba";

export interface SocialLink {
  id: SocialId;
  label: string;
  /** Change these to your real profile / page URLs. */
  href: string;
  /** Gradient shown on the flap while it is hovered or focused. */
  hover: string;
}

// Order = biggest (back) flap first, smallest (front) flap last.
export const SOCIALS: SocialLink[] = [
  {
    id: "spotify",
    label: "Spotify",
    href: "https://open.spotify.com/",
    hover: "linear-gradient(135deg, #5df08f 0%, #1db954 55%, #0e7a37 100%)",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/",
    hover: "linear-gradient(135deg, #ff7a7a 0%, #ff1f1f 55%, #a80000 100%)",
  },
  {
    id: "apple-music",
    label: "Apple Music",
    href: "https://music.apple.com/",
    hover: "linear-gradient(135deg, #ffa1b4 0%, #fa4a68 55%, #e0153a 100%)",
  },
  {
    id: "audiomack",
    label: "Audiomack",
    href: "https://audiomack.com/",
    hover: "linear-gradient(135deg, #ffd166 0%, #ffa200 55%, #ff6a00 100%)",
  },
  {
    id: "doba",
    label: "Doba",
    href: "/doba",
    hover: "linear-gradient(135deg, #b79bff 0%, #7c5cff 55%, #3b82f6 100%)",
  },
];
