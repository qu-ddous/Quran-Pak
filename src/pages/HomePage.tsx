import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen, Search, Headphones, Bookmark, ChevronRight, ArrowRight,
  Sparkles, Compass, Download, Star
} from 'lucide-react';
import { fetchSurahList } from '../api/quranApi';
import { getLastRead } from '../db/userDb';
import type { SurahMeta } from '../types/quran';
import type { ReadingHistory } from '../db/userDb';

// Commonly recited daily Surahs
const FEATURED_SURAH_NUMBERS = [1, 2, 18, 36, 55, 56, 67, 112];

const QUICK_TAGS = [
  { label: 'Surah Yaseen', number: 36 },
  { label: 'Al-Mulk', number: 67 },
  { label: 'Ar-Rahman', number: 55 },
  { label: 'Al-Kahf', number: 18 },
  { label: 'Al-Waqi’ah', number: 56 },
  { label: 'Ayatul Kursi (2:255)', link: '/search?q=2:255' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [lastRead, setLastRead] = useState<ReadingHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [heroSearch, setHeroSearch] = useState('');

  useEffect(() => {
    document.title = 'Noor Quran — Read & Listen to the Noble Quran';
    Promise.all([
      fetchSurahList().then(setSurahs),
      getLastRead().then(setLastRead),
    ]).finally(() => setLoading(false));
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  const featuredSurahs = surahs.filter((s) => FEATURED_SURAH_NUMBERS.includes(s.number));

  return (
    <div>
      {/* ─── Panoramic Full-Width Hero Section (Matching User Reference) ─── */}
      <section
        className="hero-fullwidth"
        aria-label="Noor Quran Hero Banner"
      >
        <div className="hero-fullwidth-overlay" />

        <div className="hero-content-wrapper">
          <div className="hero-text-container">
            {/* Arabic Bismillah Calligraphy */}
            <p
              className="arabic-text"
              lang="ar"
              style={{
                fontSize: '1.9rem',
                color: 'var(--color-accent)',
                margin: '0 0 10px',
                fontWeight: 700,
                lineHeight: 1.2,
                textShadow: '0 0 16px rgba(212, 175, 55, 0.4)',
              }}
              aria-label="Bismillah ir-Rahman ir-Rahim"
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>

            {/* Editorial Headline matching reference screenshot */}
            <h1 className="hero-headline">
              A calm space<br />
              to reconnect<br />
              <span className="hero-gold-text">with the Quran</span>
            </h1>

            {/* Subtitle matching reference */}
            <p className="hero-subtext">
              Read, listen and reflect — at your own pace.
            </p>

            {/* Action Buttons matching reference */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', marginBottom: 28 }}>
              <Link
                to="/quran"
                className="hero-cta-btn"
                id="hero-start-reading-btn"
              >
                <BookOpen size={20} className="shiny-icon" style={{ color: 'var(--color-accent)' }} />
                <span>Start reading</span>
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/listen"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '13px 24px',
                  borderRadius: 9999,
                  background: 'rgba(255, 255, 255, 0.88)',
                  backdropFilter: 'blur(8px)',
                  border: '1.5px solid var(--color-border-gold)',
                  color: 'var(--color-brand)',
                  fontWeight: 700,
                  fontSize: '0.96rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                  transition: 'all 0.2s ease',
                }}
              >
                <Headphones size={18} className="shiny-icon" style={{ color: 'var(--color-accent)' }} />
                <span>Listen Audio</span>
              </Link>
            </div>

            {/* Quick Search Form */}
            <form
              onSubmit={handleHeroSearch}
              style={{
                maxWidth: 480,
                marginBottom: 16,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <input
                type="search"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search verse or chapter (e.g. Yaseen, 2:255)…"
                style={{
                  width: '100%',
                  padding: '12px 105px 12px 18px',
                  borderRadius: 9999,
                  border: '1.5px solid var(--color-border-gold)',
                  background: 'rgba(255, 255, 255, 0.94)',
                  color: 'var(--color-ink-900)',
                  fontSize: '0.9rem',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                className="btn-gold"
                style={{
                  position: 'absolute',
                  right: 4,
                  padding: '7px 16px',
                  fontSize: '0.84rem',
                  borderRadius: 9999,
                }}
              >
                <Search size={14} /> Search
              </button>
            </form>

            {/* Quick jump tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Sparkles size={12} className="shiny-icon" /> Popular:
              </span>
              {QUICK_TAGS.map((tag) => (
                <Link
                  key={tag.label}
                  to={tag.link ?? `/surah/${tag.number}`}
                  style={{
                    fontSize: '0.76rem',
                    color: 'var(--color-brand)',
                    background: 'rgba(212, 175, 55, 0.12)',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                    padding: '3px 10px',
                    borderRadius: 20,
                    textDecoration: 'none',
                    fontWeight: 600,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main Content Container (Bounded width for comfortable reading) ─── */}
      <div style={{ maxWidth: 1260, margin: '0 auto', padding: '36px 20px 80px' }}>

      {/* ─── Continue Reading Banner (if user has history) ─── */}
      {lastRead && (
        <section style={{ marginBottom: 36 }}>
          <div
            onClick={() => navigate(`/surah/${lastRead.surahNumber}#ayah-${lastRead.ayahNumber}`)}
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '16px 24px',
              borderRadius: 16,
              border: '1.5px solid var(--color-border-gold)',
              background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-cream-100) 100%)',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            }}
          >
            <div className="icon-badge-shiny" style={{ width: 44, height: 44, borderRadius: 12 }}>
              <BookOpen size={22} className="shiny-icon" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 800, color: 'var(--color-brand)', fontSize: '1rem' }}>
                  Continue Reading: Surah {lastRead.surahNumber}
                </span>
                <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 10, background: 'var(--color-gold-soft)', color: 'var(--color-accent)', fontWeight: 700 }}>
                  Ayah {lastRead.ayahNumber}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                Pick up where you left off • Last recited {new Date(lastRead.visitedAt).toLocaleDateString()}
              </div>
            </div>
            <div className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              Resume <ChevronRight size={14} className="shiny-icon" />
            </div>
          </div>
        </section>
      )}

      {/* ─── Verse of Inspiration Card ─── */}
      <section style={{ marginBottom: 40 }}>
        <div
          className="mushaf-frame"
          style={{
            padding: '28px 32px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-cream-100) 100%)',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, background: 'var(--color-gold-soft)', border: '1px solid var(--color-gold-500)', color: 'var(--color-brand)', fontSize: '0.78rem', fontWeight: 700, marginBottom: 12 }}>
            <Star size={13} className="shiny-icon" /> AYAH OF INSPIRATION
          </div>
          <p
            className="arabic-text"
            lang="ar"
            style={{ fontSize: '2.1rem', color: 'var(--color-brand)', margin: '0 0 10px', fontWeight: 700, lineHeight: 1.8 }}
          >
            فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا
          </p>
          <p style={{ fontStyle: 'italic', color: 'var(--color-text)', maxWidth: 600, margin: '0 auto 12px', fontSize: '1.02rem', lineHeight: 1.6 }}>
            "For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease."
          </p>
          <div style={{ fontSize: '0.82rem', color: 'var(--color-accent)', fontWeight: 700 }}>
            Surah Ash-Sharh (94:5-6)
          </div>
        </div>
      </section>

      {/* ─── Key Pathways Grid (Shiny Cards) ─── */}
      <section style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Compass size={22} className="shiny-icon" style={{ color: 'var(--color-accent)' }} /> Explore Noor Quran
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
          {[
            { to: '/quran', icon: BookOpen, title: 'All 114 Surahs', desc: 'Browse the complete holy Quran with chapter translations and audio recitation', color: 'emerald' },
            { to: '/juz', icon: Compass, title: '30 Juz Directory', desc: 'Continuous reading across scholarly juz divisions with exact start/end references', color: 'gold' },
            { to: '/listen', icon: Headphones, title: 'Audio Streamer', desc: 'High-quality murattal recitations from Mishary Alafasy, Sudais, and Husary', color: 'emerald' },
            { to: '/search', icon: Search, title: 'Verse Search', desc: 'Search any word in English or Arabic, or type direct chapter references (e.g. 2:255)', color: 'gold' },
            { to: '/downloads', icon: Download, title: 'Offline Reading', desc: 'Save entire Surahs into local browser storage for travel or low connectivity', color: 'emerald' },
            { to: '/bookmarks', icon: Bookmark, title: 'Saved Ayahs', desc: 'Store meaningful verses and bookmark reading checkpoints directly on device', color: 'gold' },
          ].map(({ to, icon: Icon, title, desc, color }) => (
            <Link key={to} to={to} style={{ textDecoration: 'none' }}>
              <div
                className="card"
                style={{
                  padding: 22,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 16,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-gold-500)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(27,67,50,0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)';
                  (e.currentTarget as HTMLDivElement).style.transform = '';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '';
                }}
              >
                <div className={color === 'emerald' ? 'icon-badge-shiny' : 'icon-badge-gold'} style={{ width: 44, height: 44, borderRadius: 12 }}>
                  <Icon size={22} className="shiny-icon" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.02rem', color: 'var(--color-text)', marginBottom: 6 }}>
                    {title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    {desc}
                  </div>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--color-brand)', fontWeight: 700 }}>
                  Open Section <ArrowRight size={13} className="shiny-icon" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Frequently Recited Surahs with User's Emerald & Gold Design ─── */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
            Frequently Recited Surahs
          </h2>
          <Link to="/quran" style={{ fontSize: '0.88rem', color: 'var(--color-brand)', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
            View all 114 Surahs <ChevronRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} style={{ height: 84, borderRadius: 16, background: 'var(--color-cream-200)', animation: 'spin 1s infinite' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {featuredSurahs.map((s) => (
              <Link key={s.number} to={`/surah/${s.number}`} style={{ textDecoration: 'none' }}>
                <div className="surah-card-emerald">
                  {/* Number Badge */}
                  <div className="surah-card-number-badge">
                    {s.number}
                  </div>

                  {/* English Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff', letterSpacing: '-0.01em', marginBottom: 2 }}>
                      {s.englishName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#bce5cf', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span>{s.numberOfAyahs} Ayahs</span>
                      <span>•</span>
                      <span>{s.revelationType}</span>
                    </div>
                  </div>

                  {/* Glowing Golden Arabic Name */}
                  <div className="surah-card-arabic" lang="ar">
                    {s.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
    </div>
  );
}
