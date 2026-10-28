

/**
 * src/data/manualAudience.ts
 *
 * EXAMPLE DATA ONLY — replace all figures with verified values.
 * Add one record per playlist each day.
 */

export interface ManualAudienceEntry {
  playlistId: string;
  capturedAt: string;
  followers: number;
  monthlyListeners: number | null;
}

const DAILY_READINGS: Record<
  string,
  { followers: number; monthlyListeners: number | null }[]
> = {
  'pl-kenyan-hits': [
    { followers: 1250, monthlyListeners: null },
    { followers: 1264, monthlyListeners: null },
    { followers: 1278, monthlyListeners: null },
  ],
  'pl-mejja': [
    { followers: 680, monthlyListeners: null },
    { followers: 691, monthlyListeners: null },
    { followers: 705, monthlyListeners: null },
  ],
  'pl-mboka-doba': [
    { followers: 320, monthlyListeners: null },
    { followers: 328, monthlyListeners: null },
    { followers: 335, monthlyListeners: null },
  ],
  'pl-kapitani': [
    { followers: 540, monthlyListeners: null },
    { followers: 548, monthlyListeners: null },
    { followers: 556, monthlyListeners: null },
  ],
  'pl-nganya': [
    { followers: 870, monthlyListeners: null },
    { followers: 884, monthlyListeners: null },
    { followers: 899, monthlyListeners: null },
  ],
  'pl-nzau': [
    { followers: 410, monthlyListeners: null },
    { followers: 417, monthlyListeners: null },
    { followers: 425, monthlyListeners: null },
  ],
  'pl-onlymoh': [
    { followers: 320, monthlyListeners: null },
    { followers: 328, monthlyListeners: null },
    { followers: 335, monthlyListeners: null },
  ],
  'pl-nikita-kering': [
    { followers: 760, monthlyListeners: null },
    { followers: 772, monthlyListeners: null },
    { followers: 785, monthlyListeners: null },
  ],
  'pl-moti-nrg': [
    { followers: 335, monthlyListeners: null },
    { followers: 342, monthlyListeners: null },
    { followers: 350, monthlyListeners: null },
  ],
  'pl-virusi-mbaya': [
    { followers: 290, monthlyListeners: null },
    { followers: 297, monthlyListeners: null },
    { followers: 304, monthlyListeners: null },
  ],
  'pl-bedroom-jams': [
    { followers: 460, monthlyListeners: null },
    { followers: 468, monthlyListeners: null },
    { followers: 476, monthlyListeners: null },
  ],
  'pl-cosign-black': [
    { followers: 215, monthlyListeners: null },
    { followers: 221, monthlyListeners: null },
    { followers: 228, monthlyListeners: null },
  ],
  'pl-gonga-utat': [
    { followers: 380, monthlyListeners: null },
    { followers: 389, monthlyListeners: null },
    { followers: 398, monthlyListeners: null },
  ],
};

const DATES = [
  '2026-10-23',
  '2026-10-24',
  '2026-10-25',
];

export const MANUAL_AUDIENCE: ManualAudienceEntry[] =
  Object.entries(DAILY_READINGS).flatMap(
    ([playlistId, readings]) =>
      readings.map((reading, index) => ({
        playlistId,
        capturedAt: DATES[index],
        ...reading,
      })),
  );

export function getManualAudience(
  playlistId: string,
): ManualAudienceEntry[] {
  return MANUAL_AUDIENCE
    .filter((entry) => entry.playlistId === playlistId)
    .slice()
    .sort((a, b) => a.capturedAt.localeCompare(b.capturedAt));
}

export function getLatestManualAudience(
  playlistId: string,
): ManualAudienceEntry | undefined {
  return getManualAudience(playlistId).at(-1);
}
