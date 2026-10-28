import type { DataProvider } from './contracts';
import { createAppwriteProvider } from './appwrite/provider';
import { createStaticProvider } from './static/provider';

/**
 * The single data entry point for the whole app.
 * Components import `api` and never know where data lives.
 */
export const api: DataProvider =
  import.meta.env.VITE_DATA_PROVIDER === 'appwrite' ? createAppwriteProvider() : createStaticProvider();

export * from './contracts';
