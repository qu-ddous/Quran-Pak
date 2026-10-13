import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Layers, ArrowRight, Trash2 } from 'lucide-react';
import type { IslamicBook } from '../../types/books';

interface BookCardProps {
  book: IslamicBook;
  onDelete?: (bookId: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onDelete }) => {
  return (
    <div
      className="card group"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 20,
        overflow: 'hidden',
        border: '1.5px solid var(--color-border)',
        background: 'var(--color-surface)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        position: 'relative',
      }}
    >
      {/* Card Cover Banner */}
      <div
        style={{
          background: book.coverGradient,
          padding: '24px 22px 20px',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 140,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Subtle decorative pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.12,
            backgroundImage: `radial-gradient(circle at 20% 30%, #ffffff 1px, transparent 1px), radial-gradient(circle at 80% 70%, #ffffff 1.5px, transparent 1.5px)`,
            backgroundSize: '24px 24px',
            pointerEvents: 'none',
          }}
        />

        {/* Top Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 20,
              fontSize: '0.72rem',
              fontWeight: 700,
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              color: '#ffffff',
              letterSpacing: '0.02em',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            {book.categoryLabel}
          </span>

          {book.isCustom && onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
                  onDelete(book.id);
                }
              }}
              aria-label="Delete custom book"
              style={{
                background: 'rgba(239, 68, 68, 0.25)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#ffffff',
                padding: '4px 8px',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>

        {/* Arabic Calligraphy Title on Cover */}
        <div style={{ position: 'relative', zIndex: 1, marginTop: 12 }}>
          <div
            className="arabic-text"
            style={{
              fontSize: '1.45rem',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.4,
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              textAlign: 'left',
              direction: 'rtl',
            }}
          >
            {book.arabicTitle}
          </div>
        </div>
      </div>

      {/* Card Body */}
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
          <h3
            style={{
              margin: '0 0 6px',
              fontSize: '1.12rem',
              fontWeight: 700,
              color: 'var(--color-text)',
              lineHeight: 1.35,
            }}
          >
            {book.title}
          </h3>

          <div
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-gold-600)',
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            {book.author}
          </div>

          <p
            style={{
              margin: '0 0 16px',
              fontSize: '0.85rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.55,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {book.description}
          </p>
        </div>

        {/* Meta Stats & Action */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              fontSize: '0.78rem',
              color: 'var(--color-text-muted)',
              borderTop: '1px solid var(--color-border)',
              paddingTop: 14,
              marginBottom: 16,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Layers size={14} style={{ color: 'var(--color-brand)' }} />
              <span>{book.totalItems} دعائیں / ابواب</span>
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
              padding: '10px 16px',
              fontSize: '0.88rem',
              fontWeight: 700,
              borderRadius: 12,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(27, 67, 50, 0.2)',
            }}
          >
            <BookOpen size={16} />
            <span>پڑھیں • Read Book</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
};
