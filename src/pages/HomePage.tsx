import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen, Search, Headphones, ChevronRight, ArrowRight,
  Sparkles, Compass, Play, Pause, SkipBack, SkipForward,
  Shuffle, Repeat, Volume2, VolumeX, Heart, Clock
} from 'lucide-react';
import { fetchSurahList } from '../api/quranApi';
import { getLastRead } from '../db/userDb';
import type { SurahMeta } from '../types/quran';
import type { ReadingHistory } from '../db/userDb';

const QUICK_TAGS = [
  { label: 'Surah Yaseen', number: 36 },
  { label: 'Al-Mulk', number: 67 },
  { label: 'Ar-Rahman', number: 55 },
  { label: 'Al-Kahf', number: 18 },
  { label: 'Al-Waqi’ah', number: 56 },
  { label: 'Ayatul Kursi (2:255)', link: '/search?q=2:255' },
];

const SAMPLE_JUZ = [
  { number: 1, name: 'Alif Lam Meem', start: 'Al-Fatihah 1', end: 'Al-Baqarah 141' },
  { number: 2, name: 'Sayaqool', start: 'Al-Baqarah 142', end: 'Al-Baqarah 252' },
  { number: 3, name: 'Tilkal Rusul', start: 'Al-Baqarah 253', end: 'Aal \'Imran 92' },
  { number: 4, name: 'Lan Tanaaloo', start: 'Aal \'Imran 93', end: 'An-Nisa 23' },
  { number: 5, name: 'Wal Muhsanat', start: 'An-Nisa 24', end: 'An-Nisa 147' },
  { number: 6, name: 'La Yuhibbullah', start: 'An-Nisa 148', end: 'Al-Ma\'idah 81' },
];

const TRANSLATION_PREVIEWS: Record<string, { name: string; bismillah: string; ayah1: string; ayah2: string }> = {
  'en.sahih': {
    name: 'Sahih International',
    bismillah: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    ayah1: '[All] praise is [due] to Allah, Lord of the worlds -',
    ayah2: 'The Entirely Merciful, the Especially Merciful,',
  },
  'ur.maududi': {
    name: 'Abul A\'la Maududi (Urdu)',
    bismillah: 'اللہ کے نام سے جو رحمان اور رحیم ہے',
    ayah1: 'شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے',
    ayah2: 'تعریف اللہ ہی کے لیے ہے جو تمام جہانوں کا پرورش کرنے والا ہے',
  },
  'en.khattab': {
    name: 'The Clear Quran (Dr. Mustafa Khattab)',
    bismillah: 'In the Name of Allah—the Most Compassionate, Most Merciful.',
    ayah1: 'All praise is for Allah—Lord of all worlds,',
    ayah2: 'the Most Compassionate, Most Merciful,',
  },
  'en.yusufali': {
    name: 'Yusuf Ali',
    bismillah: 'In the name of Allah, Most Gracious, Most Merciful.',
    ayah1: 'Praise be to Allah, the Cherisher and Sustainer of the worlds;',
    ayah2: 'Most Gracious, Most Merciful;',
  },
};

