import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, Search, ChevronLeft, ChevronRight,
  Maximize2, Minimize2, UserCheck
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
  const [paperTheme, setPaperTheme] = useState<'register' | 'book'>('register');
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
              color: 'var(--color-gold-700)',
            }}
          >
            {book.categoryLabel}
          </span>
          {paperTheme === 'register' && (
            <span
              style={{
                padding: '3px 10px',
                borderRadius: 14,
                fontSize: '0.74rem',
                fontWeight: 700,
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#dc2626',
                border: '1px solid rgba(239, 68, 68, 0.25)',
              }}
            >
              📒 رجسٹر موڈ (Lined Register)
            </span>
          )}
        </div>
      </div>

      {/* ─── Book Header Showcase Card (Trilingual Titles & Real Author) ───────── */}
      <section
        style={{
          borderRadius: 24,
          padding: '26px 28px',
          background: book.coverGradient,
          color: '#ffffff',
          marginBottom: 20,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.18)',
          position: 'relative',
          overflow: 'hidden',
          border: '1.5px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        {/* Subtle decorative lined register overlay texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.08,
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.4) 20px, rgba(255,255,255,0.4) 21px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Trilingual Title Grid: English, Urdu, and Arabic clearly presented */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 16,
              marginBottom: 16,
            }}
          >
            {/* 1. English Book Title Box */}
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 14,
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                backdropFilter: 'blur(6px)',
              }}
            >
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--color-accent)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <span>🇬🇧 English Title (انگریزی نام):</span>
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 'clamp(1.2rem, 2.2vw, 1.55rem)',
                  fontWeight: 800,
                  lineHeight: 1.3,
                  color: '#ffffff',
                }}
              >
                {book.titleEnglish || book.title}
              </h1>
            </div>

            {/* 2. Urdu Book Title Box */}
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 14,
                background: 'rgba(212, 175, 55, 0.18)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                direction: 'rtl',
                textAlign: 'right',
                backdropFilter: 'blur(6px)',
              }}
            >
              <div
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: 'var(--color-accent)',
                  marginBottom: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  justifyContent: 'flex-start',
                }}
              >
                <span>🇵🇰 اردو عنوان (Urdu Title):</span>
              </div>
              <div
                style={{
                  fontSize: 'clamp(1.2rem, 2.3vw, 1.6rem)',
                  fontWeight: 700,
                  fontFamily: "'Noto Nastaliq Urdu', 'Urdu Typesetting', serif",
                  lineHeight: 1.55,
                  color: '#ffffff',
                }}
              >
                {book.titleUrdu || book.title}
              </div>
            </div>

            {/* 3. Arabic Book Title Box */}
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 14,
                background: 'rgba(0, 0, 0, 0.28)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                direction: 'rtl',
                textAlign: 'right',
                backdropFilter: 'blur(6px)',
              }}
            >
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--color-accent)',
                  marginBottom: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  justifyContent: 'flex-start',
                }}
              >
                <span>🇸🇦 العنوان بالعربية (Arabic Title):</span>
              </div>
              <div
                className="arabic-text"
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 700,
                  color: 'var(--color-accent)',
                  lineHeight: 1.35,
                }}
              >
                {book.titleArabic || book.arabicTitle}
              </div>
            </div>
          </div>

          {/* Authentic Scholar & Book Provenance Panel */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: '10px 16px',
              borderRadius: 12,
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '0.84rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <UserCheck size={16} style={{ color: 'var(--color-accent)' }} />
              <span style={{ fontWeight: 700 }}>
                تصنیف و تحقیق: {book.author} ({book.authorEnglish})
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: 0.9 }}>
              {book.publishedEra && (
                <span>📜 {book.publishedEra}</span>
              )}
              <span>⏱️ مطالعہ: {book.readTime}</span>
              <span>📄 {book.totalItems} صفحات و اسباق</span>
            </div>
          </div>

          {/* Book Summary / Description */}
          <p
            style={{
              margin: '12px 0 0',
              fontSize: '0.88rem',
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: 820,
              lineHeight: 1.55,
            }}
          >
            {book.description}
          </p>
        </div>
      </section>

      {/* ─── Authentic Ruled Register Ledger Header Plate ────────────────────── */}
      {paperTheme === 'register' && (
        <div
          style={{
            borderRadius: 18,
            background: 'var(--color-surface)',
            border: '2px solid var(--color-border)',
            borderLeft: '6px solid #ef4444', // Classic red vertical margin line
            padding: '16px 20px',
            marginBottom: 20,
            position: 'relative',
            boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)',
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(148, 163, 184, 0.14) 28px, rgba(148, 163, 184, 0.14) 29px)',
          }}
        >
          {/* Top Spiral Punch Hole simulation */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: 10,
              marginBottom: 12,
              borderBottom: '1.5px dashed rgba(239, 68, 68, 0.35)',
            }}
          >
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {[1, 2, 3, 4, 5, 6].map((hole) => (
                <div
                  key={hole}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: 'var(--color-bg)',
                    border: '1.5px solid rgba(100, 116, 139, 0.4)',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.25)',
                  }}
                />
              ))}
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: 'var(--color-gold-700)',
                  letterSpacing: '0.06em',
                  marginLeft: 6,
                }}
              >
                📓 رجسٹرِ اسلامی کتب و ادعیہ • ISLAMIC NOTEBOOK REGISTER
              </span>
            </div>

            <div
              className="arabic-text"
              style={{
                fontSize: '0.95rem',
                color: 'var(--color-brand)',
                fontWeight: 700,
              }}
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
          </div>

          {/* Register Ledger Info: Date, Subject, Page No */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 10,
              fontSize: '0.82rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--color-bg)',
                padding: '6px 12px',
                borderRadius: 8,
                border: '1px solid var(--color-border)',
              }}
            >
              <span style={{ color: '#ef4444', fontWeight: 800 }}>DATE / تاریخ:</span>
              <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>
                1448ھ (مطابق 2026ء)
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--color-bg)',
                padding: '6px 12px',
                borderRadius: 8,
                border: '1px solid var(--color-border)',
              }}
            >
              <span style={{ color: 'var(--color-brand)', fontWeight: 800 }}>SUBJECT / عنوان:</span>
              <span
                style={{
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {book.titleEnglish || book.title}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--color-bg)',
                padding: '6px 12px',
                borderRadius: 8,
                border: '1px solid var(--color-border)',
              }}
            >
              <span style={{ color: 'var(--color-gold-700)', fontWeight: 800 }}>PAGE / صفحہ:</span>
              <span style={{ fontWeight: 800, color: 'var(--color-brand)' }}>
                صفحہ {currentPageIndex + 1} از {totalPages}
              </span>
            </div>
          </div>
        </div>
      )}

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
          </div>

          {/* Paper Theme Switcher: Notebook Register vs Book */}
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
              onClick={() => setPaperTheme('register')}
              title="کتاب کو کاپی یا رجسٹر کی طرح لکیروں کے ساتھ پڑھیں"
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: 'none',
                background: paperTheme === 'register' ? '#dc2626' : 'transparent',
                color: paperTheme === 'register' ? '#ffffff' : 'var(--color-text-muted)',
                fontWeight: 750,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              📒 رجسٹر طرز (Ruled Register)
            </button>
            <button
              onClick={() => setPaperTheme('book')}
              title="عام صاف ستھری کتابی شکل"
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: 'none',
                background: paperTheme === 'book' ? 'var(--color-brand)' : 'transparent',
                color: paperTheme === 'book' ? '#ffffff' : 'var(--color-text-muted)',
                fontWeight: 750,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              📖 کتابی طرز (Book)
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
                  scrollToReadingStart();
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

          {/* Current Page Dua Item Card with Animated Page-Turn Wrapper */}
          {currentItem && (
            <div id="reader-page-viewport" key={currentPageIndex} className="book-page-turn">
              <DuaItemCard
                item={currentItem}
                bookId={book.id}
                bookTitle={book.title}
                arabicFontSize={arabicFontSize}
                showTransliteration={showTransliteration}
                showUrdu={showUrdu}
                showEnglish={showEnglish}
                paperTheme={paperTheme}
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

            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--color-gold-700)' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
              paperTheme={paperTheme}
            />
          ))}
        </div>
      )}
    </div>
  );
}
