import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowUp, Copy, Sparkles } from 'lucide-react';
import { fetchJuzWithTranslation, AVAILABLE_TRANSLATIONS } from '../api/quranApi';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import type { Ayah } from '../types/quran';
import { JUZ_META } from '../types/quran';
import { LoadingSpinner, ErrorState, Bismillah } from '../components/ui/SharedComponents';
import { isUrduText } from '../utils/urduUtils';

const FONT_SIZE_MAP = { sm: '1.45rem', md: '1.85rem', lg: '2.25rem', xl: '2.7rem' };

function stripLeadingBismillah(text: string, surahNumber: number, ayahNumberInSurah: number): string {
  if (surahNumber === 1 || surahNumber === 9 || ayahNumberInSurah !== 1) {
    return text;
  }
  const knownPrefixes = [
    'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
    'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ',
    'بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ',
    'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
  ];
  for (const prefix of knownPrefixes) {
    if (text.startsWith(prefix)) {
      return text.slice(prefix.length).trim();
    }
  }
  return text.replace(/^ب[\u064B-\u065F\u0670]*س[\u064B-\u065F\u0670]*م[\u064B-\u065F\u0670]*\s+[\u0600-\u06FF\s]+?الر[\u064B-\u065F\u0670]*ح[\u064B-\u065F\u0670]*ي[\u064B-\u065F\u0670]*م[\u064B-\u065F\u0670]*\s*/, '').trim();
}