const RECITERS = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy', audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3' },
  { id: 'ar.abdulbasit', name: 'AbdulBaset AbdulSamad', audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.abdulbasitmurattal/1.mp3' },
  { id: 'ar.maher', name: 'Maher Al-Muaiqly', audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.mahermuaiqly/1.mp3' },
  { id: 'ar.ghamadi', name: 'Saad Al-Ghamdi', audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.saadalghamidi/1.mp3' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [lastRead, setLastRead] = useState<ReadingHistory | null>(null);
  const [heroSearch, setHeroSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'surah' | 'juz'>('surah');

  // Interactive reading section state
  const [selectedTranslation, setSelectedTranslation] = useState<string>('en.sahih');
  const [previewFontSize, setPreviewFontSize] = useState<'sm' | 'md' | 'lg'>('md');

  // Interactive audio section state
  const [selectedReciterId, setSelectedReciterId] = useState<string>('ar.alafasy');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(42);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    document.title = 'Noor Quran — A calm space to reconnect with the Quran';
    Promise.all([
      fetchSurahList().then(setSurahs),
      getLastRead().then(setLastRead),
    ]);
  }, []);

  // Sync audio reciter source
  useEffect(() => {
    const currentReciter = RECITERS.find((r) => r.id === selectedReciterId) || RECITERS[0];
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      audioRef.current.src = currentReciter.audioUrl;
      if (wasPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [selectedReciterId]);

  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  const currentReciter = RECITERS.find((r) => r.id === selectedReciterId) || RECITERS[0];
  const translationData = TRANSLATION_PREVIEWS[selectedTranslation] || TRANSLATION_PREVIEWS['en.sahih'];

  // 6 initial Surahs for Explore section
  const exploreSurahs = surahs.slice(0, 6);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div>
      {/* Hidden audio element for interactive player */}
      <audio
        ref={audioRef}
        src={currentReciter.audioUrl}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
              setDuration(audioRef.current.duration);
            }
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
      />

      {/* ─── 1. Panoramic Full-Width Hero Section ─── */}
      <section
        className="hero-fullwidth"
        aria-label="Noor Quran Hero Banner"
      >
        <div className="hero-fullwidth-overlay" />

        <div className="hero-content-wrapper">
          <div className="hero-text-container">
            {/* Arabic Bismillah Calligraphy */}
            <p
              className="arabic-text"
              lang="ar"
              style={{
                fontSize: '1.9rem',
                color: 'var(--color-accent)',
                margin: '0 0 10px',
                fontWeight: 700,
                lineHeight: 1.2,
                textShadow: '0 0 16px rgba(212, 175, 55, 0.4)',
              }}
              aria-label="Bismillah ir-Rahman ir-Rahim"
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>

            {/* Editorial Headline */}
            <h1 className="hero-headline">
              A calm space<br />
              to reconnect<br />
              <span className="hero-gold-text">with the Quran</span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtext">
              Read, listen and reflect — at your own pace.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', marginBottom: 28 }}>
              <Link
                to="/quran"
                className="hero-cta-btn"
                id="hero-start-reading-btn"
              >
                <BookOpen size={20} className="shiny-icon" style={{ color: 'var(--color-accent)' }} />
                <span>Start reading</span>
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/listen"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '13px 24px',
                  borderRadius: 9999,
                  background: 'rgba(255, 255, 255, 0.88)',
                  backdropFilter: 'blur(8px)',
                  border: '1.5px solid var(--color-border-gold)',
                  color: 'var(--color-brand)',
                  fontWeight: 700,
                  fontSize: '0.96rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                  transition: 'all 0.2s ease',
                }}
              >
                <Headphones size={18} className="shiny-icon" style={{ color: 'var(--color-accent)' }} />
                <span>Listen Audio</span>
              </Link>
            </div>

            {/* Quick Search Form */}
            <form
              onSubmit={handleHeroSearch}
              style={{
                maxWidth: 480,
                marginBottom: 16,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <input
                type="search"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search verse or chapter (e.g. Yaseen, 2:255)…"
                style={{
                  width: '100%',
                  padding: '12px 105px 12px 18px',
                  borderRadius: 9999,
                  border: '1.5px solid var(--color-border-gold)',
                  background: 'rgba(255, 255, 255, 0.94)',
                  color: 'var(--color-ink-900)',
                  fontSize: '0.9rem',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                className="btn-gold"
                style={{
                  position: 'absolute',
                  right: 4,
                  padding: '7px 16px',
                  fontSize: '0.84rem',
                  borderRadius: 9999,
                }}
              >
                <Search size={14} /> Search
              </button>
            </form>

            {/* Quick Jump Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Sparkles size={12} className="shiny-icon" /> Popular:
              </span>
              {QUICK_TAGS.map((tag) => (
                <Link
                  key={tag.label}
                  to={tag.link ?? `/surah/${tag.number}`}
                  style={{
                    fontSize: '0.76rem',
                    color: 'var(--color-brand)',
                    background: 'rgba(212, 175, 55, 0.12)',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                    padding: '3px 10px',
                    borderRadius: 20,
                    textDecoration: 'none',
                    fontWeight: 600,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main Content Container (Structured Editorial Flow) ─── */}
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '50px 24px 80px' }}>

        {/* Continue Reading Bar (if exists) */}
        {lastRead && (
          <div style={{ marginBottom: 44 }}>
            <div
              onClick={() => navigate(`/surah/${lastRead.surahNumber}#ayah-${lastRead.ayahNumber}`)}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '14px 22px',
                borderRadius: 16,
                border: '1.5px solid var(--color-border-gold)',
                background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-cream-100) 100%)',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              }}
            >
              <div className="icon-badge-shiny" style={{ width: 40, height: 40, borderRadius: 12 }}>
                <BookOpen size={20} className="shiny-icon" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 800, color: 'var(--color-brand)', fontSize: '0.96rem' }}>
                    Continue Reading: Surah {lastRead.surahNumber}
                  </span>
                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 10, background: 'var(--color-gold-soft)', color: 'var(--color-accent)', fontWeight: 700 }}>
                    Ayah {lastRead.ayahNumber}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Pick up where you left off • Last recited {new Date(lastRead.visitedAt).toLocaleDateString()}
                </div>
              </div>
              <div className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.84rem' }}>
                Resume <ChevronRight size={14} className="shiny-icon" />
              </div>
            </div>
          </div>
        )}

        {/* ─── 2. "Your Quran journey, your way" ─── */}
        <section style={{ marginBottom: 70 }}>
          <h2 className="section-title-editorial">
            Your Quran journey, <span className="hero-gold-text">your way</span>
          </h2>
          <p className="section-subtitle-editorial">
            Whether you want to read, listen or explore the meanings, Noor Quran is here to support you at every step.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {/* Card 1: Read at your pace */}
            <Link to="/quran" className="journey-card">
              <div className="journey-card-content">
                <div>
                  <div className="journey-card-icon-badge">
                    <BookOpen size={22} className="shiny-icon" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-brand)', marginBottom: 8 }}>
                    Read at your pace
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.55, margin: 0 }}>
                    Enjoy a clear and peaceful reading experience, designed for focus and ease.
                  </p>
                </div>
                <div className="round-arrow-btn">
                  <ChevronRight size={18} />
                </div>
              </div>
              <div
                className="journey-card-image"
                style={{
                  backgroundImage: "url('/journey-read.jpg')",
                  backgroundPosition: 'center',
                }}
              />
            </Link>

            {/* Card 2: Listen to recitation */}
            <Link to="/listen" className="journey-card">
              <div className="journey-card-content">
                <div>
                  <div className="journey-card-icon-badge">
                    <Headphones size={22} className="shiny-icon" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-brand)', marginBottom: 8 }}>
                    Listen to recitation
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.55, margin: 0 }}>
                    Immerse yourself in beautiful recitations from renowned Qaris, anytime, anywhere.
                  </p>
                </div>
                <div className="round-arrow-btn">
                  <ChevronRight size={18} />
                </div>
              </div>
              <div
                className="journey-card-image"
                style={{
                  backgroundImage: "url('/hero-bg-clean.jpg')",
                  backgroundPosition: '60% 30%',
                }}
              />
            </Link>

            {/* Card 3: Explore with meaning */}
            <Link to="/search" className="journey-card">
              <div className="journey-card-content">
                <div>
                  <div className="journey-card-icon-badge">
                    <Compass size={22} className="shiny-icon" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-brand)', marginBottom: 8 }}>
                    Explore with meaning
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.55, margin: 0 }}>
                    Read trusted translations and simple explanations to deepen your understanding.
                  </p>
                </div>
                <div className="round-arrow-btn">
                  <ChevronRight size={18} />
                </div>
              </div>
              <div
                className="journey-card-image"
                style={{
                  backgroundImage: "url('/hero-bg-clean.jpg')",
                  backgroundPosition: '86% 75%',
                }}
              />
            </Link>
          </div>
        </section>

        {/* ─── 3. "Explore the Quran" (Surah / Juz Switcher) ─── */}
        <section style={{ marginBottom: 74, textAlign: 'center' }}>
          <h2 className="section-title-editorial">
            Explore the Quran
          </h2>
          <p className="section-subtitle-editorial">
            Browse by Surah or Juz and start your journey wherever you feel ready.
          </p>

          {/* Toggle pill */}
          <div className="explore-toggle-pill">
            <button
              onClick={() => setActiveTab('surah')}
              className={`explore-toggle-btn ${activeTab === 'surah' ? 'active' : ''}`}
            >
              Surah
            </button>
            <button
              onClick={() => setActiveTab('juz')}
              className={`explore-toggle-btn ${activeTab === 'juz' ? 'active' : ''}`}
            >
              Juz
            </button>
          </div>

          {/* 6 Cards Grid (2 columns) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16, marginBottom: 32, textAlign: 'left' }}>
            {activeTab === 'surah' ? (
              exploreSurahs.map((s) => (
                <Link
                  key={s.number}
                  to={`/surah/${s.number}`}
                  className="surah-clean-card"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: 'rgba(45, 106, 79, 0.1)',
                      border: '1px solid rgba(45, 106, 79, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-brand)',
                    }}>
                      <BookOpen size={20} className="shiny-icon" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.02rem', color: 'var(--color-brand)', marginBottom: 2 }}>
                        {s.englishName}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                        {s.englishNameTranslation}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 10px',
                    borderRadius: 9999,
                    background: 'rgba(212, 175, 55, 0.1)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    color: 'var(--color-brand)',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                  }}>
                    <span>{s.number}</span>
                    <ChevronRight size={14} />
                  </div>
                </Link>
              ))
            ) : (
              SAMPLE_JUZ.map((j) => (
                <Link
                  key={j.number}
                  to={`/juz/${j.number}`}
                  className="surah-clean-card"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: 'rgba(212, 175, 55, 0.12)',
                      border: '1px solid rgba(212, 175, 55, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-accent)',
                    }}>
                      <Compass size={20} className="shiny-icon" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.02rem', color: 'var(--color-brand)', marginBottom: 2 }}>
                        Juz {j.number} • {j.name}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                        {j.start} – {j.end}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 10px',
                    borderRadius: 9999,
                    background: 'rgba(212, 175, 55, 0.1)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    color: 'var(--color-brand)',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                  }}>
                    <span>{j.number}</span>
                    <ChevronRight size={14} />
                  </div>
                </Link>
              ))
            )}
          </div>

          <Link
            to={activeTab === 'surah' ? '/quran' : '/juz'}
            className="btn-outline-gold"
          >
            <span>View all {activeTab === 'surah' ? 'Surahs' : 'Juz'}</span>
            <ArrowRight size={15} />
          </Link>
        </section>

        {/* ─── 4. "Read with understanding" ─── */}
        <section style={{ marginBottom: 74 }}>
          <h2 className="section-title-editorial">
            Read with understanding
          </h2>
          <p className="section-subtitle-editorial">
            Choose a translation and read with clarity, with trusted sources.
          </p>

          <div style={{
            background: 'var(--color-surface)',
            border: '1.5px solid var(--color-border-gold)',
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          }}>
            {/* Left Controls & Live Reader Preview */}
            <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {/* Control Header: Translation Dropdown & Font Sizing */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Translation:</span>
                    <select
                      value={selectedTranslation}
                      onChange={(e) => setSelectedTranslation(e.target.value)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 10,
                        border: '1.5px solid var(--color-border-gold)',
                        background: 'var(--color-bg)',
                        color: 'var(--color-text)',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    >
                      <option value="en.sahih">Sahih International</option>
                      <option value="ur.maududi">Abul A'la Maududi (Urdu)</option>
                      <option value="en.khattab">The Clear Quran (Dr. Khattab)</option>
                      <option value="en.yusufali">Yusuf Ali</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Font size:</span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {(['sm', 'md', 'lg'] as const).map((size) => (
                        <button
                          key={size}
                          onClick={() => setPreviewFontSize(size)}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            border: previewFontSize === size ? '1.5px solid var(--color-brand)' : '1px solid var(--color-border)',
                            background: previewFontSize === size ? 'var(--color-brand)' : 'var(--color-bg)',
                            color: previewFontSize === size ? '#ffffff' : 'var(--color-text)',
                            fontWeight: 700,
                            fontSize: size === 'sm' ? '0.75rem' : size === 'md' ? '0.9rem' : '1.05rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          A
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Preview Box */}
                <div style={{
                  padding: '24px',
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, rgba(254, 252, 248, 0.7) 0%, rgba(245, 240, 230, 0.4) 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  marginBottom: 24,
                }}>
                  {/* Bismillah */}
                  <p
                    className="arabic-text"
                    lang="ar"
                    style={{
                      fontSize: previewFontSize === 'sm' ? '1.4rem' : previewFontSize === 'md' ? '1.7rem' : '2.1rem',
                      color: 'var(--color-brand)',
                      margin: '0 0 12px',
                      fontWeight: 700,
                      textAlign: 'center',
                    }}
                  >
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', textAlign: 'center', fontStyle: 'italic', marginBottom: 20 }}>
                    {translationData.bismillah}
                  </p>

                  <div style={{ borderTop: '1px dashed rgba(212, 175, 55, 0.4)', paddingTop: 16 }}>
                    {/* Ayah 1 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-accent)', fontWeight: 700 }}>Ayah 1:1</span>
                      <span className="arabic-text" lang="ar" style={{ fontSize: previewFontSize === 'sm' ? '1.2rem' : previewFontSize === 'md' ? '1.4rem' : '1.7rem', color: 'var(--color-brand)' }}>
                        الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝
                      </span>
                    </div>
                    <p style={{ fontSize: previewFontSize === 'sm' ? '0.84rem' : previewFontSize === 'md' ? '0.92rem' : '1.02rem', color: 'var(--color-text)', lineHeight: 1.5, margin: 0 }}>
                      {translationData.ayah1}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footnote Citation */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.8rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
                <BookOpen size={16} className="shiny-icon" style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                <span>Translations from the Quran are from trusted scholarly sources, such as Sahih International, with verified Uthmani text.</span>
              </div>
            </div>

            {/* Right Scenic Arched Illustration */}
            <div style={{
              backgroundImage: "url('/journey-read.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: 320,
              borderLeft: '1.5px solid var(--color-border-gold)',
            }} />
          </div>
        </section>

        {/* ─── 5. "Listen and reflect" ─── */}
        <section style={{ marginBottom: 74 }}>
          <h2 className="section-title-editorial">
            Listen and reflect
          </h2>
          <p className="section-subtitle-editorial">
            Play recitations from renowned Qaris and let the words of the Quran bring peace to your heart.
          </p>

          <div style={{
            background: 'var(--color-surface)',
            border: '1.5px solid var(--color-border-gold)',
            borderRadius: 24,
            padding: '28px 32px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 28,
          }}>
            {/* Mosque Art Thumbnail */}
            <div style={{
              width: 140,
              height: 140,
              borderRadius: 20,
              backgroundImage: "url('/hero-bg-clean.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: '60% 40%',
              border: '2px solid var(--color-border-gold)',
              boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
              flexShrink: 0,
            }} />

            {/* Player Controls & Track Info */}
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--color-brand)' }}>
                    Surah Al-Fatihah (The Opening)
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-accent)', fontWeight: 600 }}>
                    Recited by {currentReciter.name}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Reciter:</span>
                  <select
                    value={selectedReciterId}
                    onChange={(e) => setSelectedReciterId(e.target.value)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: 8,
                      border: '1px solid var(--color-border-gold)',
                      background: 'var(--color-bg)',
                      color: 'var(--color-text)',
                      fontWeight: 600,
                      fontSize: '0.84rem',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {RECITERS.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 14 }}>
                <button aria-label="Shuffle" className="btn-ghost" style={{ padding: 6, color: 'var(--color-text-muted)' }}>
                  <Shuffle size={18} />
                </button>
                <button
                  aria-label="Previous"
                  className="btn-ghost"
                  style={{ padding: 6, color: 'var(--color-brand)' }}
                  onClick={() => {
                    if (audioRef.current) audioRef.current.currentTime = 0;
                  }}
                >
                  <SkipBack size={20} />
                </button>
                <button
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  onClick={togglePlayAudio}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: '#0f382c',
                    color: '#ffffff',
                    border: '2px solid #d4af37',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(15, 56, 44, 0.4), 0 0 12px rgba(212, 175, 55, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isPlaying ? <Pause size={22} className="shiny-icon" /> : <Play size={22} style={{ marginLeft: 2 }} className="shiny-icon" />}
                </button>
                <button
                  aria-label="Next"
                  className="btn-ghost"
                  style={{ padding: 6, color: 'var(--color-brand)' }}
                  onClick={() => {
                    if (audioRef.current) audioRef.current.currentTime = 0;
                  }}
                >
                  <SkipForward size={20} />
                </button>
                <button aria-label="Repeat" className="btn-ghost" style={{ padding: 6, color: 'var(--color-text-muted)' }}>
                  <Repeat size={18} />
                </button>
              </div>

              {/* Progress Slider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', minWidth: 32 }}>
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={duration || 42}
                  step={0.1}
                  value={currentTime}
                  onChange={(e) => {
                    const t = parseFloat(e.target.value);
                    setCurrentTime(t);
                    if (audioRef.current) audioRef.current.currentTime = t;
                  }}
                  style={{ flex: 1, accentColor: '#d4af37', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', minWidth: 32 }}>
                  {formatTime(duration)}
                </span>
                <button
                  aria-label="Mute"
                  className="btn-ghost"
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.muted = !isMuted;
                      setIsMuted(!isMuted);
                    }
                  }}
                  style={{ padding: 4, color: 'var(--color-brand)', marginLeft: 6 }}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 6. "Build a gentle daily habit" ─── */}
        <section style={{ marginBottom: 74 }}>
          <h2 className="section-title-editorial">
            Build a gentle daily habit
          </h2>
          <p className="section-subtitle-editorial">
            A simple routine to help you stay connected with the Quran, day by day.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
            {/* Step 1 */}
            <div className="habit-step-card">
              <div className="habit-icon-pill">
                <Clock size={24} className="shiny-icon" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-brand)', margin: '0 0 4px' }}>
                  Choose a time
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.45 }}>
                  Find a quiet moment that works for you.
                </p>
              </div>
            </div>

            <ChevronRight size={22} style={{ color: 'var(--color-accent)', opacity: 0.6 }} className="desktop-nav" />

            {/* Step 2 */}
            <div className="habit-step-card">
              <div className="habit-icon-pill">
                <Headphones size={24} className="shiny-icon" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-brand)', margin: '0 0 4px' }}>
                  Read or listen
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.45 }}>
                  Engage with the Quran in a way that feels right.
                </p>
              </div>
            </div>

            <ChevronRight size={22} style={{ color: 'var(--color-accent)', opacity: 0.6 }} className="desktop-nav" />

            {/* Step 3 */}
            <div className="habit-step-card">
              <div className="habit-icon-pill">
                <Heart size={24} className="shiny-icon" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-brand)', margin: '0 0 4px' }}>
                  Reflect a little
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.45 }}>
                  Take a moment to absorb the meaning.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 7. "Begin with one ayah at a time" (Arched CTA Banner) ─── */}
        <section style={{ marginBottom: 40 }}>
          <div className="arched-cta-banner">
            {/* Left Arched Mosque Icon / Window */}
            <div style={{
              width: 140,
              height: 140,
              borderRadius: '70px 70px 20px 20px',
              backgroundImage: "url('/journey-read.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '2px solid var(--color-border-gold)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              flexShrink: 0,
            }} />

            {/* Center Callout */}
            <div style={{ textAlign: 'center', flex: 1, maxWidth: 640 }}>
              <h2 className="section-title-editorial" style={{ margin: '0 0 8px', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}>
                Begin with one ayah at a time
              </h2>
              <p className="section-subtitle-editorial" style={{ margin: '0 auto 24px', fontSize: '0.98rem' }}>
                Take the next step in your Quran journey. Read, listen and reflect whenever you are ready.
              </p>

              <Link
                to="/quran"
                className="hero-cta-btn"
                style={{ padding: '13px 36px' }}
              >
                <BookOpen size={20} className="shiny-icon" style={{ color: 'var(--color-accent)' }} />
                <span>Start reading</span>
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Right Decorative Jasmine / Mosque Thumbnail */}
            <div style={{
              width: 140,
              height: 140,
              borderRadius: '70px 70px 20px 20px',
              backgroundImage: "url('/hero-bg-clean.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: '86% 75%',
              border: '2px solid var(--color-border-gold)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              flexShrink: 0,
            }} />
          </div>
        </section>

      </div>
    </div>
  );
}
