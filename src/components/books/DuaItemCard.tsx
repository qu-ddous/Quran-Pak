import { useState, useEffect } from 'react';
import {
  Volume2, VolumeX, Copy, Check, Bookmark,
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
  paperTheme?: 'register' | 'book';
}

export const DuaItemCard = ({
  item,
  bookId,
  bookTitle,
  arabicFontSize = 26,
  showTransliteration = true,
  showUrdu = true,
  showEnglish = true,
  paperTheme = 'register',
}: DuaItemCardProps) => {
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
    utterance.rate = 0.85;

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
    const textToCopy = `📖 ${item.titleEnglish || item.title}\n${item.titleUrdu || ''}\n\n${item.arabicText}\n\nاردو ترجمہ:\n${item.translationUrdu}\n\nEnglish Translation:\n${item.translationEnglish}\n\nحوالہ: ${item.reference || bookTitle}\n\n— Noor Quran (نور القرآن)`;
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

  // Share
  const handleShare = () => {
    const text = `${item.titleEnglish || item.title}\n\n${item.arabicText}\n\n${item.translationUrdu}`;
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

  const isRegister = paperTheme === 'register';

  return (
    <div
      id={`item-${item.id}`}
      style={{
        borderRadius: 20,
        padding: isRegister ? '26px 28px 24px 34px' : '24px 26px',
        marginBottom: 24,
        position: 'relative',
        background: isRegister ? 'var(--color-surface)' : 'var(--color-surface)',
        // Faint horizontal register ruled lines when in register mode
        backgroundImage: isRegister
          ? 'repeating-linear-gradient(transparent, transparent 35px, rgba(148, 163, 184, 0.18) 35px, rgba(148, 163, 184, 0.18) 36px)'
          : 'none',
        // Red margin line on the left like a real register notebook
        borderLeft: isRegister ? '4px solid #ef4444' : '1.5px solid var(--color-border)',
        borderTop: '1.5px solid var(--color-border)',
        borderRight: '1.5px solid var(--color-border)',
        borderBottom: '1.5px solid var(--color-border)',
        boxShadow: isRegister
          ? '0 6px 25px rgba(0, 0, 0, 0.05), inset 3px 0 0 rgba(239, 68, 68, 0.3)'
          : '0 4px 18px rgba(0, 0, 0, 0.03)',
        transition: 'all 0.2s ease',
        overflow: 'hidden',
      }}
    >
      {/* Real Register Notebook Top Header Bar */}
      {isRegister && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            paddingBottom: 10,
            borderBottom: '1.5px solid rgba(239, 68, 68, 0.35)',
            fontSize: '0.78rem',
            color: 'var(--color-text-muted)',
            fontFamily: 'monospace',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#ef4444', fontWeight: 800 }}>●</span>
            <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>
              صفحہ / Page: {item.pageNumber || 1}
            </span>
          </div>

          <div
            className="arabic-text"
            style={{
              fontSize: '0.9rem',
              color: 'var(--color-accent)',
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>

          <div style={{ color: 'var(--color-gold-700)', fontWeight: 700 }}>
            {item.reference ? `حوالہ: ${item.reference}` : 'مستند و مسنون'}
          </div>
        </div>
      )}

      {/* ─── Tri-Lingual Titles Header Box ─── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 14,
          marginBottom: 16,
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: 14,
        }}
      >
        <div style={{ flex: 1 }}>
          {/* 1. English Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: 6, background: 'var(--color-gold-soft)', color: 'var(--color-brand)' }}>
              🇬🇧 English
            </span>
            <h3
              style={{
                margin: 0,
                fontSize: '1.08rem',
                fontWeight: 800,
                color: 'var(--color-brand)',
                lineHeight: 1.35,
              }}
            >
              {item.titleEnglish || item.title}
            </h3>
          </div>

          {/* 2. Urdu Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, direction: 'rtl', textAlign: 'right' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: 6, background: 'rgba(27, 67, 50, 0.1)', color: 'var(--color-brand)' }}>
              🇵🇰 اردو
            </span>
            <span
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--color-text)',
                lineHeight: 1.8,
                fontFamily: 'var(--font-urdu)',
              }}
            >
              {item.titleUrdu || item.title}
            </span>
          </div>

          {/* 3. Arabic Title (if present) */}
          {item.titleArabic && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, direction: 'rtl', textAlign: 'right' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: 6, background: 'rgba(212, 175, 55, 0.15)', color: 'var(--color-gold-700)' }}>
                🇸🇦 العربية
              </span>
              <span
                className="arabic-text"
                style={{
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  color: 'var(--color-gold-600)',
                  lineHeight: 1.2,
                }}
              >
                {item.titleArabic}
              </span>
            </div>
          )}
        </div>

        {/* Action Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {/* Audio Speech */}
          <button
            onClick={handleToggleAudio}
            aria-label={isSpeaking ? 'Stop Arabic audio' : 'Listen Arabic pronunciation'}
            title={isSpeaking ? 'Stop audio' : 'سماعت فرمائیں (Listen Audio)'}
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
            title="کاپی کریں (Copy)"
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

      {/* ─── Arabic Sacred Text Box ─── */}
      <div
        className="arabic-text select-all"
        style={{
          fontSize: `${arabicFontSize}px`,
          lineHeight: 2.3,
          color: 'var(--color-text)',
          textAlign: 'right',
          direction: 'rtl',
          padding: '14px 18px',
          background: isRegister ? 'rgba(255, 255, 255, 0.7)' : 'var(--color-bg)',
          borderRadius: 16,
          marginBottom: 16,
          border: '1.5px solid var(--color-border-gold)',
          letterSpacing: '0.01em',
          wordBreak: 'break-word',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        {item.arabicText}
      </div>

      {/* ─── Transliteration (Pronunciation) ─── */}
      {showTransliteration && item.transliteration && (
        <div
          style={{
            fontSize: '0.92rem',
            fontStyle: 'italic',
            color: 'var(--color-text-muted)',
            marginBottom: 14,
            padding: '8px 14px',
            background: 'rgba(212, 175, 55, 0.06)',
            borderLeft: '3px solid var(--color-accent)',
            borderRadius: '0 10px 10px 0',
            lineHeight: 1.55,
          }}
        >
          <strong style={{ fontStyle: 'normal', fontSize: '0.78rem', color: 'var(--color-gold-700)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 2 }}>
            تلفظ و ادائیگی / Pronunciation:
          </strong>
          {item.transliteration}
        </div>
      )}

      {/* ─── Urdu Translation ─── */}
      {showUrdu && item.translationUrdu && (
        <div
          style={{
            fontSize: '1.14rem',
            lineHeight: 2.2,
            color: 'var(--color-text)',
            textAlign: 'right',
            direction: 'rtl',
            marginBottom: 14,
            padding: '12px 16px',
            borderRadius: 12,
            background: isRegister ? 'rgba(255, 255, 255, 0.85)' : 'var(--color-surface)',
            borderRight: '3.5px solid var(--color-brand)',
            borderTop: '1px solid var(--color-border)',
            borderBottom: '1px solid var(--color-border)',
            borderLeft: '1px solid var(--color-border)',
            fontFamily: 'var(--font-urdu)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: 'var(--color-gold-soft)', color: 'var(--color-brand)', fontFamily: 'var(--font-urdu)' }}>
              اردو ترجمہ و مفہوم
            </span>
          </div>
          {item.translationUrdu}
        </div>
      )}

      {/* ─── English Translation ─── */}
      {showEnglish && item.translationEnglish && (
        <div
          style={{
            fontSize: '0.92rem',
            lineHeight: 1.6,
            color: 'var(--color-text)',
            marginBottom: 16,
            padding: '10px 14px',
            borderRadius: 12,
            background: isRegister ? 'rgba(255, 255, 255, 0.85)' : 'var(--color-bg)',
            borderLeft: '3.5px solid #3b82f6',
            borderTop: '1px solid var(--color-border)',
            borderBottom: '1px solid var(--color-border)',
            borderRight: '1px solid var(--color-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '2px 6px', borderRadius: 6, background: 'rgba(59, 130, 246, 0.1)', color: '#2563eb' }}>
              English Meaning & Translation
            </span>
          </div>
          {item.translationEnglish}
        </div>
      )}

      {/* ─── Reference & Benefits & Tasbeeh Toolbar ─── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px dashed var(--color-border)',
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
                padding: '4px 10px',
                borderRadius: 8,
                background: 'var(--color-gold-soft)',
                color: 'var(--color-gold-700)',
                fontWeight: 700,
                fontSize: '0.86rem',
                fontFamily: 'var(--font-urdu)',
                lineHeight: 1.6,
                direction: 'rtl',
              }}
            >
              <BookOpen size={12} />
              حوالہ: {item.reference}
            </span>
          )}

          {item.benefits && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 10px',
                borderRadius: 8,
                background: 'rgba(27, 67, 50, 0.08)',
                color: 'var(--color-brand)',
                fontWeight: 700,
                fontSize: '0.86rem',
                fontFamily: 'var(--font-urdu)',
                lineHeight: 1.6,
                direction: 'rtl',
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
              padding: '6px 14px',
              borderRadius: 24,
              background: currentCount >= targetCount ? 'var(--color-primary-100)' : 'var(--color-gold-soft)',
              border: `1.5px solid ${currentCount >= targetCount ? 'var(--color-brand)' : 'var(--color-border-gold)'}`,
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'all 0.15s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
            title="تعداد گننے کے لیے کلک کریں (Tap to Count)"
          >
            <span
              style={{
                fontSize: '0.88rem',
                fontWeight: 800,
                color: 'var(--color-brand)',
                fontFamily: 'var(--font-urdu)',
                lineHeight: 1.5,
              }}
            >
              تسبیح کاؤنٹر:
            </span>
            <span
              style={{
                fontSize: '0.94rem',
                fontWeight: 900,
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
