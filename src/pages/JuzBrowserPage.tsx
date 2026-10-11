import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { JUZ_META } from '../types/quran';
import { PageHeader } from '../components/ui/SharedComponents';
import { ChevronRight } from 'lucide-react';

export default function JuzBrowserPage() {
  useEffect(() => { document.title = 'Juz Navigator — Noor Quran'; }, []);

  return (
    <div style={{ maxWidth: 1260, margin: '0 auto', padding: '36px 20px 80px' }}>
      <PageHeader
        title="Juz Navigator"
        arabic="الأجزاء الثلاثون"
        subtitle="Browse all 30 Juz (Paras) of the Noble Quran. Start and end references are sourced from canonical Islamic scholarship."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
        {JUZ_META.map((juz) => (
          <Link key={juz.number} to={`/juz/${juz.number}`} style={{ textDecoration: 'none' }}>
            <div className="surah-card-emerald" style={{ padding: '16px 20px' }}>
              {/* Gold Juz Badge */}
              <div className="surah-card-number-badge">
                {juz.number}
              </div>

              {/* Text Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff', letterSpacing: '-0.01em', marginBottom: 3 }}>
                  Juz {juz.number}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#bce5cf', lineHeight: 1.5 }}>
                  Surah {juz.startSurah}:{juz.startAyah} → {juz.endSurah}:{juz.endAyah}
                </div>
              </div>

              {/* Arrow and Calligraphy */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="arabic-text" style={{ fontSize: '1.3rem', color: '#fef08a', fontWeight: 800, margin: 0 }}>
                  الجزء {juz.number}
                </span>
                <ChevronRight size={18} style={{ color: 'var(--color-gold-400)', opacity: 0.8 }} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <p style={{ marginTop: 40, fontSize: '0.82rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        Juz boundaries sourced from <a href="https://api.alquran.cloud" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-brand)', textDecoration: 'none', fontWeight: 600 }}>Al Quran Cloud API</a>. See <Link to="/sources" style={{ color: 'var(--color-brand)', textDecoration: 'none', fontWeight: 600 }}>Sources &amp; Methodology</Link>.
      </p>
    </div>
  );
}
