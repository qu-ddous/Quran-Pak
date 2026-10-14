import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Sparkles, BookOpen,
  ArrowRight, X, HelpCircle, Library
} from 'lucide-react';
import { getAllBooks, searchAllDuas, getSavedDuas } from '../db/booksDb';
import type { IslamicBook, BookCategory } from '../types/books';
import { BookCard } from '../components/books/BookCard';
import { useToast } from '../context/ToastContext';

const CATEGORY_TABS: { key: BookCategory; label: string; icon: string }[] = [
  { key: 'all', label: 'تمام کتب • All Books', icon: '📚' },
  { key: 'hadith', label: 'کتبِ احادیث نبویہ • Hadith', icon: '📜' },
  { key: 'namaz', label: 'نمازِ حنفی و احکام • Salah', icon: '🕌' },
  { key: 'duas', label: 'حصن المسلم و اذکار • Duas', icon: '🤲' },
  { key: 'kalima', label: 'شش کلمے و عقائد • Kalimas', icon: '✨' },
  { key: 'seerah', label: 'شمائل و سیرت • Shamail', icon: '🌸' },
  { key: 'adab', label: 'اخلاق و آداب • Manners', icon: '🤝' },
  { key: 'fiqh', label: 'فقہ و ادلہ • Fiqh', icon: '⚖️' },
  { key: 'quranic', label: '۴۰ ربنا دعائیں • Rabbana', icon: '📖' },
  { key: 'ruqyah', label: 'شفا و حفاظت • Healing', icon: '🛡️' },
  { key: 'special', label: 'استخارہ و خصوصی • Special', icon: '🌙' },
];

