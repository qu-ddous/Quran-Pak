import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, Clock, Trash2, BookOpen } from 'lucide-react';
import { getRecentHistory, clearHistory, getBookmarks, getNotes } from '../db/userDb';
import { useToast } from '../context/ToastContext';
import type { ReadingHistory } from '../db/userDb';
import { LoadingSpinner, EmptyState, PageHeader } from '../components/ui/SharedComponents';

export default function ProgressPage() {
  const [history, setHistory] = useState<ReadingHistory[]>([]);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [noteCount, setNoteCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    document.title = 'Reading Progress — Noor Quran';
    Promise.all([
      getRecentHistory(50).then(setHistory),
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

  // Get unique Surahs read
  const uniqueSurahs = [...new Set(history.map((h) => h.surahNumber))];

  if (loading) return <LoadingSpinner text="Loading progress…" />;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 64px' }}>
      <PageHeader
        title="Reading Progress"
        subtitle="Your actual reading history based on Surahs and Ayahs you have opened. No fake streaks or invented stats."
      />

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Surahs Visited', value: uniqueSurahs.length, icon: BookOpen, max: 114 },
          { label: 'Sessions Recorded', value: history.length, icon: Clock },
          { label: 'Bookmarks', value: bookmarkCount, icon: BarChart2 },
          { label: 'Notes', value: noteCount, icon: BarChart2 },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="card" style={{ padding: '16px 20px', textAlign: 'center' }}>
            <Icon size={20} style={{ color: 'var(--color-brand)', marginBottom: 8 }} aria-hidden="true" />
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Surah progress bar */}
      {uniqueSurahs.length > 0 && (
        <div className="card" style={{ padding: '20px', marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Surahs Explored</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-brand)', fontWeight: 600 }}>{uniqueSurahs.length} / 114</span>
          </div>
          <div style={{ height: 8, background: 'var(--color-cream-200)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%', background: 'var(--color-brand)',
              width: `${(uniqueSurahs.length / 114) * 100}%`,
              borderRadius: 4, transition: 'width 0.5s ease',
            }} role="progressbar" aria-valuenow={uniqueSurahs.length} aria-valuemin={0} aria-valuemax={114} />
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 8, marginBottom: 0 }}>
            Based on actual pages visited. Progress is calculated from your reading history, not from quiz completion or estimates.
          </p>
        </div>
      )}

      {/* Recent history */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Recent History</h2>
        {history.length > 0 && (
          <button onClick={handleClear} className="btn-ghost" style={{ color: '#c0392b', fontSize: '0.8rem' }}>
            <Trash2 size={14} aria-hidden="true" /> Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <EmptyState
          title="No reading history yet"
          message="Start reading any Surah — your visits will be tracked here so you can continue where you left off."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {history.map((item) => (
            <Link
              key={item.key}
              to={`/surah/${item.surahNumber}#ayah-${item.ayahNumber}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                className="card"
                style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, transition: 'transform 0.15s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = ''; }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 8, background: 'var(--color-primary-100)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-brand)', flexShrink: 0,
                }}>
                  {item.surahNumber}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text)' }}>
                    Surah {item.surahNumber}, Ayah {item.ayahNumber}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    {new Date(item.visitedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
