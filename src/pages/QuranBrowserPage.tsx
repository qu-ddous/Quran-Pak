import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, BookOpen, ChevronRight, Compass } from 'lucide-react';
import { fetchSurahList } from '../api/quranApi';
import type { SurahMeta } from '../types/quran';
import { LoadingSpinner, ErrorState } from '../components/ui/SharedComponents';

type RevelationType = 'all' | 'Meccan' | 'Medinan';
type SortOption = 'default' | 'ayahs-desc' | 'ayahs-asc' | 'alpha';

const POPULAR_SURAHS = [
  { number: 1, name: 'Al-Fatihah' },
  { number: 2, name: 'Al-Baqarah' },
  { number: 18, name: 'Al-Kahf' },
  { number: 36, name: 'Yaseen' },
  { number: 55, name: 'Ar-Rahman' },
  { number: 56, name: 'Al-Waqi’ah' },
  { number: 67, name: 'Al-Mulk' },
  { number: 112, name: 'Al-Ikhlas' },
];

const CARD_THEMES = [
  {
    gradient: 'linear-gradient(135deg, #092c21 0%, #175440 60%, #0d382b 100%)',
    border: 'rgba(212, 175, 55, 0.65)',
    glow: 'rgba(212, 175, 55, 0.35)',
    accent: '#fef08a',
    badgeBg: 'linear-gradient(135deg, #ca8a04 0%, #eab308 100%)',
  },
  {
    gradient: 'linear-gradient(135deg, #451a03 0%, #854d0e 55%, #713f12 100%)',
    border: 'rgba(250, 204, 21, 0.65)',
    glow: 'rgba(234, 179, 8, 0.35)',
    accent: '#fef9c3',
    badgeBg: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
  },
  {
    gradient: 'linear-gradient(135deg, #081d38 0%, #1d4ed8 55%, #1e3a8a 100%)',
    border: 'rgba(96, 165, 250, 0.65)',
    glow: 'rgba(59, 130, 246, 0.35)',
    accent: '#dbeafe',
    badgeBg: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
  },
  {
    gradient: 'linear-gradient(135deg, #4c0519 0%, #9f1239 55%, #881337 100%)',
    border: 'rgba(251, 113, 133, 0.65)',
    glow: 'rgba(244, 63, 94, 0.35)',
    accent: '#ffe4e6',
    badgeBg: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)',
  },
  {
    gradient: 'linear-gradient(135deg, #2e0854 0%, #6b21a8 55%, #581c87 100%)',
    border: 'rgba(192, 132, 252, 0.65)',
    glow: 'rgba(168, 85, 247, 0.35)',
    accent: '#f3e8ff',
    badgeBg: 'linear-gradient(135deg, #7e22ce 0%, #9333ea 100%)',
  },
  {
    gradient: 'linear-gradient(135deg, #022c22 0%, #0f766e 55%, #115e59 100%)',
    border: 'rgba(45, 212, 191, 0.65)',
    glow: 'rgba(20, 184, 166, 0.35)',
    accent: '#ccfbf1',
    badgeBg: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
  },
];

