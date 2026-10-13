import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, ExternalLink, Sparkles, Copy, Search, BookOpen, ArrowRight } from 'lucide-react';
import { getBookmarks, removeBookmark } from '../db/userDb';
import { useToast } from '../context/ToastContext';
import type { Bookmark as BookmarkType } from '../db/userDb';
import { LoadingSpinner, EmptyState } from '../components/ui/SharedComponents';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    document.title = 'Saved Bookmarks — Noor Quran';
    getBookmarks().then(setBookmarks).finally(() => setLoading(false));
  }, []);

  const handleRemove = async (id: string) => {
    await removeBookmark(id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    showToast('Bookmark removed', 'info');
  };

  const copyBookmark = (bm: BookmarkType) => {
    const text = `Surah ${bm.surahEnglishName} [${bm.surahNumber}:${bm.ayahNumber}]\n${bm.ayahText}\n(Noor Quran)`;
    navigator.clipboard.writeText(text).then(() => showToast('Ayah copied to clipboard', 'success'));
  };

  const filteredBookmarks = bookmarks.filter((b) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase().trim();
    return (
      b.surahEnglishName.toLowerCase().includes(q) ||
      b.surahNumber.toString().includes(q) ||
      b.ayahNumber.toString().includes(q) ||
      b.ayahText.includes(q)
    );
  });

  const uniqueSurahsCount = new Set(bookmarks.map(b => b.surahNumber)).size;

  if (loading) return <LoadingSpinner text="Loading your bookmarks…" />;

  return (
    <div className="quran-page-container" style={{ paddingBottom: 100 }}>
      {/* ─── Panoramic Luxury Header Banner ─── */}
      <div className="quran-hero-banner hero-bg-bookmarks">
        <div className="quran-hero-overlay" />
        <div className="hero-glass-card">
          <div
            lang="ar"
            style={{
              fontSize: '1.45rem',
              color: 'var(--color-gold-500)',
              fontFamily: 'var(--font-arabic)',
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            آيات محفوظة ومفضلة
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            color: 'var(--color-brand)',
            lineHeight: 1.15,
            margin: '0 0 12px',
          }}>
            Saved Sacred Ayahs
          </h1>

          <p style={{
            fontSize: '1rem',
            lineHeight: 1.6,
            color: 'var(--color-text)',
            opacity: 0.9,
            marginBottom: 20,
          }}>
            Your personal sanctuary of divine verses saved for reflection, daily recitation, and spiritual memorization.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 9999,
              background: 'rgba(212, 175, 55, 0.18)',
              border: '1.5px solid var(--color-border-gold)',
              fontWeight: 800,
              fontSize: '0.85rem',
              color: 'var(--color-brand)',
            }}>
              <Bookmark size={15} className="shiny-icon" /> {bookmarks.length} Saved {bookmarks.length === 1 ? 'Verse' : 'Verses'}
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 9999,
              background: 'rgba(45, 106, 79, 0.16)',
              border: '1.5px solid var(--color-primary-300)',
              fontWeight: 800,
              fontSize: '0.85rem',
              color: 'var(--color-brand)',
            }}>
              <BookOpen size={15} className="shiny-icon" /> {uniqueSurahsCount} Distinct Chapters
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 9999,
              background: 'rgba(212, 175, 55, 0.18)',
              border: '1.5px solid var(--color-border-gold)',
              fontWeight: 800,
              fontSize: '0.85rem',
              color: 'var(--color-brand)',
            }}>
              <Sparkles size={15} className="shiny-icon" /> Private Device Storage
            </span>
          </div>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <EmptyState
          title="No Bookmarks Saved Yet"
          message="While reading any Surah, tap the Bookmark icon on any Ayah to preserve it here for quick access."
          icon={<Bookmark size={48} style={{ color: 'var(--color-gold-500)', opacity: 0.5 }} />}
        />
      ) : (
        <>
          {/* Search bar inside bookmarks */}
          <div style={{ position: 'relative', marginBottom: 24 }}>
            <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="search"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter saved verses by Surah name or Ayah text…"
              style={{
                width: '100%',
                padding: '12px 16px 12px 44px',
                borderRadius: 14,
                border: '1.5px solid var(--color-border-gold)',
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                fontSize: '0.92rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Bookmarks List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredBookmarks.map((bm) => (
              <div
                key={bm.id}
                className="card"
                style={{
                  padding: '24px 28px',
                  borderRadius: 18,
                  border: '1.5px solid var(--color-border-gold)',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="icon-badge-gold" style={{ width: 36, height: 36, borderRadius: '50%' }}>
                      <Bookmark size={18} className="shiny-icon" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: 'var(--color-brand)', fontSize: '1rem' }}>
                        Surah {bm.surahEnglishName} ({bm.surahNumber}:{bm.ayahNumber})
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        Saved {new Date(bm.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={() => copyBookmark(bm)}
                      className="btn-ghost"
                      style={{ padding: '6px 10px', borderRadius: 8 }}
                      title="Copy Ayah"
                    >
                      <Copy size={16} />
                    </button>

                    <button
                      onClick={() => handleRemove(bm.id)}
                      className="btn-ghost"
                      style={{ padding: '6px 10px', borderRadius: 8, color: '#dc2626' }}
                      title="Remove Bookmark"
                    >
                      <Trash2 size={16} />
                    </button>

                    <Link
                      to={`/surah/${bm.surahNumber}#ayah-${bm.ayahNumber}`}
                      className="btn-primary"
                      style={{
                        padding: '6px 14px',
                        borderRadius: 8,
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        textDecoration: 'none',
                      }}
                    >
                      <span>Read Ayah</span>
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>

                <p
                  className="arabic-text"
                  lang="ar"
                  style={{
                    fontSize: '1.5rem',
                    margin: 0,
                    color: 'var(--color-text)',
                    lineHeight: 2,
                    direction: 'rtl',
                    textAlign: 'right',
                  }}
                >
                  {bm.ayahText}{bm.ayahText.length >= 80 ? '…' : ''}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Footer Info */}
      <div style={{ marginTop: 44, padding: '18px 24px', borderRadius: 16, background: 'var(--color-surface)', border: '1px solid var(--color-border-gold)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
          Bookmarks are securely cached in local IndexedDB. They remain safely stored on this device.
        </span>
        <Link to="/quran" style={{ fontSize: '0.82rem', color: 'var(--color-accent)', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span>Browse All Surahs</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
