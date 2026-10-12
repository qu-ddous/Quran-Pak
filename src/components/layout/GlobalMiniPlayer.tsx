import { useLocation, useNavigate } from 'react-router-dom';
import { Play, Pause, SkipBack, SkipForward, X, Headphones, ExternalLink } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

export default function GlobalMiniPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    stopAudio,
    seek,
    playNextSurah,
    playPrevSurah,
  } = useAudio();

  const location = useLocation();
  const navigate = useNavigate();

  // If no track is loaded, don't show the mini-player
  if (!currentTrack) {
    return null;
  }

  // On the dedicated /listen page, the grand deck is already front-and-center
  if (location.pathname === '/listen') {
    return null;
  }

  // Detect if on reader pages where MobileBottomNav is hidden
  const isReaderPage =
    location.pathname.startsWith('/surah/') ||
    (location.pathname.startsWith('/juz/') && location.pathname !== '/juz');

  const formatTime = (t: number) => {
    if (!isFinite(t) || isNaN(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <aside
      className={`global-mini-player ${isReaderPage ? 'mini-player-reader' : ''}`}
      aria-label="Active Quran Audio Player"
    >
      {/* Top micro progress bar */}
      <div
        className="mini-player-progressbar"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickPos = (e.clientX - rect.left) / rect.width;
          if (duration > 0) seek(clickPos * duration);
        }}
        title="Click to seek"
      >
        <div
          className="mini-player-progressbar-fill"
          style={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }}
        />
      </div>

      <div className="mini-player-content">
        {/* Left: Medallion & Surah Info */}
        <div
          className="mini-player-trackinfo"
          onClick={() => navigate('/listen')}
          title="Click to open full player"
        >
          <div className="mini-player-disc">
            {isPlaying ? (
              <div className="mini-eq-bars">
                <span className="mini-eq mini-eq-1" />
                <span className="mini-eq mini-eq-2" />
                <span className="mini-eq mini-eq-3" />
              </div>
            ) : (
              <Headphones size={18} className="shiny-icon text-gold" />
            )}
          </div>

          <div className="mini-player-meta">
            <div className="mini-player-title-row">
              <span className="mini-player-surah-num">#{currentTrack.surahNumber}</span>
              <span className="mini-player-title">{currentTrack.englishName}</span>
              {currentTrack.arabicName && (
                <span className="mini-player-arabic" lang="ar">{currentTrack.arabicName}</span>
              )}
            </div>
            <div className="mini-player-reciter">
              {currentTrack.reciterName} • {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>

        {/* Center: Playback Controls */}
        <div className="mini-player-controls">
          <button
            type="button"
            className="mini-btn-nav"
            onClick={playPrevSurah}
            disabled={currentTrack.surahNumber <= 1}
            aria-label="Previous Surah"
            title="Previous Surah"
          >
            <SkipBack size={18} />
          </button>

          <button
            type="button"
            className="mini-btn-play"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause recitation' : 'Resume recitation'}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={19} className="shiny-icon" />
            ) : (
              <Play size={19} className="shiny-icon" style={{ marginLeft: 2 }} />
            )}
          </button>

          <button
            type="button"
            className="mini-btn-nav"
            onClick={playNextSurah}
            disabled={currentTrack.surahNumber >= 114}
            aria-label="Next Surah"
            title="Next Surah"
          >
            <SkipForward size={18} />
          </button>
        </div>

        {/* Right: Open in Listen & Stop/Close ('X') */}
        <div className="mini-player-actions">
          <button
            type="button"
            className="mini-btn-action"
            onClick={() => navigate('/listen')}
            aria-label="Open full listen deck"
            title="Open full audio sanctuary"
          >
            <ExternalLink size={18} />
          </button>

          <button
            type="button"
            className="mini-btn-stop"
            onClick={stopAudio}
            aria-label="Stop audio completely"
            title="Stop recitation"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
