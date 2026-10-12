import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Compass, 
  Headphones, 
  Bookmark, 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  Search, 
  Settings, 
  BarChart3, 
  DownloadCloud, 
  FileText,
  ArrowRight
} from 'lucide-react';

const currentYear = new Date().getFullYear();

const POPULAR_SURAHS = [
  { name: 'Al-Fatiha', num: 1 },
  { name: 'Al-Baqara', num: 2 },
  { name: 'Al-Kahf', num: 18 },
  { name: 'Yaseen', num: 36 },
  { name: 'Ar-Rahman', num: 55 },
  { name: 'Al-Mulk', num: 67 },
];

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer
      role="contentinfo"
      className="site-footer"
      style={{
        borderTop: '2px solid var(--color-border-gold)',
        background: 'var(--color-surface)',
        marginTop: 'auto',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Golden Top Accent */}
      <div 
        style={{
          height: 3,
          width: '100%',
          background: 'linear-gradient(90deg, transparent 0%, var(--color-border-gold) 20%, #fde047 50%, var(--color-border-gold) 80%, transparent 100%)',
        }} 
      />

      <div className="quran-page-container" style={{ paddingTop: 52, paddingBottom: 40 }}>
        {/* Main Footer 4-Column Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 40,
            marginBottom: 48,
          }}
          className="footer-grid"
        >
          {/* Column 1: Brand & Sacred Mission */}
          <div style={{ maxWidth: 360 }}>
            <Link
              to="/"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 12, textDecoration: 'none', marginBottom: 16 }}
              aria-label="Noor Quran — Home"
            >
              <div className="icon-badge-shiny" style={{ width: 44, height: 44, borderRadius: 12 }}>
                <BookOpen size={22} className="shiny-icon" aria-hidden="true" />
              </div>
              <div style={{ lineHeight: 1.15 }}>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-brand)', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Noor Quran</span>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-block' }} />
                </div>
                <div className="arabic-text" style={{ fontSize: '0.9rem', color: 'var(--color-accent)', fontWeight: 700, lineHeight: 1.2 }}>
                  نُورُ الْقُرْآنِ الْكَرِيمِ
                </div>
              </div>
            </Link>

            <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--color-text-muted)', margin: '0 0 18px 0' }}>
              A sanctuary for reciting, listening, and reflecting upon the Holy Quran. 
              Built with verified Uthmani calligraphy, high-definition recitations, and zero ads.
            </p>

            {/* Sacred Quranic Ayah Quote Badge */}
            <div 
              style={{
                padding: '12px 16px',
                borderRadius: 14,
                background: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                fontSize: '0.82rem',
                color: 'var(--color-brand)',
                lineHeight: 1.5,
              }}
            >
              <div className="arabic-text" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-accent)', marginBottom: 4 }}>
                إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ
              </div>
              <div style={{ fontStyle: 'italic', fontSize: '0.78rem', opacity: 0.9 }}>
                "Indeed, this Quran guides to that which is most suitable." — [17:9]
              </div>
            </div>
          </div>

          {/* Column 2: Sacred Scripture & Navigation */}
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-brand)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 18px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Compass size={16} className="shiny-icon" /> Revelation & Divisions
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li>
                <Link to="/quran" className="footer-link">
                  <span>All 114 Surahs</span>
                  <span className="footer-pill">114</span>
                </Link>
              </li>
              <li>
                <Link to="/juz" className="footer-link">
                  <span>30 Canonical Juz (Paras)</span>
                  <span className="footer-pill">30 Juz</span>
                </Link>
              </li>
              <li>
                <Link to="/listen" className="footer-link">
                  <span>Audio Sanctuary &amp; Qaris</span>
                  <span className="footer-pill">7 Qaris</span>
                </Link>
              </li>
              <li>
                <Link to="/search" className="footer-link">
                  <span>Global Word &amp; Verse Search</span>
                </Link>
              </li>
              <li>
                <Link to="/progress" className="footer-link">
                  <span>Khatm &amp; Reading Analytics</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Chapters & Personal Tools */}
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-brand)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 18px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={16} className="shiny-icon" /> Popular &amp; Tools
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {POPULAR_SURAHS.slice(0, 4).map((s) => (
                <li key={s.num}>
                  <Link to={`/surah/${s.num}`} className="footer-link">
                    <span>Surah {s.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 700 }}>Ch. {s.num}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/bookmarks" className="footer-link">
                  <span>Saved Verses (Bookmarks)</span>
                </Link>
              </li>
              <li>
                <Link to="/notes" className="footer-link">
                  <span>My Ayah Reflection Notes</span>
                </Link>
              </li>
              <li>
                <Link to="/downloads" className="footer-link">
                  <span>Offline Storage &amp; Cache</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Text Integrity & Transparency */}
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-brand)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 18px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={16} className="shiny-icon" /> Integrity &amp; About
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li>
                <Link to="/sources" className="footer-link">
                  <span>Canonical Sources &amp; Methodology</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">
                  <span>About Noor Quran Mission</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="footer-link">
                  <span>Local-First Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/settings" className="footer-link">
                  <span>Audio &amp; Script Preferences</span>
                </Link>
              </li>
            </ul>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
              <button
                onClick={() => navigate('/search')}
                className="btn-gold"
                style={{
                  padding: '8px 14px',
                  fontSize: '0.82rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Search size={14} /> Quick Search
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="btn-ghost"
                style={{
                  padding: '8px 12px',
                  borderRadius: 12,
                  border: '1px solid var(--color-border-gold)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.82rem',
                  color: 'var(--color-brand)',
                }}
                title="Settings"
              >
                <Settings size={14} /> Settings
              </button>
            </div>
          </div>
        </div>

        {/* ─── Bottom Sub-Footer Bar ─── */}
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: 24,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            fontSize: '0.84rem',
            color: 'var(--color-text-muted)',
          }}
          className="sub-footer-bar"
        >
          {/* Left: Dedication & Islamic Du'a */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Heart size={15} style={{ color: '#e11d48', flexShrink: 0 }} />
            <span>
              <strong>Sadaqah Jariyah</strong> — Free &amp; open for the entire global Ummah.
            </span>
          </div>

          {/* Center / Right: Canonical Verification Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={14} style={{ color: 'var(--color-accent)' }} /> King Fahd Complex Verified
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Headphones size={14} style={{ color: 'var(--color-brand)' }} /> 128kbps Studio Tilawah
            </span>
            <span>•</span>
            <span>© {currentYear} Noor Quran</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
