import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, Search, ChevronLeft, ChevronRight,
  Maximize2, Minimize2
} from 'lucide-react';
import { getBookById } from '../db/booksDb';
import type { IslamicBook } from '../types/books';
import { DuaItemCard } from '../components/books/DuaItemCard';

export default function BookReaderPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [book, setBook] = useState<IslamicBook | null>(null);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);

  // Reading Preferences
  const [viewMode, setViewMode] = useState<'page' | 'continuous'>('page');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [arabicFontSize, setArabicFontSize] = useState(26);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showUrdu, setShowUrdu] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);
  const [inBookQuery, setInBookQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!bookId) return;
    const found = getBookById(bookId);
    if (found) {
      setBook(found);
      document.title = `${found.title} — Noor Quran`;
    } else {
      navigate('/books');
    }
  }, [bookId, navigate]);

  // Handle hash navigation (e.g. #item-nh-qunoot-full)
  useEffect(() => {
    if (location.hash && book) {
      const itemId = location.hash.replace('#item-', '');
      // Find which chapter and item index contains this itemId
      for (let chIdx = 0; chIdx < book.chapters.length; chIdx++) {
        const itIdx = book.chapters[chIdx].items.findIndex((it) => it.id === itemId);
        if (itIdx !== -1) {
          setSelectedChapterIndex(chIdx);
          setCurrentPageIndex(itIdx);
          break;
        }
      }
    }
  }, [location.hash, book]);

  const currentChapter = book?.chapters[selectedChapterIndex] || book?.chapters[0];

  // Filter items in current chapter by inBookQuery
  const chapterItems = useMemo(() => {
    if (!currentChapter) return [];
    if (!inBookQuery.trim()) return currentChapter.items;

    const q = inBookQuery.toLowerCase().trim();
    return currentChapter.items.filter((it) =>
      it.title.toLowerCase().includes(q) ||
      it.arabicText.includes(q) ||
      it.translationUrdu.includes(q) ||
      it.translationEnglish.toLowerCase().includes(q)
    );
  }, [currentChapter, inBookQuery]);

  // Adjust page index when chapterItems change
  useEffect(() => {
    if (currentPageIndex >= chapterItems.length) {
      setCurrentPageIndex(0);
    }
  }, [chapterItems.length, currentPageIndex]);

  if (!book || !currentChapter) {
    return (
      <div className="quran-page-container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>کتاب لوڈ ہو رہی ہے...</h2>
        <Link to="/books" className="btn-primary" style={{ marginTop: 20, display: 'inline-block' }}>
          تمام کتب پر واپس جائیں
        </Link>
      </div>
    );
  }

  const totalPages = chapterItems.length;
  const currentItem = chapterItems[currentPageIndex];

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex((prev) => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="quran-page-container" style={{ paddingBottom: 100 }}>
      {/* ─── Breadcrumb & Back Link ─────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 18,
          marginBottom: 16,
          fontSize: '0.86rem',
        }}
      >
        <Link
          to="/books"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--color-brand)',
            textDecoration: 'none',
            fontWeight: 700,
          }}
        >
          <ArrowLeft size={16} />
          <span>کتب لائبریری (All Books)</span>
        </Link>

        <span
          style={{
            padding: '3px 10px',
            borderRadius: 14,
            fontSize: '0.74rem',
            fontWeight: 700,
            background: 'var(--color-gold-soft)',
            color: 'var(--color-gold-700)',
          }}
        >
          {book.categoryLabel}
        </span>
      </div>

      {/* ─── Book Header Card ────────────────────────────────────────────────── */}
      <section
        style={{
          borderRadius: 22,
          padding: '24px 28px',
          background: book.coverGradient,
          color: '#ffffff',
          marginBottom: 24,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
            <div>
              <h1
                style={{
                  margin: '0 0 6px',
                  fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
                  fontWeight: 800,
                }}
              >
                {book.title}
              </h1>
              <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: 8 }}>
                {book.author} • {book.readTime}
              </div>
            </div>

            <div
              className="arabic-text"
              style={{
                fontSize: '1.6rem',
                color: 'var(--color-accent)',
                fontWeight: 700,
                direction: 'rtl',
                textAlign: 'left',
              }}
            >
              {book.arabicTitle}
            </div>
          </div>

          <p
            style={{
              margin: '8px 0 0',
              fontSize: '0.88rem',
              color: 'rgba(255, 255, 255, 0.88)',
              maxWidth: 760,
              lineHeight: 1.55,
            }}
          >
            {book.description}
          </p>
        </div>
      </section>

      {/* ─── Reading Control Toolbar ─────────────────────────────────────────── */}
      <div
        className="card"
        style={{
          borderRadius: 18,
          padding: '16px 20px',
          marginBottom: 24,
          border: '1.5px solid var(--color-border)',
          background: 'var(--color-surface)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {/* Row 1: Chapter Selector & Mode Switcher */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          {/* Chapter Selector (if multiple chapters) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 240 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
              باب / فہرست:
            </span>
            <select
              value={selectedChapterIndex}
              onChange={(e) => {
                setSelectedChapterIndex(Number(e.target.value));
                setCurrentPageIndex(0);
              }}
              style={{
                width: '100%',
                maxWidth: 320,
                padding: '8px 12px',
                borderRadius: 10,
                border: '1.5px solid var(--color-border)',
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
                fontSize: '0.88rem',
                fontWeight: 600,
              }}
            >
              {book.chapters.map((ch, idx) => (
                <option key={ch.id} value={idx}>
                  {idx + 1}. {ch.title} ({ch.items.length})
                </option>
              ))}
            </select>
          </div>

          {/* Mode Switcher: Page by Page vs Continuous */}
          <div
            style={{
              display: 'inline-flex',
              background: 'var(--color-bg)',
              borderRadius: 12,
              padding: 4,
              border: '1px solid var(--color-border)',
            }}
          >
            <button
              onClick={() => setViewMode('page')}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: 'none',
                background: viewMode === 'page' ? 'var(--color-brand)' : 'transparent',
                color: viewMode === 'page' ? '#ffffff' : 'var(--color-text-muted)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              📖 صفحہ وار (Page View)
            </button>
            <button
              onClick={() => setViewMode('continuous')}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: 'none',
                background: viewMode === 'continuous' ? 'var(--color-brand)' : 'transparent',
                color: viewMode === 'continuous' ? '#ffffff' : 'var(--color-text-muted)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              📜 مکمل فہرست (All Duas)
            </button>
            <button
              onClick={toggleFullscreen}
              aria-label="Toggle Fullscreen"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Reading Mode'}
              style={{
                marginLeft: 4,
                padding: '6px 10px',
                borderRadius: 8,
                border: 'none',
                background: isFullscreen ? 'var(--color-gold-soft)' : 'transparent',
                color: isFullscreen ? 'var(--color-gold-700)' : 'var(--color-text-muted)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              <span>{isFullscreen ? 'Exit' : 'Full'}</span>
            </button>
          </div>
        </div>

        {/* Row 2: In-book Search & Display Settings */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, borderTop: '1px solid var(--color-border)', paddingTop: 12 }}>
          {/* Quick in-book search */}
          <div style={{ position: 'relative', minWidth: 220, flex: 1 }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
              }}
            />
            <input
              type="text"
              value={inBookQuery}
              onChange={(e) => {
                setInBookQuery(e.target.value);
                setCurrentPageIndex(0);
              }}
              placeholder="اس کتاب میں تلاش کریں..."
              style={{
                width: '100%',
                padding: '6px 12px 6px 32px',
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
                fontSize: '0.82rem',
              }}
            />
          </div>

          {/* Arabic Font Sizer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              عربی فونٹ سائز:
            </span>
            <button
              onClick={() => setArabicFontSize((prev) => Math.max(18, prev - 2))}
              aria-label="Decrease font size"
              style={{
                padding: '4px 8px',
                borderRadius: 6,
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: 700,
              }}
            >
              A-
            </button>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-brand)', minWidth: 26, textAlign: 'center' }}>
              {arabicFontSize}
            </span>
            <button
              onClick={() => setArabicFontSize((prev) => Math.min(42, prev + 2))}
              aria-label="Increase font size"
              style={{
                padding: '4px 8px',
                borderRadius: 6,
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: 700,
              }}
            >
              A+
            </button>
          </div>

          {/* Toggle Translation Chips */}
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => setShowUrdu((p) => !p)}
              style={{
                padding: '4px 10px',
                borderRadius: 8,
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: showUrdu ? '1.5px solid var(--color-brand)' : '1px solid var(--color-border)',
                background: showUrdu ? 'rgba(27, 67, 50, 0.1)' : 'transparent',
                color: showUrdu ? 'var(--color-brand)' : 'var(--color-text-muted)',
              }}
            >
              اردو {showUrdu ? '✓' : ''}
            </button>

            <button
              onClick={() => setShowEnglish((p) => !p)}
              style={{
                padding: '4px 10px',
                borderRadius: 8,
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: showEnglish ? '1.5px solid var(--color-brand)' : '1px solid var(--color-border)',
                background: showEnglish ? 'rgba(27, 67, 50, 0.1)' : 'transparent',
                color: showEnglish ? 'var(--color-brand)' : 'var(--color-text-muted)',
              }}
            >
              English {showEnglish ? '✓' : ''}
            </button>

            <button
              onClick={() => setShowTransliteration((p) => !p)}
              style={{
                padding: '4px 10px',
                borderRadius: 8,
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: showTransliteration ? '1.5px solid var(--color-accent)' : '1px solid var(--color-border)',
                background: showTransliteration ? 'var(--color-gold-soft)' : 'transparent',
                color: showTransliteration ? 'var(--color-gold-700)' : 'var(--color-text-muted)',
              }}
            >
              تلفظ {showTransliteration ? '✓' : ''}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Reading View ────────────────────────────────────────────────────── */}
      {chapterItems.length === 0 ? (
        <div className="card" style={{ padding: '40px 20px', textAlign: 'center', borderRadius: 16 }}>
          <h3>اس تلاش پر کوئی دعا نہیں ملی</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            تلاش کا لفظ تبدیل کر کے دوبارہ کوشش کریں۔
          </p>
          <button onClick={() => setInBookQuery('')} className="btn-primary" style={{ marginTop: 12 }}>
            تمام دعائیں دیکھیں
          </button>
        </div>
      ) : viewMode === 'page' ? (
        /* PAGE BY PAGE READER MODE */
        <div>
          {/* Top Page Progress Indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
              padding: '8px 16px',
              borderRadius: 14,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-brand)' }}>
              صفحہ {currentPageIndex + 1} از {totalPages}
            </div>

            {/* Quick Page Jump Slider / Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                صفحہ منتخب کریں:
              </span>
              <select
                value={currentPageIndex}
                onChange={(e) => {
                  setCurrentPageIndex(Number(e.target.value));
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                style={{
                  padding: '4px 8px',
                  borderRadius: 6,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  fontSize: '0.8rem',
                }}
              >
                {chapterItems.map((it, idx) => (
                  <option key={it.id} value={idx}>
                    {idx + 1}. {it.title.substring(0, 32)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Current Page Dua Item Card */}
          {currentItem && (
            <DuaItemCard
              item={currentItem}
              bookId={book.id}
              bookTitle={book.title}
              arabicFontSize={arabicFontSize}
              showTransliteration={showTransliteration}
              showUrdu={showUrdu}
              showEnglish={showEnglish}
            />
          )}

          {/* Bottom Page Navigation Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              marginTop: 20,
              padding: '12px 18px',
              borderRadius: 18,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            }}
          >
            <button
              onClick={handlePrevPage}
              disabled={currentPageIndex === 0}
              className="btn-ghost"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 18px',
                borderRadius: 12,
                fontSize: '0.88rem',
                fontWeight: 700,
                opacity: currentPageIndex === 0 ? 0.4 : 1,
                cursor: currentPageIndex === 0 ? 'not-allowed' : 'pointer',
                border: '1px solid var(--color-border)',
              }}
            >
              <ChevronLeft size={18} />
              <span>پچھلا صفحہ • Previous</span>
            </button>

            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-gold-700)' }}>
              {currentPageIndex + 1} / {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPageIndex === totalPages - 1}
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 18px',
                borderRadius: 12,
                fontSize: '0.88rem',
                fontWeight: 700,
                opacity: currentPageIndex === totalPages - 1 ? 0.4 : 1,
                cursor: currentPageIndex === totalPages - 1 ? 'not-allowed' : 'pointer',
              }}
            >
              <span>اگلا صفحہ • Next</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      ) : (
        /* CONTINUOUS LIST READER MODE */
        <div>
          {chapterItems.map((item) => (
            <DuaItemCard
              key={item.id}
              item={item}
              bookId={book.id}
              bookTitle={book.title}
              arabicFontSize={arabicFontSize}
              showTransliteration={showTransliteration}
              showUrdu={showUrdu}
              showEnglish={showEnglish}
            />
          ))}
        </div>
      )}
    </div>
  );
}
