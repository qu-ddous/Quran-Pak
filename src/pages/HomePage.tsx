import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Search, Headphones, Bookmark, ChevronRight, ArrowRight } from 'lucide-react';
import { fetchSurahList } from '../api/quranApi';
import { getLastRead } from '../db/userDb';
import type { SurahMeta } from '../types/quran';
import type { ReadingHistory } from '../db/userDb';

// Featured Surahs — well-known, commonly read
const FEATURED_SURAH_NUMBERS = [1, 2, 36, 55, 56, 67, 78, 112];

export default function HomePage() {
  const navigate = useNavigate();
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [lastRead, setLastRead] = useState<ReadingHistory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Noor Quran — Read the Noble Quran';
    Promise.all([
      fetchSurahList().then(setSurahs),
      getLastRead().then(setLastRead),
    ]).finally(() => setLoading(false));
  }, []);

  const featuredSurahs = surahs.filter((s) => FEATURED_SURAH_NUMBERS.includes(s.number));

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px 64px' }}>
      {/* Hero */}
      <section style={{ textAlign: 'center', marginBottom: 64 }}>
        <p
          className="arabic-text"
          lang="ar"
          style={{ fontSize: '2.5rem', color: 'var(--color-brand)', marginBottom: 8, fontWeight: 700 }}
          aria-label="Bismillah ir-Rahman ir-Rahim"
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 12px', lineHeight: 1.2, color: 'var(--color-text)' }}>
          Noor Quran
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: 32, lineHeight: 1.6, maxWidth: 560, margin: '0 auto 32px' }}>
          Read the Noble Quran in Arabic with English and Urdu translations. All 114 Surahs, real audio recitations, bookmarks, and notes — no account required.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          <Link to="/quran" className="btn-primary" style={{ fontSize: '1rem', padding: '12px 28px' }}>
            <BookOpen size={18} aria-hidden="true" />
            Browse Surahs
          </Link>
          <Link to="/search" className="btn-secondary" style={{ fontSize: '1rem', padding: '12px 28px' }}>
            <Search size={18} aria-hidden="true" />
            Search Quran
          </Link>
        </div>
      </section>

      {/* Continue Reading */}
      {lastRead && (
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16, color: 'var(--color-text)' }}>Continue Reading</h2>
          <button
            onClick={() => navigate(`/surah/${lastRead.surahNumber}#ayah-${lastRead.ayahNumber}`)}
            className="card"
            style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
              width: '100%', textAlign: 'left', cursor: 'pointer', border: '1.5px solid var(--color-primary-300)',
              background: 'var(--color-primary-50)', fontFamily: 'inherit',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--color-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BookOpen size={22} color="white" aria-hidden="true" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: 'var(--color-brand)', marginBottom: 2 }}>
                Surah {lastRead.surahNumber} — Ayah {lastRead.ayahNumber}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                Last read {new Date(lastRead.visitedAt).toLocaleDateString()}
              </div>
            </div>
            <ChevronRight size={20} style={{ color: 'var(--color-brand)', flexShrink: 0 }} aria-hidden="true" />
          </button>
        </section>
      )}

      {/* Feature Cards */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 20, color: 'var(--color-text)' }}>Explore</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { to: '/quran', icon: BookOpen, title: 'All Surahs', desc: 'Browse and read all 114 Surahs with Arabic text and translations' },
            { to: '/juz', icon: BookOpen, title: 'Juz Navigator', desc: 'Browse all 30 Juz with their start and end references' },
            { to: '/listen', icon: Headphones, title: 'Listen', desc: 'Recitation audio from renowned reciters via Al Quran Cloud' },
            { to: '/search', icon: Search, title: 'Search', desc: 'Search Arabic text, translations, and Surah:Ayah references' },
            { to: '/bookmarks', icon: Bookmark, title: 'Bookmarks', desc: 'Save and revisit your favourite verses. Stored locally on this device.' },
          ].map(({ to, icon: Icon, title, desc }) => (
            <Link
              key={to}
              to={to}
              style={{ textDecoration: 'none' }}
            >
              <div
                className="card"
                style={{
                  padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', gap: 12,
                  transition: 'transform 0.15s, box-shadow 0.15s', cursor: 'pointer',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--color-primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} style={{ color: 'var(--color-brand)' }} aria-hidden="true" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)', marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{desc}</div>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.82rem', color: 'var(--color-brand)', fontWeight: 600 }}>
                  Open <ArrowRight size={12} aria-hidden="true" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Surahs */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
            Commonly Read Surahs
          </h2>
          <Link to="/quran" style={{ fontSize: '0.875rem', color: 'var(--color-brand)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            See all <ChevronRight size={14} aria-hidden="true" />
          </Link>
        </div>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div key={i} style={{ height: 80, borderRadius: 12, background: 'var(--color-cream-200)', animation: 'pulse 1.5s ease infinite' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {featuredSurahs.map((s) => (
              <Link key={s.number} to={`/surah/${s.number}`} style={{ textDecoration: 'none' }}>
                <div
                  className="card"
                  style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12, transition: 'transform 0.15s, box-shadow 0.15s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: 8, background: 'var(--color-primary-100)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-brand)', flexShrink: 0,
                  }}>
                    {s.number}
                  </div>
                  <div style={{ overflow: 'hidden', flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.englishName}</div>
                    <div className="arabic-text" lang="ar" style={{ fontSize: '1rem', color: 'var(--color-brand)', lineHeight: 1.3, margin: 0 }}>{s.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{s.numberOfAyahs} ayahs · {s.revelationType}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <style>{`@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }`}</style>
    </div>
  );
}
