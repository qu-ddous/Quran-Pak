import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen, Search, Headphones, ChevronRight, ArrowRight,
  Sparkles, Compass, Play, Pause, SkipBack, SkipForward,
  Shuffle, Repeat, Volume2, VolumeX, Heart, Clock, BookMarked
} from 'lucide-react';
import { getLastRead } from '../db/userDb';
import type { ReadingHistory } from '../db/userDb';

const QUICK_TAGS = [
  { label: 'Surah Yaseen', number: 36 },
  { label: 'Al-Mulk', number: 67 },
  { label: 'Ar-Rahman', number: 55 },
  { label: 'Al-Kahf', number: 18 },
  { label: 'Al-Waqi’ah', number: 56 },
  { label: 'Ayatul Kursi (2:255)', link: '/search?q=2:255' },
];


export const SURAH_SHOWCASE_DATA = [
  {
    number: 1,
    name: 'سُورَةُ ٱلْفَاتِحَةِ',
    englishName: 'Al-Fatihah',
    englishNameTranslation: 'The Opening',
    numberOfAyahs: 7,
    revelationType: 'Meccan',
    teaser: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ • الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    colorTheme: {
      gradient: 'linear-gradient(135deg, #092c21 0%, #175440 60%, #0d382b 100%)',
      border: '#d4af37',
      glow: 'rgba(212, 175, 55, 0.55)',
      accent: '#fef08a',
      badgeBg: 'linear-gradient(135deg, #ca8a04 0%, #eab308 100%)',
      colorName: 'Royal Emerald',
    },
  },
  {
    number: 2,
    name: 'سُورَةُ البَقَرَةِ',
    englishName: 'Al-Baqarah',
    englishNameTranslation: 'The Cow',
    numberOfAyahs: 286,
    revelationType: 'Medinan',
    teaser: 'الۤمۤ • ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًۭى لِّلْمُتَّقِينَ',
    colorTheme: {
      gradient: 'linear-gradient(135deg, #451a03 0%, #854d0e 55%, #713f12 100%)',
      border: '#fde047',
      glow: 'rgba(234, 179, 8, 0.55)',
      accent: '#fef9c3',
      badgeBg: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
      colorName: 'Imperial Amber',
    },
  },
  {
    number: 3,
    name: 'سُورَةُ آلِ عِمْرَانَ',
    englishName: 'Aal \'Imran',
    englishNameTranslation: 'Family of Imran',
    numberOfAyahs: 200,
    revelationType: 'Medinan',
    teaser: 'الۤمۤ • ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ',
    colorTheme: {
      gradient: 'linear-gradient(135deg, #081d38 0%, #1d4ed8 55%, #1e3a8a 100%)',
      border: '#60a5fa',
      glow: 'rgba(59, 130, 246, 0.55)',
      accent: '#dbeafe',
      badgeBg: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
      colorName: 'Persian Sapphire',
    },
  },
  {
    number: 4,
    name: 'سُورَةُ النِّسَاءِ',
    englishName: 'An-Nisa',
    englishNameTranslation: 'The Women',
    numberOfAyahs: 176,
    revelationType: 'Medinan',
    teaser: 'يَـٰٓأَيُّهَا ٱلنَّاسُ ٱتَّقُوا۟ رَبَّكُمُ ٱلَّذِى خَلَقَكُم مِّن نَّفْسٍۢ وَٰحِدَةٍۢ',
    colorTheme: {
      gradient: 'linear-gradient(135deg, #4c0519 0%, #9f1239 55%, #881337 100%)',
      border: '#fb7185',
      glow: 'rgba(244, 63, 94, 0.55)',
      accent: '#ffe4e6',
      badgeBg: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)',
      colorName: 'Crimson Ruby',
    },
  },
  {
    number: 5,
    name: 'سُورَةُ المَائِدَةِ',
    englishName: 'Al-Ma\'idah',
    englishNameTranslation: 'The Table Spread',
    numberOfAyahs: 120,
    revelationType: 'Medinan',
    teaser: 'يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ أَوْفُوا۟ بِٱلْعُقُودِ ۚ',
    colorTheme: {
      gradient: 'linear-gradient(135deg, #2e0854 0%, #6b21a8 55%, #581c87 100%)',
      border: '#c084fc',
      glow: 'rgba(168, 85, 247, 0.55)',
      accent: '#f3e8ff',
      badgeBg: 'linear-gradient(135deg, #7e22ce 0%, #9333ea 100%)',
      colorName: 'Velvet Amethyst',
    },
  },
  {
    number: 6,
    name: 'سُورَةُ الأَنْعَامِ',
    englishName: 'Al-An\'am',
    englishNameTranslation: 'The Cattle',
    numberOfAyahs: 165,
    revelationType: 'Meccan',
    teaser: 'ٱلْحَمْدُ لِلَّهِ ٱلَّذِى خَلَقَ ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضَ وَجَعَلَ ٱلظُّلُمَـٰتِ وَٱلنُّورَ',
    colorTheme: {
      gradient: 'linear-gradient(135deg, #022c22 0%, #0f766e 55%, #115e59 100%)',
      border: '#2dd4bf',
      glow: 'rgba(20, 184, 166, 0.55)',
      accent: '#ccfbf1',
      badgeBg: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
      colorName: 'Peacock Jade',
    },
  },
];

