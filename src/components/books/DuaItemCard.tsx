import React, { useState, useEffect } from 'react';
import {
  Volume2, VolumeX, Copy, Check, Bookmark, Heart,
  RotateCcw, Sparkles, BookOpen, Share2
} from 'lucide-react';
import type { BookItem } from '../../types/books';
import { isDuaSaved, toggleSaveDua } from '../../db/booksDb';
import { useToast } from '../../context/ToastContext';

interface DuaItemCardProps {
  item: BookItem;
  bookId: string;
  bookTitle: string;
  arabicFontSize?: number;
  showTransliteration?: boolean;
  showUrdu?: boolean;
  showEnglish?: boolean;
}

export const DuaItemCard: React.FC<DuaItemCardProps> = ({
  item,
  bookId,
  bookTitle,
  arabicFontSize = 26,
  showTransliteration = true,
  showUrdu = true,
  showEnglish = true,
}) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Tasbeeh state
  const targetCount = item.repeatCount || 1;
  const [currentCount, setCurrentCount] = useState(0);

  useEffect(() => {
    setIsSaved(isDuaSaved(item.id));
  }, [item.id]);

  // Audio Speech Synthesis for Arabic
  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      showToast('Audio synthesis not supported on this browser', 'info');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(item.arabicText);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85; // Slightly slower for clear Tajweed

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      showToast('Unable to play Arabic audio', 'error');
    };

    window.speechSynthesis.speak(utterance);
  };

  // Copy Dua
  const handleCopy = () => {
    const textToCopy = `📖 ${item.title}\n\n${item.arabicText}\n\nاردو ترجمہ:\n${item.translationUrdu}\n\nEnglish Translation:\n${item.translationEnglish}\n\nحوالہ: ${item.reference || bookTitle}\n\n— Noor Quran (نور القرآن)`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    showToast('دعا کا متن اور ترجمہ کاپی ہو گیا • Copied', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  // Bookmark / Favorite
  const handleToggleBookmark = () => {
    const newlySaved = toggleSaveDua(bookId, bookTitle, item);
    setIsSaved(newlySaved);
    showToast(
      newlySaved ? 'محفوظ دعاؤں میں شامل کر دیا گیا' : 'محفوظ فہرست سے ہٹا دیا گیا',
      'success'
    );
  };

  // Tasbeeh counter increment
  const handleIncrementCounter = () => {
    if (targetCount <= 1) return;
    const next = currentCount + 1;
    setCurrentCount(next);
    if (next === targetCount) {
      showToast(`ماشاءاللہ! مکمل تعداد (${targetCount}) مکمل ہوئی`, 'success');
    }
  };

  const handleResetCounter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentCount(0);
  };

  // Share via Web Share API
  const handleShare = () => {
    const text = `${item.title}\n\n${item.arabicText}\n\n${item.translationUrdu}`;
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div
      id={`item-${item.id}`}
      className="card"
      style={{
        borderRadius: 20,
        padding: '24px 26px',
        marginBottom: 20,
        border: '1.5px solid var(--color-border)',
        background: 'var(--color-surface)',
        boxShadow: '0 4px 18px rgba(0, 0, 0, 0.03)',
        position: 'relative',
        transition: 'border-color 0.2s ease',
      }}
    >
      {/* Top Header: Title & Action Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
          marginBottom: 16,
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: 14,
        }}
      >
        <div>
          <h3
            style={{
              margin: '0 0 4px',
              fontSize: '1.15rem',
              fontWeight: 700,
              color: 'var(--color-brand)',
              lineHeight: 1.35,
            }}
          >
            {item.title}
          </h3>
          {item.arabicTitle && (
            <div
              className="arabic-text"
              style={{
                fontSize: '0.95rem',
                color: 'var(--color-gold-600)',
                fontWeight: 600,
                textAlign: 'left',
                direction: 'rtl',
              }}
            >
              {item.arabicTitle}
            </div>
          )}
        </div>

        {/* Action Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {/* Audio Speech */}
          <button
            onClick={handleToggleAudio}
            aria-label={isSpeaking ? 'Stop Arabic audio' : 'Listen Arabic pronunciation'}
            title={isSpeaking ? 'Stop audio' : 'سماعت فرمائیں'}
            style={{
              background: isSpeaking ? 'var(--color-gold-soft)' : 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 10,
              padding: '7px 9px',
              color: isSpeaking ? 'var(--color-gold-600)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            {isSpeaking ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            aria-label="Copy Dua text"
            title="کاپی کریں"
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 10,
              padding: '7px 9px',
              color: copied ? 'var(--color-brand)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            {copied ? <Check size={17} /> : <Copy size={17} />}
          </button>

          {/* Bookmark Button */}
          <button
            onClick={handleToggleBookmark}
            aria-label={isSaved ? 'Remove from saved' : 'Save this Dua'}
            title={isSaved ? 'محفوظ شدہ' : 'محفوظ کریں'}
            style={{
              background: isSaved ? 'rgba(234, 179, 8, 0.15)' : 'transparent',
              border: isSaved ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
              borderRadius: 10,
              padding: '7px 9px',
              color: isSaved ? 'var(--color-accent)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            <Bookmark size={17} fill={isSaved ? 'currentColor' : 'none'} />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            aria-label="Share Dua"
            title="شیئر کریں"
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 10,
              padding: '7px 9px',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            <Share2 size={17} />
          </button>
        </div>
      </div>

      {/* Arabic Script */}
      <div
        className="arabic-text select-all"
        style={{
          fontSize: `${arabicFontSize}px`,
          lineHeight: 2.25,
          color: 'var(--color-text)',
          textAlign: 'right',
          direction: 'rtl',
          padding: '12px 14px',
          background: 'var(--color-bg)',
          borderRadius: 14,
          marginBottom: 16,
          border: '1px solid var(--color-border-gold)',
          letterSpacing: '0.01em',
          wordBreak: 'break-word',
        }}
      >
        {item.arabicText}
      </div>

      {/* Transliteration */}
      {showTransliteration && item.transliteration && (
        <div
          style={{
            fontSize: '0.92rem',
            fontStyle: 'italic',
            color: 'var(--color-text-muted)',
            marginBottom: 14,
            padding: '6px 12px',
            background: 'rgba(212, 175, 55, 0.05)',
            borderLeft: '3px solid var(--color-accent)',
            borderRadius: '0 8px 8px 0',
            lineHeight: 1.5,
          }}
        >
          <strong style={{ fontStyle: 'normal', fontSize: '0.8rem', color: 'var(--color-gold-700)', display: 'block', marginBottom: 2 }}>
            تلفظ / Pronunciation:
          </strong>
          {item.transliteration}
        </div>
      )}

      {/* Urdu Translation */}
      {showUrdu && item.translationUrdu && (
        <div
          style={{
            fontSize: '1.08rem',
            lineHeight: 2,
            color: 'var(--color-text)',
            textAlign: 'right',
            direction: 'rtl',
            marginBottom: 14,
            padding: '10px 14px',
            borderRadius: 10,
            background: 'var(--color-surface)',
            borderRight: '3px solid var(--color-brand)',
            fontFamily: "'Noto Nastaliq Urdu', 'Urdu Typesetting', system-ui, serif",
          }}
        >
          <strong style={{ fontSize: '0.85rem', color: 'var(--color-brand)', display: 'block', marginBottom: 4 }}>
            اردو ترجمہ:
          </strong>
          {item.translationUrdu}
        </div>
      )}

      {/* English Translation */}
      {showEnglish && item.translationEnglish && (
        <div
          style={{
            fontSize: '0.92rem',
            lineHeight: 1.6,
            color: 'var(--color-text)',
            marginBottom: 16,
            padding: '8px 12px',
            borderRadius: 10,
            background: 'var(--color-bg)',
          }}
        >
          <strong style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 3 }}>
            English Translation:
          </strong>
          {item.translationEnglish}
        </div>
      )}

      {/* Reference & Benefits Badges */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--color-border)',
          paddingTop: 12,
          fontSize: '0.8rem',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          {item.reference && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '3px 9px',
                borderRadius: 8,
                background: 'var(--color-gold-soft)',
                color: 'var(--color-gold-700)',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            >
              <BookOpen size={12} />
              {item.reference}
            </span>
          )}

          {item.benefits && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '3px 9px',
                borderRadius: 8,
                background: 'rgba(27, 67, 50, 0.08)',
                color: 'var(--color-brand)',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            >
              <Sparkles size={12} />
              فضیلت: {item.benefits}
            </span>
          )}
        </div>

        {/* Digital Tasbeeh Counter if repeatCount > 1 */}
        {targetCount > 1 && (
          <div
            onClick={handleIncrementCounter}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              borderRadius: 24,
              background: currentCount >= targetCount ? 'var(--color-primary-100)' : 'var(--color-gold-soft)',
              border: `1.5px solid ${currentCount >= targetCount ? 'var(--color-brand)' : 'var(--color-border-gold)'}`,
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'all 0.15s ease',
            }}
            title="تعداد گننے کے لیے کلک کریں (Tap to Count)"
          >
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-brand)' }}>
              تسبیح کاؤنٹر:
            </span>
            <span
              style={{
                fontSize: '0.92rem',
                fontWeight: 800,
                color: currentCount >= targetCount ? 'var(--color-brand)' : 'var(--color-gold-700)',
              }}
            >
              {currentCount} / {targetCount}
            </span>

            {currentCount > 0 && (
              <button
                onClick={handleResetCounter}
                aria-label="Reset counter"
                title="دوبارہ شروع کریں"
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: 2,
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                }}
              >
                <RotateCcw size={12} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
