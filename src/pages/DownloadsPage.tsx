import { useEffect, useState, useCallback } from 'react';
import { Download, Trash2, HardDrive, WifiOff, CheckCircle } from 'lucide-react';
import {
  fetchSurahArabic,
  fetchSurahList,
  ARABIC_EDITION,
} from '../api/quranApi';
import {
  cacheSurah,
  getCachedSurahNumbers,
  removeCachedSurah,
  clearCachedSurahs,
} from '../db/userDb';
import { useToast } from '../context/ToastContext';
import type { SurahMeta } from '../types/quran';
import { LoadingSpinner, PageHeader } from '../components/ui/SharedComponents';

export default function DownloadsPage() {
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [cached, setCached] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<Set<number>>(new Set());
  const { showToast } = useToast();

  const refreshCached = useCallback(async () => {
    const nums = await getCachedSurahNumbers();
    setCached(new Set(nums));
  }, []);

  useEffect(() => {
    document.title = 'Downloads — Noor Quran';
    Promise.all([
      fetchSurahList().then(setSurahs),
      refreshCached(),
    ]).finally(() => setLoading(false));
  }, [refreshCached]);

  const downloadSurah = async (surahNumber: number) => {
    if (downloading.has(surahNumber)) return;
    setDownloading((prev) => new Set(prev).add(surahNumber));
    try {
      const data = await fetchSurahArabic(surahNumber);
      await cacheSurah(surahNumber, data);
      setCached((prev) => new Set(prev).add(surahNumber));
      showToast(`Surah ${surahNumber} cached for offline reading`, 'success');
    } catch {
      showToast('Download failed. Check your internet connection.', 'error');
    } finally {
      setDownloading((prev) => { const s = new Set(prev); s.delete(surahNumber); return s; });
    }
  };

  const removeCache = async (surahNumber: number) => {
    await removeCachedSurah(surahNumber);
    setCached((prev) => { const s = new Set(prev); s.delete(surahNumber); return s; });
    showToast(`Surah ${surahNumber} removed from cache`, 'info');
  };

  const clearAll = async () => {
    if (!window.confirm('Remove all cached Surah text from this device?')) return;
    await clearCachedSurahs();
    setCached(new Set());
    showToast('All cached Surahs cleared', 'info');
  };

  if (loading) return <LoadingSpinner text="Loading downloads…" />;

  const cachedCount = cached.size;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 64px' }}>
      <PageHeader
        title="Offline Downloads"
        subtitle="Cache Quran Arabic text for offline reading. Audio requires an internet connection (caching audio is not permitted under Al Quran Cloud CDN terms)."
      />

      {/* Status banner */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, padding: '16px 20px', background: 'var(--color-primary-50)', border: '1px solid var(--color-primary-300)', borderRadius: 10, marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <HardDrive size={18} style={{ color: 'var(--color-brand)' }} aria-hidden="true" />
          <span style={{ fontWeight: 700, color: 'var(--color-brand)' }}>{cachedCount} Surahs cached</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          <WifiOff size={14} aria-hidden="true" />
          Cached text is readable without internet
        </div>
        {cachedCount > 0 && (
          <button onClick={clearAll} className="btn-ghost" style={{ marginLeft: 'auto', color: '#c0392b', fontSize: '0.8rem' }}>
            <Trash2 size={14} aria-hidden="true" /> Clear all
          </button>
        )}
      </div>

      {/* Audio note */}
      <div style={{ padding: '12px 16px', background: '#fff8e1', border: '1px solid #f59e0b', borderRadius: 8, marginBottom: 24, fontSize: '0.82rem', color: '#92400e' }}>
        <strong>Audio:</strong> Recitation audio is streamed from Al Quran Cloud CDN (Islamic Network). Caching audio locally is not permitted under their CDN terms of service. Audio always requires an internet connection.
      </div>

      {/* Surah list */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
        {surahs.map((s) => {
          const isCached = cached.has(s.number);
          const isDownloading = downloading.has(s.number);

          return (
            <div key={s.number} className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: isCached ? 'var(--color-primary-100)' : 'var(--color-cream-200)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.8rem', color: isCached ? 'var(--color-brand)' : 'var(--color-text-muted)', flexShrink: 0,
              }}>
                {s.number}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.englishName}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{s.numberOfAyahs} ayahs</div>
              </div>
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                {isCached ? (
                  <>
                    <CheckCircle size={14} style={{ color: 'var(--color-brand)', alignSelf: 'center' }} aria-label="Cached" />
                    <button
                      onClick={() => removeCache(s.number)}
                      aria-label={`Remove cached Surah ${s.englishName}`}
                      className="btn-ghost"
                      style={{ padding: 6, color: '#c0392b' }}
                    >
                      <Trash2 size={12} aria-hidden="true" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => downloadSurah(s.number)}
                    aria-label={`Cache Surah ${s.englishName} for offline reading`}
                    className="btn-ghost"
                    style={{ padding: 6, color: 'var(--color-brand)' }}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <div style={{ width: 14, height: 14, border: '2px solid var(--color-brand)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} aria-label="Downloading…" />
                    ) : (
                      <Download size={12} aria-hidden="true" />
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p style={{ marginTop: 32, fontSize: '0.78rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        Only Arabic text ({ARABIC_EDITION} edition) is cached. Translations are not cached.
        Cached data is stored in your browser's IndexedDB. Clearing browser data removes the cache.
      </p>
    </div>
  );
}