export default function QuranBrowserPage() {
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [query, setQuery] = useState('');
  const [revelation, setRevelation] = useState<RevelationType>('all');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchSurahList()
      .then((data) => setSurahs(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.title = 'All 114 Surahs — Noor Quran';
    load();
  }, [load]);

  const filteredSurahs = useMemo(() => {
    let list = [...surahs];
    const q = query.toLowerCase().trim();

    if (q) {
      list = list.filter((s) =>
        s.englishName.toLowerCase().includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        s.name.includes(q) ||
        String(s.number).includes(q)
      );
    }

    if (revelation !== 'all') {
      list = list.filter((s) => s.revelationType === revelation);
    }

    switch (sortOption) {
      case 'ayahs-desc':
        list.sort((a, b) => b.numberOfAyahs - a.numberOfAyahs);
        break;
      case 'ayahs-asc':
        list.sort((a, b) => a.numberOfAyahs - b.numberOfAyahs);
        break;
      case 'alpha':
        list.sort((a, b) => a.englishName.localeCompare(b.englishName));
        break;
      default:
        list.sort((a, b) => a.number - b.number);
        break;
    }

    return list;
  }, [surahs, query, revelation, sortOption]);

  if (loading) return <LoadingSpinner text="Loading Surah list…" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div style={{ maxWidth: 1540, width: '100%', margin: '0 auto', padding: '0 24px 100px' }}>
      {/* ─── 1. Panoramic Arched Hero Banner ─── */}
      <section className="quran-hero-banner hero-bg-quran">
        <div className="quran-hero-overlay" />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 680 }}>
          {/* Bismillah Calligraphy */}
          <p
            className="arabic-text"
            lang="ar"
            style={{
              fontSize: '1.9rem',
              color: 'var(--color-accent)',
              margin: '0 0 10px',
              fontWeight: 700,
              lineHeight: 1.2,
              textShadow: '0 0 14px rgba(212, 175, 55, 0.4)',
            }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>

          <h1 className="hero-headline" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', margin: '0 0 12px' }}>
            The Noble Quran, <span className="hero-gold-text">All 114 Chapters</span>
          </h1>

          <p style={{ fontSize: '1.02rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: '0 0 24px' }}>
            Explore the complete divine revelation in verified Uthmani script with multilingual translations, authentic verse recitations, and scholarly metadata.
          </p>

          {/* Quick Stats Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 9999,
              background: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid var(--color-border-gold)',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--color-brand)',
            }}>
              <BookOpen size={14} className="shiny-icon" /> 114 Surahs
            </span>

            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 9999,
              background: 'rgba(45, 106, 79, 0.12)',
              border: '1px solid rgba(45, 106, 79, 0.35)',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--color-brand)',
            }}>
              <Sparkles size={14} className="shiny-icon" /> 6,236 Verses
            </span>

            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 9999,
              background: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid var(--color-border-gold)',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--color-brand)',
            }}>
              <Compass size={14} className="shiny-icon" /> 30 Juz
            </span>
          </div>
        </div>
      </section>

      {/* ─── 2. Search, Revelation Filters & Sorting ─── */}
      <section style={{ marginBottom: 32 }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 14,
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 18,
        }}>
          {/* Search Box */}
          <div style={{ flex: 1, minWidth: 280, position: 'relative' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-accent)',
              }}
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, number, or meaning (e.g. Yaseen, 36, The Cow)…"
              style={{
                width: '100%',
                padding: '12px 16px 12px 42px',
                borderRadius: 9999,
                border: '1.5px solid var(--color-border-gold)',
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                fontSize: '0.92rem',
                outline: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                transition: 'border-color 0.15s ease',
              }}
            />
          </div>

          {/* Revelation Pills: All / Meccan / Medinan */}
          <div style={{ display: 'flex', gap: 6 }}>
            {(['all', 'Meccan', 'Medinan'] as const).map((type) => {
              const count = type === 'all' ? 114 : type === 'Meccan' ? 86 : 28;
              const isSelected = revelation === type;
              return (
                <button
                  key={type}
                  onClick={() => setRevelation(type)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 9999,
                    border: isSelected ? '1.5px solid #d4af37' : '1px solid var(--color-border)',
                    background: isSelected ? 'var(--color-brand)' : 'var(--color-surface)',
                    color: isSelected ? '#ffffff' : 'var(--color-text-muted)',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(15, 56, 44, 0.3)' : 'none',
                  }}
                >
                  {type === 'all' ? 'All' : type} ({count})
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              style={{
                padding: '8px 14px',
                borderRadius: 12,
                border: '1px solid var(--color-border-gold)',
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                fontSize: '0.85rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="default">Surah Order (1–114)</option>
              <option value="ayahs-desc">Most Verses First</option>
              <option value="ayahs-asc">Fewest Verses First</option>
              <option value="alpha">Alphabetical (A–Z)</option>
            </select>
          </div>
        </div>

        {/* Popular Surahs Quick Jumps */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Sparkles size={13} className="shiny-icon" /> Popular Surahs:
          </span>
          {POPULAR_SURAHS.map((s) => (
            <Link
              key={s.number}
              to={`/surah/${s.number}`}
              style={{
                padding: '4px 12px',
                borderRadius: 20,
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                color: 'var(--color-brand)',
                fontSize: '0.78rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {s.name} ({s.number})
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 3. Result Count & Active Filter Indicator ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', margin: 0, fontWeight: 600 }}>
          Showing <span style={{ color: 'var(--color-brand)', fontWeight: 800 }}>{filteredSurahs.length}</span> {filteredSurahs.length === 1 ? 'Surah' : 'Surahs'}
          {(query || revelation !== 'all') && ` matching criteria`}
        </p>

        {query && (
          <button
            onClick={() => setQuery('')}
            className="btn-ghost"
            style={{ fontSize: '0.82rem', padding: '4px 10px', color: 'var(--color-accent)' }}
          >
            Clear Search
          </button>
        )}
      </div>

      {/* ─── 4. Vibrant 114 Jewel-Tone Surah Cards Grid ─── */}
      {filteredSurahs.length === 0 ? (
        <div style={{
          padding: '60px 24px',
          textAlign: 'center',
          background: 'var(--color-surface)',
          borderRadius: 20,
          border: '1.5px dashed var(--color-border)',
        }}>
          <BookOpen size={36} style={{ color: 'var(--color-accent)', opacity: 0.6, marginBottom: 12 }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-brand)', marginBottom: 6 }}>
            No Surahs found for "{query}"
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: '0 0 16px' }}>
            Try searching with a different spelling, English meaning, or Surah number.
          </p>
          <button
            onClick={() => { setQuery(''); setRevelation('all'); }}
            className="btn-gold"
            style={{ padding: '8px 20px', borderRadius: 9999 }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filteredSurahs.map((s) => {
            const theme = CARD_THEMES[(s.number - 1) % CARD_THEMES.length];
            return (
              <Link
                key={s.number}
                to={`/surah/${s.number}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '16px 20px',
                    borderRadius: 18,
                    background: theme.gradient,
                    border: `2px solid ${theme.border}`,
                    boxShadow: `0 6px 20px rgba(0, 0, 0, 0.2), 0 0 14px ${theme.glow}`,
                    color: '#ffffff',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px) scale(1.015)';
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 10px 28px rgba(0,0,0,0.35), 0 0 22px ${theme.border}`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = '';
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 20px rgba(0, 0, 0, 0.2), 0 0 14px ${theme.glow}`;
                  }}
                >
                  {/* Hexagon Gold Number Badge */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: theme.badgeBg,
                      color: '#143526',
                      fontWeight: 900,
                      fontSize: '1.1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 4px 10px rgba(0,0,0,0.35)',
                      border: '1.5px solid rgba(255,255,255,0.7)',
                    }}
                  >
                    {s.number}
                  </div>

                  {/* English Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: '1.08rem', color: '#ffffff', letterSpacing: '-0.01em', marginBottom: 2 }}>
                      {s.englishName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.85)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span>{s.numberOfAyahs} Ayahs</span>
                      <span>•</span>
                      <span>{s.revelationType}</span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: theme.accent, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      "{s.englishNameTranslation}"
                    </div>
                  </div>

                  {/* Glowing Arabic Name */}
                  <div
                    className="arabic-text"
                    lang="ar"
                    style={{
                      fontSize: '1.55rem',
                      fontWeight: 800,
                      color: theme.accent,
                      textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                      flexShrink: 0,
                    }}
                  >
                    {s.name}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* ─── 5. Revelation Wisdom & Insights Section ─── */}
      <section style={{ marginTop: 60 }}>
        <h2 className="section-title-editorial" style={{ fontSize: '1.75rem', marginBottom: 6 }}>
          Wisdom of Divine Revelation
        </h2>
        <p className="section-subtitle-editorial" style={{ marginBottom: 28 }}>
          The Quran was revealed over 23 years across two blessed eras of the Prophet Muhammad ﷺ.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {/* Meccan Card */}
          <div
            className="card"
            style={{
              padding: 24,
              borderRadius: 20,
              border: '1.5px solid var(--color-border-gold)',
              background: 'var(--color-surface)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div className="icon-badge-shiny" style={{ width: 40, height: 40, borderRadius: 12 }}>
                <Compass size={20} className="shiny-icon" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-brand)', margin: 0 }}>
                  Meccan Surahs (86 Chapters)
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-accent)', fontWeight: 700 }}>Early Revelation • Faith & Tawheed</span>
              </div>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: '0 0 16px' }}>
              Revealed in Makkah before the Hijrah. Characterized by profound rhythm, concise impactful verses establishing Tawheed (Monotheism), resurrection, prophethood, and moral uprightness.
            </p>
            <button
              onClick={() => setRevelation('Meccan')}
              className="btn-outline-gold"
              style={{ fontSize: '0.82rem', padding: '6px 16px' }}
            >
              Filter 86 Meccan Surahs <ChevronRight size={13} />
            </button>
          </div>

          {/* Medinan Card */}
          <div
            className="card"
            style={{
              padding: 24,
              borderRadius: 20,
              border: '1.5px solid var(--color-border-gold)',
              background: 'var(--color-surface)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div className="icon-badge-gold" style={{ width: 40, height: 40, borderRadius: 12 }}>
                <BookOpen size={20} className="shiny-icon" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-brand)', margin: 0 }}>
                  Medinan Surahs (28 Chapters)
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-accent)', fontWeight: 700 }}>Post-Hijrah • Law & Community</span>
              </div>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: '0 0 16px' }}>
              Revealed in Madinah after the Hijrah. Features detailed legislation, societal governance, family laws, treaties, financial ethics, and instructions for the Muslim community.
            </p>
            <button
              onClick={() => setRevelation('Medinan')}
              className="btn-outline-gold"
              style={{ fontSize: '0.82rem', padding: '6px 16px' }}
            >
              Filter 28 Medinan Surahs <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
