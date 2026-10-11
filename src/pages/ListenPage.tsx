import { useEffect, useState, useRef, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Volume2, Sparkles } from 'lucide-react';
import { fetchSurahList, buildSurahAudioUrl } from '../api/quranApi';
import { KNOWN_RECITERS } from '../types/quran';
import { useSettings } from '../context/SettingsContext';
import type { SurahMeta } from '../types/quran';
import { LoadingSpinner, PageHeader } from '../components/ui/SharedComponents';

export default function ListenPage() {
  const { settings, updateSetting } = useSettings();
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [audioError, setAudioError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playAudioForSurahRef = useRef<(surahNum: number) => void>(() => {});

  useEffect(() => {
    document.title = 'Listen to the Quran — Noor Quran';
    fetchSurahList().then(setSurahs).finally(() => setLoading(false));
  }, []);

  const playAudioForSurah = useCallback((surahNum: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audioUrl = buildSurahAudioUrl(surahNum, settings.reciterIdentifier);
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.loop = isLooping;

    audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
    audio.ondurationchange = () => setDuration(audio.duration);

    audio.onended = () => {
      if (isLooping) return;
      if (autoPlayNext && surahNum < 114) {
        setSelectedSurah(surahNum + 1);
        playAudioForSurahRef.current(surahNum + 1);
      } else {
        setIsPlaying(false);
      }
    };

    audio.onerror = () => {
      setAudioError('Audio unavailable for this recitation. Check your internet connection or switch reciter.');
      setIsPlaying(false);
    };

    audio.play().then(() => {
      setIsPlaying(true);
      setAudioError(null);
    }).catch(() => {
      setAudioError('Could not play audio. Click the Play button directly.');
      setIsPlaying(false);
    });
  }, [settings.reciterIdentifier, isLooping, autoPlayNext]);

  useEffect(() => {
    playAudioForSurahRef.current = playAudioForSurah;
  }, [playAudioForSurah]);

  const playAudio = () => {
    if (audioRef.current && audioRef.current.src) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      playAudioForSurah(selectedSurah);
    }
  };

  const pauseAudio = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const loadNewSurah = (surahNum: number, startPlaying = false) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setAudioError(null);
    setSelectedSurah(surahNum);

    if (startPlaying) {
      setTimeout(() => playAudioForSurah(surahNum), 100);
    }
  };

  const seek = (val: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const formatTime = (t: number) => {
    if (!isFinite(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const toggleLoop = () => {
    const newVal = !isLooping;
    setIsLooping(newVal);
    if (audioRef.current) audioRef.current.loop = newVal;
  };

  const selectedReciter = KNOWN_RECITERS.find(r => r.identifier === settings.reciterIdentifier) ?? KNOWN_RECITERS[0];
  const selectedSurahMeta = surahs.find(s => s.number === selectedSurah);

  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '32px 20px 80px' }}>
      <PageHeader
        title="Listen to Quran Recitations"
        subtitle="Continuous full-chapter recitation streamed directly via Islamic Network high-speed CDN."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: 28, alignItems: 'start' }} className="listen-grid">
        {/* Surah list */}
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 14, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} className="shiny-icon" style={{ color: 'var(--color-accent)' }} /> Choose Surah
          </h2>
          {loading ? <LoadingSpinner text="Loading Surahs…" /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 560, overflowY: 'auto', paddingRight: 6 }}>
              {surahs.map((s) => {
                const isSelected = s.number === selectedSurah;
                return (
                  <button
                    key={s.number}
                    onClick={() => loadNewSurah(s.number, isPlaying)}
                    aria-label={`Select ${s.englishName}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '12px 16px', borderRadius: 12, border: 'none',
                      background: isSelected ? 'var(--gradient-emerald)' : 'var(--color-surface)',
                      color: isSelected ? '#ffffff' : 'var(--color-text)',
                      cursor: 'pointer', textAlign: 'left',
                      boxShadow: isSelected ? '0 4px 14px rgba(27,67,50,0.3)' : 'none',
                      borderLeft: isSelected ? '4px solid var(--color-gold-500)' : '4px solid transparent',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: isSelected ? 'var(--color-gold-500)' : 'var(--color-cream-200)',
                      color: isSelected ? '#143526' : 'var(--color-brand)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '0.8rem', flexShrink: 0,
                    }}>
                      {s.number}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {s.englishName}
                      </div>
                      <div style={{ fontSize: '0.74rem', opacity: 0.75 }}>
                        {s.numberOfAyahs} Ayahs • {s.revelationType}
                      </div>
                    </div>
                    <div className="arabic-text" lang="ar" style={{ fontSize: '1.2rem', color: isSelected ? '#fef08a' : 'var(--color-brand)', fontWeight: 700, flexShrink: 0 }}>
                      {s.name}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Player & Reciter settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Reciter selector card */}
          <div className="card" style={{ padding: 20, border: '1.5px solid var(--color-border-gold)' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: 12, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Volume2 size={16} className="shiny-icon" style={{ color: 'var(--color-accent)' }} /> Qari (Reciter)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {KNOWN_RECITERS.map((r) => (
                <label
                  key={r.identifier}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                    borderRadius: 10, cursor: 'pointer',
                    background: settings.reciterIdentifier === r.identifier ? 'var(--color-primary-50)' : 'transparent',
                    border: `1.5px solid ${settings.reciterIdentifier === r.identifier ? 'var(--color-gold-500)' : 'var(--color-border)'}`,
                  }}
                >
                  <input
                    type="radio"
                    name="reciter"
                    value={r.identifier}
                    checked={settings.reciterIdentifier === r.identifier}
                    onChange={() => {
                      updateSetting('reciterIdentifier', r.identifier);
                      loadNewSurah(selectedSurah, isPlaying);
                    }}
                    style={{ accentColor: 'var(--color-brand)' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-text)' }}>{r.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Murattal</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Interactive Player Card */}
          <div className="card" style={{ padding: 24, border: '2px solid var(--color-gold-500)', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
            {selectedSurahMeta && (
              <>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div className="arabic-text pulse-gold" lang="ar" style={{ fontSize: '2.5rem', color: 'var(--color-brand)', fontWeight: 800, margin: '0 0 4px' }}>
                    {selectedSurahMeta.name}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--color-text)', marginBottom: 2 }}>
                    Surah {selectedSurahMeta.englishName}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Recited by {selectedReciter.name}
                  </div>
                </div>

                {audioError && (
                  <p style={{ fontSize: '0.82rem', color: '#c0392b', textAlign: 'center', marginBottom: 16 }}>{audioError}</p>
                )}

                {/* Seek bar */}
                <div style={{ marginBottom: 18 }}>
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={(e) => seek(Number(e.target.value))}
                    aria-label="Seek audio position"
                    style={{ width: '100%', accentColor: 'var(--color-gold-500)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Main Controls with Shiny Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 18 }}>
                  <button
                    onClick={() => loadNewSurah(Math.max(1, selectedSurah - 1), isPlaying)}
                    aria-label="Previous Surah"
                    className="btn-ghost"
                    style={{ padding: 10, borderRadius: '50%' }}
                    disabled={selectedSurah <= 1}
                  >
                    <SkipBack size={20} className="shiny-icon" />
                  </button>

                  <button
                    onClick={isPlaying ? pauseAudio : playAudio}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    className="btn-gold"
                    style={{
                      width: 58, height: 58, borderRadius: '50%', padding: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: 3 }} />}
                  </button>

                  <button
                    onClick={() => loadNewSurah(Math.min(114, selectedSurah + 1), isPlaying)}
                    aria-label="Next Surah"
                    className="btn-ghost"
                    style={{ padding: 10, borderRadius: '50%' }}
                    disabled={selectedSurah >= 114}
                  >
                    <SkipForward size={20} className="shiny-icon" />
                  </button>
                </div>

                {/* Repeat & Auto-Advance Toggles */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, borderTop: '1px solid var(--color-border)', paddingTop: 14 }}>
                  <button
                    onClick={toggleLoop}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: isLooping ? 'var(--color-gold-soft)' : 'transparent',
                      border: `1px solid ${isLooping ? 'var(--color-gold-500)' : 'var(--color-border)'}`,
                      color: isLooping ? 'var(--color-brand)' : 'var(--color-text-muted)',
                      padding: '6px 12px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    <Repeat size={14} className="shiny-icon" />
                    <span>Loop {isLooping ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    onClick={() => setAutoPlayNext(!autoPlayNext)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: autoPlayNext ? 'var(--color-primary-50)' : 'transparent',
                      border: `1px solid ${autoPlayNext ? 'var(--color-brand)' : 'var(--color-border)'}`,
                      color: autoPlayNext ? 'var(--color-brand)' : 'var(--color-text-muted)',
                      padding: '6px 12px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    <Sparkles size={14} className="shiny-icon" />
                    <span>Auto-Next {autoPlayNext ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
