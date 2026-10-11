import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, Copy, Play, Pause,
  Square, Settings2, BookOpen, Layers, Volume2, Repeat,
} from 'lucide-react';
import { fetchSurahWithTranslation, buildAudioUrl, AVAILABLE_TRANSLATIONS } from '../api/quranApi';
import { addBookmark, removeBookmark, recordVisit } from '../db/userDb';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import type { Ayah, Surah } from '../types/quran';
import { LoadingSpinner, ErrorState, Bismillah, Badge } from '../components/ui/SharedComponents';
import type { Bookmark as BookmarkType } from '../db/userDb';

const FONT_SIZE_MAP = { sm: '1.45rem', md: '1.8rem', lg: '2.15rem', xl: '2.6rem' };

/**
 * Remove duplicate leading Bismillah from Ayah 1.
 * Surah 1: Bismillah IS Ayah 1 (leave intact, don't show separate banner).
 * Surah 9: No Bismillah at all (scholarly rule).
 * Surah 2-114: API attaches Bismillah to Ayah 1 text, but we display the ornate header banner,
 * so we strip it from Ayah 1 body to avoid duplicate display.
 */
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
  // Fallback regex for slight diacritic differences
  return text.replace(/^ب[\u064B-\u065F\u0670]*س[\u064B-\u065F\u0670]*م[\u064B-\u065F\u0670]*\s+[\u0600-\u06FF\s]+?الر[\u064B-\u065F\u0670]*ح[\u064B-\u065F\u0670]*ي[\u064B-\u065F\u0670]*م[\u064B-\u065F\u0670]*\s*/, '').trim();
}

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

  // View Mode: 'cards' (Verse by verse with translation) or 'mushaf' (Traditional Continuous Holy Book Page)
  const [viewMode, setViewMode] = useState<'cards' | 'mushaf'>('cards');

  // Audio Playback & Auto-Play Next
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const autoPlayRef = useRef(true);
  const playAyahByIndexRef = useRef<(index: number) => Promise<void>>(async () => {});

  useEffect(() => {
    autoPlayRef.current = autoPlay;
  }, [autoPlay]);

  const [activeModalAyah, setActiveModalAyah] = useState<Ayah | null>(null);

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
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [load]);

  useEffect(() => {
    if (arabic) document.title = `${arabic.englishName} (${arabic.name}) — Noor Quran`;
  }, [arabic]);

  // Play Ayah audio with Auto-Play forward chain
  const playAyahByIndex = useCallback(async (index: number) => {
    if (!arabic || index < 0 || index >= arabic.ayahs.length) {
      setPlayingAyah(null);
      return;
    }

    const targetAyah = arabic.ayahs[index];
    const audioUrl = buildAudioUrl(targetAyah.number, settings.reciterIdentifier);

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setPlayingAyah(targetAyah.numberInSurah);
    setAudioLoading(true);

    audio.oncanplay = () => setAudioLoading(false);

    audio.onended = () => {
      if (autoPlayRef.current && index + 1 < arabic.ayahs.length) {
        // Auto play next verse
        playAyahByIndexRef.current(index + 1);
        const nextAyahNumber = arabic.ayahs[index + 1].numberInSurah;
        const el = document.getElementById(`ayah-${nextAyahNumber}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setPlayingAyah(null);
        if (index + 1 >= arabic.ayahs.length) {
          showToast(`Completed recitation of Surah ${arabic.englishName}`, 'success');
        }
      }
    };

    audio.onerror = () => {
      showToast('Audio temporarily unavailable. Continuing next verse…', 'error');
      setAudioLoading(false);
      if (autoPlayRef.current && index + 1 < arabic.ayahs.length) {
        setTimeout(() => playAyahByIndexRef.current(index + 1), 1000);
      } else {
        setPlayingAyah(null);
      }
    };

    try {
      await audio.play();
      const el = document.getElementById(`ayah-${targetAyah.numberInSurah}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch {
      showToast('Click play again to start audio playback.', 'info');
      setPlayingAyah(null);
      setAudioLoading(false);
    }
  }, [arabic, settings.reciterIdentifier, showToast]);

  useEffect(() => {
    playAyahByIndexRef.current = playAyahByIndex;
  }, [playAyahByIndex]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingAyah(null);
  };

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
      showToast('Ayah bookmarked', 'success');
    }
  };

  const copyReference = (ayah: Ayah, cleanedText: string) => {
    const translationAyah = translation?.ayahs[ayah.numberInSurah - 1];
    const textToCopy = `${arabic?.englishName} [${num}:${ayah.numberInSurah}]\n${cleanedText}\n\nTranslation: ${translationAyah?.text ?? ''}\n(Noor Quran — noorquran.app)`;
    navigator.clipboard.writeText(textToCopy).then(() => showToast('Ayah and translation copied', 'success'));
  };

  if (loading) return <LoadingSpinner text={`Loading Surah ${num}…`} />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!arabic) return null;

  // Header Bismillah rule:
  // Surah 1: Bismillah is verse 1 (no extra banner)
  // Surah 9: No Bismillah at all
  // All others: Display ornamental Bismillah banner
  const showBismillahBanner = num !== 1 && num !== 9;

  const currentPlayingIndex = arabic.ayahs.findIndex(a => a.numberInSurah === playingAyah);

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '24px 20px 120px' }}>
      {/* Top Navigation & Controls Bar */}
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
        boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
      }}>
        {/* Prev / Next Surah */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => num > 1 && navigate(`/surah/${num - 1}`)}
            disabled={num <= 1}
            aria-label="Previous Surah"
            className="btn-secondary"
            style={{ padding: '6px 12px', opacity: num <= 1 ? 0.4 : 1 }}
          >
            <ChevronLeft size={16} className="shiny-icon" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <Link to="/quran" className="btn-ghost" style={{ padding: '6px 10px', fontSize: '0.85rem' }}>
            <Layers size={15} className="shiny-icon" /> All Surahs
          </Link>

          <button
            onClick={() => num < 114 && navigate(`/surah/${num + 1}`)}
            disabled={num >= 114}
            aria-label="Next Surah"
            className="btn-secondary"
            style={{ padding: '6px 12px', opacity: num >= 114 ? 0.4 : 1 }}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={16} className="shiny-icon" />
          </button>
        </div>

        {/* View mode switcher & Settings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* View mode: Cards vs Mushaf */}
          <div style={{ display: 'flex', background: 'var(--color-cream-100)', padding: 3, borderRadius: 10, border: '1px solid var(--color-border)' }}>
            <button
              onClick={() => setViewMode('cards')}
              style={{
                padding: '5px 10px',
                borderRadius: 8,
                border: 'none',
                background: viewMode === 'cards' ? 'var(--color-brand)' : 'transparent',
                color: viewMode === 'cards' ? '#fff' : 'var(--color-text-muted)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <Layers size={14} /> Cards
            </button>
            <button
              onClick={() => setViewMode('mushaf')}
              style={{
                padding: '5px 10px',
                borderRadius: 8,
                border: 'none',
                background: viewMode === 'mushaf' ? 'var(--color-brand)' : 'transparent',
                color: viewMode === 'mushaf' ? '#fff' : 'var(--color-text-muted)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <BookOpen size={14} /> Mushaf Page
            </button>
          </div>

          {/* Continuous Auto-Play toggle button */}
          <button
            onClick={() => {
              if (playingAyah !== null) {
                stopAudio();
              } else {
                playAyahByIndex(0);
              }
            }}
            className={playingAyah !== null ? 'btn-gold' : 'btn-primary'}
            style={{ padding: '7px 14px', fontSize: '0.85rem' }}
          >
            {playingAyah !== null ? (
              <>
                <Square size={14} className="shiny-icon" />
                <span>Stop Recitation</span>
              </>
            ) : (
              <>
                <Play size={14} className="shiny-icon" />
                <span>Auto-Play Surah</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Reading Settings"
            className="btn-ghost"
            style={{ width: 36, height: 36, padding: 0, borderRadius: 8, border: '1px solid var(--color-border)' }}
            title="Reading Settings"
          >
            <Settings2 size={17} className="shiny-icon" />
          </button>
        </div>
      </div>

      {/* Reader Settings Drawer/Panel */}
      {showSettings && (
        <div className="card" style={{ padding: 20, marginBottom: 24, border: '1.5px solid var(--color-border-gold)', background: 'var(--color-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-brand)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Settings2 size={18} className="shiny-icon" /> Reading & Display Preferences
            </div>
            <button onClick={() => setShowSettings(false)} className="btn-ghost" style={{ padding: 4, fontSize: '0.8rem' }}>Close</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>
                Arabic Font Size
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateSetting('arabicFontSize', s)}
                    style={{
                      flex: 1,
                      padding: '6px',
                      borderRadius: 6,
                      border: `1.5px solid ${settings.arabicFontSize === s ? 'var(--color-brand)' : 'var(--color-border)'}`,
                      background: settings.arabicFontSize === s ? 'var(--color-primary-50)' : 'transparent',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      color: settings.arabicFontSize === s ? 'var(--color-brand)' : 'var(--color-text)',
                    }}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>
                Content Display
              </label>
              <select
                value={settings.readingMode}
                onChange={(e) => updateSetting('readingMode', e.target.value as any)}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '0.85rem' }}
              >
                <option value="both">Arabic & Translation</option>
                <option value="arabic-only">Arabic Only</option>
                <option value="translation-only">Translation Only</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>
                Translation Edition
              </label>
              <select
                value={settings.translationEdition}
                onChange={(e) => updateSetting('translationEdition', e.target.value)}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '0.85rem' }}
              >
                {AVAILABLE_TRANSLATIONS.map((t) => (
                  <option key={t.identifier} value={t.identifier}>{t.name} ({t.language})</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Ornate Surah Cartouche Header (Proper Holy Book Frame) */}
      <div className="mushaf-surah-cartouche">
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
          <Badge label={`Surah ${arabic.number}`} variant="gold" />
          <Badge label={arabic.revelationType === 'Meccan' ? 'Makkah' : 'Madinah'} variant="green" />
          <Badge label={`${arabic.numberOfAyahs} Ayahs`} variant="gold" />
        </div>
        <h1
          className="arabic-text"
          lang="ar"
          style={{
            fontSize: '3.4rem',
            color: '#fef08a',
            margin: '0 0 4px',
            fontWeight: 800,
            textShadow: '0 2px 10px rgba(0,0,0,0.4)',
            lineHeight: 1.4,
          }}
        >
          {arabic.name}
        </h1>
        <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.02em', marginBottom: 4 }}>
          {arabic.englishName}
        </div>
        <div style={{ fontSize: '1rem', color: '#bce5cf', fontStyle: 'italic' }}>
          "{arabic.englishNameTranslation}"
        </div>
      </div>

      {/* Bismillah Banner (Only displayed when appropriate, and not duplicated) */}
      {showBismillahBanner && <Bismillah />}

      {/* VIEW 1: TRADITIONAL MUSHAF PAGE VIEW */}
      {viewMode === 'mushaf' && (
        <div className="mushaf-frame">
          <div style={{ textAlign: 'center', marginBottom: 18, color: 'var(--color-accent)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>
            ✦ MUSHAF CONTINUOUS RECITATION ✦
          </div>
          <div
            className={`arabic-text font-arabic-${settings.arabicFontSize}`}
            style={{
              textAlign: 'justify',
              textJustify: 'inter-word',
              direction: 'rtl',
              color: 'var(--color-text)',
              lineHeight: 2.5,
              fontSize: FONT_SIZE_MAP[settings.arabicFontSize],
            }}
          >
            {arabic.ayahs.map((ayah, idx) => {
              const cleanedText = stripLeadingBismillah(ayah.text, num, ayah.numberInSurah);
              const isPlaying = playingAyah === ayah.numberInSurah;
              return (
                <span
                  key={ayah.number}
                  id={`ayah-${ayah.numberInSurah}`}
                  onClick={() => setActiveModalAyah(ayah)}
                  style={{
                    cursor: 'pointer',
                    padding: '2px 4px',
                    borderRadius: 6,
                    backgroundColor: isPlaying ? 'rgba(212, 175, 55, 0.25)' : 'transparent',
                    boxShadow: isPlaying ? '0 0 10px rgba(212, 175, 55, 0.5)' : 'none',
                    transition: 'background 0.2s ease',
                  }}
                  title={`Ayah ${ayah.numberInSurah} — Tap for audio & translation`}
                >
                  {cleanedText}
                  <span
                    className="ayah-end-symbol"
                    onClick={(e) => {
                      e.stopPropagation();
                      playAyahByIndex(idx);
                    }}
                    title={`Ayah ${ayah.numberInSurah} — Click to play audio`}
                  >
                    {ayah.numberInSurah}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: CARD / VERSE-BY-VERSE VIEW */}
      {viewMode === 'cards' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {arabic.ayahs.map((ayah, idx) => {
            const cleanedText = stripLeadingBismillah(ayah.text, num, ayah.numberInSurah);
            const translationAyah = translation?.ayahs[ayah.numberInSurah - 1];
            const bmId = `${num}:${ayah.numberInSurah}`;
            const isPlaying = playingAyah === ayah.numberInSurah;
            const isBm = bookmarkedIds.has(bmId);

            return (
              <div
                key={ayah.number}
                id={`ayah-${ayah.numberInSurah}`}
                className={`card ${isPlaying ? 'active-playing-ayah' : ''}`}
                style={{ padding: '24px 28px', position: 'relative' }}
              >
                {/* Header row with Ayah marker badge & Sajda badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="icon-badge-gold" style={{ width: 34, height: 34, borderRadius: '50%', fontWeight: 800, fontSize: '0.85rem' }}>
                      {ayah.numberInSurah}
                    </div>
                    {ayah.sajda && (
                      <Badge label="Sajda Required" variant="gold" />
                    )}
                  </div>

                  {/* Actions for this Ayah */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      onClick={() => isPlaying ? stopAudio() : playAyahByIndex(idx)}
                      aria-label={isPlaying ? 'Pause audio' : 'Play verse audio'}
                      className="btn-ghost"
                      style={{
                        padding: '6px 12px',
                        borderRadius: 8,
                        background: isPlaying ? 'var(--color-brand)' : 'var(--color-cream-100)',
                        color: isPlaying ? '#ffffff' : 'var(--color-brand)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        opacity: isPlaying && audioLoading ? 0.7 : 1,
                      }}
                      disabled={isPlaying && audioLoading}
                    >
                      {isPlaying ? (
                        <>
                          <Pause size={14} className="shiny-icon" /> {audioLoading ? 'Loading…' : 'Playing'}
                        </>
                      ) : (
                        <>
                          <Play size={14} className="shiny-icon" /> Recite
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => toggleBookmark(ayah)}
                      aria-label="Bookmark ayah"
                      className="btn-ghost"
                      style={{ padding: '6px 8px', borderRadius: 8, color: isBm ? 'var(--color-accent)' : undefined }}
                      title={isBm ? 'Bookmarked' : 'Add bookmark'}
                    >
                      {isBm ? <BookmarkCheck size={18} className="shiny-icon" /> : <Bookmark size={18} />}
                    </button>

                    <button
                      onClick={() => copyReference(ayah, cleanedText)}
                      aria-label="Copy ayah text and translation"
                      className="btn-ghost"
                      style={{ padding: '6px 8px', borderRadius: 8 }}
                      title="Copy reference"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                {/* Arabic text (without duplicate Bismillah) */}
                {settings.readingMode !== 'translation-only' && (
                  <p
                    className="arabic-text"
                    lang="ar"
                    style={{
                      fontSize: FONT_SIZE_MAP[settings.arabicFontSize],
                      color: isPlaying ? 'var(--color-brand)' : 'var(--color-text)',
                      margin: '0 0 18px',
                      padding: '4px 0',
                      lineHeight: 2.3,
                      borderBottom: settings.readingMode === 'both' ? '1px dashed var(--color-border)' : 'none',
                    }}
                  >
                    {cleanedText}
                  </p>
                )}

                {/* Translation text */}
                {settings.readingMode !== 'arabic-only' && translationAyah && (
                  <div>
                    <p style={{ margin: '0 0 6px', lineHeight: 1.8, color: 'var(--color-text)', fontSize: '0.98rem' }}>
                      {translationAyah.text}
                    </p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>
                      — {AVAILABLE_TRANSLATIONS.find(t => t.identifier === settings.translationEdition)?.name ?? settings.translationEdition}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Sticky Audio Player Dock (when audio is active) */}
      {playingAyah !== null && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '92%',
          maxWidth: 620,
          background: 'var(--gradient-emerald)',
          color: '#ffffff',
          borderRadius: 20,
          padding: '14px 22px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.4), 0 0 16px rgba(212, 175, 55, 0.35)',
          border: '1.5px solid var(--color-gold-500)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          animation: 'page-fade 0.25s ease',
        }}>
          {/* Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="icon-badge-gold" style={{ width: 40, height: 40, borderRadius: 12 }}>
              <Volume2 size={20} className="shiny-icon" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#fef08a' }}>
                Surah {arabic.englishName} : Ayah {playingAyah}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#bce5cf' }}>
                Auto-Advancing Recitation
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Auto Play toggle */}
            <button
              onClick={() => {
                setAutoPlay(!autoPlay);
                showToast(`Auto-advance next verse: ${!autoPlay ? 'ON' : 'OFF'}`, 'info');
              }}
              style={{
                background: autoPlay ? 'rgba(212, 175, 55, 0.25)' : 'transparent',
                border: '1px solid var(--color-gold-500)',
                color: '#fef08a',
                padding: '6px 10px',
                borderRadius: 8,
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
              title="Toggle Auto Play Next"
            >
              <Repeat size={13} className="shiny-icon" />
              <span>Auto {autoPlay ? 'ON' : 'OFF'}</span>
            </button>

            {/* Previous Verse */}
            <button
              onClick={() => currentPlayingIndex > 0 && playAyahByIndex(currentPlayingIndex - 1)}
              disabled={currentPlayingIndex <= 0}
              style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', opacity: currentPlayingIndex <= 0 ? 0.4 : 1 }}
              title="Previous Ayah"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Stop Recitation */}
            <button
              onClick={stopAudio}
              style={{
                background: '#ca8a04',
                border: 'none',
                color: '#143526',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)',
              }}
              title="Stop Recitation"
            >
              <Square size={16} fill="#143526" />
            </button>

            {/* Next Verse */}
            <button
              onClick={() => currentPlayingIndex < arabic.ayahs.length - 1 && playAyahByIndex(currentPlayingIndex + 1)}
              disabled={currentPlayingIndex >= arabic.ayahs.length - 1}
              style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', opacity: currentPlayingIndex >= arabic.ayahs.length - 1 ? 0.4 : 1 }}
              title="Next Ayah"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Quick Modal when clicking verse in Mushaf view */}
      {activeModalAyah && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          zIndex: 2000,
        }}
        onClick={() => setActiveModalAyah(null)}
        >
          <div
            className="card"
            style={{ maxWidth: 520, width: '100%', padding: 24, border: '2px solid var(--color-gold-500)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Badge label={`Surah ${arabic.englishName} : Ayah ${activeModalAyah.numberInSurah}`} variant="gold" />
              <button onClick={() => setActiveModalAyah(null)} className="btn-ghost" style={{ padding: 4 }}>✕</button>
            </div>

            <p className="arabic-text" style={{ fontSize: '1.7rem', color: 'var(--color-brand)', marginBottom: 16, lineHeight: 2 }}>
              {stripLeadingBismillah(activeModalAyah.text, num, activeModalAyah.numberInSurah)}
            </p>

            {translation?.ayahs[activeModalAyah.numberInSurah - 1] && (
              <p style={{ color: 'var(--color-text)', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: 20 }}>
                {translation.ayahs[activeModalAyah.numberInSurah - 1].text}
              </p>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  playAyahByIndex(activeModalAyah.numberInSurah - 1);
                  setActiveModalAyah(null);
                }}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                <Play size={14} className="shiny-icon" /> Play Recitation
              </button>
              <button
                onClick={() => {
                  toggleBookmark(activeModalAyah);
                  setActiveModalAyah(null);
                }}
                className="btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              >
                <Bookmark size={14} /> Bookmark
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
