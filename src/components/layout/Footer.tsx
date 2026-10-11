import { Link } from 'react-router-dom';
import { BookOpen, ExternalLink } from 'lucide-react';

const currentYear = new Date().getFullYear();

export default function Footer() {
  const year = currentYear;
  return (
    <footer
      role="contentinfo"
      style={{
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        marginTop: 'auto',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32, marginBottom: 32 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={15} color="white" aria-hidden="true" />
              </div>
              <span style={{ fontWeight: 700, color: 'var(--color-brand)', fontSize: '0.95rem' }}>Noor Quran</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
              A respectful Quran reading website for Arabic, Urdu, and English readers.
            </p>
          </div>

          {/* Reading */}
          <div>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 12, marginTop: 0 }}>Reading</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['/quran', 'Browse Surahs'],
                ['/juz', 'Browse Juz'],
                ['/search', 'Search Quran'],
                ['/listen', 'Listen'],
              ].map(([to, label]) => (
                <li key={to}><Link to={to} style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Personal */}
          <div>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 12, marginTop: 0 }}>Personal</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['/bookmarks', 'Bookmarks'],
                ['/notes', 'Notes'],
                ['/progress', 'Progress'],
                ['/downloads', 'Downloads'],
              ].map(([to, label]) => (
                <li key={to}><Link to={to} style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 12, marginTop: 0 }}>Info</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['/sources', 'Data Sources'],
                ['/settings', 'Settings'],
                ['/about', 'About'],
                ['/privacy', 'Privacy'],
              ].map(([to, label]) => (
                <li key={to}><Link to={to} style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 20, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            © {year} Noor Quran — Quran text served by{' '}
            <a href="https://alquran.cloud" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-brand)', textDecoration: 'none' }}>
              Al Quran Cloud <ExternalLink size={10} aria-hidden="true" style={{ verticalAlign: 'middle' }} />
            </a>
            {' '}(Islamic Network). All translations used per their respective licenses.
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <Link to="/sources" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Sources &amp; Licenses</Link>
            <Link to="/privacy" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
