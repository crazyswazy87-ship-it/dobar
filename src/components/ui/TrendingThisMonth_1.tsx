
import type { ReactElement } from "react";
import { TRENDING } from "../../data/trending";
import YouTubeReelsCarousel from "../layout/youtubereelscarousel";

import "../../styles/youtubereels.css";

const month = new Date().toLocaleString("en", {
  month: "long",
  year: "numeric",
});


const SPOTIFY_PLAYLIST_URL = "https://open.spotify.com/playlist/0EqOvlPjXnWCXULExlmp6x?si=ch5_JEaaSy-HwN3roGnXiw";

export default function TrendingThisMonth(): ReactElement {
  return (
    <div
      className="yrc-trending-section"
      style={{
        maxWidth: 1100,
        margin: "20px auto 0",
        perspective: "1200px",
      }}
    >
      <header className="yrc-trending-header">
        <p className="yrc-trending-month">{month}</p>

        <h2 className="yrc-heading">Trending This Month</h2>

        <p className="yrc-trending-description">
          Top 30 tracks across Kenya’s streaming scene.
        </p>
      </header>

      {TRENDING.length > 0 ? (
        <>
          <section
            aria-label="Trending this month"
            className="yrc-trending-carousel"
          >
            <YouTubeReelsCarousel reels={TRENDING} />
          </section>

          <div className="yrc-spotify-wrap">
            <a
              className="yrc-spotify-button"
              href={SPOTIFY_PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Listen to the playlist on Spotify"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="yrc-spotify-icon"
              >
                <path
                  fill="currentColor"
                  d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.59 14.42a.75.75 0 0 1-1.03.25c-2.82-1.72-6.37-2.11-10.55-1.16a.75.75 0 1 1-.33-1.46c4.58-1.05 8.51-.59 11.66 1.34.36.22.47.68.25 1.03Zm1.47-3.26a.94.94 0 0 1-1.29.31c-3.23-1.99-8.15-2.56-11.97-1.4a.94.94 0 1 1-.55-1.79c4.36-1.32 9.77-.68 13.5 1.6.44.27.58.84.31 1.28Zm.13-3.39c-3.87-2.3-10.26-2.51-13.96-1.38a1.13 1.13 0 1 1-.66-2.16c4.25-1.29 11.31-1.04 15.78 1.61a1.13 1.13 0 0 1-1.16 1.93Z"
                />
              </svg>

              <span>Listen on Spotify</span>

              <span className="yrc-spotify-arrow" aria-hidden="true">
                ↗
              </span>
            </a>

            <p className="yrc-spotify-caption">
              Take the trending tracks with you.
            </p>
          </div>
        </>
      ) : (
        <p className="yrc-trending-empty">Nothing trending yet.</p>
      )}
    </div>
  );
}
