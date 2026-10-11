import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { fetchJuzWithTranslation, AVAILABLE_TRANSLATIONS } from '../api/quranApi';
import { useSettings } from '../context/SettingsContext';
import type { Ayah } from '../types/quran';
import { JUZ_META } from '../types/quran';
import { LoadingSpinner, ErrorState, Badge, Bismillah } from '../components/ui/SharedComponents';

const FONT_SIZE_MAP = { sm: '1.45rem', md: '1.8rem', lg: '2.15rem', xl: '2.6rem' };

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

  if (loading) return <LoadingSpinner text={`Loading Juz ${num}…`} />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const juzMeta = JUZ_META.find((j) => j.number === num);
  const translationInfo = AVAILABLE_TRANSLATIONS.find((t) => t.identifier === settings.translationEdition);

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 20px 80px' }}>
      {/* Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
        padding: '12px 18px',
        borderRadius: 14,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-gold)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => num > 1 && navigate(`/juz/${num - 1}`)}
            disabled={num <= 1}
            aria-label="Previous Juz"
            className="btn-secondary"
            style={{ padding: '6px 12px', opacity: num <= 1 ? 0.4 : 1 }}
          >
            <ChevronLeft size={16} className="shiny-icon" />
            <span>Juz {num - 1}</span>
          </button>

          <Link to="/juz" className="btn-ghost" style={{ padding: '6px 10px', fontSize: '0.85rem' }}>
            <BookOpen size={15} className="shiny-icon" /> All 30 Juz
          </Link>

          <button
            onClick={() => num < 30 && navigate(`/juz/${num + 1}`)}
            disabled={num >= 30}
            aria-label="Next Juz"
            className="btn-secondary"
            style={{ padding: '6px 12px', opacity: num >= 30 ? 0.4 : 1 }}
          >
            <span>Juz {num + 1}</span>
            <ChevronRight size={16} className="shiny-icon" />
          </button>
        </div>
      </div>

      {/* Juz Cartouche Header */}
      <div className="mushaf-surah-cartouche" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <Badge label={`Juz ${num}`} variant="gold" />
          {juzMeta && (
            <Badge
              label={`Surah ${juzMeta.startSurah}:${juzMeta.startAyah} → ${juzMeta.endSurah}:${juzMeta.endAyah}`}
              variant="green"
            />
          )}
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 6px', color: '#fef08a' }}>
          Juz {num}
        </h1>
        {juzMeta && (
          <p style={{ color: '#bce5cf', margin: 0, fontSize: '0.9rem' }}>
            From Surah {juzMeta.startSurah}, Ayah {juzMeta.startAyah} to Surah {juzMeta.endSurah}, Ayah {juzMeta.endAyah}
          </p>
        )}
      </div>

      {/* Ayahs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {arabicAyahs.map((ayah, idx) => {
          const tAyah = translationAyahs[idx];
          const surahNum = ayah.surah?.number ?? 1;
          const isStartOfSurah = ayah.numberInSurah === 1;
          const cleanedText = stripLeadingBismillah(ayah.text, surahNum, ayah.numberInSurah);

          return (
            <div key={ayah.number}>
              {/* If this is verse 1 of a Surah within this Juz, display Surah banner */}
              {isStartOfSurah && (
                <div style={{ margin: '28px 0 16px', textAlign: 'center' }}>
                  <div className="mushaf-surah-cartouche" style={{ padding: '12px 20px', marginBottom: 12 }}>
                    <div style={{ fontSize: '0.78rem', color: '#fef08a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Surah {ayah.surah?.number} • {ayah.surah?.revelationType}
                    </div>
                    <div className="arabic-text" style={{ fontSize: '2rem', color: '#ffffff', fontWeight: 800, margin: '4px 0' }}>
                      {ayah.surah?.name}
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fef08a' }}>
                      {ayah.surah?.englishName} ({ayah.surah?.englishNameTranslation})
                    </div>
                  </div>
                  {surahNum !== 1 && surahNum !== 9 && <Bismillah />}
                </div>
              )}

              <div
                className="card"
                style={{ padding: '22px 24px', border: '1.5px solid var(--color-border)' }}
              >
                {/* Reference & ayah number */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  {ayah.surah && (
                    <Link
                      to={`/surah/${ayah.surah.number}#ayah-${ayah.numberInSurah}`}
                      style={{ fontSize: '0.82rem', color: 'var(--color-brand)', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <BookOpen size={14} className="shiny-icon" /> {ayah.surah.englishName} ({ayah.surah.number}:{ayah.numberInSurah})
                    </Link>
                  )}
                  <div className="icon-badge-gold" style={{ width: 32, height: 32, borderRadius: '50%', fontWeight: 800, fontSize: '0.8rem' }} aria-label={`Ayah ${ayah.numberInSurah}`}>
                    {ayah.numberInSurah}
                  </div>
                </div>

                {/* Arabic */}
                {settings.readingMode !== 'translation-only' && (
                  <p className="arabic-text" lang="ar" style={{
                    fontSize: FONT_SIZE_MAP[settings.arabicFontSize],
                    color: 'var(--color-text)', margin: '0 0 16px',
                    lineHeight: 2.3,
                    borderBottom: settings.readingMode === 'both' && tAyah ? '1px dashed var(--color-border)' : 'none',
                    paddingBottom: settings.readingMode === 'both' && tAyah ? 14 : 0,
                  }}>
                    {cleanedText}
                  </p>
                )}

                {/* Translation */}
                {settings.readingMode !== 'arabic-only' && tAyah && (
                  <p style={{ margin: 0, lineHeight: 1.8, color: 'var(--color-text)', fontSize: '0.96rem' }}
                    lang={translationInfo?.language ?? 'en'}
                    dir={translationInfo?.direction === 'rtl' ? 'rtl' : 'ltr'}
                  >
                    {tAyah.text}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