export default function JuzReaderPage() {
  const { juzNumber } = useParams<{ juzNumber: string }>();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { showToast } = useToast();

  const num = parseInt(juzNumber ?? '1', 10);

  const [arabicAyahs, setArabicAyahs] = useState<Ayah[]>([]);
  const [translationAyahs, setTranslationAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (isNaN(num) || num < 1 || num > 30) {
      setError('Invalid Juz number. Please choose a Juz between 1 and 30.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { arabic, translation } = await fetchJuzWithTranslation(num, settings.translationEdition);
      setArabicAyahs(arabic.ayahs);
      setTranslationAyahs(translation.ayahs);
    } catch (e: unknown) {
      setError((e as Error).message ?? 'Failed to load Juz.');
    } finally {
      setLoading(false);
    }
  }, [num, settings.translationEdition]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    document.title = `Juz ${num} — Noor Quran`;
  }, [num]);

  const copyAyah = (arabicText: string, transText: string, ref: string) => {
    const text = `${ref}\n${arabicText}\n\nTranslation: ${transText}\n(Noor Quran)`;
    navigator.clipboard.writeText(text).then(() => showToast('Ayah copied', 'success'));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <LoadingSpinner text={`Loading Juz ${num}…`} />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const juzMeta = JUZ_META.find((j) => j.number === num);
  const translationInfo = AVAILABLE_TRANSLATIONS.find((t) => t.identifier === settings.translationEdition);
  const isUrduTranslation =
    settings.translationEdition.startsWith('ur.') ||
    translationInfo?.language === 'ur' ||
    (translationAyahs.length > 0 && isUrduText(translationAyahs[0].text));

  return (
    <div className="quran-page-container" style={{ paddingTop: 24, paddingBottom: 140 }}>
      {/* ─── Top Navigation Strip ─── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20,
      }}>
        <Link
          to="/juz"
          className="btn-ghost"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            borderRadius: 12,
            border: '1px solid var(--color-border-gold)',
            background: 'var(--color-surface)',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--color-brand)',
          }}
        >
          <ArrowLeft size={16} className="shiny-icon" />
          <span>All 30 Juz</span>
        </Link>

        {/* Prev / Next Juz Quick Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => num > 1 && navigate(`/juz/${num - 1}`)}
            disabled={num <= 1}
            aria-label="Previous Juz"
            className="btn-secondary"
            style={{ padding: '7px 14px', borderRadius: 10, opacity: num <= 1 ? 0.4 : 1, fontSize: '0.85rem' }}
          >
            <ChevronLeft size={16} className="shiny-icon" />
            <span className="hidden sm:inline">Juz {num > 1 ? num - 1 : 1}</span>
          </button>

          <button
            onClick={() => num < 30 && navigate(`/juz/${num + 1}`)}
            disabled={num >= 30}
            aria-label="Next Juz"
            className="btn-secondary"
            style={{ padding: '7px 14px', borderRadius: 10, opacity: num >= 30 ? 0.4 : 1, fontSize: '0.85rem' }}
          >
            <span className="hidden sm:inline">Juz {num < 30 ? num + 1 : 30}</span>
            <ChevronRight size={16} className="shiny-icon" />
          </button>
        </div>
      </div>

      {/* ─── Grand Royal Cartouche Header ─── */}
      <div className="surah-cartouche-luxury">
        <div className="surah-cartouche-texture" />

        {/* Top Badges */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
          <span style={{
            background: 'rgba(212, 175, 55, 0.22)',
            border: '1px solid rgba(212, 175, 55, 0.45)',
            color: '#fef08a',
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '4px 12px',
            borderRadius: 9999,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            letterSpacing: '0.05em',
          }}>
            <Sparkles size={12} className="shiny-icon" />
            JUZ {num} OF 30
          </span>

          {juzMeta && (
            <span style={{
              background: 'rgba(45, 106, 79, 0.4)',
              border: '1px solid rgba(110, 231, 183, 0.35)',
              color: '#a7f3d0',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: 9999,
            }}>
              SURAH {juzMeta.startSurah}:{juzMeta.startAyah} → {juzMeta.endSurah}:{juzMeta.endAyah}
            </span>
          )}

          <span style={{
            background: 'rgba(212, 175, 55, 0.22)',
            border: '1px solid rgba(212, 175, 55, 0.45)',
            color: '#fef08a',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: 9999,
          }}>
            {arabicAyahs.length} VERSES
          </span>
        </div>

        {/* Arabic Calligraphy Title */}
        <h1
          className="arabic-text"
          lang="ar"
          style={{
            position: 'relative',
            zIndex: 2,
            fontSize: 'clamp(2.6rem, 5.5vw, 4rem)',
            color: '#fef08a',
            margin: '0 0 6px',
            fontWeight: 800,
            textShadow: '0 4px 18px rgba(0,0,0,0.6), 0 0 20px rgba(212,175,55,0.4)',
            lineHeight: 1.3,
          }}
        >
          الجزء {num}
        </h1>

        {/* English Title */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(1.5rem, 3.2vw, 2.2rem)',
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '0.02em',
          marginBottom: 6,
        }}>
          Holy Quran — Portion {num}
        </div>

        <div style={{
          position: 'relative',
          zIndex: 2,
          fontSize: '0.92rem',
          color: '#bce5cf',
          fontStyle: 'italic',
        }}>
          Canonical division from Surah {juzMeta?.startSurah} to Surah {juzMeta?.endSurah}
        </div>
      </div>

      {/* ─── Verses in this Juz ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {arabicAyahs.map((ayah, idx) => {
          const tAyah = translationAyahs[idx];
          const surahNum = ayah.surah?.number ?? 1;
          const isStartOfSurah = ayah.numberInSurah === 1;
          const cleanedText = stripLeadingBismillah(ayah.text, surahNum, ayah.numberInSurah);
          const showBismillah = isStartOfSurah && surahNum !== 1 && surahNum !== 9;

          return (
            <div key={ayah.number}>
              {/* Surah Header Card when a new Surah starts in this Juz */}
              {isStartOfSurah && (
                <div style={{ margin: '36px 0 20px' }}>
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
                      borderRadius: 18,
                      padding: '20px 24px',
                      textAlign: 'center',
                      color: '#ffffff',
                      border: '1.5px solid var(--color-border-gold)',
                      boxShadow: '0 8px 24px rgba(27,67,50,0.25)',
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', color: '#fef08a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                      SURAH {ayah.surah?.number} • {ayah.surah?.revelationType?.toUpperCase()} REVELATION
                    </div>
                    <div className="arabic-text" lang="ar" style={{ fontSize: '2.4rem', color: '#ffffff', fontWeight: 800, margin: '4px 0', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                      {ayah.surah?.name}
                    </div>
                    <div style={{ fontSize: '1.25rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#fef08a' }}>
                      {ayah.surah?.englishName}
                    </div>
                  </div>

                  {showBismillah && <div style={{ marginTop: 16 }}><Bismillah /></div>}
                </div>
              )}

              {/* Individual Ayah Card */}
              <div
                className="card"
                style={{
                  padding: '24px 28px',
                  borderRadius: 18,
                  border: '1px solid var(--color-border)',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="icon-badge-gold" style={{ width: 34, height: 34, borderRadius: '50%', fontWeight: 800, fontSize: '0.85rem' }}>
                      {ayah.numberInSurah}
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-brand)' }}>
                      Surah {ayah.surah?.englishName ?? ayah.surah?.number} : {ayah.numberInSurah}
                    </span>
                  </div>

                  <button
                    onClick={() => copyAyah(cleanedText, tAyah?.text ?? '', `Surah ${ayah.surah?.englishName} [${surahNum}:${ayah.numberInSurah}]`)}
                    className="btn-ghost"
                    style={{ padding: '6px 8px', borderRadius: 8 }}
                    title="Copy Ayah"
                  >
                    <Copy size={16} />
                  </button>
                </div>

                {/* Arabic Text */}
                <p
                  className="arabic-text"
                  lang="ar"
                  style={{
                    fontSize: FONT_SIZE_MAP[settings.arabicFontSize],
                    color: 'var(--color-text)',
                    margin: '0 0 16px',
                    padding: '4px 0',
                    lineHeight: 2.3,
                    borderBottom: '1px dashed var(--color-border)',
                  }}
                >
                  {cleanedText}
                </p>

                {/* Translation Text */}
                {tAyah && (
                  <div>
                    <p
                      style={{
                        margin: '0 0 6px',
                        lineHeight: isUrduTranslation ? 2.2 : 1.8,
                        color: 'var(--color-text)',
                        fontSize: isUrduTranslation ? '1.14rem' : '0.98rem',
                        direction: isUrduTranslation ? 'rtl' : 'ltr',
                        textAlign: isUrduTranslation ? 'right' : 'left',
                        fontFamily: isUrduTranslation ? 'var(--font-urdu)' : 'inherit',
                      }}
                    >
                      {tAyah.text}
                    </p>
                    <div
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--color-text-muted)',
                        textAlign: isUrduTranslation ? 'left' : 'right',
                        fontStyle: 'italic',
                      }}
                    >
                      — {translationInfo?.name ?? settings.translationEdition}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Floating Reader Bar ─── */}
      <div className="reader-floating-bar">
        <button
          onClick={() => num > 1 && navigate(`/juz/${num - 1}`)}
          disabled={num <= 1}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#ffffff',
            cursor: num <= 1 ? 'not-allowed' : 'pointer',
            opacity: num <= 1 ? 0.35 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 8px',
            fontSize: '0.8rem',
            fontWeight: 700,
          }}
          title="Previous Juz"
        >
          <ChevronLeft size={18} className="shiny-icon" />
          <span className="hidden sm:inline">Prev Juz</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '0.85rem', color: '#fef08a', fontWeight: 800 }}>
            Juz {num} of 30
          </span>
          <span style={{ fontSize: '0.75rem', color: '#bce5cf' }}>
            ({arabicAyahs.length} Verses)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={scrollToTop}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '50%',
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            title="Scroll to Top"
          >
            <ArrowUp size={14} />
          </button>

          <button
            onClick={() => num < 30 && navigate(`/juz/${num + 1}`)}
            disabled={num >= 30}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: num >= 30 ? 'not-allowed' : 'pointer',
              opacity: num >= 30 ? 0.35 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 8px',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
            title="Next Juz"
          >
            <span className="hidden sm:inline">Next Juz</span>
            <ChevronRight size={18} className="shiny-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}
