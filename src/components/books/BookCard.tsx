import { Link } from 'react-router-dom';
import { Clock, Layers, ArrowRight, UserCheck, BookOpen } from 'lucide-react';
import type { IslamicBook } from '../../types/books';

interface BookCardProps {
  book: IslamicBook;
}

export const BookCard = ({ book }: BookCardProps) => {
  return (
    <div
      className="card group"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 22,
        overflow: 'hidden',
        border: '1.5px solid var(--color-border)',
        background: 'var(--color-surface)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        position: 'relative',
      }}
    >
      {/* ─── Card Cover Banner (Islamic Manuscript & Book Header) ─── */}
      <div
        style={{
          background: book.coverGradient,
          padding: '22px 22px 18px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Subtle decorative register / ledger ruled pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.1,
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 18px, rgba(255,255,255,0.4) 18px, rgba(255,255,255,0.4) 19px)`,
            pointerEvents: 'none',
          }}
        />

        {/* Top Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1, marginBottom: 10 }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 20,
              fontSize: '0.74rem',
              fontWeight: 800,
              background: 'rgba(255, 255, 255, 0.22)',
              backdropFilter: 'blur(8px)',
              color: '#ffffff',
              letterSpacing: '0.02em',
              border: '1px solid rgba(255, 255, 255, 0.35)',
            }}
          >
            {book.categoryLabel}
          </span>
        </div>

        {/* Arabic Calligraphy on Cover */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: 'var(--color-accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 4,
            }}
          >
            🇸🇦 العنوان بالعربية (Arabic Title):
          </div>
          <div
            className="arabic-text"
            style={{
              fontSize: '1.38rem',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.4,
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
              textAlign: 'left',
              direction: 'rtl',
            }}
          >
            {book.titleArabic || book.arabicTitle}
          </div>
        </div>
      </div>

      {/* ─── Card Body with 3 Distinct Language Titles ─── */}
      <div
        style={{
          padding: '20px 22px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          {/* 1. English Title Box */}
          <div
            style={{
              marginBottom: 12,
              padding: '10px 12px',
              borderRadius: 12,
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-brand)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
              🇬🇧 English Title:
            </div>
            <h3
              style={{
                margin: 0,
                fontSize: '1.02rem',
                fontWeight: 800,
                color: 'var(--color-text)',
                lineHeight: 1.35,
              }}
            >
              {book.titleEnglish || book.title}
            </h3>
          </div>

          {/* 2. Urdu Title Box */}
          <div
            style={{
              marginBottom: 14,
              padding: '8px 12px',
              borderRadius: 12,
              background: 'rgba(212, 175, 55, 0.08)',
              borderRight: '3px solid var(--color-accent)',
              direction: 'rtl',
              textAlign: 'right',
            }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-gold-700)', marginBottom: 2, fontFamily: 'var(--font-urdu)' }}>
              🇵🇰 اردو عنوان:
            </div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-brand)',
                lineHeight: 1.85,
                fontFamily: 'var(--font-urdu)',
              }}
            >
              {book.titleUrdu || book.title}
            </div>
          </div>

          {/* Real Author Attribution */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.88rem',
              color: 'var(--color-gold-700)',
              fontWeight: 700,
              marginBottom: 10,
              padding: '6px 10px',
              borderRadius: 8,
              background: 'var(--color-gold-soft)',
            }}
          >
            <UserCheck size={14} style={{ color: 'var(--color-brand)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-urdu)', direction: 'rtl', lineHeight: 1.6 }}>
              مصنف: {book.author}
            </span>
            <span style={{ fontSize: '0.78rem', opacity: 0.85, fontWeight: 500 }}>
              ({book.authorEnglish})
            </span>
          </div>

          {/* Description */}
          <p
            style={{
              margin: '0 0 16px',
              fontSize: '0.96rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.95,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontFamily: 'var(--font-urdu)',
              direction: 'rtl',
              textAlign: 'right',
            }}
          >
            {book.description}
          </p>
        </div>

        {/* ─── Footer Meta Stats & Register Action ─── */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.78rem',
              color: 'var(--color-text-muted)',
              borderTop: '1px solid var(--color-border)',
              paddingTop: 12,
              marginBottom: 16,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Layers size={14} style={{ color: 'var(--color-brand)' }} />
              <span style={{ fontFamily: 'var(--font-urdu)', fontSize: '0.88rem' }}>{book.totalItems} صفحات / دعائیں</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Clock size={14} style={{ color: 'var(--color-accent)' }} />
              <span>{book.readTime}</span>
            </span>
          </div>

          <Link
            to={`/books/${book.id}`}
            className="btn-primary"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '11px 16px',
              fontSize: '0.92rem',
              fontWeight: 800,
              borderRadius: 14,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(27, 67, 50, 0.2)',
            }}
          >
            <BookOpen size={17} />
            <span style={{ fontFamily: 'var(--font-urdu)', fontSize: '0.98rem' }}>کتاب کا مطالعہ کریں • Read Book</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
};
