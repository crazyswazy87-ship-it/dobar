import type { SocialId } from "../../data/socials";

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": true,
  focusable: false,
} as const;

function Spotify({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <mask id="mask-spotify">
        <rect width="24" height="24" f ill="#fff" />
        <g fill="none" stroke="#000" strokeLinecap="round">
          <path d="M6.3 9.1c3.9-1.2 8.5-.8 11.9 1.3" strokeWidth="2" />
          <path d="M7.1 12.6c3.3-.9 6.8-.6 9.6 1.1" strokeWidth="1.6" />
          <path d="M7.9 15.9c2.7-.6 5.2-.4 7.4.9" strokeWidth="1.3" />
        </g>
      </mask>
      <circle cx="12" cy="12" r="10" mask="url(#mask-spotify)" />
    </svg>
  );
}

function YouTube({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path
        fillRule="evenodd"
        d="M3 8.5A3.5 3.5 0 0 1 6.5 5h11A3.5 3.5 0 0 1 21 8.5v7a3.5 3.5 0 0 1-3.5 3.5h-11A3.5 3.5 0 0 1 3 15.5v-7Zm7 .7v5.6l5-2.8-5-2.8Z"
      />
    </svg>
  );
}

function AppleMusic({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <mask id="mask-apple-music">
        <rect width="24" height="24" fill="#fff" />
        <g fill="#000">
          <ellipse cx="8.9" cy="16.4" rx="2" ry="1.6" />
          <ellipse cx="15.4" cy="15" rx="2" ry="1.6" />
          <rect x="10.2" y="7.6" width="1.3" height="8.6" />
          <rect x="16.7" y="6.2" width="1.3" height="8.6" />
          <path d="M10.2 7.6 18 6.2v2.1l-7.8 1.4z" />
        </g>
      </mask>
      <rect x="2" y="2" width="20" height="20" rx="5.5" mask="url(#mask-apple-music)" />
    </svg>
  );
}

function Audiomack({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <mask id="mask-audiomack">
        <rect width="24" height="24" fill="#fff" />
        <g fill="#000">
          <rect x="5.2" y="10" width="2" height="4" rx="1" />
          <rect x="8.6" y="7" width="2" height="10" rx="1" />
          <rect x="12" y="5" width="2" height="14" rx="1" />
          <rect x="15.4" y="8.2" width="2" height="7.6" rx="1" />
          <rect x="18.4" y="10.4" width="1.6" height="3.2" rx=".8" />
        </g>
      </mask>
      <circle cx="12" cy="12" r="10" mask="url(#mask-audiomack)" />
    </svg>
  );
}

function Doba({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path
        fillRule="evenodd"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-3.4 5.2h3.1a4.8 4.8 0 0 1 0 9.6H8.6V7.2Zm2.1 2v5.6h1a2.8 2.8 0 0 0 0-5.6h-1Z"
      />
    </svg>
  );
}

export const ICONS: Record<SocialId, (props: IconProps) => React.JSX.Element> = {
  spotify: Spotify,
  youtube: YouTube,
  "apple-music": AppleMusic,
  audiomack: Audiomack,
  doba: Doba,
};
