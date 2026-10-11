import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ExternalLink, AlertCircle } from 'lucide-react';
import { searchQuran, AVAILABLE_TRANSLATIONS, DEFAULT_TRANSLATION_EN } from '../api/quranApi';
import { useSettings } from '../context/SettingsContext';
import type { SearchMatch } from '../types/quran';
import { LoadingSpinner, EmptyState, PageHeader } from '../components/ui/SharedComponents';

// Parse "2:255" style references
function parseSurahAyahRef(query: string): { surah: number; ayah: number } | null {
  const match = query.trim().match(/^(\d{1,3}):(\d{1,3})$/);
  if (!match) return null;
  const s = parseInt(match[1], 10);
  const a = parseInt(match[2], 10);
  if (s >= 1 && s <= 114 && a >= 1) return { surah: s, ayah: a };
  return null;
}

export default function SearchPage() {
  const { settings } = useSettings();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [edition, setEdition] = useState(settings.translationEdition || DEFAULT_TRANSLATION_EN);
  const [results, setResults] = useState<SearchMatch[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const debounceRef = useRef<number | undefined>(undefined);

  useEffect(() => { document.title = 'Search — Noor Quran'; }, []);

  // Debounce input
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setDebouncedQuery(query);
      if (query) setSearchParams({ q: query });
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [query, setSearchParams]);

  const doSearch = useCallback(async () => {
    if (!debouncedQuery.trim()) { setResults(null); return; }

    const ref = parseSurahAyahRef(debouncedQuery);
    if (ref) {
      // Direct navigation for Surah:Ayah reference
      setResults([]);
      setTotalCount(0);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await searchQuran(debouncedQuery, edition);
      setResults(data.matches);
      setTotalCount(data.count);
    } catch (e: unknown) {
      setError((e as Error).message ?? 'Search failed. Please try again.');
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, edition]);

  useEffect(() => { doSearch(); }, [doSearch]);

  const directRef = parseSurahAyahRef(debouncedQuery);
  const translationInfo = AVAILABLE_TRANSLATIONS.find(t => t.identifier === edition);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 64px' }}>
      <PageHeader
        title="Search the Quran"
        subtitle="Search Arabic text, English and Urdu translations. Try a word, phrase, or Surah:Ayah reference like 2:255."
      />

      {/* Search form */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. mercy, patience, 2:255…"
            aria-label="Search Quran"
            autoFocus
            style={{
              width: '100%', padding: '12px 12px 12px 40px',
              border: '2px solid var(--color-border)', borderRadius: 10,
              background: 'var(--color-surface)', color: 'var(--color-text)',
              fontSize: '1rem', fontFamily: 'inherit', outline: 'none',
              transition: 'border-color 0.15s',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--color-brand)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; }}
          />
        </div>
        <select
          value={edition}
          onChange={(e) => setEdition(e.target.value)}
          aria-label="Search in edition"
          style={{
            padding: '12px 14px', border: '2px solid var(--color-border)', borderRadius: 10,
            background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '0.875rem',
            fontFamily: 'inherit', cursor: 'pointer', outline: 'none',
          }}
        >
          {AVAILABLE_TRANSLATIONS.map((t) => (
            <option key={t.identifier} value={t.identifier}>{t.englishName}</option>
          ))}
        </select>
      </div>

      <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: 24 }}>
        Searching in: <strong>{translationInfo?.name ?? edition}</strong> ({translationInfo?.language ?? ''}) — {translationInfo?.name} translation
      </p>

      {/* Direct reference */}
      {directRef && debouncedQuery && (
        <div style={{ padding: '16px 20px', background: 'var(--color-primary-50)', border: '1.5px solid var(--color-primary-300)', borderRadius: 10, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--color-brand)', marginBottom: 4 }}>
                Direct reference: Surah {directRef.surah}, Ayah {directRef.ayah}
              </div>
              <Link
                to={`/surah/${directRef.surah}#ayah-${directRef.ayah}`}
                className="btn-primary"
                style={{ fontSize: '0.875rem', padding: '8px 16px', display: 'inline-flex' }}
              >
                Open this Ayah <ExternalLink size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {loading && <LoadingSpinner text="Searching…" />}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px', background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 8 }}>
          <AlertCircle size={16} style={{ color: '#c0392b', flexShrink: 0 }} aria-hidden="true" />
          <span style={{ fontSize: '0.875rem', color: '#c0392b' }}>{error}</span>
        </div>
      )}
      {!loading && !error && results === null && !debouncedQuery && (
        <EmptyState
          title="Start typing to search"
          message="Enter a word, phrase, or a Surah:Ayah reference like 2:255 to search the Quran."
          icon={<Search size={40} style={{ color: 'var(--color-text-muted)', opacity: 0.4 }} />}
        />
      )}
      {!loading && !error && results && !directRef && (
        <>
          <p style={{ marginBottom: 20, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            {totalCount > 0 ? `${totalCount} result${totalCount !== 1 ? 's' : ''} for "${debouncedQuery}"` : `No results for "${debouncedQuery}"`}
          </p>
          {results.length === 0 ? (
            <EmptyState
              title="No results found"
              message={`No matches found for "${debouncedQuery}" in ${translationInfo?.name ?? edition}. Try a different word or translation.`}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {results.map((match) => (
                <div key={`${match.surah.number}:${match.numberInSurah}`} className="card" style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-brand)', fontSize: '0.875rem' }}>
                      {match.surah.englishName} ({match.surah.number}:{match.numberInSurah})
                    </div>
                    <Link
                      to={`/surah/${match.surah.number}#ayah-${match.numberInSurah}`}
                      style={{ color: 'var(--color-brand)', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600, flexShrink: 0 }}
                    >
                      Open <ExternalLink size={12} aria-hidden="true" />
                    </Link>
                  </div>
                  <p style={{ margin: 0, lineHeight: 1.7, color: 'var(--color-text)', fontSize: '0.93rem' }}
                    dir={translationInfo?.direction === 'rtl' ? 'rtl' : 'ltr'}
                    lang={translationInfo?.language ?? 'en'}
                  >
                    {match.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
