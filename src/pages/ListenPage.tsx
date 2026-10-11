import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, SkipBack, SkipForward, Repeat, Volume2, ExternalLink } from 'lucide-react';
import { fetchSurahList } from '../api/quranApi';
import { buildAudioUrl, buildSurahAudioUrl } from '../api/quranApi';
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
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    document.title = 'Listen — Noor Quran';
    fetchSurahList().then(setSurahs).finally(() => setLoading(false));
  }, []);

  // Build surah audio URL
  const getAudioUrl = () => buildSurahAudioUrl(selectedSurah, settings.reciterIdentifier);

  const playAudio = () => {
    if (!audioRef.current) {
      const audio = new Audio(getAudioUrl());
      audioRef.current = audio;
      audio.loop = isLooping;
      audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
      audio.ondurationchange = () => setDuration(audio.duration);
      audio.onended = () => { setIsPlaying(false); if (!isLooping) setIsPlaying(false); };
      audio.onerror = () => {
        setAudioError('Audio unavailable. Please check your internet connection or try another Surah / reciter.');
        setIsPlaying(false);
      };
    }
    audioRef.current.play().then(() => {
      setIsPlaying(true);
      setAudioError(null);
    }).catch(() => {
      setAudioError('Could not play audio. Try clicking the Play button directly.');
    });
  };

  const pauseAudio = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const loadNewSurah = (surahNum: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setAudioError(null);
    setSelectedSurah(surahNum);
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
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 64px' }}>
      <PageHeader
        title="Listen to the Quran"
        subtitle="Play recitations from renowned reciters via Al Quran Cloud CDN (Islamic Network). Audio requires an internet connection."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 32, alignItems: 'start' }} className="listen-grid">

        {/* Surah list */}
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>Select Surah</h2>
          {loading ? <LoadingSpinner text="Loading Surahs…" /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 520, overflowY: 'auto', paddingRight: 4 }}>
              {surahs.map((s) => (
                <button
                  key={s.number}
                  onClick={() => loadNewSurah(s.number)}
                  aria-label={`Select ${s.englishName}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px', borderRadius: 8, border: '1.5px solid',
                    borderColor: selectedSurah === s.number ? 'var(--color-brand)' : 'var(--color-border)',
                    background: selectedSurah === s.number ? 'var(--color-primary-50)' : 'var(--color-surface)',
                    cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.15s',
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 6, background: selectedSurah === s.number ? 'var(--color-brand)' : 'var(--color-primary-100)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    fontWeight: 700, fontSize: '0.8rem', color: selectedSurah === s.number ? 'white' : 'var(--color-brand)',
                  }}>
                    {selectedSurah === s.number && isPlaying ? <Volume2 size={14} aria-hidden="true" /> : s.number}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text)' }}>{s.englishName}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{s.numberOfAyahs} ayahs</div>
                  </div>
                  <div className="arabic-text" lang="ar" style={{ marginLeft: 'auto', fontSize: '1rem', color: 'var(--color-brand)' }}>
                    {s.name}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Player & Controls */}
        <div style={{ position: 'sticky', top: 80 }}>
          {/* Reciter selection */}
          <div className="card" style={{ padding: 20, marginBottom: 20 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '0.9rem', fontWeight: 700 }}>Reciter</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {KNOWN_RECITERS.map((r) => (
                <button
                  key={r.identifier}
                  onClick={() => {
                    updateSetting('reciterIdentifier', r.identifier);
                    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; setIsPlaying(false); }
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 8, border: '1.5px solid',
                    borderColor: settings.reciterIdentifier === r.identifier ? 'var(--color-brand)' : 'var(--color-border)',
                    background: settings.reciterIdentifier === r.identifier ? 'var(--color-primary-50)' : 'transparent',
                    cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.15s',
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', background: 'var(--color-primary-100)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-brand)',
                  }}>
                    {r.englishName.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--color-text)' }}>{r.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>MP3 · 128kbps</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Player */}
          <div className="card" style={{ padding: 24 }}>
            {selectedSurahMeta ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div className="arabic-text" lang="ar" style={{ fontSize: '1.8rem', color: 'var(--color-brand)', marginBottom: 4 }}>
                    {selectedSurahMeta.name}
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--color-text)', marginBottom: 2 }}>{selectedSurahMeta.englishName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{selectedReciter.name}</div>
                </div>

                {/* Error */}
                {audioError && (
                  <p style={{ fontSize: '0.82rem', color: '#c0392b', textAlign: 'center', marginBottom: 16 }}>{audioError}</p>
                )}

                {/* Seek bar */}
                <div style={{ marginBottom: 16 }}>
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={(e) => seek(Number(e.target.value))}
                    aria-label="Seek audio position"
                    style={{ width: '100%', accentColor: 'var(--color-brand)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <button
                    onClick={() => loadNewSurah(Math.max(1, selectedSurah - 1))}
                    aria-label="Previous Surah"
                    className="btn-ghost"
                    style={{ padding: 10, borderRadius: '50%' }}
                    disabled={selectedSurah <= 1}
                  >
                    <SkipBack size={18} aria-hidden="true" />
                  </button>
                  <button
                    onClick={isPlaying ? pauseAudio : playAudio}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    style={{
                      width: 52, height: 52, borderRadius: '50%', border: 'none',
                      background: 'var(--color-brand)', color: 'white', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 16px rgba(45,106,79,0.4)', transition: 'transform 0.1s',
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                    onMouseUp={(e) => (e.currentTarget.style.transform = '')}
                  >
                    {isPlaying ? <Pause size={22} aria-hidden="true" /> : <Play size={22} aria-hidden="true" />}
                  </button>
                  <button
                    onClick={() => loadNewSurah(Math.min(114, selectedSurah + 1))}
                    aria-label="Next Surah"
                    className="btn-ghost"
                    style={{ padding: 10, borderRadius: '50%' }}
                    disabled={selectedSurah >= 114}
                  >
                    <SkipForward size={18} aria-hidden="true" />
                  </button>
                  <button
                    onClick={toggleLoop}
                    aria-label={isLooping ? 'Disable repeat' : 'Enable repeat'}
                    aria-pressed={isLooping}
                    className="btn-ghost"
                    style={{ padding: 8, borderRadius: '50%', color: isLooping ? 'var(--color-brand)' : undefined }}
                  >
                    <Repeat size={16} aria-hidden="true" />
                  </button>
                </div>
              </>
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Select a Surah to begin</p>
            )}

            {/* Attribution */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.6 }}>
                Audio: <strong>{selectedReciter.attribution}</strong>.<br />
                Source: <a href="https://alquran.cloud" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-brand)', textDecoration: 'none' }}>
                  Al Quran Cloud CDN <ExternalLink size={10} aria-hidden="true" />
                </a>.<br />
                Audio requires internet. Offline caching is not permitted under CDN terms.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .listen-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
