import { NotConfiguredError, type DataProvider } from '../contracts';
import { isAppwriteConfigured } from './schema';

/**
 * APPWRITE PROVIDER — skeleton only, NOT implemented or tested.
 *
 * When you are ready:
 *   1. npm i appwrite
 *   2. Create the database from schema.ts and fill the VITE_APPWRITE_* env vars.
 *   3. Implement each method below with `Databases`, `Account` and `Teams`
 *      (docs/APPWRITE.md lists exactly what to do), using the mappers in mappers.ts.
 *   4. Set VITE_DATA_PROVIDER=appwrite.
 *
 * No component needs to change: they only talk to the DataProvider contract.
 */
export function createAppwriteProvider(): DataProvider {
  const nope = (what: string) => async (): Promise<never> => {
    throw new NotConfiguredError(
      isAppwriteConfigured() ? `Appwrite provider (${what}) is not implemented` : 'Appwrite'
    );
  };

  return {
    id: 'appwrite',
    capabilities: { hasBackend: true, canEditCatalog: true },
    catalog: {
      listPlaylists: nope('listPlaylists'),
      getPlaylistBySlug: nope('getPlaylistBySlug'),
      listArtists: nope('listArtists'),
      listTracks: nope('listTracks'),
      listPlacements: nope('listPlacements'),
      listTestimonials: nope('listTestimonials'),
      listSnapshots: nope('listSnapshots'),
    },
    submissions: {
      submit: async () => ({
        status: 'failed',
        persisted: false,
        error: 'Appwrite is selected but not implemented yet.',
      }),
      adminList: nope('adminList'),
      adminUpdate: nope('adminUpdate'),
    },
    auth: {
      getState: async () => ({ mode: 'unconfigured' }),
      signIn: nope('signIn'),
      signOut: nope('signOut'),
    },
  };
}
