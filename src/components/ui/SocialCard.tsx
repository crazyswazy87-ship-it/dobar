
import "../../styles/socials.css";
import type { Artist } from "../../types";
import type { ReactNode } from "react";

// Platform icons
const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" className="icon" fill="currentColor">
    <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.49 17.31a.75.75 0 0 1-1.03.25c-2.82-1.72-6.37-2.11-10.55-1.16a.75.75 0 1 1-.33-1.46c4.58-1.05 8.5-.6 11.66 1.34.35.22.46.68.25 1.03zm1.47-3.27a.94.94 0 0 1-1.29.31c-3.23-1.99-8.15-2.57-11.97-1.4a.94.94 0 1 1-.55-1.8c4.36-1.32 9.78-.68 13.5 1.6.44.27.58.85.31 1.29zm.13-3.4C15.22 8.35 8.8 8.14 5.08 9.27a1.13 1.13 0 1 1-.66-2.16c4.27-1.3 11.36-1.05 15.84 1.61a1.13 1.13 0 0 1-1.16 1.94z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" className="icon" fill="currentColor">
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
  </svg>
);

const AppleMusicIcon = () => (
  <svg viewBox="0 0 24 24" className="icon" fill="currentColor">
    <path d="M21 3v13.5a3.5 3.5 0 1 1-2-3.16V7.2l-9 2v9.3a3.5 3.5 0 1 1-2-3.16V5.7L21 3z" />
  </svg>
);

// Social panel
interface SocialBoxProps {
  href: string;
  className: string;
  label: string;
  delay?: string;
  children: ReactNode;
}

const SocialBox = ({
  href,
  className,
  label,
  delay,
  children,
}: SocialBoxProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Listen on ${label}`}
    title={label}
    className={`box ${className}`}
    style={{ transitionDelay: delay }}
  >
    {children}
  </a>
);

// Artist Social Card
interface SocialCardProps {
  artist: Artist;
}

export const SocialCard = ({ artist }: SocialCardProps) => {
  const { spotifyUrl, appleMusicUrl, socials } = artist;

  const hasLinks = spotifyUrl || socials.youtube || appleMusicUrl;

  if (!hasLinks) return null;

  return (
    <div className="card">
      <div className="background">
        <div className="logo">Find Me On</div>

        {spotifyUrl && (
          <SocialBox
            href={spotifyUrl}
            className="box1"
            label="Spotify"
          >
            <SpotifyIcon />
          </SocialBox>
        )}

        {socials.youtube && (
          <SocialBox
            href={socials.youtube}
            className="box2"
            label="YouTube"
            delay="0.2s"
          >
            <YouTubeIcon />
          </SocialBox>
        )}

        {appleMusicUrl && (
          <SocialBox
            href={appleMusicUrl}
            className="box3"
            label="Apple Music"
            delay="0.4s"
          >
            <AppleMusicIcon />
          </SocialBox>
        )}

        <div
          className="box box4"
          style={{ transitionDelay: "0.6s" }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default SocialCard;
