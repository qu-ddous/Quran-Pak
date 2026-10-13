import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen, Search, Sparkles, Plus, Bookmark, Compass,
  Layers, ArrowRight, Heart, X, Check, ExternalLink, HelpCircle
} from 'lucide-react';
import { getAllBooks, deleteCustomBook, searchAllDuas, getSavedDuas } from '../db/booksDb';
import type { IslamicBook, BookCategory } from '../types/books';
import { BookCard } from '../components/books/BookCard';
import { AddBookModal } from '../components/books/AddBookModal';
import { useToast } from '../context/ToastContext';

const CATEGORY_TABS: { key: BookCategory; label: string; icon: string }[] = [
  { key: 'all', label: 'تمام کتب • All Books', icon: '📚' },
  { key: 'namaz', label: 'نمازِ حنفی و احکام • Salah', icon: '🕌' },
  { key: 'kalima', label: 'شش کلمے • 6 Kalimas', icon: '✨' },
  { key: 'duas', label: 'حصن المسلم • Daily Duas', icon: '🤲' },
  { key: 'quranic', label: '۴۰ ربنا دعائیں • Rabbana', icon: '📖' },
  { key: 'special', label: 'استخارہ و خصوصی • Special', icon: '🌙' },
  { key: 'ruqyah', label: 'شفا و حفاظت • Healing', icon: '🛡️' },
];

export default function IslamicBooksPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [books, setBooks] = useState<IslamicBook[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<BookCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

  const handleDeleteBook = (bookId: string) => {
    if (deleteCustomBook(bookId)) {
      showToast('کتاب کامیابی سے حذف کر دی گئی', 'success');
      refreshBooks();
    }
  };

  return (
    <div className="quran-page-container" style={{ paddingBottom: 80 }}>
      {/* ─── Hero Section ────────────────────────────────────────────────────── */}
      <section
        style={{
          marginTop: 20,
          marginBottom: 32,
          padding: '36px 30px',
          borderRadius: 24,
          background: 'linear-gradient(135deg, #092c21 0%, #165b44 55%, #0d382b 100%)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(9, 44, 33, 0.25)',
          border: '1.5px solid var(--color-border-gold)',
        }}
      >
        {/* Decorative background glow */}
        <div
          style={{
            position: 'absolute',
            top: -60,
            right: -40,
            width: 260,
            height: 260,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 840 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 20,
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--color-accent)',
              marginBottom: 16,
            }}
          >
            <Sparkles size={14} />
            <span>مستند کتب، دعائیں، نمازِ حنفی، اور شش کلمے مع ترجمہ</span>
          </div>

          <h1
            style={{
              margin: '0 0 10px',
              fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)',
              fontWeight: 900,
              lineHeight: 1.25,
              letterSpacing: '-0.02em',
            }}
          >
            اسلامی کتب و دعاؤں کی لائبریری
          </h1>

          <div
            className="arabic-text"
            style={{
              fontSize: '1.35rem',
              color: 'var(--color-accent)',
              lineHeight: 1.6,
              marginBottom: 14,
              direction: 'rtl',
              textAlign: 'left',
            }}
          >
            مَكْتَبَةُ الأَدْعِيَةِ وَالأَذْكَارِ وَالأَحْكَامِ الإِسْلَامِيَّةِ
          </div>

          <p
            style={{
              margin: '0 0 24px',
              fontSize: '0.96rem',
              lineHeight: 1.65,
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: 720,
            }}
          >
            کسی بھی چھوٹی یا بڑی دعا کو عربی، اردو ترجمہ اور انگریزی میں تلاش کریں اور پڑھیں۔
            مکمل نمازِ حنفی (ثناء، تشہد، درود، دعائے قنوت، نمازِ جنازہ)، اسلام کے ۶ کلمے،
            حصن المسلم کی روزمرہ دعائیں، اور ۴۰ قرآنی ربنا دعائیں باآسانی کارڈز اور کتابی صفحات میں مطالعہ فرمائیں۔
          </p>

          {/* Action Bar inside Hero: Search + Add Book */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            {/* Live Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: 280, maxWidth: 540 }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255, 255, 255, 0.7)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="کسی بھی دعا، نماز، کلمہ یا لفظ کو تلاش کریں (e.g. قنوت، کھانا، سفر، استخارہ)..."
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 42px',
                  borderRadius: 14,
                  border: '1.5px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  outline: 'none',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Add Custom Book Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 20px',
                borderRadius: 14,
                background: 'var(--gradient-gold)',
                color: '#1a1a1a',
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(212, 175, 55, 0.35)',
                whiteSpace: 'nowrap',
              }}
            >
              <Plus size={18} />
              <span>کتاب شامل کریں • Add Book</span>
            </button>
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
              <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-brand)' }}>
                تلاش کے نتائج ({searchResults.length} دعائیں ملیں)
              </h2>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                Matching results for "{searchQuery}" across all Islamic books
              </div>
            </div>

            <button
              onClick={() => setSearchQuery('')}
              className="btn-ghost"
              style={{ fontSize: '0.8rem', padding: '4px 10px' }}
            >
              تلاش بند کریں
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--color-text-muted)' }}>
              <HelpCircle size={36} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text)' }}>
                کوئی دعا یا نتیجہ نہیں ملا
              </div>
              <div style={{ fontSize: '0.85rem' }}>
                متبادل الفاظ آزمائیں جیسے: "قنوت"، "سفر"، "کھانا"، "استغفار"، یا انگریزی میں "qunoot", "travel", "hanafi"
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: 14 }}>
              {searchResults.map(({ book, chapter, item }) => (
                <div
                  key={item.id}
                  className="card"
                  style={{
                    padding: '16px 18px',
                    borderRadius: 14,
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 6,
                          background: 'var(--color-gold-soft)',
                          color: 'var(--color-gold-700)',
                        }}
                      >
                        {book.title.split(' ')[0]}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {item.reference || chapter.title}
                      </span>
                    </div>

                    <h4 style={{ margin: '0 0 6px', fontSize: '0.98rem', fontWeight: 700, color: 'var(--color-brand)' }}>
                      {item.title}
                    </h4>

                    <div
                      className="arabic-text"
                      style={{
                        fontSize: '1.05rem',
                        lineHeight: 1.8,
                        color: 'var(--color-text)',
                        marginBottom: 6,
                        maxHeight: 60,
                        overflow: 'hidden',
                        direction: 'rtl',
                        textAlign: 'right',
                      }}
                    >
                      {item.arabicText}
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.82rem',
                        color: 'var(--color-text-muted)',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        direction: 'rtl',
                        textAlign: 'right',
                      }}
                    >
                      {item.translationUrdu}
                    </p>
                  </div>

                  <Link
                    to={`/books/${book.id}#item-${item.id}`}
                    className="btn-primary"
                    style={{
                      marginTop: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      padding: '7px 12px',
                      borderRadius: 8,
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    <span>دعا دیکھیں • Open in Reader</span>
                    <ArrowRight size={13} />
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
                fontSize: '0.85rem',
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.18s ease',
                background: isActive ? 'var(--color-brand)' : 'var(--color-surface)',
                color: isActive ? '#ffffff' : 'var(--color-text)',
                border: isActive ? '1.5px solid var(--color-brand)' : '1px solid var(--color-border)',
                boxShadow: isActive ? '0 4px 12px rgba(27, 67, 50, 0.25)' : 'none',
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
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text)' }}>
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
            <BookCard key={book.id} book={book} onDelete={handleDeleteBook} />
          ))}
        </div>
      </section>

      {/* Add Custom Book Modal */}
      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onBookAdded={refreshBooks}
      />
    </div>
  );
}
