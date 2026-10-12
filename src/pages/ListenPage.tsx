import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Play, Pause, SkipBack, SkipForward, Repeat, Volume2, Sparkles,
  Headphones, Search, BookOpen, VolumeX,
} from 'lucide-react';
import { KNOWN_RECITERS } from '../types/quran';
import { useSettings } from '../context/SettingsContext';
import { useAudio } from '../context/AudioContext';
import { LoadingSpinner } from '../components/ui/SharedComponents';

export default function ListenPage() {
  const { settings, updateSetting } = useSettings();
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLooping,
    autoPlayNext,
    audioError,
    surahs,
    loadingSurahs,
    playSurah,
    pauseAudio,
    resumeAudio,
    seek,
    setVolume,
    toggleMute,
    toggleLoop,
    setAutoPlayNext,
  } = useAudio();

  const [selectedSurah, setSelectedSurah] = useState<number>(() => {
    return currentTrack ? currentTrack.surahNumber : 1;
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = 'Listen to Holy Quran — Noor Quran Audio Sanctuary';
  }, []);

  // Sync selectedSurah when currentTrack changes
  useEffect(() => {
    if (currentTrack) {
      setSelectedSurah(currentTrack.surahNumber);
    }
  }, [currentTrack]);

  const loadNewSurah = (surahNum: number, startPlaying = false) => {
    setSelectedSurah(surahNum);
    if (startPlaying) {
      playSurah(surahNum);
    }
  };

  const playAudio = () => {
    if (currentTrack && currentTrack.surahNumber === selectedSurah) {
      resumeAudio();
    } else {
      playSurah(selectedSurah);
    }
  };

  const formatTime = (t: number) => {
    if (!isFinite(t) || isNaN(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const selectedSurahMeta = surahs.find((s) => s.number === selectedSurah);

  const filteredSurahs = surahs.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.number.toString().includes(q) ||
      s.englishName.toLowerCase().includes(q) ||
      s.englishNameTranslation.toLowerCase().includes(q) ||
      s.name.includes(q)
    );
  });

  return (
    <div className="quran-page-container" style={{ paddingBottom: 100 }}>
      {/* ─── Panoramic Luxury Header Banner ─── */}
      <div className="quran-hero-banner hero-bg-listen">
        <div className="quran-hero-overlay" />
        <div className="hero-glass-card">
          <div style={{
            fontSize: '1.45rem',
            color: 'var(--color-gold-500)',
            fontFamily: "'Amiri', serif",
            fontWeight: 800,
            marginBottom: 8,
          }}>
            استمع إلى القرآن الكريم
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            color: 'var(--color-brand)',
            lineHeight: 1.15,
            margin: '0 0 12px',
          }}>
            Quran Audio Sanctuary
          </h1>

          <p style={{
            fontSize: '1rem',
            lineHeight: 1.6,
            marginBottom: 20,
          }}>
            Experience continuous high-definition full-chapter recitations streamed via Islamic Network CDN, chanted by the world's most revered Qaris.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 9999,
              background: 'rgba(212, 175, 55, 0.18)',
              border: '1.5px solid var(--color-border-gold)',
              fontWeight: 800,
              fontSize: '0.85rem',
              color: 'var(--color-brand)',
            }}>
              <Headphones size={15} className="shiny-icon" /> 128kbps Studio Quality
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 9999,
              background: 'rgba(45, 106, 79, 0.16)',
              border: '1.5px solid var(--color-border-gold)',
              fontWeight: 800,
              fontSize: '0.85rem',
              color: 'var(--color-brand)',
            }}>
              <Sparkles size={15} className="shiny-icon" /> Auto Chapter Advance
            </span>
          </div>
        </div>
      </div>

      {/* ─── Two-Column Interactive Studio Layout ─── */}
      <div className="listen-layout-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, alignItems: 'start' }}>

        {/* Left Column: Playlist */}
        <div className="card" style={{ padding: '24px', borderRadius: 20, border: '1.5px solid var(--color-border-gold)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--color-brand)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <BookOpen size={18} className="shiny-icon" /> Surah Playlist (114)
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              {filteredSurahs.length} Available
            </span>
          </div>

          {/* Quick Search */}
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Surah by name or number…"
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Scrollable list */}
          {loadingSurahs ? (
            <LoadingSpinner text="Loading playlist…" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 580, overflowY: 'auto', paddingRight: 6 }}>
              {filteredSurahs.map((s) => {
                const isSelected = s.number === selectedSurah;
                const isThisPlaying = isPlaying && currentTrack?.surahNumber === s.number;
                return (
                  <button
                    key={s.number}
                    onClick={() => loadNewSurah(s.number, true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      padding: '12px 16px',
                      borderRadius: 14,
                      border: isSelected ? '1.5px solid var(--color-gold-500)' : '1px solid var(--color-border)',
                      background: isSelected ? 'var(--gradient-emerald)' : 'var(--color-surface)',
                      color: isSelected ? '#ffffff' : 'var(--color-text)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      boxShadow: isSelected ? '0 6px 18px rgba(27,67,50,0.3)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: isSelected ? 'var(--color-gold-500)' : 'var(--color-cream-200)',
                          color: isSelected ? '#143526' : 'var(--color-brand)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          flexShrink: 0,
                        }}
                      >
                        {isThisPlaying ? (
                          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 16 }}>
                            <span className="eq-bar eq-bar-1" style={{ background: '#143526' }} />
                            <span className="eq-bar eq-bar-2" style={{ background: '#143526' }} />
                            <span className="eq-bar eq-bar-3" style={{ background: '#143526' }} />
                          </div>
                        ) : (
                          s.number
                        )}
                      </div>

                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                          {s.englishName}
                        </div>
                        <div style={{ fontSize: '0.75rem', opacity: isSelected ? 0.9 : 0.65 }}>
                          {s.numberOfAyahs} Ayahs • {s.revelationType}
                        </div>
                      </div>
                    </div>

                    <div className="arabic-text" lang="ar" style={{ fontSize: '1.25rem', fontWeight: 800, color: isSelected ? '#fef08a' : 'var(--color-brand)' }}>
                      {s.name}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Grand Luxury Audio Deck */}
        <div className="listen-player-deck">
          {/* Subtle spinning vinyl / holy medallion */}
          <div className="listen-disc-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <div
              className={`listen-disc ${isPlaying ? 'spinning-disc' : 'spinning-disc-paused'}`}
              style={{
                width: 140,
                height: 140,
                borderRadius: '50%',
                background: 'radial-gradient(circle, #2d6a4f 0%, #143526 50%, #081c14 100%)',
                border: '4px solid var(--color-gold-500)',
                boxShadow: '0 0 30px rgba(212, 175, 55, 0.4), inset 0 0 15px rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <div
                className="listen-disc-inner"
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'var(--color-gold-500)',
                  color: '#143526',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                }}
              >
                <Headphones size={24} />
              </div>
            </div>
          </div>

          {/* Active Surah Titles */}
          {selectedSurahMeta && (
            <>
              <div className="listen-surah-arabic arabic-text" lang="ar" style={{ fontSize: '2.5rem', color: '#fef08a', fontWeight: 800, margin: '0 0 4px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                {selectedSurahMeta.name}
              </div>
              <div className="listen-surah-english" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 800, marginBottom: 2 }}>
                {selectedSurahMeta.englishName}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#bce5cf', fontStyle: 'italic', marginBottom: 18 }}>
                "{selectedSurahMeta.englishNameTranslation}" • {selectedSurahMeta.numberOfAyahs} Verses
              </div>
            </>
          )}

          {/* Reciter Selector Pill */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fef08a', display: 'block', marginBottom: 6 }}>
              RECITER VOICE
            </label>
            <select
              value={settings.reciterIdentifier}
              onChange={(e) => {
                const newReciter = e.target.value;
                updateSetting('reciterIdentifier', newReciter);
                if (isPlaying) {
                  playSurah(selectedSurah, newReciter);
                }
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 10,
                border: '1.5px solid var(--color-border-gold)',
                background: 'rgba(0, 0, 0, 0.35)',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {KNOWN_RECITERS.map((r) => (
                <option key={r.identifier} value={r.identifier} style={{ background: '#143526', color: '#ffffff' }}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Audio Error Banner */}
          {audioError && (
            <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(239, 68, 68, 0.25)', border: '1px solid #ef4444', color: '#fca5a5', fontSize: '0.78rem', marginBottom: 16 }}>
              {audioError}
            </div>
          )}

          {/* Scrubber Range Bar */}
          <div style={{ marginBottom: 20 }}>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              style={{
                width: '100%',
                accentColor: 'var(--color-gold-500)',
                cursor: 'pointer',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#bce5cf', marginTop: 4 }}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Playback Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 20 }}>
            {/* Prev Surah */}
            <button
              onClick={() => selectedSurah > 1 && loadNewSurah(selectedSurah - 1, isPlaying)}
              disabled={selectedSurah <= 1}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: selectedSurah <= 1 ? 0.35 : 1 }}
              title="Previous Surah"
            >
              <SkipBack size={22} />
            </button>

            {/* Big Main Play/Pause */}
            <button
              onClick={() => isPlaying ? pauseAudio() : playAudio()}
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'var(--gradient-gold)',
                color: '#143526',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(212, 175, 55, 0.6)',
                transition: 'transform 0.15s ease',
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.92)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {isPlaying ? <Pause size={26} fill="#143526" /> : <Play size={26} fill="#143526" style={{ marginLeft: 3 }} />}
            </button>

            {/* Next Surah */}
            <button
              onClick={() => selectedSurah < 114 && loadNewSurah(selectedSurah + 1, isPlaying)}
              disabled={selectedSurah >= 114}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: selectedSurah >= 114 ? 0.35 : 1 }}
              title="Next Surah"
            >
              <SkipForward size={22} />
            </button>
          </div>

          {/* Secondary Controls: Repeat & Auto Next */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
            <button
              onClick={toggleLoop}
              style={{
                background: isLooping ? 'rgba(212, 175, 55, 0.35)' : 'rgba(0,0,0,0.25)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                color: isLooping ? '#fef08a' : '#ffffff',
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Repeat size={14} /> Loop {isLooping ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={() => setAutoPlayNext(!autoPlayNext)}
              style={{
                background: autoPlayNext ? 'rgba(212, 175, 55, 0.35)' : 'rgba(0,0,0,0.25)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                color: autoPlayNext ? '#fef08a' : '#ffffff',
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              Auto-Next {autoPlayNext ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Volume Control */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, paddingTop: 16, borderTop: '1px solid rgba(212, 175, 55, 0.25)' }}>
            <button onClick={toggleMute} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              style={{ width: 120, accentColor: 'var(--color-gold-500)', cursor: 'pointer' }}
            />
          </div>

          {/* Read this Surah direct link */}
          <div style={{ marginTop: 20 }}>
            <Link
              to={`/surah/${selectedSurah}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 18px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
            >
              <BookOpen size={14} /> Read Surah {selectedSurah} with Translation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
