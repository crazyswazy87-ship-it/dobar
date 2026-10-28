import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SiteLayout } from './components/layout/SiteLayout';
import { ThemeProvider } from './theme/ThemeProvider';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// heavier / rarely visited pages load on demand
const PlaylistsPage = lazy(() => import('./pages/PlaylistsPage'));
const ArtistsPage = lazy(() => import('./pages/ArtistsPage'));
const ArtistProfilePage = lazy(() => import('./pages/ArtistProfilePage'));
const AudiencePage = lazy(() => import('./pages/AudiencePage'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const SubmitPage = lazy(() => import('./pages/SubmitPage'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'));
const AdminSubmissions = lazy(() => import('./pages/admin/AdminSubmissions'));
const AdminCatalog = lazy(() => import('./pages/admin/AdminCatalog'));

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="grid min-h-svh place-items-center muted" aria-busy="true">Loading…</div>}>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route index element={<Home />} />
              <Route path="playlists" element={<PlaylistsPage />} />
              <Route path="artists" element={<ArtistsPage />} />
              <Route path="artists/:artistId" element={<ArtistProfilePage />} />
              <Route path="audience" element={<AudiencePage />} />
              <Route path="how-it-works" element={<HowItWorksPage />} />
              <Route path="submit" element={<SubmitPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="submissions" element={<AdminSubmissions />} />
              <Route path="catalog" element={<AdminCatalog />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}