export const JUZ_SHOWCASE_DATA = [
  {
    number: 1,
    name: 'الجزء الأول (الم)',
    englishName: 'Juz 1 • Alif Lam Meem',
    englishNameTranslation: 'Al-Fatihah 1 – Al-Baqarah 141',
    numberOfAyahs: 148,
    revelationType: 'Part 1',
    teaser: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ • صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ',
    colorTheme: SURAH_SHOWCASE_DATA[0].colorTheme,
  },
  {
    number: 2,
    name: 'الجزء الثاني (سَيَقُولُ)',
    englishName: 'Juz 2 • Sayaqool',
    englishNameTranslation: 'Al-Baqarah 142 – Al-Baqarah 252',
    numberOfAyahs: 111,
    revelationType: 'Part 2',
    teaser: 'سَيَقُولُ السُّفَهَاءُ مِنَ النَّاسِ مَا وَلَّاهُمْ عَن قِبْلَتِهِمُ',
    colorTheme: SURAH_SHOWCASE_DATA[1].colorTheme,
  },
  {
    number: 3,
    name: 'الجزء الثالث (تِلْكَ الرُّسُلُ)',
    englishName: 'Juz 3 • Tilkal Rusul',
    englishNameTranslation: 'Al-Baqarah 253 – Aal \'Imran 92',
    numberOfAyahs: 126,
    revelationType: 'Part 3',
    teaser: 'تِلْكَ الرُّسُلُ فَضَّلْنَا بَعْضَهُمْ عَلَىٰ بَعْضٍ ۘ',
    colorTheme: SURAH_SHOWCASE_DATA[2].colorTheme,
  },
  {
    number: 4,
    name: 'الجزء الرابع (لَن تَنَالُوا)',
    englishName: 'Juz 4 • Lan Tanaaloo',
    englishNameTranslation: 'Aal \'Imran 93 – An-Nisa 23',
    numberOfAyahs: 131,
    revelationType: 'Part 4',
    teaser: 'لَن تَنَالُوا الْبِرَّ حَتَّىٰ تُنفِقُوا مِمَّا تُحِبُّونَ ۚ',
    colorTheme: SURAH_SHOWCASE_DATA[3].colorTheme,
  },
  {
    number: 5,
    name: 'الجزء الخامس (وَالْمُحْصَنَاتُ)',
    englishName: 'Juz 5 • Wal Muhsanat',
    englishNameTranslation: 'An-Nisa 24 – An-Nisa 147',
    numberOfAyahs: 124,
    revelationType: 'Part 5',
    teaser: 'وَالْمُحْصَنَاتُ مِنَ النِّسَاءِ إِلَّا مَا مَلَكَتْ أَيْمَانُكُمْ ۖ',
    colorTheme: SURAH_SHOWCASE_DATA[4].colorTheme,
  },
  {
    number: 6,
    name: 'الجزء السادس (لَا يُحِبُّ اللَّهُ)',
    englishName: 'Juz 6 • La Yuhibbullah',
    englishNameTranslation: 'An-Nisa 148 – Al-Ma\'idah 81',
    numberOfAyahs: 110,
    revelationType: 'Part 6',
    teaser: 'لَّا يُحِبُّ اللَّهُ الْجَهْرَ بِالسُّوءِ مِنَ الْقَوْلِ إِلَّا مَن ظُلِمَ ۚ',
    colorTheme: SURAH_SHOWCASE_DATA[5].colorTheme,
  },
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
  const [lastRead, setLastRead] = useState<ReadingHistory | null>(null);
  const [heroSearch, setHeroSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'surah' | 'juz'>('surah');

  // 3D Showcase State
  const [showcaseIndex, setShowcaseIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showcaseViewMode, setShowcaseViewMode] = useState<'3d' | 'grid'>('3d');

  // Auto-advance 3D showcase cards every 4 seconds
  useEffect(() => {
    if (isPaused || showcaseViewMode !== '3d') return;
    const interval = setInterval(() => {
      setShowcaseIndex((prev) => (prev + 1) % 6);
    }, 3800);
    return () => clearInterval(interval);
  }, [isPaused, showcaseViewMode]);

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
    getLastRead().then(setLastRead);

    const handleGlobalAudioStarted = () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    };

    window.addEventListener('quran-global-audio-started', handleGlobalAudioStarted);

    return () => {
      window.removeEventListener('quran-global-audio-started', handleGlobalAudioStarted);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
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
      // Stop any other audio before starting home preview
      window.dispatchEvent(new CustomEvent('quran-stop-global-audio'));
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
                  padding: '13px 22px',
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

              <Link
                to="/books"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '13px 22px',
                  borderRadius: 9999,
                  background: 'var(--gradient-gold)',
                  color: '#1a1a1a',
                  fontWeight: 800,
                  fontSize: '0.96rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)',
                  transition: 'all 0.2s ease',
                }}
              >
                <BookMarked size={18} />
                <span>Islamic Books & Duas (کتب و دعائیں)</span>
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
      <div className="quran-page-container" style={{ paddingBottom: 80, paddingTop: 50 }}>

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

        {/* ─── 2.5. Islamic Books & Duas Spotlight Section ─── */}
        <section style={{ marginBottom: 70 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginBottom: 24 }}>
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 12px',
                  borderRadius: 20,
                  background: 'var(--color-gold-soft)',
                  color: 'var(--color-gold-700)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  marginBottom: 10,
                }}
              >
                <Sparkles size={14} />
                <span>کتب و دعاؤں کی لائبریری • Islamic Books</span>
              </div>
              <h2 className="section-title-editorial" style={{ margin: '0 0 6px', textAlign: 'left' }}>
                Islamic Books, Namaz & <span className="hero-gold-text">Duas Library</span>
              </h2>
              <p className="section-subtitle-editorial" style={{ margin: 0, textAlign: 'left' }}>
                مکمل نمازِ حنفی مع ترجمہ، اسلام کے چھ کلمے، حصن المسلم کی روزمرہ دعائیں، اور قرآنی ۴۰ ربنا دعائیں۔
              </p>
            </div>

            <Link
              to="/books"
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: 14,
                fontSize: '0.88rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <BookOpen size={16} />
              <span>تمام کتب دیکھیں • View All Books</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {/* Book Card 1: Namaz-e-Hanafi */}
            <Link
              to="/books/namaz-e-hanafi"
              className="card"
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                textDecoration: 'none',
                border: '1.5px solid var(--color-border)',
                background: 'var(--color-surface)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.25s ease',
                boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, #092c21 0%, #165b44 60%, #0d382b 100%)',
                  padding: '20px 20px 16px',
                  color: '#ffffff',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: 8, background: 'rgba(255,255,255,0.2)' }}>
                    نماز گائیڈ • Salah
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)' }}>
                    22 اذکار و احکام
                  </span>
                </div>
                <div className="arabic-text" style={{ fontSize: '1.35rem', color: '#ffffff', textAlign: 'left', direction: 'rtl' }}>
                  صَلَاةُ الحَنَفِيَّةِ مَعَ التَّرْجَمَةِ
                </div>
              </div>
              <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: '0 0 6px', fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-brand)' }}>
                    Namaz-e-Hanafi مع مکمل ترجمہ
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    تکبیرِ تحریمہ، ثناء، تشہد، درودِ ابراہیم، دعائے قنوت، نمازِ جنازہ اور تسبیحات مع اردو و انگریزی ترجمہ۔
                  </p>
                </div>
                <div style={{ marginTop: 14, fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-gold-700)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>کتاب کھولیں • Open Guide</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </Link>

            {/* Book Card 2: 6 Kalimas */}
            <Link
              to="/books/shash-kalimat"
              className="card"
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                textDecoration: 'none',
                border: '1.5px solid var(--color-border)',
                background: 'var(--color-surface)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.25s ease',
                boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, #451a03 0%, #854d0e 60%, #713f12 100%)',
                  padding: '20px 20px 16px',
                  color: '#ffffff',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: 8, background: 'rgba(255,255,255,0.2)' }}>
                    کلمے • Six Kalimas
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#fef08a' }}>
                    8 کلمات مع ایمان
                  </span>
                </div>
                <div className="arabic-text" style={{ fontSize: '1.35rem', color: '#ffffff', textAlign: 'left', direction: 'rtl' }}>
                  الكَلِمَاتُ السِّتَّةُ مَعَ التَّرْجَمَةِ
                </div>
              </div>
              <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: '0 0 6px', fontSize: '1.05rem', fontWeight: 800, color: '#854d0e' }}>
                    شش کلمے مع ترجمہ و فضیلت
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    کلمہ طیبہ، شہادت، تمجید، توحید، استغفار، ردِ کفر، اور ایمانِ مجمل و مفصل مع مکمل اعراب اور فضائل۔
                  </p>
                </div>
                <div style={{ marginTop: 14, fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-gold-700)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>کلمے پڑھیں • Read Kalimas</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </Link>

            {/* Book Card 3: Hisn al-Muslim */}
            <Link
              to="/books/hisn-al-muslim"
              className="card"
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                textDecoration: 'none',
                border: '1.5px solid var(--color-border)',
                background: 'var(--color-surface)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.25s ease',
                boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, #022c22 0%, #0f766e 60%, #115e59 100%)',
                  padding: '20px 20px 16px',
                  color: '#ffffff',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: 8, background: 'rgba(255,255,255,0.2)' }}>
                    مسنون دعائیں • Daily Duas
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#99f6e4' }}>
                    18 مسنون دعائیں
                  </span>
                </div>
                <div className="arabic-text" style={{ fontSize: '1.35rem', color: '#ffffff', textAlign: 'left', direction: 'rtl' }}>
                  حِصْنُ المُسْلِمِ مِنْ أَذْكَارِ الكِتَابِ
                </div>
              </div>
              <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: '0 0 6px', fontSize: '1.05rem', fontWeight: 800, color: '#0f766e' }}>
                    حصن المسلم: روزمرہ دعائیں
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    صبح و شام کے اذکار، کھانا، سفر، سونا، جاگنا، بیت الخلاء، مسجد اور پریشانی و غم سے نجات کی دعائیں۔
                  </p>
                </div>
                <div style={{ marginTop: 14, fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-gold-700)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>دعائیں دیکھیں • Open Duas</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </Link>

            {/* Book Card 4: 40 Rabbana Duas */}
            <Link
              to="/books/rabbana-duas"
              className="card"
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                textDecoration: 'none',
                border: '1.5px solid var(--color-border)',
                background: 'var(--color-surface)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.25s ease',
                boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #1e1b4b 100%)',
                  padding: '20px 20px 16px',
                  color: '#ffffff',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: 8, background: 'rgba(255,255,255,0.2)' }}>
                    قرآنی • 40 Rabbana
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#c7d2fe' }}>
                    قرآنِ پاک کی دعائیں
                  </span>
                </div>
                <div className="arabic-text" style={{ fontSize: '1.35rem', color: '#ffffff', textAlign: 'left', direction: 'rtl' }}>
                  الأَرْبَعُونَ رَبَّنَا مِنَ القُرْآنِ
                </div>
              </div>
              <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: '0 0 6px', fontSize: '1.05rem', fontWeight: 800, color: '#312e81' }}>
                    قرآنی ۴۰ ربنا دعائیں مع ترجمہ
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    قرآن مجید کی وہ مبارک دعائیں جو لفظ "ربنا" سے شروع ہوتی ہیں، سورت اور آیت کے مکمل حوالے کے ساتھ۔
                  </p>
                </div>
                <div style={{ marginTop: 14, fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-gold-700)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>ربنا دعائیں پڑھیں • Read Rabbana</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* ─── 3. "Explore the Quran" with 3D Colorful Card Showcase ─── */}
        <section style={{ marginBottom: 74, textAlign: 'center' }}>
          <h2 className="section-title-editorial">
            Explore the Quran
          </h2>
          <p className="section-subtitle-editorial">
            Browse by Surah or Juz and start your journey wherever you feel ready.
          </p>

          {/* Controls: Tab Switcher & View Mode */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
            {/* Surah / Juz toggle */}
            <div className="explore-toggle-pill" style={{ margin: 0 }}>
              <button
                onClick={() => {
                  setActiveTab('surah');
                  setShowcaseIndex(0);
                }}
                className={`explore-toggle-btn ${activeTab === 'surah' ? 'active' : ''}`}
              >
                Surah
              </button>
              <button
                onClick={() => {
                  setActiveTab('juz');
                  setShowcaseIndex(0);
                }}
                className={`explore-toggle-btn ${activeTab === 'juz' ? 'active' : ''}`}
              >
                Juz
              </button>
            </div>

            {/* View Mode Toggle: 3D Showcase vs Grid */}
            <div style={{
              display: 'inline-flex',
              background: 'rgba(212, 175, 55, 0.1)',
              padding: '3px',
              borderRadius: 9999,
              border: '1px solid rgba(212, 175, 55, 0.3)',
            }}>
              <button
                onClick={() => setShowcaseViewMode('3d')}
                style={{
                  padding: '6px 16px',
                  borderRadius: 9999,
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: showcaseViewMode === '3d' ? 'var(--color-brand)' : 'transparent',
                  color: showcaseViewMode === '3d' ? '#ffffff' : 'var(--color-text-muted)',
                  transition: 'all 0.2s ease',
                }}
              >
                ✨ 3D Showcase
              </button>
              <button
                onClick={() => setShowcaseViewMode('grid')}
                style={{
                  padding: '6px 16px',
                  borderRadius: 9999,
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: showcaseViewMode === 'grid' ? 'var(--color-brand)' : 'transparent',
                  color: showcaseViewMode === 'grid' ? '#ffffff' : 'var(--color-text-muted)',
                  transition: 'all 0.2s ease',
                }}
              >
                ▦ 6 Cards Grid
              </button>
            </div>
          </div>

          {/* Current Data Set (Surah or Juz) */}
          {(() => {
            const currentList = activeTab === 'surah' ? SURAH_SHOWCASE_DATA : JUZ_SHOWCASE_DATA;

            return (
              <>
                {showcaseViewMode === '3d' ? (
                  /* ─── 3D Showcase Stage with Animated Track & Popping Active Card ─── */
                  <div
                    className="showcase-stage-wrapper"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                  >
                    {/* Background Animated Conveyor Patti with Laser Beam */}
                    <div className="showcase-conveyor-track">
                      <div className="showcase-track-center-beam" />
                    </div>

                    {/* Left & Right Manual Navigation Buttons */}
                    <button
                      onClick={() => setShowcaseIndex((prev) => (prev - 1 + 6) % 6)}
                      aria-label="Previous Showcase Card"
                      style={{
                        position: 'absolute',
                        left: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 20,
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: 'rgba(15, 56, 44, 0.85)',
                        backdropFilter: 'blur(8px)',
                        border: '1.5px solid #d4af37',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <ChevronRight size={22} style={{ transform: 'rotate(180deg)' }} />
                    </button>

                    <button
                      onClick={() => setShowcaseIndex((prev) => (prev + 1) % 6)}
                      aria-label="Next Showcase Card"
                      style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 20,
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: 'rgba(15, 56, 44, 0.85)',
                        backdropFilter: 'blur(8px)',
                        border: '1.5px solid #d4af37',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <ChevronRight size={22} />
                    </button>

                    {/* 3D Viewport with 6 Cards positioned in 3D Perspective */}
                    <div className="showcase-carousel-viewport">
                      {currentList.map((item, idx) => {
                        const diff = (idx - showcaseIndex + 6) % 6;
                        let cardClass = 'showcase-card-3d ';
                        if (diff === 0) {
                          cardClass += 'showcase-card-active';
                        } else if (diff === 1) {
                          cardClass += 'showcase-card-next';
                        } else if (diff === 5) {
                          cardClass += 'showcase-card-prev';
                        } else if (diff <= 2) {
                          cardClass += 'showcase-card-hidden-right';
                        } else {
                          cardClass += 'showcase-card-hidden-left';
                        }

                        const theme = item.colorTheme;
                        const isCurrentActive = diff === 0;

                        return (
                          <div
                            key={item.number}
                            className={cardClass}
                            onClick={() => {
                              if (!isCurrentActive) {
                                setShowcaseIndex(idx);
                              }
                            }}
                            style={{
                              background: theme.gradient,
                              border: `2px solid ${theme.border}`,
                              boxShadow: isCurrentActive
                                ? `0 24px 60px rgba(0, 0, 0, 0.55), 0 0 35px ${theme.glow}`
                                : `0 10px 30px rgba(0, 0, 0, 0.35)`,
                            }}
                          >
                            {/* Card Top: Hex Badge Number & Tag Pill */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                              <div style={{
                                width: 42,
                                height: 42,
                                borderRadius: 12,
                                background: theme.badgeBg,
                                color: '#13281e',
                                fontWeight: 900,
                                fontSize: '1.15rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                border: '1.5px solid rgba(255,255,255,0.7)',
                              }}>
                                {item.number}
                              </div>

                              <div style={{
                                padding: '4px 12px',
                                borderRadius: 20,
                                background: 'rgba(0, 0, 0, 0.3)',
                                border: `1px solid ${theme.border}`,
                                color: theme.accent,
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                letterSpacing: '0.04em',
                                textTransform: 'uppercase',
                              }}>
                                {item.revelationType} • {item.numberOfAyahs} Ayahs
                              </div>
                            </div>

                            {/* Arabic Calligraphy Title */}
                            <div
                              className="arabic-text"
                              lang="ar"
                              style={{
                                fontSize: isCurrentActive ? '2.2rem' : '1.75rem',
                                color: theme.accent,
                                margin: '0 0 10px',
                                fontWeight: 800,
                                lineHeight: 1.25,
                                textShadow: '0 2px 14px rgba(0,0,0,0.6)',
                                transition: 'all 0.3s ease',
                              }}
                            >
                              {item.name}
                            </div>

                            {/* English Name & Translation */}
                            <div style={{ fontWeight: 800, fontSize: '1.35rem', color: '#ffffff', letterSpacing: '-0.01em', marginBottom: 4 }}>
                              {item.englishName}
                            </div>
                            <div style={{ fontSize: '0.92rem', color: 'rgba(255, 255, 255, 0.85)', marginBottom: 16 }}>
                              {item.englishNameTranslation}
                            </div>

                            {/* Opening Verse Teaser (visible in active card) */}
                            <div style={{
                              padding: '12px 14px',
                              borderRadius: 14,
                              background: 'rgba(0, 0, 0, 0.28)',
                              border: '1px dashed rgba(255, 255, 255, 0.25)',
                              marginBottom: 20,
                            }}>
                              <p className="arabic-text" lang="ar" style={{ fontSize: '1.08rem', color: theme.accent, margin: 0, lineHeight: 1.5 }}>
                                {item.teaser}
                              </p>
                            </div>

                            {/* Action Button */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: '0.8rem', color: theme.accent, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Sparkles size={14} className="shiny-icon" /> {theme.colorName}
                              </span>

                              <Link
                                to={activeTab === 'surah' ? `/surah/${item.number}` : `/juz/${item.number}`}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 8,
                                  padding: '9px 20px',
                                  borderRadius: 9999,
                                  background: '#ffffff',
                                  color: '#0f2f24',
                                  fontWeight: 800,
                                  fontSize: '0.88rem',
                                  textDecoration: 'none',
                                  boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                                  transition: 'all 0.15s ease',
                                }}
                              >
                                <span>{activeTab === 'surah' ? 'Read Surah' : 'Open Juz'}</span>
                                <ArrowRight size={15} />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* 6 Dots / Pills Indicators for the active opened card */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 18 }}>
                      {currentList.map((item, idx) => {
                        const isCur = idx === showcaseIndex;
                        return (
                          <button
                            key={item.number}
                            onClick={() => setShowcaseIndex(idx)}
                            aria-label={`Go to ${item.englishName}`}
                            style={{
                              height: 10,
                              width: isCur ? 36 : 10,
                              borderRadius: 9999,
                              background: isCur ? item.colorTheme.border : 'rgba(212, 175, 55, 0.25)',
                              border: isCur ? `1.5px solid ${item.colorTheme.border}` : 'none',
                              boxShadow: isCur ? `0 0 10px ${item.colorTheme.glow}` : 'none',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              padding: 0,
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* ─── All 6 Cards Grid (Vibrant & Colorful) ─── */
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 18, marginBottom: 32, textAlign: 'left' }}>
                    {currentList.map((item) => {
                      const theme = item.colorTheme;
                      return (
                        <Link
                          key={item.number}
                          to={activeTab === 'surah' ? `/surah/${item.number}` : `/juz/${item.number}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '20px 22px',
                            borderRadius: 18,
                            background: theme.gradient,
                            border: `2px solid ${theme.border}`,
                            boxShadow: `0 8px 24px rgba(0,0,0,0.2), 0 0 16px ${theme.glow}`,
                            color: '#ffffff',
                            textDecoration: 'none',
                            transition: 'all 0.25s ease',
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px) scale(1.02)';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.transform = '';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{
                              width: 44,
                              height: 44,
                              borderRadius: 12,
                              background: theme.badgeBg,
                              color: '#13281e',
                              fontWeight: 900,
                              fontSize: '1.1rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                              border: '1.5px solid rgba(255,255,255,0.7)',
                            }}>
                              {item.number}
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ffffff', marginBottom: 2 }}>
                                {item.englishName}
                              </div>
                              <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                                {item.englishNameTranslation}
                              </div>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div className="arabic-text" lang="ar" style={{ fontSize: '1.35rem', color: theme.accent, fontWeight: 700, marginBottom: 4 }}>
                              {item.name}
                            </div>
                            <div style={{ fontSize: '0.76rem', color: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                              <span>Open</span>
                              <ChevronRight size={14} />
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            );
          })()}

          {/* Bottom link to view all 114 Surahs or 30 Juz */}
          <div style={{ marginTop: 24 }}>
            <Link
              to={activeTab === 'surah' ? '/quran' : '/juz'}
              className="btn-outline-gold"
            >
              <span>View all {activeTab === 'surah' ? '114 Surahs' : '30 Juz'}</span>
              <ArrowRight size={15} />
            </Link>
          </div>
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