export default function IslamicBooksPage() {
  const { showToast } = useToast();

  const [books, setBooks] = useState<IslamicBook[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<BookCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedDuasCount, setSavedDuasCount] = useState(0);

  const refreshBooks = () => {
    const list = getAllBooks();
    setBooks(list);
    setSavedDuasCount(getSavedDuas().length);
  };

  useEffect(() => {
    document.title = 'Islamic Books & Duas Library — Noor Quran';
    refreshBooks();
  }, []);

  // Filter books by category
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      if (selectedCategory === 'all') return true;
      return b.category === selectedCategory;
    });
  }, [books, selectedCategory]);

  // Live Dua search across all books
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchAllDuas(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="quran-page-container" style={{ paddingBottom: 80 }}>
      {/* ─── Hero Section ────────────────────────────────────────────────────── */}
      {/* ─── Clean Noble Page Header (Open, Dignified, No Cards) ─── */}
      <section className="clean-noble-header">
        <div className="clean-noble-container">
          <div
            className="clean-noble-pill gold"
            style={{ marginBottom: 16 }}
          >
            <Sparkles size={14} />
            <span style={{ fontFamily: 'var(--font-urdu)', fontSize: '0.98rem' }}>مستند کتب، دعائیں، نمازِ حنفی، اور شش کلمے مع ترجمہ</span>
          </div>

          <h1
            style={{
              margin: '0 0 10px',
              fontSize: 'clamp(2.1rem, 4.5vw, 3.2rem)',
              fontWeight: 900,
              lineHeight: 1.4,
              letterSpacing: '-0.02em',
              fontFamily: 'var(--font-urdu)',
              direction: 'rtl',
              textAlign: 'center',
              color: 'var(--color-text)',
            }}
          >
            اسلامی کتب و دعاؤں کی لائبریری
          </h1>

          <div
            className="arabic-text"
            lang="ar"
            style={{
              fontSize: 'clamp(1.2rem, 2.5vw, 1.55rem)',
              color: 'var(--color-accent)',
              lineHeight: 1.6,
              marginBottom: 14,
              direction: 'rtl',
              textAlign: 'center',
            }}
          >
            مَكْتَبَةُ الأَدْعِيَةِ وَالأَذْكَارِ وَالأَحْكَامِ الإِسْلَامِيَّةِ
          </div>

          <p
            style={{
              margin: '0 auto 24px',
              fontSize: '1.05rem',
              lineHeight: 2.1,
              color: 'var(--color-text-secondary)',
              maxWidth: 760,
              fontFamily: 'var(--font-urdu)',
              direction: 'rtl',
              textAlign: 'center',
            }}
          >
            کسی بھی چھوٹی یا بڑی دعا کو عربی، اردو ترجمہ اور انگریزی میں تلاش کریں اور پڑھیں۔
            مکمل نمازِ حنفی (ثناء، تشہد، درود، دعائے قنوت، نمازِ جنازہ)، اسلام کے ۶ کلمے،
            حصن المسلم کی روزمرہ دعائیں، اور ۴۰ قرآنی ربنا دعائیں باآسانی کارڈز اور کتابی صفحات میں مطالعہ فرمائیں۔
          </p>

          {/* Action Bar: Clean Live Search */}
          <div style={{ width: '100%', maxWidth: 640, margin: '0 auto', position: 'relative' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="کسی بھی کتاب، دعا، نماز، کلمہ یا لفظ کو تلاش کریں (e.g. بخاری، قنوت، کھانا، سفر)..."
              style={{
                width: '100%',
                padding: '13px 42px 13px 44px',
                borderRadius: 16,
                border: '1.5px solid var(--color-border)',
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                fontSize: '0.96rem',
                outline: 'none',
                fontFamily: 'var(--font-urdu)',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ─── Live Dua Search Results (When user types) ───────────────────────── */}
      {searchQuery.trim() && (
        <section
          style={{
            marginBottom: 36,
            padding: 24,
            borderRadius: 20,
            background: 'var(--color-surface)',
            border: '2px solid var(--color-border-gold)',
            boxShadow: '0 6px 24px rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
              borderBottom: '1px solid var(--color-border)',
              paddingBottom: 12,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--color-brand)',
                  fontFamily: 'var(--font-urdu)',
                  direction: 'rtl',
                  lineHeight: 1.8,
                }}
              >
                تلاش کے نتائج ({searchResults.length} دعائیں ملیں)
              </h2>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                Matching results for "{searchQuery}" across all Islamic books
              </div>
            </div>

            <button
              onClick={() => setSearchQuery('')}
              className="btn-ghost"
              style={{ fontSize: '0.86rem', padding: '4px 10px', fontFamily: 'var(--font-urdu)', lineHeight: 1.6 }}
            >
              تلاش بند کریں
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--color-text-muted)' }}>
              <HelpCircle size={36} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
              <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-text)', fontFamily: 'var(--font-urdu)', lineHeight: 1.8 }}>
                کوئی دعا یا نتیجہ نہیں ملا
              </div>
              <div style={{ fontSize: '0.98rem', fontFamily: 'var(--font-urdu)', lineHeight: 1.8 }}>
                متبادل الفاظ آزمائیں جیسے: "قنوت"، "سفر"، "کھانا"، "استغفار"، یا انگریزی میں "qunoot", "travel", "hanafi"
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
              {searchResults.map(({ book, chapter, item }) => (
                <div
                  key={item.id}
                  className="card"
                  style={{
                    padding: '18px 20px',
                    borderRadius: 16,
                    border: '1.5px solid var(--color-border)',
                    borderLeft: '4px solid #ef4444', // Notebook register red line
                    background: 'var(--color-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                  }}
                >
                  <div>
                    {/* Source Book Attribution with Trilingual info */}
                    <div
                      style={{
                        padding: '6px 10px',
                        borderRadius: 8,
                        background: 'var(--color-bg)',
                        border: '1px solid var(--color-border)',
                        marginBottom: 10,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-brand)' }}>
                          📖 {book.titleEnglish || book.title}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-gold-700)', fontWeight: 700 }}>
                          {item.reference || chapter.title}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', direction: 'rtl', textAlign: 'right', fontFamily: 'var(--font-urdu)', lineHeight: 1.7 }}>
                        {book.titleUrdu || book.title} • <span style={{ color: 'var(--color-brand)' }}>مصنف: {book.author}</span>
                      </div>
                    </div>

                    {/* Trilingual Item Titles */}
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '1px 5px', borderRadius: 4, background: 'var(--color-gold-soft)', color: 'var(--color-brand)' }}>
                          🇬🇧 EN
                        </span>
                        <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: 'var(--color-brand)' }}>
                          {item.titleEnglish || item.title}
                        </h4>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, direction: 'rtl', textAlign: 'right' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '1px 5px', borderRadius: 4, background: 'rgba(27, 67, 50, 0.1)', color: 'var(--color-brand)' }}>
                          🇵🇰 اردو
                        </span>
                        <span style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-urdu)', lineHeight: 1.7 }}>
                          {item.titleUrdu || item.title}
                        </span>
                      </div>
                    </div>

                    {/* Arabic Text Snippet */}
                    <div
                      className="arabic-text"
                      style={{
                        fontSize: '1.15rem',
                        lineHeight: 1.8,
                        color: 'var(--color-text)',
                        marginBottom: 8,
                        maxHeight: 70,
                        overflow: 'hidden',
                        direction: 'rtl',
                        textAlign: 'right',
                        padding: '6px 10px',
                        borderRadius: 8,
                        background: 'var(--color-bg)',
                      }}
                    >
                      {item.arabicText}
                    </div>

                    {/* Urdu Translation Snippet */}
                    <p
                      style={{
                        margin: '0 0 6px',
                        fontSize: '0.94rem',
                        color: 'var(--color-text)',
                        lineHeight: 1.9,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        direction: 'rtl',
                        textAlign: 'right',
                        fontFamily: 'var(--font-urdu)',
                      }}
                    >
                      {item.translationUrdu}
                    </p>

                    {/* English Translation Snippet */}
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.78rem',
                        color: 'var(--color-text-muted)',
                        lineHeight: 1.45,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {item.translationEnglish}
                    </p>
                  </div>

                  <Link
                    to={`/books/${book.id}#item-${item.id}`}
                    className="btn-primary"
                    style={{
                      marginTop: 14,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      padding: '8px 14px',
                      borderRadius: 10,
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    <span>📖 کتاب کا مطالعہ کریں • Read Book</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ─── Category Filter Tabs ────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 12,
          marginBottom: 24,
          scrollbarWidth: 'none',
        }}
      >
        {CATEGORY_TABS.map(({ key, label, icon }) => {
          const isActive = selectedCategory === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 18px',
                borderRadius: 24,
                fontSize: '0.94rem',
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.18s ease',
                background: isActive ? 'var(--color-brand)' : 'var(--color-surface)',
                color: isActive ? '#ffffff' : 'var(--color-text)',
                border: isActive ? '1.5px solid var(--color-brand)' : '1px solid var(--color-border)',
                boxShadow: isActive ? '0 4px 12px rgba(27, 67, 50, 0.25)' : 'none',
                fontFamily: 'var(--font-urdu)',
                lineHeight: 1.6,
              }}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── Books Grid ──────────────────────────────────────────────────────── */}
      <section style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: '1.45rem',
                fontWeight: 800,
                color: 'var(--color-text)',
                fontFamily: 'var(--font-urdu)',
                direction: 'rtl',
                lineHeight: 1.8,
              }}
            >
              کتب و رہنما گائیڈز ({filteredBooks.length})
            </h2>
            <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
              Explore curated and contributed Islamic books
            </div>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--color-gold-600)', fontWeight: 700 }}>
            {savedDuasCount > 0 && `🔖 ${savedDuasCount} محفوظ دعائیں`}
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 22,
          }}
        >
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
}
