import { GlassButton } from '../components/glass';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Page not found — Doba Music');
  return (
    <div className="wrap section grid min-h-[70svh] place-content-center pt-36 text-center">
      <p className="eyebrow">404</p>
      <h1 className="display mt-3 text-[clamp(2.2rem,7vw,4.5rem)]">This page isn’t on the playlist.</h1>
      <p className="muted mx-auto mt-4 max-w-md">The link may be old or mistyped.</p>
      <div className="mt-8 flex justify-center gap-3">
        <GlassButton to="/" kind="primary" size="lg">Back home</GlassButton>
        <GlassButton to="/submit" kind="glass" size="lg">Submit music</GlassButton>
      </div>
    </div>
  );
}
