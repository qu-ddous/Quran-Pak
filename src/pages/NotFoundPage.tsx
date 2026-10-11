import { Link } from 'react-router-dom';
import { Home, Search, BookOpen, Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div style={{
      maxWidth: 600,
      margin: '60px auto',
      padding: '40px 24px',
      textAlign: 'center',
    }}>
      <div style={{
        width: 72,
        height: 72,
        margin: '0 auto 24px',
        borderRadius: '50%',
        background: 'var(--color-primary-100)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Compass size={36} style={{ color: 'var(--color-brand)' }} />
      </div>

      <div style={{
        fontSize: '4rem',
        fontWeight: 800,
        color: 'var(--color-brand)',
        lineHeight: 1,
        marginBottom: 8,
      }}>
        404
      </div>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 12px 0', color: 'var(--color-text)' }}>
        Page Not Found
      </h1>

      <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 32 }}>
        The page or Surah you are looking for does not exist or may have been moved.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Link to="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Home size={16} /> Return Home
        </Link>
        <Link to="/quran" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <BookOpen size={16} /> Browse Surahs
        </Link>
        <Link to="/search" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Search size={16} /> Search Quran
        </Link>
      </div>
    </div>
  );
}
