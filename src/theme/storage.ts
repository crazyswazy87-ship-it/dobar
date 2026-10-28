import type { Theme } from './context';

/** Same key the project already used. */
export const THEME_KEY = 'doba-theme';

export function readStoredTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    // The old "spotify" theme was removed; it maps to dark.
    if (saved === 'spotify') return 'dark';
  } catch {
    /* storage blocked */
  }
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  meta?.setAttribute('content', theme === 'dark' ? '#050706' : '#e8eee9');
}

/** Runs from main.tsx BEFORE React renders, so the first paint uses the right theme. */
export function initTheme(): Theme {
  const theme = readStoredTheme();
  applyTheme(theme);
  return theme;
}
