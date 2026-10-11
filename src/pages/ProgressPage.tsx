import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock, Trash2, BookOpen, Bookmark, Sparkles,
  TrendingUp, Award, Compass, ArrowRight,
} from 'lucide-react';
import { getRecentHistory, clearHistory, getBookmarks, getNotes } from '../db/userDb';
import { useToast } from '../context/ToastContext';
import type { ReadingHistory } from '../db/userDb';
import { LoadingSpinner, EmptyState } from '../components/ui/SharedComponents';
import { JUZ_META } from '../types/quran';

export default function ProgressPage() {
  const [history, setHistory] = useState<ReadingHistory[]>([]);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [noteCount, setNoteCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    document.title = 'Quran Journey Analytics — Noor Quran';
    Promise.all([
      getRecentHistory(60).then(setHistory),
      getBookmarks().then((b) => setBookmarkCount(b.length)),
      getNotes().then((n) => setNoteCount(n.length)),
    ]).finally(() => setLoading(false));
  }, []);

  const handleClear = async () => {
    if (!window.confirm('Clear all reading history? This cannot be undone. Your bookmarks and notes will not be affected.')) return;
    await clearHistory();
    setHistory([]);
    showToast('Reading history cleared', 'info');
  };

  // Unique Surahs visited
  const uniqueSurahs = Array.from(new Set(history.map((h) => h.surahNumber)));
  const percentageCompleted = Math.min(100, Math.round((uniqueSurahs.length / 114) * 100));

  // Determine which Juz have been visited (based on surah coverage in JUZ_META)
  const visitedJuzSet = new Set<number>();
  uniqueSurahs.forEach((sNum) => {
    JUZ_META.forEach((juz) => {
      if (sNum >= juz.startSurah && sNum <= juz.endSurah) {
        visitedJuzSet.add(juz.number);
      }
    });
  });

  // Calculate activity distribution over last 7 days for the SVG bar chart
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayCounts = [0, 0, 0, 0, 0, 0, 0];
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  history.forEach((h) => {
    const diffDays = Math.floor((now - h.visitedAt) / oneDayMs);
    if (diffDays >= 0 && diffDays < 7) {
      const d = new Date(h.visitedAt).getDay();
      dayCounts[d] += 1;
    }
  });

  const maxDayCount = Math.max(...dayCounts, 1);

  // SVG Radial Ring Calculations
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentageCompleted / 100) * circumference;

  if (loading) return <LoadingSpinner text="Computing your Quran journey analytics…" />;

  return (
    <div className="quran-page-container" style={{ paddingBottom: 100 }}>
      {/* ─── Panoramic Luxury Header Banner ─── */}
      <div className="quran-hero-banner hero-bg-progress">
        <div className="quran-hero-overlay" />
        <div className="hero-glass-card">
          <div style={{
            fontSize: '1.45rem',
            color: 'var(--color-gold-500)',
            fontFamily: "'Amiri', serif",
            fontWeight: 800,
            marginBottom: 8,
          }}>
            مسيرة القراءة والختمة المباركة
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            color: 'var(--color-brand)',
            lineHeight: 1.15,
            margin: '0 0 12px',
          }}>
            Reading Journey &amp; Analytics
          </h1>

          <p style={{
            fontSize: '1rem',
            lineHeight: 1.6,
            color: 'var(--color-text)',
            opacity: 0.9,
            marginBottom: 20,
          }}>
            Real-time, authentic spiritual analytics tracked strictly from your verified reading sessions. Gain insights into your Khatm progress, chapter coverage, and continuous habits.
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
              <Award size={15} className="shiny-icon" /> {uniqueSurahs.length} of 114 Surahs Explored
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 9999,
              background: 'rgba(45, 106, 79, 0.16)',
              border: '1.5px solid var(--color-primary-300)',
              fontWeight: 800,
              fontSize: '0.85rem',
              color: 'var(--color-brand)',
            }}>
              <TrendingUp size={15} className="shiny-icon" /> {history.length} Reading Sessions
            </span>
          </div>
        </div>
      </div>

      {/* ─── Top 4 Metric Cards ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
        <div className="card" style={{ padding: '22px 24px', borderRadius: 18, border: '1.5px solid var(--color-border-gold)', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="icon-badge-gold" style={{ width: 48, height: 48, borderRadius: 14 }}>
            <BookOpen size={22} className="shiny-icon" />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-brand)', lineHeight: 1 }}>
              {uniqueSurahs.length} <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>/ 114</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
              Surahs Read
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '22px 24px', borderRadius: 18, border: '1.5px solid var(--color-border-gold)', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="icon-badge-gold" style={{ width: 48, height: 48, borderRadius: 14 }}>
            <Clock size={22} className="shiny-icon" />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-brand)', lineHeight: 1 }}>
              {history.length}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
              Logged Sessions
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '22px 24px', borderRadius: 18, border: '1.5px solid var(--color-border-gold)', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="icon-badge-gold" style={{ width: 48, height: 48, borderRadius: 14 }}>
            <Bookmark size={22} className="shiny-icon" />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-brand)', lineHeight: 1 }}>
              {bookmarkCount}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
              Saved Ayahs
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '22px 24px', borderRadius: 18, border: '1.5px solid var(--color-border-gold)', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="icon-badge-gold" style={{ width: 48, height: 48, borderRadius: 14 }}>
            <Sparkles size={22} className="shiny-icon" />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-brand)', lineHeight: 1 }}>
              {noteCount}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
              Personal Reflections
            </div>
          </div>
        </div>
      </div>

      {/* ─── Graphical Visualizations Deck ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 24, marginBottom: 28 }} className="progress-charts-grid">
        {/* Chart 1: Radial Khatm Completion Gauge */}
        <div className="card" style={{ padding: '28px', borderRadius: 20, border: '1.5px solid var(--color-border-gold)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--color-brand)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Compass size={18} className="shiny-icon" /> Khatm Completion Gauge
            </h2>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-gold-500)', background: 'rgba(212, 175, 55, 0.15)', padding: '3px 10px', borderRadius: 9999 }}>
              {percentageCompleted}% Completed
            </span>
          </div>

          {/* SVG Radial Gauge */}
          <div style={{ position: 'relative', width: 160, height: 160, margin: '14px 0' }}>
            <svg width="160" height="160" viewBox="0 0 160 160">
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="var(--color-cream-200)"
                strokeWidth="14"
              />
              {/* Active Progress Ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="url(#emeraldGoldGradient)"
                strokeWidth="14"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="progress-ring-circle"
              />
              {/* Gradient Definition */}
              <defs>
                <linearGradient id="emeraldGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Content */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--color-brand)', lineHeight: 1 }}>
                {percentageCompleted}%
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 700, marginTop: 4 }}>
                KHATM PROGRESS
              </span>
            </div>
          </div>

          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
            {114 - uniqueSurahs.length > 0
              ? `${114 - uniqueSurahs.length} chapters remaining to achieve complete Quran recitation.`
              : 'Mubarak! You have visited and reflected upon all 114 Surahs of the Noble Quran.'}
          </p>
        </div>

        {/* Chart 2: 7-Day Reading Frequency Bar Chart */}
        <div className="card" style={{ padding: '28px', borderRadius: 20, border: '1.5px solid var(--color-border-gold)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--color-brand)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={18} className="shiny-icon" /> Weekly Reading Activity
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Past 7 Days
            </span>
          </div>

          {/* SVG Bar Chart */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, padding: '20px 10px 10px', minHeight: 160 }}>
            {daysOfWeek.map((day, idx) => {
              const count = dayCounts[idx];
              const heightPercent = Math.max(12, Math.round((count / maxDayCount) * 100));
              return (
                <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: 8 }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: count > 0 ? 'var(--color-gold-500)' : 'var(--color-text-muted)' }}>
                    {count}
                  </span>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: 32,
                      height: `${heightPercent}px`,
                      borderRadius: '8px 8px 4px 4px',
                      background: count > 0 ? 'var(--gradient-emerald)' : 'var(--color-cream-200)',
                      border: count > 0 ? '1px solid var(--color-border-gold)' : 'none',
                      boxShadow: count > 0 ? '0 4px 12px rgba(27,67,50,0.2)' : 'none',
                      transition: 'all 0.5s ease',
                    }}
                    title={`${day}: ${count} reading sessions`}
                  />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            <span>Consistent daily recitation fosters tranquil contemplation.</span>
          </div>
        </div>
      </div>

      {/* ─── 30 Holy Juz Matrix Heatmap ─── */}
      <div className="card" style={{ padding: '28px', borderRadius: 20, border: '1.5px solid var(--color-border-gold)', marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 4px', color: 'var(--color-brand)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={18} className="shiny-icon" /> 30 Juz Exploration Matrix
            </h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              Interactive holy map of all 30 Paras. Visited portions illuminate in royal emerald. Tap any tile to open that Juz.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: 'var(--gradient-emerald)', border: '1px solid var(--color-border-gold)' }} />
              <span>Visited ({visitedJuzSet.size})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: 'var(--color-cream-100)', border: '1px solid var(--color-border)' }} />
              <span>Unread ({30 - visitedJuzSet.size})</span>
            </div>
          </div>
        </div>

        {/* 30 Juz Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 1fr))', gap: 10 }}>
          {Array.from({ length: 30 }, (_, i) => i + 1).map((juzNum) => {
            const isVisited = visitedJuzSet.has(juzNum);
            return (
              <Link
                key={juzNum}
                to={`/juz/${juzNum}`}
                className="juz-heatmap-cell"
                style={{
                  background: isVisited ? 'var(--gradient-emerald)' : 'var(--color-surface)',
                  color: isVisited ? '#ffffff' : 'var(--color-text)',
                  border: isVisited ? '1.5px solid var(--color-gold-500)' : '1px solid var(--color-border)',
                  boxShadow: isVisited ? '0 4px 12px rgba(27,67,50,0.3)' : 'none',
                }}
                title={`Juz ${juzNum} — ${isVisited ? 'Visited' : 'Not yet opened'}`}
              >
                <span style={{ fontSize: '0.7rem', opacity: isVisited ? 0.85 : 0.5 }}>JUZ</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 900, color: isVisited ? '#fef08a' : 'inherit' }}>{juzNum}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ─── Recent History Timeline ─── */}
      <div className="card" style={{ padding: '28px', borderRadius: 20, border: '1.5px solid var(--color-border-gold)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--color-brand)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={18} className="shiny-icon" /> Recent Quran Visits Timeline
          </h2>
          {history.length > 0 && (
            <button
              onClick={handleClear}
              className="btn-ghost"
              style={{ color: '#dc2626', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Trash2 size={14} /> Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <EmptyState
            title="No reading logs yet"
            message="As you explore and recite Surahs, your exact timeline will automatically populate here so you can seamlessly continue your spiritual journey."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {history.slice(0, 15).map((item) => (
              <Link
                key={item.key}
                to={`/surah/${item.surahNumber}#ayah-${item.ayahNumber}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    padding: '14px 18px',
                    borderRadius: 14,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 14,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-gold-500)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.transform = '';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: 'var(--gradient-emerald)',
                        color: '#fef08a',
                        fontWeight: 900,
                        fontSize: '0.95rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 4px 10px rgba(27,67,50,0.2)',
                      }}
                    >
                      {item.surahNumber}
                    </div>

                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-brand)' }}>
                        Surah {item.surahNumber}, Ayah {item.ayahNumber}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {new Date(item.visitedAt).toLocaleDateString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-accent)', fontWeight: 700, fontSize: '0.82rem' }}>
                    <span>Continue</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
