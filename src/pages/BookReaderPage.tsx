import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, Search, ChevronLeft, ChevronRight,
  Maximize2, Minimize2, BookOpen, ScrollText,
  Minus, Plus, Type, UserCheck, BookMarked
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
      document.title = `${found.titleEnglish || found.title} — Noor Quran`;
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
      (it.titleEnglish && it.titleEnglish.toLowerCase().includes(q)) ||
      (it.titleUrdu && it.titleUrdu.includes(q)) ||
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

  const scrollToReadingStart = () => {
    const readerTarget = document.getElementById('book-reading-content-start');
    if (readerTarget) {
      const navOffset = 75;
      const y = readerTarget.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
      scrollToReadingStart();
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex((prev) => prev + 1);
      scrollToReadingStart();
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
          <span>کتب لائبریری (All Books Library)</span>
        </Link>

        <div style={{ display: 'flex', gap: 8 }}>
          <span
            style={{
              padding: '3px 10px',
              borderRadius: 14,
              fontSize: '0.74rem',
              fontWeight: 700,
              background: 'var(--color-gold-soft)',
              color: 'var(--color-gold-text)',
            }}
          >
            {book.category}
          </span>
        </div>
      </div>

      {/* ─── Classical Prestigious Book Header (Clean & Dignified, No Cards) ─── */}
      <section
        style={{
          padding: '24px 16px 24px',
          marginBottom: 24,
          position: 'relative',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          {/* 1. Arabic Sacred Book Title */}
          <div
            className="arabic-text"
            lang="ar"
            style={{
              fontSize: 'clamp(1.7rem, 3.5vw, 2.3rem)',
              fontWeight: 800,
              color: 'var(--color-accent)',
              lineHeight: 1.4,
              marginBottom: 6,
              textAlign: 'center',
            }}
          >
            {book.titleArabic || book.arabicTitle}
          </div>

          {/* 2. Urdu Book Title */}
          <h1
            style={{
              margin: '0 0 8px',
              fontSize: 'clamp(1.4rem, 2.8vw, 1.95rem)',
              fontWeight: 800,
              fontFamily: 'var(--font-urdu)',
              lineHeight: 1.85,
              color: 'var(--color-text)',
              direction: 'rtl',
              textAlign: 'center',
            }}
          >
            {book.titleUrdu || book.title}
          </h1>

          {/* 3. English Subtitle */}
          <div
            style={{
              fontSize: '0.96rem',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              marginBottom: 16,
            }}
          >
            {book.titleEnglish || book.title}
          </div>

          {/* 4. Scholarly Provenance & Metadata Row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 16,
              fontSize: '0.85rem',
            }}
          >
            <span
              className="clean-noble-pill gold"
              style={{
                fontFamily: 'var(--font-urdu)',
                direction: 'rtl',
              }}
            >
              <UserCheck size={14} style={{ color: 'var(--color-accent)' }} />
              تصنیف: {book.author}
            </span>

            {book.publishedEra && (
              <span className="clean-noble-pill">
                📜 {book.publishedEra}
              </span>
            )}

            <span className="clean-noble-pill">
              ⏱️ مطالعہ: {book.readTime}
            </span>

            <span className="clean-noble-pill">
              📄 {book.totalItems} صفحات و اسباق
            </span>
          </div>

          {/* 5. Book Summary / Description */}
          {book.description && (
            <p
              style={{
                margin: 0,
                fontSize: '0.98rem',
                color: 'var(--color-text-secondary)',
                maxWidth: 760,
                marginInline: 'auto',
                lineHeight: 1.9,
                fontFamily: 'var(--font-urdu)',
                direction: 'rtl',
                textAlign: 'center',
              }}
            >
              {book.description}
            </p>
          )}
        </div>
      </section>

      {/* ─── Modern Reading Control Toolbar ─────────────────────────────────── */}
      <div
        style={{
          borderRadius: 18,
          padding: '14px 18px',
          marginBottom: 20,
          border: '1.5px solid var(--color-border)',
          background: 'var(--color-surface)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {/* Row 1: Chapter Dropdown + View Mode + Style Theme + Fullscreen */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          {/* Chapter Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 260 }}>
            <BookMarked size={17} style={{ color: 'var(--color-brand)', flexShrink: 0 }} />
            <select
              value={selectedChapterIndex}
              onChange={(e) => {
                setSelectedChapterIndex(Number(e.target.value));
                setCurrentPageIndex(0);
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 10,
                border: '1.5px solid var(--color-border)',
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
                fontSize: '0.88rem',
                fontWeight: 600,
                fontFamily: 'var(--font-urdu)',
                lineHeight: 1.5,
              }}
            >
              {book.chapters.map((ch, idx) => (
                <option key={ch.id} value={idx}>
                  {idx + 1}. {ch.title} ({ch.items.length})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            {/* View Mode Segmented Pill */}
            <div
              style={{
                display: 'inline-flex',
                background: 'var(--color-bg)',
                borderRadius: 12,
                padding: 3,
                border: '1px solid var(--color-border)',
                gap: 2,
              }}
            >
              <button
                onClick={() => setViewMode('page')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 9,
                  border: 'none',
                  background: viewMode === 'page' ? 'var(--color-brand)' : 'transparent',
                  color: viewMode === 'page' ? '#ffffff' : 'var(--color-text-muted)',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  fontFamily: 'var(--font-urdu)',
                  lineHeight: 1.4,
                }}
              >
                <BookOpen size={14} />
                <span>صفحہ وار</span>
              </button>
              <button
                onClick={() => setViewMode('continuous')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 9,
                  border: 'none',
                  background: viewMode === 'continuous' ? 'var(--color-brand)' : 'transparent',
                  color: viewMode === 'continuous' ? '#ffffff' : 'var(--color-text-muted)',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  fontFamily: 'var(--font-urdu)',
                  lineHeight: 1.4,
                }}
              >
                <ScrollText size={14} />
                <span>مکمل فہرست</span>
              </button>
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              aria-label="Toggle Fullscreen"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '6px 10px',
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                background: isFullscreen ? 'var(--color-gold-soft)' : 'var(--color-bg)',
                color: isFullscreen ? 'var(--color-gold-700)' : 'var(--color-text)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              <span>{isFullscreen ? 'بند کریں' : 'فل سکرین'}</span>
            </button>
          </div>
        </div>

        {/* Row 2: In-book Search & Font Sizer & Translation Toggles */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10, borderTop: '1px solid var(--color-border)', paddingTop: 10 }}>
          {/* Quick in-book search */}
          <div style={{ position: 'relative', minWidth: 200, flex: 1, maxWidth: 360 }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
                pointerEvents: 'none',
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
                padding: '6px 10px 6px 30px',
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
                fontSize: '0.84rem',
                fontFamily: 'var(--font-urdu)',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
            {/* Arabic Font Sizer */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--color-bg)', padding: '3px 6px', borderRadius: 10, border: '1px solid var(--color-border)' }}>
              <Type size={13} style={{ color: 'var(--color-brand)', marginLeft: 4 }} />
              <button
                onClick={() => setArabicFontSize((prev) => Math.max(18, prev - 2))}
                aria-label="Decrease font size"
                style={{
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                }}
              >
                <Minus size={12} />
              </button>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-brand)', minWidth: 22, textAlign: 'center' }}>
                {arabicFontSize}
              </span>
              <button
                onClick={() => setArabicFontSize((prev) => Math.min(44, prev + 2))}
                aria-label="Increase font size"
                style={{
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                }}
              >
                <Plus size={12} />
              </button>
            </div>

            {/* Language / Translation Pills */}
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => setShowUrdu((p) => !p)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '5px 10px',
                  borderRadius: 8,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: showUrdu ? '1.5px solid var(--color-brand)' : '1px solid var(--color-border)',
                  background: showUrdu ? 'rgba(27, 67, 50, 0.12)' : 'var(--color-bg)',
                  color: showUrdu ? 'var(--color-brand)' : 'var(--color-text-muted)',
                  fontFamily: 'var(--font-urdu)',
                  lineHeight: 1.4,
                }}
              >
                <span>اردو</span>
                {showUrdu && <span>✓</span>}
              </button>

              <button
                onClick={() => setShowEnglish((p) => !p)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '5px 10px',
                  borderRadius: 8,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: showEnglish ? '1.5px solid #3b82f6' : '1px solid var(--color-border)',
                  background: showEnglish ? 'rgba(59, 130, 246, 0.12)' : 'var(--color-bg)',
                  color: showEnglish ? '#2563eb' : 'var(--color-text-muted)',
                  lineHeight: 1.4,
                }}
              >
                <span>English</span>
                {showEnglish && <span>✓</span>}
              </button>

              <button
                onClick={() => setShowTransliteration((p) => !p)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '5px 10px',
                  borderRadius: 8,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: showTransliteration ? '1.5px solid var(--color-accent)' : '1px solid var(--color-border)',
                  background: showTransliteration ? 'var(--color-gold-soft)' : 'var(--color-bg)',
                  color: showTransliteration ? 'var(--color-gold-700)' : 'var(--color-text-muted)',
                  fontFamily: 'var(--font-urdu)',
                  lineHeight: 1.4,
                }}
              >
                <span>تلفظ</span>
                {showTransliteration && <span>✓</span>}
              </button>
            </div>
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
          {/* Top Page Progress Indicator with anchor */}
          <div
            id="book-reading-content-start"
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
            <div
              style={{
                fontSize: '0.98rem',
                fontWeight: 700,
                color: 'var(--color-brand)',
                fontFamily: 'var(--font-urdu)',
                lineHeight: 1.6,
              }}
            >
              صفحہ {currentPageIndex + 1} از {totalPages}
            </div>

            {/* Quick Page Jump Slider / Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-urdu)',
                  lineHeight: 1.5,
                }}
              >
                صفحہ منتخب کریں:
              </span>
              <select
                value={currentPageIndex}
                onChange={(e) => {
                  setCurrentPageIndex(Number(e.target.value));
                  scrollToReadingStart();
                }}
                style={{
                  padding: '4px 8px',
                  borderRadius: 6,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  fontSize: '0.86rem',
                  fontFamily: 'var(--font-urdu)',
                  direction: 'rtl',
                }}
              >
                {chapterItems.map((it, idx) => (
                  <option key={it.id} value={idx}>
                    {idx + 1}. {(it.titleUrdu || it.title).substring(0, 36)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Current Page Dua Item Card with Animated Page-Turn Wrapper */}
          {currentItem && (
            <div
              id="reader-page-viewport"
              key={currentPageIndex}
              className="book-page-turn"
              style={{
                borderRadius: 20,
                background: 'var(--color-surface)',
                border: '1.5px solid var(--color-border-gold)',
                padding: '24px 28px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(212, 175, 55, 0.15)',
                position: 'relative',
              }}
            >
              {/* Classical Islamic Book Header */}
              <div
                style={{
                  textAlign: 'center',
                  paddingBottom: 14,
                  marginBottom: 18,
                  borderBottom: '1.5px solid var(--color-border-gold)',
                }}
              >
                <div
                  className="arabic-text"
                  style={{
                    fontSize: '1.45rem',
                    color: 'var(--color-brand)',
                    fontWeight: 800,
                    marginBottom: 6,
                    textAlign: 'center',
                  }}
                >
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    fontSize: '0.92rem',
                    color: 'var(--color-gold-700)',
                    fontFamily: 'var(--font-urdu)',
                    direction: 'rtl',
                  }}
                >
                  <span>{book.titleUrdu || book.title}</span>
                  <span style={{ opacity: 0.6 }}>•</span>
                  <span>صفحہ {currentPageIndex + 1} از {totalPages}</span>
                </div>
              </div>

              <DuaItemCard
                item={currentItem}
                bookId={book.id}
                bookTitle={book.title}
                arabicFontSize={arabicFontSize}
                showTransliteration={showTransliteration}
                showUrdu={showUrdu}
                showEnglish={showEnglish}
              />
            </div>
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
                gap: 8,
                padding: '10px 18px',
                borderRadius: 12,
                fontSize: '0.94rem',
                fontWeight: 700,
                opacity: currentPageIndex === 0 ? 0.4 : 1,
                cursor: currentPageIndex === 0 ? 'not-allowed' : 'pointer',
                border: '1px solid var(--color-border)',
                lineHeight: 1.4,
              }}
            >
              <ChevronLeft size={18} />
              <span style={{ fontFamily: 'var(--font-urdu)', fontSize: '0.96rem', direction: 'rtl' }}>پچھلا صفحہ</span>
              <span style={{ fontSize: '0.74rem', opacity: 0.65, fontWeight: 500 }}>(Previous)</span>
            </button>

            <div style={{ textAlign: 'center' }}>
              <span
                style={{
                  fontSize: '1.02rem',
                  fontWeight: 800,
                  color: 'var(--color-gold-700)',
                  fontFamily: 'var(--font-urdu)',
                  lineHeight: 1.6,
                }}
              >
                صفحہ {currentPageIndex + 1} از {totalPages}
              </span>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                {book.titleEnglish || book.title}
              </div>
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPageIndex === totalPages - 1}
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: 12,
                fontSize: '0.94rem',
                fontWeight: 700,
                opacity: currentPageIndex === totalPages - 1 ? 0.4 : 1,
                cursor: currentPageIndex === totalPages - 1 ? 'not-allowed' : 'pointer',
                lineHeight: 1.4,
              }}
            >
              <span style={{ fontFamily: 'var(--font-urdu)', fontSize: '0.96rem', direction: 'rtl' }}>اگلا صفحہ</span>
              <span style={{ fontSize: '0.74rem', opacity: 0.85, fontWeight: 500 }}>(Next)</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      ) : (
        /* CONTINUOUS LIST READER MODE */
        <div
          id="reader-page-viewport"
          style={{
            borderRadius: 20,
            background: 'var(--color-surface)',
            border: '1.5px solid var(--color-border-gold)',
            padding: '24px 28px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(212, 175, 55, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* Classical Islamic Book Header */}
          <div
            style={{
              textAlign: 'center',
              paddingBottom: 14,
              marginBottom: 10,
              borderBottom: '1.5px solid var(--color-border-gold)',
            }}
          >
            <div
              className="arabic-text"
              style={{
                fontSize: '1.45rem',
                color: 'var(--color-brand)',
                fontWeight: 800,
                marginBottom: 6,
                textAlign: 'center',
              }}
            >
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                fontSize: '0.92rem',
                color: 'var(--color-gold-700)',
                fontFamily: 'var(--font-urdu)',
                direction: 'rtl',
              }}
            >
              <span>{book.titleUrdu || book.title}</span>
              <span style={{ opacity: 0.6 }}>•</span>
              <span>تمام صفحات و ادعیہ ({chapterItems.length})</span>
            </div>
          </div>

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
