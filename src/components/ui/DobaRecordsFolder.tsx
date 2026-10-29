
import { useEffect, useMemo, useRef, useState } from 'react';
import { useCatalog } from '../../hooks/useCatalog';
import Folder from '../layout/Folder';
import { Link } from 'react-router-dom';
import { Info, ListMusic, Users } from 'lucide-react';
import { Reveal } from '../Reveal';
import { LiquidGlass } from '../glass';

const ESTIMATED_MONTHLY_LISTENERS = 96310;
const COUNT_DURATION = 6000;
const VERIFIED_PLACEMENTS_COUNT = 33;

type RecordItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
};

function useCountUp(
  target: number,
  isInView: boolean,
  duration = COUNT_DURATION
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) {
      setCount(0);
      return;
    }

    const endValue = Math.max(0, Math.floor(target));

    if (endValue === 0) {
      setCount(0);
      return;
    }

    let startTime: number | null = null;
    let frameId = 0;

    const animate = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const progress = Math.min(
        (timestamp - startTime) / duration,
        1
      );

      const easedProgress = 1 - Math.pow(1 - progress, 4);

      setCount(Math.round(easedProgress * endValue));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [target, isInView, duration]);

  return count;
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US').format(value);

export default function DobaRecordsFolder() {
  const { data } = useCatalog();
  const playlistCount = data?.playlists.length ?? 0;

  const statsRef = useRef<HTMLDivElement>(null);
  const [statsInView, setStatsInView] = useState(false);

  useEffect(() => {
    const element = statsRef.current;

    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      setStatsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const animatedPlaylistCount = useCountUp(
    playlistCount,
    statsInView
  );

  const animatedMonthlyListeners = useCountUp(
    ESTIMATED_MONTHLY_LISTENERS,
    statsInView
  );

  // Three photo cards displayed inside the folder.
  const records = useMemo<RecordItem[]>(
    () => [
      {
        id: 'doba-playlists',
        title: 'TOXIC LYRIKALI',
        description: `${formatNumber(playlistCount)} curated playlists in our catalogue.`,
        image: '/assets/images/mboka.png',
        alt: 'Doba music playlist catalogue',
      },
      {
        id: 'verified-placements',
        title: 'DYANA CODDS',
        description: `${formatNumber(VERIFIED_PLACEMENTS_COUNT)} verified placements in our records.`,
        image: '/assets/imagescodds.jpg',
        alt: 'Music promotion and playlist placement',
      },
      {
        id: 'monthly-listeners',
        title: 'KAPITANI',
        description: `${formatNumber(ESTIMATED_MONTHLY_LISTENERS)}+ estimated monthly listeners across our playlists.`,
        image: '/assets/playlists/monthly-listeners.jpg',
        alt: 'Music fans listening to their favourite songs',
      },
    ],
    [playlistCount]
  );

  return (
    <section
      className="doba-folder-section"
      aria-labelledby="doba-records-title"
    >
      <div className="doba-folder-container">
        <p className="doba-folder-eyebrow">
          THE DOBA CATALOGUE
        </p>

        <h2
          id="doba-records-title"
          className="yrc-heading"
        >
          MADOBA
        </h2>

        <Reveal delay={0.08}>
          <div
            className="doba-catalog-stats"
            ref={statsRef}
          >
            <div className="doba-catalog-stat">
              <div className="doba-catalog-stat-icon">
                <ListMusic size={20} aria-hidden="true" />
              </div>

              <div>
                <p className="doba-catalog-stat-label">
                  Our playlists
                </p>

                <p
                  className="doba-catalog-stat-value"
                  aria-label={`${formatNumber(playlistCount)} playlists`}
                  aria-live="off"
                >
                  {formatNumber(animatedPlaylistCount)}
                </p>

                <p className="doba-catalog-stat-caption">
                  Curated playlists in our catalogue
                </p>
              </div>
            </div>

            <div className="doba-catalog-stat-divider" />

            <div className="doba-catalog-stat">
              <div className="doba-catalog-stat-icon">
                <Users size={20} aria-hidden="true" />
              </div>

              <div>
                <p className="doba-catalog-stat-label">
                  Estimated monthly listeners
                </p>

                <p
                  className="doba-catalog-stat-value"
                  aria-label={`${formatNumber(ESTIMATED_MONTHLY_LISTENERS)} plus estimated monthly listeners`}
                  aria-live="off"
                >
                  {formatNumber(animatedMonthlyListeners)}+
                </p>

                <p className="doba-catalog-stat-caption">
                  Estimated combined audience across our playlists
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="doba-folder-stage">
          <Folder
            label="FEATURED NEW ARTISTS"
            items={records}
            mode="flap"
            variant="glass"
            layout="spread"
            color="#3dff48"
            width={312}
            height={210}
            tabHeight={42}
            draggable
            onItemClick={(item) => {
              console.log('Selected record:', item.title);
            }}
            onItemsChange={(updatedItems) => {
              console.log('Updated folder order:', updatedItems);
            }}
          />
        </div>

        <Reveal delay={0.14}>
          <LiquidGlass
            variant="subtle"
            radius={22}
            className="mt-5 flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="flex items-start gap-3 text-sm leading-6">
              <Info
                size={18}
                aria-hidden="true"
                className="mt-0.5 shrink-0"
                style={{ color: 'var(--accent-text)' }}
              />

              <span className="muted">
                <strong className="text-[(--ink)]">
                  Followers are not listeners.
                </strong>{' '}
                This is an estimate, not a guarantee of unique monthly
                listeners, streams, saves, or artist reach.
              </span>
            </p>

            <Link
              to="/audience"
              className="inline-flex min-h-11 shrink-0 items-center text-sm font-bold"
              style={{ color: 'var(--accent-text)' }}
            >
              See the audience data →
            </Link>
          </LiquidGlass>
        </Reveal>
      </div>
    </section>
  );
}
