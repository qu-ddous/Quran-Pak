import { useState } from 'react';
import { X, Plus, Trash2, BookPlus, Sparkles } from 'lucide-react';
import type { BookCategory, UserCustomBookInput } from '../../types/books';
import { addCustomBook } from '../../db/booksDb';
import { useToast } from '../../context/ToastContext';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAdded: () => void;
}

export const AddBookModal = ({ isOpen, onClose, onBookAdded }: AddBookModalProps) => {
  const { showToast } = useToast();

  const [titleEnglish, setTitleEnglish] = useState('');
  const [titleUrdu, setTitleUrdu] = useState('');
  const [arabicTitle, setArabicTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [authorEnglish, setAuthorEnglish] = useState('');
  const [category, setCategory] = useState<BookCategory>('duas');
  const [description, setDescription] = useState('');

  const [items, setItems] = useState<UserCustomBookInput['items']>([
    {
      title: '',
      titleEnglish: '',
      titleUrdu: '',
      titleArabic: '',
      arabicText: '',
      transliteration: '',
      translationUrdu: '',
      translationEnglish: '',
      reference: '',
      benefits: '',
      repeatCount: 1,
    },
  ]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        title: '',
        titleEnglish: '',
        titleUrdu: '',
        titleArabic: '',
        arabicText: '',
        transliteration: '',
        translationUrdu: '',
        translationEnglish: '',
        reference: '',
        benefits: '',
        repeatCount: 1,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      showToast('At least one Dua/item is required in the book', 'info');
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, val: string | number) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalTitleEnglish = titleEnglish.trim();
    const finalTitleUrdu = titleUrdu.trim();
    const primaryTitle = finalTitleEnglish || finalTitleUrdu;

    if (!primaryTitle) {
      showToast('براہ کرم کتاب کا نام انگریزی یا اردو میں درج کریں (Please enter book title)', 'error');
      return;
    }

    const validItems = items.filter((it) => (it.title.trim() || it.titleUrdu?.trim() || it.titleEnglish?.trim()) && it.arabicText.trim());
    if (validItems.length === 0) {
      showToast('کم از کم ایک دعا کا عنوان اور عربی متن درج کریں (Please provide at least one Dua)', 'error');
      return;
    }

    // Normalise item titles so title, titleEnglish, and titleUrdu are all filled
    const normalisedItems = validItems.map((it) => ({
      ...it,
      title: it.title.trim() || it.titleEnglish?.trim() || it.titleUrdu?.trim() || 'دعا',
      titleEnglish: it.titleEnglish?.trim() || it.title.trim() || 'Dua',
      titleUrdu: it.titleUrdu?.trim() || it.title.trim() || 'دعا',
      titleArabic: it.titleArabic?.trim() || undefined,
    }));

    try {
      addCustomBook({
        title: primaryTitle,
        titleEnglish: finalTitleEnglish || finalTitleUrdu,
        titleUrdu: finalTitleUrdu || finalTitleEnglish,
        titleArabic: arabicTitle.trim() || undefined,
        arabicTitle: arabicTitle.trim() || undefined,
        author: author.trim() || 'اہلِ علم / مرتب',
        authorEnglish: authorEnglish.trim() || author.trim() || 'Author / Compiler',
        category,
        description: description.trim() || 'اسلامی کتاب و دعاؤں کا مجموعہ',
        items: normalisedItems,
      });

      showToast('ماشاءاللہ! نئی کتاب کامیابی سے شامل کر دی گئی', 'success');
      onBookAdded();
      onClose();
    } catch {
      showToast('کتاب محفوظ کرنے میں خرابی پیش آئی', 'error');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(5px)',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 720,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 24,
          background: 'var(--color-surface)',
          border: '1.5px solid var(--color-border-gold)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--gradient-emerald)',
            color: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BookPlus size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                نئی کتاب / مجموعہ شامل کریں
              </h2>
              <div style={{ fontSize: '0.78rem', opacity: 0.9 }}>
                Add Custom Islamic Book or Duas Collection
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '24px', flex: 1 }}>
          {/* Book Info Section with 3 Distinct Language Titles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, marginBottom: 16 }}>
            {/* 1. English Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: 6, color: 'var(--color-brand)' }}>
                🇬🇧 English Book Title (انگریزی نام) *
              </label>
              <input
                type="text"
                value={titleEnglish}
                onChange={(e) => setTitleEnglish(e.target.value)}
                placeholder="e.g. Daily Masnoon Duas Collection"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1.5px solid var(--color-border)',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            {/* 2. Urdu Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: 6, color: 'var(--color-gold-700)', direction: 'rtl', textAlign: 'right' }}>
                🇵🇰 اردو عنوان (Urdu Title)
              </label>
              <input
                type="text"
                dir="rtl"
                value={titleUrdu}
                onChange={(e) => setTitleUrdu(e.target.value)}
                placeholder="مثلاً: مسنون دعاؤں اور اذکار کا رجسٹر"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1.5px solid var(--color-border)',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  fontSize: '1.05rem',
                  lineHeight: 1.8,
                  fontFamily: 'var(--font-urdu)',
                }}
              />
            </div>

            {/* 3. Arabic Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: 6, color: 'var(--color-accent)', direction: 'rtl', textAlign: 'right' }}>
                🇸🇦 العنوان بالعربية (Arabic Title)
              </label>
              <input
                type="text"
                value={arabicTitle}
                onChange={(e) => setArabicTitle(e.target.value)}
                placeholder="مثلاً: سِجِلُّ الأَدْعِيَةِ المَسْنُونَةِ"
                dir="rtl"
                className="arabic-text"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1.5px solid var(--color-border)',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  fontSize: '0.95rem',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, marginBottom: 16 }}>
            {/* Author in Urdu */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6, color: 'var(--color-text)' }}>
                مصنف / مؤلف (Author in Urdu)
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. مولانا محمد یا آپ کا نام"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1.5px solid var(--color-border)',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            {/* Author in English */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6, color: 'var(--color-text)' }}>
                Author Name in English
              </label>
              <input
                type="text"
                value={authorEnglish}
                onChange={(e) => setAuthorEnglish(e.target.value)}
                placeholder="e.g. Maulana Muhammad / Your Name"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1.5px solid var(--color-border)',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            {/* Category */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6, color: 'var(--color-text)' }}>
                قسم / کیٹیگری (Category)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BookCategory)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1.5px solid var(--color-border)',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  fontSize: '0.9rem',
                }}
              >
                <option value="duas">مسنون دعائیں (Daily Duas)</option>
                <option value="namaz">نماز گائیڈ (Salah & Prayers)</option>
                <option value="kalima">کلمے (Kalimas & Faith)</option>
                <option value="quranic">قرآنی دعائیں (Quranic Duas)</option>
                <option value="special">خصوصی دعائیں (Special Duas)</option>
                <option value="ruqyah">شفا و حفاظت (Ruqyah & Healing)</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 22 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6, color: 'var(--color-text)' }}>
              کتاب کا تعارف (Description)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اس کتاب یا دعاؤں کے متعلق مختصر تفصیل لکھیں..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1.5px solid var(--color-border)',
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
                fontSize: '0.9rem',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Duas / Items Section */}
          <div style={{ borderTop: '2px dashed var(--color-border)', paddingTop: 18, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--color-brand)' }}>
                  دعاؤں اور مندرجات کی فہرست ({items.length})
                </h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  Add Duas or Prayers included in this book
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddItem}
                className="btn-ghost"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: '1px solid var(--color-brand)',
                  color: 'var(--color-brand)',
                }}
              >
                <Plus size={14} />
                <span>مزید دعا شامل کریں</span>
              </button>
            </div>

            {items.map((it, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--color-bg)',
                  padding: 16,
                  borderRadius: 14,
                  border: '1px solid var(--color-border)',
                  borderLeft: '4px solid #ef4444', // Register notebook styling
                  marginBottom: 14,
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-gold-600)' }}>
                    صفحہ / دعا #{idx + 1}
                  </span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: 4,
                      }}
                      title="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, marginBottom: 10 }}>
                  <input
                    type="text"
                    value={it.titleEnglish || ''}
                    onChange={(e) => {
                      handleItemChange(idx, 'titleEnglish', e.target.value);
                      if (!it.title) handleItemChange(idx, 'title', e.target.value);
                    }}
                    placeholder="🇬🇧 English Title (e.g. Travel Dua)"
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-surface)',
                      color: 'var(--color-text)',
                      fontSize: '0.86rem',
                    }}
                  />
                  <input
                    type="text"
                    dir="rtl"
                    value={it.titleUrdu || it.title || ''}
                    onChange={(e) => {
                      handleItemChange(idx, 'titleUrdu', e.target.value);
                      handleItemChange(idx, 'title', e.target.value);
                    }}
                    placeholder="🇵🇰 اردو عنوان (e.g. سفر کی مسنون دعا)"
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-surface)',
                      color: 'var(--color-text)',
                      fontSize: '0.98rem',
                      fontFamily: 'var(--font-urdu)',
                      lineHeight: 1.7,
                    }}
                  />
                  <input
                    type="text"
                    value={it.reference || ''}
                    onChange={(e) => handleItemChange(idx, 'reference', e.target.value)}
                    placeholder="حوالہ (Reference e.g. صحیح البخاری)"
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-surface)',
                      color: 'var(--color-text)',
                      fontSize: '0.86rem',
                    }}
                  />
                </div>

                <div style={{ marginBottom: 10 }}>
                  <textarea
                    rows={2}
                    required
                    dir="rtl"
                    className="arabic-text"
                    value={it.arabicText}
                    onChange={(e) => handleItemChange(idx, 'arabicText', e.target.value)}
                    placeholder="عربی متن مع اعراب (Arabic Text with Aerab)..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--color-border-gold)',
                      background: 'var(--color-surface)',
                      color: 'var(--color-text)',
                      fontSize: '1rem',
                      lineHeight: 2,
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10, marginBottom: 10 }}>
                  <textarea
                    rows={2}
                    dir="rtl"
                    value={it.translationUrdu}
                    onChange={(e) => handleItemChange(idx, 'translationUrdu', e.target.value)}
                    placeholder="اردو ترجمہ (Urdu Translation)..."
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-surface)',
                      color: 'var(--color-text)',
                      fontSize: '0.96rem',
                      lineHeight: 1.8,
                      fontFamily: 'var(--font-urdu)',
                    }}
                  />
                  <textarea
                    rows={2}
                    value={it.translationEnglish}
                    onChange={(e) => handleItemChange(idx, 'translationEnglish', e.target.value)}
                    placeholder="English Translation..."
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-surface)',
                      color: 'var(--color-text)',
                      fontSize: '0.88rem',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                  <input
                    type="text"
                    value={it.transliteration}
                    onChange={(e) => handleItemChange(idx, 'transliteration', e.target.value)}
                    placeholder="تلفظ / Pronunciation"
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-surface)',
                      color: 'var(--color-text)',
                      fontSize: '0.85rem',
                    }}
                  />
                  <input
                    type="text"
                    value={it.benefits}
                    onChange={(e) => handleItemChange(idx, 'benefits', e.target.value)}
                    placeholder="فضیلت و فوائد (Virtue / Occasion)"
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-surface)',
                      color: 'var(--color-text)',
                      fontSize: '0.85rem',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 12, borderTop: '1px solid var(--color-border)' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost"
              style={{ padding: '10px 20px', borderRadius: 10, fontSize: '0.9rem' }}
            >
              منسوخ کریں • Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{
                padding: '10px 24px',
                borderRadius: 10,
                fontSize: '0.9rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Sparkles size={16} />
              <span>کتاب محفوظ کریں • Save Book</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
