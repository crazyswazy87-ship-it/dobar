import { Outlet } from 'react-router-dom';
import { GlassFilters, GlassNavigation } from '../glass';
import { Backdrop } from './Backdrop';
import { Footer } from './Footer';
import { ScrollManager } from './ScrollManager';

export function SiteLayout() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Backdrop />
      <GlassFilters />
      <ScrollManager />
      <GlassNavigation />
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
