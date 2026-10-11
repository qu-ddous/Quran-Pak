import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { JUZ_META } from '../types/quran';
import { Sparkles, BookOpen, Search, ArrowRight } from 'lucide-react';

const CARD_THEMES = [
  { bg: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)', badgeBg: 'linear-gradient(135deg, #d4af37 0%, #f3c642 100%)', badgeColor: '#143526', border: 'rgba(212, 175, 55, 0.4)', shadow: 'rgba(27, 67, 50, 0.25)', accent: '#fef08a' },
  { bg: 'linear-gradient(135deg, #7c4a03 0%, #a16207 100%)', badgeBg: 'linear-gradient(135deg, #fef08a 0%, #eab308 100%)', badgeColor: '#451a03', border: 'rgba(254, 240, 138, 0.45)', shadow: 'rgba(161, 98, 7, 0.25)', accent: '#fef9c3' },
  { bg: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)', badgeBg: 'linear-gradient(135deg, #93c5fd 0%, #3b82f6 100%)', badgeColor: '#172554', border: 'rgba(147, 197, 253, 0.45)', shadow: 'rgba(29, 78, 216, 0.25)', accent: '#dbeafe' },
  { bg: 'linear-gradient(135deg, #831843 0%, #9f1239 100%)', badgeBg: 'linear-gradient(135deg, #fda4af 0%, #f43f5e 100%)', badgeColor: '#4c0519', border: 'rgba(253, 164, 175, 0.45)', shadow: 'rgba(159, 18, 57, 0.25)', accent: '#ffe4e6' },
  { bg: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 100%)', badgeBg: 'linear-gradient(135deg, #d8b4fe 0%, #a855f7 100%)', badgeColor: '#2e1065', border: 'rgba(216, 180, 254, 0.45)', shadow: 'rgba(109, 40, 217, 0.25)', accent: '#f3e8ff' },
  { bg: 'linear-gradient(135deg, #0f291e 0%, #173f2f 100%)', badgeBg: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)', badgeColor: '#064e3b', border: 'rgba(52, 211, 153, 0.45)', shadow: 'rgba(23, 63, 47, 0.25)', accent: '#a7f3d0' },
];

const POPULAR_JUZ = [
  { num: 1, label: 'Juz 1 (Alif Lam Meem)' },
  { num: 15, label: 'Juz 15 (Subhanallazi)' },
  { num: 28, label: 'Juz 28 (Qad Sami’a)' },
  { num: 29, label: 'Juz 29 (Tabarak)' },
  { num: 30, label: 'Juz 30 (Amma)' },
];

export default function JuzBrowserPage() {
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    document.title = 'The 30 Holy Juz (Paras) — Noor Quran';
  }, []);

  const filteredJuz = JUZ_META.filter((j) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase().trim();
    return (
      j.number.toString().includes(q) ||
      `juz ${j.number}`.includes(q) ||
      `para ${j.number}`.includes(q) ||
      `surah ${j.startSurah}`.includes(q) ||
      `surah ${j.endSurah}`.includes(q)
    );
  });

  return (
    <div className="quran-page-container" style={{ paddingBottom: 100 }}>
      {/* ─── Panoramic Luxury Hero Banner ─── */}
      <div className="quran-hero-banner hero-bg-juz">
        <div className="quran-hero-overlay" />
        <div className="hero-glass-card">
          {/* Ornate Bismillah calligraphic badge */}
          <div style={{
            fontSize: '1.5rem',
            color: 'var(--color-gold-500)',
            fontFamily: "'Amiri', serif",
            fontWeight: 800,
            marginBottom: 8,
            letterSpacing: '0.04em',
            textShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}>
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2rem, 4.2vw, 3.2rem)',
            fontWeight: 800,
            color: 'var(--color-brand)',
            lineHeight: 1.15,
            margin: '0 0 14px',
          }}>
            The 30 Holy Juz, <br />
            <span style={{ color: 'var(--color-accent)' }}>Canonical Divisions</span>
          </h1>

          <p style={{
            fontSize: '1.05rem',
            lineHeight: 1.6,
            color: 'var(--color-text)',
            opacity: 0.9,
            marginBottom: 20,
          }}>
            Browse all 30 Juz (Paras) of the Noble Quran. Each portion allows you to systematically complete, memorize, and reflect upon divine revelation with verified start and end references.
          </p>

          {/* Statistics Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 9999,
              background: 'rgba(212, 175, 55, 0.18)',
              border: '1.5px solid var(--color-border-gold)',
              fontWeight: 800,
              fontSize: '0.9rem',
              color: 'var(--color-brand)',
            }}>
              <BookOpen size={16} className="shiny-icon" />
              <span>30 Juz (Paras)</span>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 9999,
              background: 'rgba(45, 106, 79, 0.16)',
              border: '1.5px solid var(--color-primary-300)',
              fontWeight: 800,
              fontSize: '0.9rem',
              color: 'var(--color-brand)',
            }}>
              <Sparkles size={16} className="shiny-icon" />
              <span>114 Complete Surahs</span>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 9999,
              background: 'rgba(212, 175, 55, 0.18)',
              border: '1.5px solid var(--color-border-gold)',
              fontWeight: 800,
              fontSize: '0.9rem',
              color: 'var(--color-brand)',
            }}>
              <span>6,236 Verses</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Search & Quick Jump Bar ─── */}
      <div style={{ marginBottom: 32 }}>
        {/* Search input */}
        <div style={{ position: 'relative', maxWidth: 640, marginBottom: 16 }}>
          <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            type="search"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter by Juz number (e.g. 1, 30) or Surah reference…"
            style={{
              width: '100%',
              padding: '14px 16px 14px 44px',
              borderRadius: 14,
              border: '2px solid var(--color-border-gold)',
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              fontSize: '0.95rem',
              outline: 'none',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
            }}
          />
        </div>

        {/* Popular Juz jump pills */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={14} className="shiny-icon" /> Popular Portions:
          </span>
          {POPULAR_JUZ.map((pj) => (
            <Link
              key={pj.num}
              to={`/juz/${pj.num}`}
              style={{
                textDecoration: 'none',
                padding: '6px 14px',
                borderRadius: 9999,
                fontSize: '0.82rem',
                fontWeight: 700,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border-gold)',
                color: 'var(--color-brand)',
                transition: 'all 0.2s ease',
              }}
            >
              {pj.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ─── 30 Jewel-Tone Juz Cards Grid ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
        {filteredJuz.map((juz) => {
          const theme = CARD_THEMES[(juz.number - 1) % CARD_THEMES.length];
          return (
            <Link
              key={juz.number}
              to={`/juz/${juz.number}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  background: theme.bg,
                  borderRadius: 20,
                  padding: '20px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  border: `1.5px solid ${theme.border}`,
                  boxShadow: `0 8px 24px ${theme.shadow}`,
                  transition: 'all 0.25s cubic-bezier(0.34, 1.3, 0.64, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 14px 32px ${theme.shadow}, 0 0 16px rgba(212, 175, 55, 0.3)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = `0 8px 24px ${theme.shadow}`;
                }}
              >
                {/* Number Badge */}
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: theme.badgeBg,
                  color: theme.badgeColor,
                  fontWeight: 900,
                  fontSize: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                }}>
                  {juz.number}
                </div>

                {/* Info Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 800,
                    fontSize: '1.15rem',
                    color: '#ffffff',
                    letterSpacing: '-0.01em',
                    marginBottom: 4,
                  }}>
                    Juz {juz.number}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: theme.accent,
                    lineHeight: 1.4,
                    display: 'inline-block',
                    background: 'rgba(0, 0, 0, 0.22)',
                    padding: '3px 8px',
                    borderRadius: 6,
                    fontWeight: 600,
                  }}>
                    Surah {juz.startSurah}:{juz.startAyah} → {juz.endSurah}:{juz.endAyah}
                  </div>
                </div>

                {/* Calligraphy and Action Arrow */}
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <span
                    className="arabic-text"
                    lang="ar"
                    style={{
                      fontSize: '1.45rem',
                      color: '#ffffff',
                      fontWeight: 800,
                      margin: 0,
                      lineHeight: 1,
                      textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    }}
                  >
                    الجزء {juz.number}
                  </span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: '0.75rem',
                    color: '#ffffff',
                    opacity: 0.85,
                    fontWeight: 700,
                  }}>
                    <span>Read</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div style={{ marginTop: 44, padding: '20px', borderRadius: 16, background: 'var(--color-surface)', border: '1px solid var(--color-border-gold)', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Canonical Juz division boundaries derived from traditional scholarly Quran manuscripts via <a href="https://api.alquran.cloud" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-brand)', textDecoration: 'none', fontWeight: 700 }}>Al Quran Cloud API</a>.
        </p>
      </div>
    </div>
  );
}
