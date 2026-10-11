import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { fetchSurahList } from '../api/quranApi';
import type { SurahMeta } from '../types/quran';
import { LoadingSpinner, ErrorState, PageHeader } from '../components/ui/SharedComponents';

type RevelationType = 'all' | 'Meccan' | 'Medinan';

export default function QuranBrowserPage() {
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [filtered, setFiltered] = useState<SurahMeta[]>([]);
  const [query, setQuery] = useState('');
  const [revelation, setRevelation] = useState<RevelationType>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchSurahList()
      .then((data) => { setSurahs(data); setFiltered(data); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.title = 'Surah List — Noor Quran';
    load();
  }, [load]);

  useEffect(() => {
    const q = query.toLowerCase().trim();
    let result = surahs;
    if (q) {
      result = result.filter((s) =>
        s.englishName.toLowerCase().includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        s.name.includes(q) ||
        String(s.number).includes(q)
      );
    }
    if (revelation !== 'all') {
      result = result.filter((s) => s.revelationType === revelation);
    }
    setFiltered(result);
  }, [query, revelation, surahs]);

  if (loading) return <LoadingSpinner text="Loading Surah list…" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px 64px' }}>
      <PageHeader
        title="Quran — All 114 Surahs"
        arabic="القرآن الكريم"
        subtitle="Browse and read all Surahs from the Noble Quran. Arabic text and translations sourced from Al Quran Cloud (api.alquran.cloud)."
      />

      {/* Search & Filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, number, or translation…"
            aria-label="Search Surahs"
            style={{
              width: '100%', padding: '10px 12px 10px 36px',
              border: '1.5px solid var(--color-border)', borderRadius: 8,
              background: 'var(--color-surface)', color: 'var(--color-text)',
              fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none',
              transition: 'border-color 0.15s',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--color-brand)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={16} style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
          <select
            value={revelation}
            onChange={(e) => setRevelation(e.target.value as RevelationType)}
            aria-label="Filter by revelation type"
            style={{
              padding: '10px 14px', border: '1.5px solid var(--color-border)', borderRadius: 8,
              background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '0.875rem',
              fontFamily: 'inherit', cursor: 'pointer', outline: 'none',
            }}
          >
            <option value="all">All revelations</option>
            <option value="Meccan">Meccan</option>
            <option value="Medinan">Medinan</option>
          </select>
        </div>
      </div>

      {/* Result count */}
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: 20 }}>
        {filtered.length} {filtered.length === 1 ? 'Surah' : 'Surahs'}
        {(query || revelation !== 'all') && ` matching your filter`}
      </p>

      {/* Surah Grid */}
      {filtered.length === 0 ? (
        <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          No Surahs found for "{query}". Try a different search.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
          {filtered.map((s) => (
            <Link key={s.number} to={`/surah/${s.number}`} style={{ textDecoration: 'none' }}>
              <div className="surah-card-emerald">
                {/* Number Badge */}
                <div className="surah-card-number-badge">
                  {s.number}
                </div>

                {/* English Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff', letterSpacing: '-0.01em', marginBottom: 2 }}>
                    {s.englishName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#bce5cf', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span>{s.numberOfAyahs} Ayahs</span>
                    <span>•</span>
                    <span>{s.revelationType}</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#8ed1ae', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    "{s.englishNameTranslation}"
                  </div>
                </div>

                {/* Glowing Golden Arabic Name */}
                <div className="surah-card-arabic" lang="ar">
                  {s.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Attribution */}
      <p style={{ marginTop: 40, fontSize: '0.8rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        Surah metadata sourced from <a href="https://api.alquran.cloud/v1/surah" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-brand)', textDecoration: 'none' }}>Al Quran Cloud API v1</a> (Islamic Network). See <Link to="/sources" style={{ color: 'var(--color-brand)', textDecoration: 'none' }}>Sources</Link> for full attribution.
      </p>
    </div>
  );
}
