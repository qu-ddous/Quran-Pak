import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchJuzWithTranslation, AVAILABLE_TRANSLATIONS } from '../api/quranApi';
import { useSettings } from '../context/SettingsContext';
import type { Ayah } from '../types/quran';
import { JUZ_META } from '../types/quran';
import { LoadingSpinner, ErrorState, Badge } from '../components/ui/SharedComponents';

const FONT_SIZE_MAP = { sm: '1.4rem', md: '1.75rem', lg: '2.1rem', xl: '2.5rem' };

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
    document.title = `Juz ${num} — Noor Quran`;
    load();
  }, [load, num]);

  const juzMeta = JUZ_META.find((j) => j.number === num);
  const translationInfo = AVAILABLE_TRANSLATIONS.find(t => t.identifier === settings.translationEdition);

  if (loading) return <LoadingSpinner text={`Loading Juz ${num}…`} />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 80px' }}>
      {/* Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Link to="/juz" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 4 }}>
          <ChevronLeft size={14} aria-hidden="true" /> All Juz
        </Link>
        <span style={{ color: 'var(--color-border)' }}>·</span>
        {num > 1 && (
          <button onClick={() => navigate(`/juz/${num - 1}`)} className="btn-ghost" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
            <ChevronLeft size={14} aria-hidden="true" /> Juz {num - 1}
          </button>
        )}
        {num < 30 && (
          <button onClick={() => navigate(`/juz/${num + 1}`)} className="btn-ghost" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
            Juz {num + 1} <ChevronRight size={14} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Juz header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <Badge label={`Juz ${num}`} variant="default" />
          {juzMeta && (
            <Badge
              label={`Surah ${juzMeta.startSurah}:${juzMeta.startAyah} — ${juzMeta.endSurah}:${juzMeta.endAyah}`}
              variant="muted"
            />
          )}
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 8px', color: 'var(--color-text)' }}>Juz {num}</h1>
        {juzMeta && (
          <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.875rem' }}>
            Surah {juzMeta.startSurah}, Ayah {juzMeta.startAyah} → Surah {juzMeta.endSurah}, Ayah {juzMeta.endAyah}
          </p>
        )}
      </div>

      {/* Ayahs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {arabicAyahs.map((ayah, idx) => {
          const tAyah = translationAyahs[idx];
          return (
            <div
              key={ayah.number}
              className="card"
              style={{ padding: '24px' }}
            >
              {/* Reference & ayah number */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                {ayah.surah && (
                  <Link
                    to={`/surah/${ayah.surah.number}#ayah-${ayah.numberInSurah}`}
                    style={{ fontSize: '0.78rem', color: 'var(--color-brand)', textDecoration: 'none', fontWeight: 600 }}
                  >
                    {ayah.surah.englishName} ({ayah.surah.number}:{ayah.numberInSurah})
                  </Link>
                )}
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', background: 'var(--color-primary-100)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.78rem', color: 'var(--color-brand)',
                }} aria-label={`Ayah ${ayah.numberInSurah}`}>
                  {ayah.numberInSurah}
                </div>
              </div>

              {/* Arabic */}
              {settings.readingMode !== 'translation-only' && (
                <p className="arabic-text" lang="ar" style={{
                  fontSize: FONT_SIZE_MAP[settings.arabicFontSize],
                  color: 'var(--color-text)', margin: '0 0 16px',
                  borderBottom: settings.readingMode === 'both' && tAyah ? '1px solid var(--color-border)' : 'none',
                  paddingBottom: settings.readingMode === 'both' && tAyah ? 16 : 0,
                }}>
                  {ayah.text}
                </p>
              )}

              {/* Translation */}
              {settings.readingMode !== 'arabic-only' && tAyah && (
                <p style={{ margin: 0, lineHeight: 1.8, color: 'var(--color-text)', fontSize: '0.95rem' }}
                  lang={translationInfo?.language ?? 'en'}
                  dir={translationInfo?.direction === 'rtl' ? 'rtl' : 'ltr'}
                >
                  {tAyah.text}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Prev/Next */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, gap: 12 }}>
        {num > 1 ? (
          <button onClick={() => navigate(`/juz/${num - 1}`)} className="btn-secondary">
            <ChevronLeft size={16} aria-hidden="true" /> Juz {num - 1}
          </button>
        ) : <span />}
        {num < 30 && (
          <button onClick={() => navigate(`/juz/${num + 1}`)} className="btn-primary">
            Juz {num + 1} <ChevronRight size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      <p style={{ marginTop: 32, fontSize: '0.78rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        Arabic text: <strong>quran-uthmani</strong> via Al Quran Cloud API. Translation: <strong>{translationInfo?.name}</strong>.
        See <Link to="/sources" style={{ color: 'var(--color-brand)', textDecoration: 'none' }}>Sources</Link>.
      </p>
    </div>
  );
}
