import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { JUZ_META } from '../types/quran';
import { PageHeader } from '../components/ui/SharedComponents';
import { ChevronRight } from 'lucide-react';

export default function JuzBrowserPage() {
  useEffect(() => { document.title = 'Juz Navigator — Noor Quran'; }, []);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px 64px' }}>
      <PageHeader
        title="Juz Navigator"
        arabic="الأجزاء"
        subtitle="Browse all 30 Juz of the Noble Quran. Start and end references are sourced from Al Quran Cloud API."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
        {JUZ_META.map((juz) => (
          <Link key={juz.number} to={`/juz/${juz.number}`} style={{ textDecoration: 'none' }}>
            <div
              className="card"
              style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, transition: 'transform 0.15s, box-shadow 0.15s', height: '100%' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 10, flexShrink: 0,
                background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0, color: 'white',
              }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 600, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Juz</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, lineHeight: 1 }}>{juz.number}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)', marginBottom: 6 }}>Juz {juz.number}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  Starts: Surah {juz.startSurah}, Ayah {juz.startAyah}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  Ends: Surah {juz.endSurah}, Ayah {juz.endAyah}
                </div>
              </div>
              <ChevronRight size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>

      <p style={{ marginTop: 40, fontSize: '0.8rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        Juz boundaries sourced from <a href="https://api.alquran.cloud" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-brand)', textDecoration: 'none' }}>Al Quran Cloud API</a>. These boundaries reflect the authoritative Islamic scholarly consensus.
        See <Link to="/sources" style={{ color: 'var(--color-brand)', textDecoration: 'none' }}>Sources &amp; Licenses</Link>.
      </p>
    </div>
  );
}
