import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import type { SurahMeta } from '../types/quran';
import { KNOWN_RECITERS } from '../types/quran';
import { fetchSurahList, buildSurahAudioUrl } from '../api/quranApi';
import { useSettings } from './SettingsContext';

export interface AudioTrack {
  id: string;
  title: string;
  englishName: string;
  arabicName: string;
  englishNameTranslation?: string;
  surahNumber: number;
  numberOfAyahs: number;
  revelationType: string;
  reciterId: string;
  reciterName: string;
  audioUrl: string;
}

interface AudioContextType {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLooping: boolean;
  autoPlayNext: boolean;
  audioError: string | null;
  surahs: SurahMeta[];
  loadingSurahs: boolean;

  playSurah: (surahNumber: number, customReciterId?: string) => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  togglePlay: () => void;
  stopAudio: () => void;
  seek: (seconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleLoop: () => void;
  setAutoPlayNext: (enabled: boolean) => void;
  playNextSurah: () => void;
  playPrevSurah: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [loadingSurahs, setLoadingSurahs] = useState(true);

  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [audioError, setAudioError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrackRef = useRef<AudioTrack | null>(null);
  currentTrackRef.current = currentTrack;
  const isLoopingRef = useRef(isLooping);
  isLoopingRef.current = isLooping;
  const autoPlayNextRef = useRef(autoPlayNext);
  autoPlayNextRef.current = autoPlayNext;
  const surahsRef = useRef(surahs);
  surahsRef.current = surahs;

  // Initialize surah list
  useEffect(() => {
    fetchSurahList()
      .then((data) => setSurahs(data))
      .catch(() => {})
      .finally(() => setLoadingSurahs(false));
  }, []);

  // Ensure singleton audio element with full listeners
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audioRef.current = audio;

      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };

      audio.ondurationchange = () => {
        if (!isNaN(audio.duration)) {
          setDuration(audio.duration);
        }
      };

      audio.onended = () => {
        if (isLoopingRef.current) {
          audio.currentTime = 0;
          audio.play().catch(() => {});
          return;
        }

        const track = currentTrackRef.current;
        if (autoPlayNextRef.current && track && track.surahNumber < 114) {
          const nextNum = track.surahNumber + 1;
          playSurahInternal(nextNum, track.reciterId);
        } else {
          setIsPlaying(false);
          setCurrentTime(0);
        }
      };

      audio.onerror = () => {
        setAudioError('Audio playback failed. The reciter stream may be temporarily unavailable.');
        setIsPlaying(false);
      };
    }

    // Stop global audio if another component dispatches a stop event
    const handleStopGlobalAudio = () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    };

    window.addEventListener('quran-stop-global-audio', handleStopGlobalAudio);

    return () => {
      window.removeEventListener('quran-stop-global-audio', handleStopGlobalAudio);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const playSurahInternal = useCallback((surahNum: number, reciterIdOverride?: string) => {
    // Notify any other audio in the app (like Ayah reader or preview) to stop immediately
    window.dispatchEvent(new CustomEvent('quran-global-audio-started'));

    const reciterIdentifier = reciterIdOverride || settings.reciterIdentifier;
    const reciter = KNOWN_RECITERS.find((r) => r.identifier === reciterIdentifier) || KNOWN_RECITERS[0];
    const surahMeta = surahsRef.current.find((s) => s.number === surahNum);
    const audioUrl = buildSurahAudioUrl(surahNum, reciterIdentifier);

    const track: AudioTrack = {
      id: `surah-${surahNum}`,
      title: surahMeta ? surahMeta.englishName : `Surah ${surahNum}`,
      englishName: surahMeta ? surahMeta.englishName : `Surah ${surahNum}`,
      arabicName: surahMeta ? surahMeta.name : '',
      englishNameTranslation: surahMeta ? surahMeta.englishNameTranslation : '',
      surahNumber: surahNum,
      numberOfAyahs: surahMeta ? surahMeta.numberOfAyahs : 0,
      revelationType: surahMeta ? surahMeta.revelationType : '',
      reciterId: reciterIdentifier,
      reciterName: reciter.name,
      audioUrl,
    };

    setCurrentTrack(track);
    setAudioError(null);
    setCurrentTime(0);
    setDuration(0);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = audioUrl;
      audioRef.current.loop = isLoopingRef.current;
      audioRef.current.volume = isMuted ? 0 : volume;

      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Audio play error:', err);
          setIsPlaying(false);
          setAudioError('Click Play to begin recitation.');
        });
    }
  }, [settings.reciterIdentifier, isMuted, volume]);

  const playSurah = (surahNumber: number, customReciterId?: string) => {
    playSurahInternal(surahNumber, customReciterId);
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  const resumeAudio = () => {
    if (audioRef.current && currentTrack) {
      window.dispatchEvent(new CustomEvent('quran-global-audio-started'));
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      if (currentTrack) {
        resumeAudio();
      } else {
        playSurah(1);
      }
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setCurrentTrack(null);
    setAudioError(null);
  };

  const seek = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    setIsMuted(false);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.volume = volume;
    } else {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.volume = 0;
    }
  };

  const toggleLoop = () => {
    const nextLoop = !isLooping;
    setIsLooping(nextLoop);
    if (audioRef.current) {
      audioRef.current.loop = nextLoop;
    }
  };

  const playNextSurah = () => {
    if (currentTrack && currentTrack.surahNumber < 114) {
      playSurahInternal(currentTrack.surahNumber + 1, currentTrack.reciterId);
    }
  };

  const playPrevSurah = () => {
    if (currentTrack && currentTrack.surahNumber > 1) {
      playSurahInternal(currentTrack.surahNumber - 1, currentTrack.reciterId);
    }
  };

  return (
    <AudioContext.Provider
      value={{
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
        togglePlay,
        stopAudio,
        seek,
        setVolume,
        toggleMute,
        toggleLoop,
        setAutoPlayNext,
        playNextSurah,
        playPrevSurah,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return ctx;
}
