import { Link } from 'react-router-dom';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa6';
import { Mail } from 'lucide-react';
import { SITE } from '../../config/site';
import { Brand } from '../glass';

export function Footer() {
  const { whatsapp, email, instagram } = SITE.contact;
  const hasContact = Boolean(whatsapp || email || instagram);
  return (
    <footer className="mt-10 border-t" style={{ borderColor: 'var(--glass-border)' }}>
      <div className="wrap grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Brand />
          <p className="muted mt-4 max-w-sm text-sm leading-6">
            Independent music discovery for Kenyan and African artists. Submissions are reviewed and considered.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="eyebrow mb-3">Explore</p>
          <ul className="grid gap-2 text-sm">
            {[
              ['/playlists', 'Playlists'],
              ['/artists', 'Artists'],
              ['/audience', 'Audience'],
              ['/how-it-works', 'How it works'],
              ['/submit', 'Submit music'],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="muted inline-block py-1 hover:text-[var(--ink)]">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow mb-3">Contact</p>
          {hasContact ? (
            <ul className="grid gap-2 text-sm">
              {whatsapp && (
                <li>
                  <a className="muted inline-flex items-center gap-2 py-1 hover:text-[var(--ink)]" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp aria-hidden="true" /> WhatsApp
                  </a>
                </li>
              )}
              {instagram && (
                <li>
                  <a className="muted inline-flex items-center gap-2 py-1 hover:text-[var(--ink)]" href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer">
                    <FaInstagram aria-hidden="true" /> @{instagram}
                  </a>
                </li>
              )}
              {email && (
                <li>
                  <a className="muted inline-flex items-center gap-2 py-1 hover:text-[var(--ink)]" href={`mailto:${email}`}>
                    <Mail size={15} aria-hidden="true" /> {email}
                  </a>
                </li>
              )}
            </ul>
          ) : (
            <p className="muted text-sm">Use the submission form and we will get back to you.</p>
          )}
        </div>
      </div>
      <div className="wrap muted flex flex-wrap justify-between gap-2 pb-10 text-xs">
        <span>© {new Date().getFullYear()} Doba Music</span>
        <Link to="/admin" className="hover:text-[var(--ink)]">
          Studio
        </Link>
      </div>
    </footer>
  );
}
