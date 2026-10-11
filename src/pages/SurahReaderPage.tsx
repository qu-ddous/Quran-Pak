import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, Copy, Play, Pause,
  Square, Settings2, BookOpen, Layers, Volume2, Repeat, ArrowLeft, ArrowUp,
  Sparkles, Headphones,
} from 'lucide-react';
import { fetchSurahWithTranslation, buildAudioUrl, AVAILABLE_TRANSLATIONS } from '../api/quranApi';
import { KNOWN_RECITERS } from '../types/quran';
import { addBookmark, removeBookmark, recordVisit } from '../db/userDb';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import type { Ayah, Surah } from '../types/quran';
import { LoadingSpinner, ErrorState, Bismillah, Badge } from '../components/ui/SharedComponents';
import type { Bookmark as BookmarkType } from '../db/userDb';

const FONT_SIZE_MAP = { sm: '1.45rem', md: '1.85rem', lg: '2.25rem', xl: '2.7rem' };

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <LoadingSpinner text={`Loading Surah ${num}…`} />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!arabic) return null;

  const showBismillahBanner = num !== 1 && num !== 9;
  const currentPlayingIndex = arabic.ayahs.findIndex(a => a.numberInSurah === playingAyah);

  return (
    <div style={{ maxWidth: 940, margin: '0 auto', padding: '24px 20px 140px' }}>
      {/* Top Header Navigation Strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20,
      }}>
        <Link
          to="/quran"
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
          <span>Back to All Surahs</span>
        </Link>

        {/* Prev / Next Surah Quick Navigator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => num > 1 && navigate(`/surah/${num - 1}`)}
            disabled={num <= 1}
            aria-label="Previous Surah"
            className="btn-secondary"
            style={{ padding: '7px 14px', borderRadius: 10, opacity: num <= 1 ? 0.4 : 1, fontSize: '0.85rem' }}
          >
            <ChevronLeft size={16} className="shiny-icon" />
            <span className="hidden sm:inline">Surah {num > 1 ? num - 1 : 1}</span>
          </button>

          <button
            onClick={() => num < 114 && navigate(`/surah/${num + 1}`)}
            disabled={num >= 114}
            aria-label="Next Surah"
            className="btn-secondary"
            style={{ padding: '7px 14px', borderRadius: 10, opacity: num >= 114 ? 0.4 : 1, fontSize: '0.85rem' }}
          >
            <span className="hidden sm:inline">Surah {num < 114 ? num + 1 : 114}</span>
            <ChevronRight size={16} className="shiny-icon" />
          </button>
        </div>
      </div>

      {/* ─── Grand Royal Surah Cartouche Header ─── */}
      <div className="surah-cartouche-luxury">
        <div className="surah-cartouche-texture" />

        {/* Subtle top floating badges */}
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
            SURAH {arabic.number} OF 114
          </span>

          <span style={{
            background: 'rgba(45, 106, 79, 0.4)',
            border: '1px solid rgba(110, 231, 183, 0.35)',
            color: '#a7f3d0',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: 9999,
          }}>
            {arabic.revelationType === 'Meccan' ? '🕋 MECCAN REVELATION' : '🕌 MEDINAN REVELATION'}
          </span>

          <span style={{
            background: 'rgba(212, 175, 55, 0.22)',
            border: '1px solid rgba(212, 175, 55, 0.45)',
            color: '#fef08a',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: 9999,
          }}>
            {arabic.numberOfAyahs} AYAHS
          </span>
        </div>

        {/* Grand Arabic Calligraphy Title */}
        <h1
          className="arabic-text"
          lang="ar"
          style={{
            position: 'relative',
            zIndex: 2,
            fontSize: 'clamp(2.8rem, 6vw, 4.4rem)',
            color: '#fef08a',
            margin: '0 0 6px',
            fontWeight: 800,
            textShadow: '0 4px 18px rgba(0,0,0,0.6), 0 0 20px rgba(212,175,55,0.4)',
            lineHeight: 1.3,
          }}
        >
          {arabic.name}
        </h1>

        {/* English Name with editorial serif */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(1.5rem, 3.2vw, 2.2rem)',
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '0.02em',
          marginBottom: 4,
          textShadow: '0 2px 8px rgba(0,0,0,0.4)',
        }}>
          {arabic.englishName}
        </div>

        {/* Translation Meaning */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          fontSize: '1rem',
          color: '#bce5cf',
          fontStyle: 'italic',
          marginBottom: 24,
        }}>
          "{arabic.englishNameTranslation}"
        </div>

        {/* Action Controls Bar embedded in Cartouche */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 12,
          paddingTop: 16,
          borderTop: '1px solid rgba(212, 175, 55, 0.25)',
        }}>
          {/* Main Audio Recitation Button */}
          <button
            onClick={() => {
              if (playingAyah !== null) {
                stopAudio();
              } else {
                playAyahByIndex(0);
              }
            }}
            className={playingAyah !== null ? 'btn-gold' : 'btn-primary'}
            style={{
              padding: '9px 20px',
              borderRadius: 12,
              fontSize: '0.9rem',
              fontWeight: 800,
              boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
            }}
          >
            {playingAyah !== null ? (
              <>
                <Square size={15} className="shiny-icon" />
                <span>Stop Recitation</span>
              </>
            ) : (
              <>
                <Play size={15} className="shiny-icon" fill="currentColor" />
                <span>Listen to Full Surah</span>
              </>
            )}
          </button>

          {/* Cards vs Mushaf View Mode Switcher */}
          <div style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.35)',
            backdropFilter: 'blur(10px)',
            padding: 4,
            borderRadius: 12,
            border: '1px solid rgba(212, 175, 55, 0.35)',
          }}>
            <button
              onClick={() => setViewMode('cards')}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: 'none',
                background: viewMode === 'cards' ? 'var(--color-gold-500)' : 'transparent',
                color: viewMode === 'cards' ? '#143526' : '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s ease',
              }}
            >
              <Layers size={14} /> Cards
            </button>
            <button
              onClick={() => setViewMode('mushaf')}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: 'none',
                background: viewMode === 'mushaf' ? 'var(--color-gold-500)' : 'transparent',
                color: viewMode === 'mushaf' ? '#143526' : '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s ease',
              }}
            >
              <BookOpen size={14} /> Mushaf Page
            </button>
          </div>

          {/* Reader Preferences Drawer Button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Reading Settings"
            style={{
              padding: '8px 14px',
              borderRadius: 12,
              border: '1px solid rgba(212, 175, 55, 0.35)',
              background: 'rgba(0,0,0,0.25)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Reading Preferences"
          >
            <Settings2 size={16} className="shiny-icon" />
            <span>Customize</span>
          </button>
        </div>
      </div>

      {/* Reader Settings Drawer/Panel */}
      {showSettings && (
        <div className="card" style={{ padding: 22, marginBottom: 28, border: '2px solid var(--color-border-gold)', background: 'var(--color-surface)', borderRadius: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-brand)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Settings2 size={18} className="shiny-icon" /> Reader Customization & Audio Settings
            </div>
            <button onClick={() => setShowSettings(false)} className="btn-ghost" style={{ padding: '4px 10px', fontSize: '0.85rem' }}>Close</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18 }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>
                Arabic Font Size
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateSetting('arabicFontSize', s)}
                    style={{
                      flex: 1,
                      padding: '7px 4px',
                      borderRadius: 8,
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
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>
                Reciter Voice
              </label>
              <select
                value={settings.reciterIdentifier}
                onChange={(e) => updateSetting('reciterIdentifier', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '0.85rem' }}
              >
                {KNOWN_RECITERS.map((r) => (
                  <option key={r.identifier} value={r.identifier}>{r.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>
                Translation Edition
              </label>
              <select
                value={settings.translationEdition}
                onChange={(e) => updateSetting('translationEdition', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '0.85rem' }}
              >
                {AVAILABLE_TRANSLATIONS.map((t) => (
                  <option key={t.identifier} value={t.identifier}>{t.name} ({t.language})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>
                Content Display
              </label>
              <select
                value={settings.readingMode}
                onChange={(e) => updateSetting('readingMode', e.target.value as any)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '0.85rem' }}
              >
                <option value="both">Arabic & Translation</option>
                <option value="arabic-only">Arabic Only</option>
                <option value="translation-only">Translation Only</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Bismillah Banner */}
      {showBismillahBanner && <Bismillah />}

      {/* ─── VIEW 1: TRADITIONAL MUSHAF PAGE VIEW ─── */}
      {viewMode === 'mushaf' && (
        <div className="mushaf-frame" style={{ boxShadow: '0 12px 36px rgba(0,0,0,0.06)' }}>
          <div style={{ textAlign: 'center', marginBottom: 20, color: 'var(--color-accent)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.08em' }}>
            ✦ CONTINUOUS MUSHAF READING ✦
          </div>
          <div
            className={`arabic-text font-arabic-${settings.arabicFontSize}`}
            style={{
              textAlign: 'justify',
              textJustify: 'inter-word',
              direction: 'rtl',
              color: 'var(--color-text)',
              lineHeight: 2.6,
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
                    padding: '3px 6px',
                    borderRadius: 8,
                    backgroundColor: isPlaying ? 'rgba(212, 175, 55, 0.3)' : 'transparent',
                    boxShadow: isPlaying ? '0 0 14px rgba(212, 175, 55, 0.6)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                  title={`Ayah ${ayah.numberInSurah} — Tap to play or view translation`}
                >
                  {cleanedText}
                  <span
                    className="ayah-end-symbol"
                    onClick={(e) => {
                      e.stopPropagation();
                      playAyahByIndex(idx);
                    }}
                    title={`Ayah ${ayah.numberInSurah} — Click to recite`}
                  >
                    {ayah.numberInSurah}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── VIEW 2: CARD / VERSE-BY-VERSE VIEW ─── */}
      {viewMode === 'cards' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
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
                style={{
                  padding: '24px 28px',
                  position: 'relative',
                  borderRadius: 18,
                  border: isPlaying ? '2px solid var(--color-gold-500)' : '1px solid var(--color-border)',
                  boxShadow: isPlaying ? '0 8px 28px rgba(212, 175, 55, 0.25)' : '0 4px 14px rgba(0,0,0,0.02)',
                  transition: 'all 0.25s ease',
                }}
              >
                {/* Header row with Ayah marker badge & Sajda badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="icon-badge-gold" style={{ width: 36, height: 36, borderRadius: '50%', fontWeight: 800, fontSize: '0.88rem' }}>
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
                        padding: '6px 14px',
                        borderRadius: 8,
                        background: isPlaying ? 'var(--color-brand)' : 'var(--color-cream-100)',
                        color: isPlaying ? '#ffffff' : 'var(--color-brand)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        opacity: isPlaying && audioLoading ? 0.7 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
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
                      style={{ padding: '7px 9px', borderRadius: 8, color: isBm ? 'var(--color-accent)' : undefined }}
                      title={isBm ? 'Bookmarked' : 'Add bookmark'}
                    >
                      {isBm ? <BookmarkCheck size={18} className="shiny-icon" /> : <Bookmark size={18} />}
                    </button>

                    <button
                      onClick={() => copyReference(ayah, cleanedText)}
                      aria-label="Copy ayah text and translation"
                      className="btn-ghost"
                      style={{ padding: '7px 9px', borderRadius: 8 }}
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
                    <p style={{ margin: '0 0 6px', lineHeight: 1.8, color: 'var(--color-text)', fontSize: '1rem' }}>
                      {translationAyah.text}
                    </p>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textAlign: 'right', fontStyle: 'italic' }}>
                      — {AVAILABLE_TRANSLATIONS.find(t => t.identifier === settings.translationEdition)?.name ?? settings.translationEdition}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Sleek Floating Reader Bottom Bar ─── */}
      <div className="reader-floating-bar">
        {/* Previous Surah button */}
        <button
          onClick={() => num > 1 && navigate(`/surah/${num - 1}`)}
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
          title="Previous Surah"
        >
          <ChevronLeft size={18} className="shiny-icon" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Center status or active playback info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {playingAyah !== null ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="icon-badge-gold" style={{ width: 30, height: 30, borderRadius: '50%' }}>
                <Volume2 size={15} className="shiny-icon" />
              </div>
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#fef08a' }}>
                  Ayah {playingAyah} of {arabic.numberOfAyahs}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#bce5cf' }}>
                  Auto {autoPlay ? 'Advancing' : 'Paused'}
                </div>
              </div>

              {/* Prev verse */}
              <button
                onClick={() => currentPlayingIndex > 0 && playAyahByIndex(currentPlayingIndex - 1)}
                disabled={currentPlayingIndex <= 0}
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', opacity: currentPlayingIndex <= 0 ? 0.35 : 1, padding: 3 }}
                title="Previous Verse"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Pause/Stop */}
              <button
                onClick={stopAudio}
                style={{
                  background: 'var(--color-gold-500)',
                  border: 'none',
                  color: '#143526',
                  borderRadius: '50%',
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                title="Stop Audio"
              >
                <Square size={12} fill="#143526" />
              </button>

              {/* Next verse */}
              <button
                onClick={() => currentPlayingIndex < arabic.ayahs.length - 1 && playAyahByIndex(currentPlayingIndex + 1)}
                disabled={currentPlayingIndex >= arabic.ayahs.length - 1}
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', opacity: currentPlayingIndex >= arabic.ayahs.length - 1 ? 0.35 : 1, padding: 3 }}
                title="Next Verse"
              >
                <ChevronRight size={16} />
              </button>

              {/* Auto repeat toggle */}
              <button
                onClick={() => {
                  setAutoPlay(!autoPlay);
                  showToast(`Auto-advance next verse: ${!autoPlay ? 'ON' : 'OFF'}`, 'info');
                }}
                style={{
                  background: autoPlay ? 'rgba(212, 175, 55, 0.3)' : 'transparent',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  color: '#fef08a',
                  padding: '4px 8px',
                  borderRadius: 6,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
                title="Toggle Auto Play Next"
              >
                <Repeat size={12} />
                <span className="hidden sm:inline">Auto</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => playAyahByIndex(0)}
                style={{
                  background: 'var(--gradient-gold)',
                  border: 'none',
                  color: '#143526',
                  padding: '5px 14px',
                  borderRadius: 9999,
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Headphones size={14} /> Listen
              </button>
              <span style={{ fontSize: '0.82rem', color: '#e2e8f0', fontWeight: 600 }}>
                {arabic.englishName} ({arabic.numberOfAyahs} v.)
              </span>
            </div>
          )}
        </div>

        {/* Next Surah & Scroll to Top */}
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
            onClick={() => num < 114 && navigate(`/surah/${num + 1}`)}
            disabled={num >= 114}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: num >= 114 ? 'not-allowed' : 'pointer',
              opacity: num >= 114 ? 0.35 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 8px',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
            title="Next Surah"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={18} className="shiny-icon" />
          </button>
        </div>
      </div>

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
            style={{ maxWidth: 520, width: '100%', padding: 24, border: '2px solid var(--color-gold-500)', borderRadius: 18 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Badge label={`Surah ${arabic.englishName} : Ayah ${activeModalAyah.numberInSurah}`} variant="gold" />
              <button onClick={() => setActiveModalAyah(null)} className="btn-ghost" style={{ padding: 4 }}>✕</button>
            </div>

            <p className="arabic-text" style={{ fontSize: '1.75rem', color: 'var(--color-brand)', marginBottom: 16, lineHeight: 2.1 }}>
              {stripLeadingBismillah(activeModalAyah.text, num, activeModalAyah.numberInSurah)}
            </p>

            {translation?.ayahs[activeModalAyah.numberInSurah - 1] && (
              <p style={{ color: 'var(--color-text)', lineHeight: 1.7, fontSize: '0.98rem', marginBottom: 20 }}>
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
                <Play size={14} className="shiny-icon" fill="currentColor" /> Play Recitation
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

