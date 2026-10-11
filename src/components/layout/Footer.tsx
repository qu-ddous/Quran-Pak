import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Search, Settings } from 'lucide-react';

const currentYear = new Date().getFullYear();

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer
      role="contentinfo"
      style={{
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        marginTop: 'auto',
        padding: '32px 24px 28px',
      }}
    >
      <div className="quran-page-container">
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          paddingBottom: 24,
          borderBottom: '1px solid var(--color-border)',
        }}>
          {/* Brand Logo */}
          <Link
            to="/"
            style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
            aria-label="Noor Quran"
          >
            <div className="icon-badge-shiny" style={{ width: 36, height: 36, borderRadius: 10 }}>
              <BookOpen size={18} className="shiny-icon" aria-hidden="true" />
            </div>
            <span style={{ fontWeight: 800, color: 'var(--color-brand)', fontSize: '1.05rem', letterSpacing: '-0.01em' }}>
              Noor Quran
            </span>
          </Link>

          {/* Quick Nav Links */}
          <nav aria-label="Footer navigation" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
            <Link to="/quran" style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-muted)', textDecoration: 'none' }}>
              Quran
            </Link>
            <Link to="/sources" style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-muted)', textDecoration: 'none' }}>
              Sources &amp; Licenses
            </Link>
            <Link to="/about" style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-muted)', textDecoration: 'none' }}>
              About
            </Link>
            <Link to="/privacy" style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-muted)', textDecoration: 'none' }}>
              Privacy
            </Link>
          </nav>

          {/* Right Controls (Search & Settings) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => navigate('/search')}
              aria-label="Search Quran"
              className="btn-ghost"
              style={{
                width: 36,
                height: 36,
                padding: 0,
                borderRadius: 10,
                border: '1px solid var(--color-border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Search Quran"
            >
              <Search size={16} className="shiny-icon" style={{ color: 'var(--color-accent)' }} />
            </button>
            <button
              onClick={() => navigate('/settings')}
              aria-label="Settings"
              className="btn-ghost"
              style={{
                width: 36,
                height: 36,
                padding: 0,
                borderRadius: 10,
                border: '1px solid var(--color-border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Settings"
            >
              <Settings size={16} className="shiny-icon" style={{ color: 'var(--color-brand)' }} />
            </button>
          </div>
        </div>

        {/* Copyright tagline matching reference */}
        <div style={{ paddingTop: 20, textAlign: 'center', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
          © {currentYear} Noor Quran. A calm space to reconnect with the Quran.
        </div>
      </div>
    </footer>
  );
}
