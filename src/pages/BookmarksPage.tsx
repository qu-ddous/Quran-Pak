import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, ExternalLink } from 'lucide-react';
import { getBookmarks, removeBookmark } from '../db/userDb';
import { useToast } from '../context/ToastContext';
import type { Bookmark as BookmarkType } from '../db/userDb';
import { LoadingSpinner, EmptyState, PageHeader } from '../components/ui/SharedComponents';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    document.title = 'Bookmarks — Noor Quran';
    getBookmarks().then(setBookmarks).finally(() => setLoading(false));
  }, []);

  const handleRemove = async (id: string) => {
    await removeBookmark(id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    showToast('Bookmark removed', 'info');
  };

  if (loading) return <LoadingSpinner text="Loading bookmarks…" />;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 64px' }}>
      <PageHeader
        title="Bookmarks"
        subtitle="Your saved ayahs. Bookmarks are stored on this device only and persist between visits."
      />

      {bookmarks.length === 0 ? (
        <EmptyState
          title="No bookmarks yet"
          message="Open any Surah and tap 'Bookmark' on an ayah to save it here. Bookmarks stay saved after you close your browser."
          icon={<Bookmark size={40} style={{ color: 'var(--color-text-muted)', opacity: 0.4 }} aria-hidden="true" />}
        />
      ) : (
        <>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: 20 }}>
            {bookmarks.length} saved {bookmarks.length === 1 ? 'ayah' : 'ayahs'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {bookmarks.map((bm) => (
              <div key={bm.id} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 8, background: 'var(--color-primary-100)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Bookmark size={18} style={{ color: 'var(--color-brand)' }} aria-hidden="true" />
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-brand)', marginBottom: 4, fontSize: '0.875rem' }}>
                    {bm.surahEnglishName} ({bm.surahNumber}:{bm.ayahNumber})
                  </div>
                  <p className="arabic-text" lang="ar" style={{ fontSize: '1.1rem', margin: '0 0 8px', color: 'var(--color-text)', lineHeight: 1.6 }}>
                    {bm.ayahText}{bm.ayahText.length >= 80 ? '…' : ''}
                  </p>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    Saved {new Date(bm.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <Link
                    to={`/surah/${bm.surahNumber}#ayah-${bm.ayahNumber}`}
                    aria-label={`Open ${bm.surahEnglishName} ayah ${bm.ayahNumber}`}
                    className="btn-ghost"
                    style={{ padding: 8 }}
                  >
                    <ExternalLink size={14} aria-hidden="true" />
                  </Link>
                  <button
                    onClick={() => handleRemove(bm.id)}
                    aria-label={`Remove bookmark for ${bm.surahEnglishName} ayah ${bm.ayahNumber}`}
                    className="btn-ghost"
                    style={{ padding: 8, color: '#c0392b' }}
                  >
                    <Trash2 size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <p style={{ marginTop: 32, fontSize: '0.78rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        Bookmarks are stored in your browser's IndexedDB. They are not sent to any server and are only visible on this device.
        To clear all bookmarks, visit <Link to="/settings" style={{ color: 'var(--color-brand)', textDecoration: 'none' }}>Settings</Link>.
      </p>
    </div>
  );
}
