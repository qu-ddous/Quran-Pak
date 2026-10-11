import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, Copy, Play, Flag,
  Settings2, Volume2,
} from 'lucide-react';
import { fetchSurahWithTranslation } from '../api/quranApi';
import { buildAudioUrl } from '../api/quranApi';
import { AVAILABLE_TRANSLATIONS } from '../api/quranApi';
import { addBookmark, removeBookmark, recordVisit } from '../db/userDb';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import type { Ayah, Surah } from '../types/quran';
import { LoadingSpinner, ErrorState, Bismillah, Badge } from '../components/ui/SharedComponents';
import type { Bookmark as BookmarkType } from '../db/userDb';

const FONT_SIZE_MAP = { sm: '1.4rem', md: '1.75rem', lg: '2.1rem', xl: '2.5rem' };

export default function SurahReaderPage() {
  const { surahNumber } = useParams<{ surahNumber: string }>();
  const navigate = useNavigate();
  const { settings, updateSetting } = useSettings();
  const { showToast } = useToast();

  const num = parseInt(surahNumber ?? '1', 10);

  const [arabic, setArabic] = useState<Surah | null>(null);
  const [translation, setTranslation] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [showSettings, setShowSettings] = useState(false);

  // Audio state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);

  const load = useCallback(async () => {
    if (isNaN(num) || num < 1 || num > 114) {
      setError('Invalid Surah number. Please choose a Surah between 1 and 114.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { arabic: a, translation: t } = await fetchSurahWithTranslation(num, settings.translationEdition);
      setArabic(a);
      setTranslation(t);
      await recordVisit(num, 1);
    } catch (e: unknown) {
      setError((e as Error).message ?? 'Failed to load Surah.');
    } finally {
      setLoading(false);
    }
  }, [num, settings.translationEdition]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (arabic) document.title = `${arabic.englishName} — Noor Quran`;
  }, [arabic]);

  // Play ayah audio
  const playAyah = async (ayah: Ayah) => {
    const audioUrl = buildAudioUrl(ayah.number, settings.reciterIdentifier);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setPlayingAyah(ayah.numberInSurah);
    setAudioLoading(true);
    audio.oncanplay = () => setAudioLoading(false);
    audio.onended = () => setPlayingAyah(null);
    audio.onerror = () => {
      showToast('Audio unavailable for this ayah. Please check your internet connection.', 'error');
      setPlayingAyah(null);
      setAudioLoading(false);
    };
    try {
      await audio.play();
    } catch {
      showToast('Could not play audio. This may require user interaction first.', 'error');
      setPlayingAyah(null);
    }
  };

  const stopAudio = () => {
    audioRef.current?.pause();
    setPlayingAyah(null);
  };

  // Bookmark helpers
  const toggleBookmark = async (ayah: Ayah) => {
    const id = `${num}:${ayah.numberInSurah}`;
    const already = bookmarkedIds.has(id);
    if (already) {
      await removeBookmark(id);
      setBookmarkedIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
      showToast('Bookmark removed', 'info');
    } else {
      const bm: BookmarkType = {
        id, surahNumber: num, ayahNumber: ayah.numberInSurah,
        surahName: arabic?.name ?? '', surahEnglishName: arabic?.englishName ?? '',
        ayahText: ayah.text.slice(0, 80),
        createdAt: Date.now(),
      };
      await addBookmark(bm);
      setBookmarkedIds((prev) => new Set(prev).add(id));
      showToast('Bookmark saved', 'success');
    }
  };

  // Copy ayah reference
  const copyReference = (ayah: Ayah) => {
    const ref = `${arabic?.englishName} (${num}:${ayah.numberInSurah}) — ${ayah.text.slice(0, 60)}…`;
    navigator.clipboard.writeText(ref).then(() => showToast('Reference copied to clipboard', 'success'));
  };

  // Report
  const reportAyah = (ayah: Ayah) => {
    const subject = encodeURIComponent(`Content issue — Surah ${num}, Ayah ${ayah.numberInSurah}`);
    const body = encodeURIComponent(`Surah: ${num} (${arabic?.englishName})\nAyah: ${ayah.numberInSurah}\nEdition: ${settings.translationEdition}\n\nIssue description:\n`);
    window.open(`mailto:feedback@noorquran.app?subject=${subject}&body=${body}`, '_blank');
  };

  if (loading) return <LoadingSpinner text={`Loading Surah ${num}…`} />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!arabic) return null;

  const showBismillah = num !== 1 && num !== 9;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 80px' }}>
      {/* Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Link to="/quran" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 4 }}>
          <ChevronLeft size={14} aria-hidden="true" /> All Surahs
        </Link>
        <span style={{ color: 'var(--color-border)' }}>·</span>
        {num > 1 && (
          <button onClick={() => navigate(`/surah/${num - 1}`)} className="btn-ghost" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
            <ChevronLeft size={14} aria-hidden="true" /> Prev
          </button>
        )}
        {num < 114 && (
          <button onClick={() => navigate(`/surah/${num + 1}`)} className="btn-ghost" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
            Next <ChevronRight size={14} aria-hidden="true" />
          </button>
        )}
        <div style={{ marginLeft: 'auto' }}>
          <button onClick={() => setShowSettings(!showSettings)} className="btn-ghost" aria-label="Reading settings" style={{ padding: '6px 10px' }}>
            <Settings2 size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Reader Settings Panel */}
      {showSettings && (
        <div className="card" style={{ padding: '20px', marginBottom: 24 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '0.95rem', fontWeight: 700 }}>Reading Settings</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
            {/* Font size */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 6 }}>Arabic Font Size</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => updateSetting('arabicFontSize', sz)}
                    aria-label={`Font size ${sz}`}
                    style={{
                      padding: '6px 12px', borderRadius: 6, border: '1.5px solid',
                      borderColor: settings.arabicFontSize === sz ? 'var(--color-brand)' : 'var(--color-border)',
                      background: settings.arabicFontSize === sz ? 'var(--color-primary-50)' : 'var(--color-surface)',
                      color: settings.arabicFontSize === sz ? 'var(--color-brand)' : 'var(--color-text-muted)',
                      fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'inherit',
                    }}
                  >
                    {sz.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            {/* Reading mode */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 6 }}>Reading Mode</label>
              <select
                value={settings.readingMode}
                onChange={(e) => updateSetting('readingMode', e.target.value as 'both' | 'arabic-only' | 'translation-only')}
                style={{ padding: '6px 12px', border: '1.5px solid var(--color-border)', borderRadius: 6, background: 'var(--color-surface)', color: 'var(--color-text)', fontFamily: 'inherit', fontSize: '0.875rem' }}
              >
                <option value="both">Arabic + Translation</option>
                <option value="arabic-only">Arabic Only</option>
                <option value="translation-only">Translation Only</option>
              </select>
            </div>
            {/* Translation */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 6 }}>Translation</label>
              <select
                value={settings.translationEdition}
                onChange={(e) => updateSetting('translationEdition', e.target.value)}
                style={{ padding: '6px 12px', border: '1.5px solid var(--color-border)', borderRadius: 6, background: 'var(--color-surface)', color: 'var(--color-text)', fontFamily: 'inherit', fontSize: '0.875rem' }}
              >
                {AVAILABLE_TRANSLATIONS.map((t) => (
                  <option key={t.identifier} value={t.identifier}>{t.englishName}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Surah Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <Badge label={`Surah ${arabic.number}`} variant="default" />
          <Badge label={arabic.revelationType === 'Meccan' ? 'Makkah' : 'Madinah'} variant={arabic.revelationType === 'Meccan' ? 'gold' : 'green'} />
          <Badge label={`${arabic.numberOfAyahs} Ayahs`} variant="muted" />
        </div>
        <h1 className="arabic-text" lang="ar" style={{ fontSize: '3rem', color: 'var(--color-brand)', marginBottom: 4, fontWeight: 700 }}>
          {arabic.name}
        </h1>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>{arabic.englishName}</div>
        <div style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>{arabic.englishNameTranslation}</div>
      </div>

      {showBismillah && <Bismillah />}

      {/* Ayahs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {arabic.ayahs.map((ayah) => {
          const translationAyah = translation?.ayahs[ayah.numberInSurah - 1];
          const bmId = `${num}:${ayah.numberInSurah}`;
          const isPlaying = playingAyah === ayah.numberInSurah;
          const isBm = bookmarkedIds.has(bmId);

          return (
            <div
              key={ayah.number}
              id={`ayah-${ayah.numberInSurah}`}
              className="card"
              style={{ padding: '24px', position: 'relative' }}
            >
              {/* Ayah number badge */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', background: 'var(--color-primary-100)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.82rem', color: 'var(--color-brand)',
                }} aria-label={`Ayah ${ayah.numberInSurah}`}>
                  {ayah.numberInSurah}
                </div>
              </div>

              {/* Arabic text */}
              {settings.readingMode !== 'translation-only' && (
                <p
                  className="arabic-text"
                  lang="ar"
                  style={{
                    fontSize: FONT_SIZE_MAP[settings.arabicFontSize],
                    color: 'var(--color-text)',
                    margin: '0 0 20px',
                    padding: '8px 0',
                    borderBottom: settings.readingMode === 'both' ? '1px solid var(--color-border)' : 'none',
                  }}
                >
                  {ayah.text}
                </p>
              )}

              {/* Translation text */}
              {settings.readingMode !== 'arabic-only' && translationAyah && (
                <div>
                  <p style={{ margin: '0 0 8px', lineHeight: 1.8, color: 'var(--color-text)', fontSize: '0.97rem' }}
                    lang={AVAILABLE_TRANSLATIONS.find(t => t.identifier === settings.translationEdition)?.language ?? 'en'}
                    dir={AVAILABLE_TRANSLATIONS.find(t => t.identifier === settings.translationEdition)?.direction === 'rtl' ? 'rtl' : 'ltr'}
                  >
                    {translationAyah.text}
                  </p>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>
                    — {AVAILABLE_TRANSLATIONS.find(t => t.identifier === settings.translationEdition)?.name ?? settings.translationEdition}
                  </div>
                </div>
              )}

              {/* Ayah actions */}
              <div style={{ display: 'flex', gap: 6, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--color-border)', flexWrap: 'wrap' }}>
                <button
                  onClick={() => isPlaying ? stopAudio() : playAyah(ayah)}
                  aria-label={isPlaying ? `Stop audio for ayah ${ayah.numberInSurah}` : `Play audio for ayah ${ayah.numberInSurah}`}
                  className="btn-ghost"
                  style={{ padding: '6px 10px', fontSize: '0.8rem', color: isPlaying ? 'var(--color-brand)' : undefined }}
                  disabled={audioLoading && isPlaying}
                >
                  {isPlaying ? <Volume2 size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
                  {isPlaying ? 'Stop' : 'Play'}
                </button>
                <button
                  onClick={() => toggleBookmark(ayah)}
                  aria-label={isBm ? `Remove bookmark for ayah ${ayah.numberInSurah}` : `Bookmark ayah ${ayah.numberInSurah}`}
                  className="btn-ghost"
                  style={{ padding: '6px 10px', fontSize: '0.8rem', color: isBm ? 'var(--color-brand)' : undefined }}
                >
                  {isBm ? <BookmarkCheck size={14} aria-hidden="true" /> : <Bookmark size={14} aria-hidden="true" />}
                  {isBm ? 'Saved' : 'Bookmark'}
                </button>
                <button
                  onClick={() => copyReference(ayah)}
                  aria-label={`Copy reference for ayah ${ayah.numberInSurah}`}
                  className="btn-ghost"
                  style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                >
                  <Copy size={14} aria-hidden="true" /> Copy
                </button>
                <button
                  onClick={() => reportAyah(ayah)}
                  aria-label={`Report issue with ayah ${ayah.numberInSurah}`}
                  className="btn-ghost"
                  style={{ padding: '6px 10px', fontSize: '0.8rem', marginLeft: 'auto', color: 'var(--color-text-muted)' }}
                >
                  <Flag size={14} aria-hidden="true" /> Report
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prev/Next navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, gap: 12 }}>
        {num > 1 ? (
          <button onClick={() => navigate(`/surah/${num - 1}`)} className="btn-secondary">
            <ChevronLeft size={16} aria-hidden="true" /> Previous Surah
          </button>
        ) : <span />}
        {num < 114 && (
          <button onClick={() => navigate(`/surah/${num + 1}`)} className="btn-primary">
            Next Surah <ChevronRight size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Attribution */}
      <p style={{ marginTop: 32, fontSize: '0.78rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        Arabic Quran text: <strong>quran-uthmani</strong> edition via <a href="https://api.alquran.cloud" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-brand)', textDecoration: 'none' }}>Al Quran Cloud API</a> (Islamic Network).
        Translation: <strong>{AVAILABLE_TRANSLATIONS.find(t => t.identifier === settings.translationEdition)?.name}</strong>.
        Audio: {settings.reciterIdentifier} via Al Quran Cloud CDN.
        See <Link to="/sources" style={{ color: 'var(--color-brand)', textDecoration: 'none' }}>Sources &amp; Licenses</Link>.
      </p>
    </div>
  );
}
