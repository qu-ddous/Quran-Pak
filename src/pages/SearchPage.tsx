import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ExternalLink, AlertCircle, Sparkles, BookOpen, ArrowRight, X } from 'lucide-react';
import { searchQuran, AVAILABLE_TRANSLATIONS, DEFAULT_TRANSLATION_EN } from '../api/quranApi';
import { useSettings } from '../context/SettingsContext';
import type { SearchMatch } from '../types/quran';
import { LoadingSpinner, EmptyState } from '../components/ui/SharedComponents';

// Parse "2:255" style references
function parseSurahAyahRef(query: string): { surah: number; ayah: number } | null {
  const match = query.trim().match(/^(\d{1,3}):(\d{1,3})$/);
  if (!match) return null;
  const s = parseInt(match[1], 10);
  const a = parseInt(match[2], 10);
  if (s >= 1 && s <= 114 && a >= 1) return { surah: s, ayah: a };
  return null;
}

const SAMPLE_SEARCHES = [
  { label: 'Mercy (رحمة)', query: 'mercy' },
  { label: 'Patience (صبر)', query: 'patience' },
  { label: 'Paradise (جنة)', query: 'gardens' },
  { label: 'Light (نور)', query: 'light' },
  { label: 'Ayatul Kursi', query: '2:255' },
  { label: 'Surah Yaseen', query: '36:1' },
];

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

  useEffect(() => { document.title = 'Search Holy Quran — Noor Quran'; }, []);

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
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 20px 100px' }}>
      {/* ─── Panoramic Luxury Header Banner ─── */}
      <div className="quran-hero-banner" style={{ padding: '40px 32px' }}>
        <div className="quran-hero-overlay" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 660 }}>
          <div style={{
            fontSize: '1.45rem',
            color: 'var(--color-gold-500)',
            fontFamily: "'Amiri', serif",
            fontWeight: 800,
            marginBottom: 8,
          }}>
            البحث في القرآن الكريم
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            color: 'var(--color-brand)',
            lineHeight: 1.15,
            margin: '0 0 12px',
          }}>
            Search the Noble Quran
          </h1>

          <p style={{
            fontSize: '1rem',
            lineHeight: 1.6,
            color: 'var(--color-text)',
            opacity: 0.9,
            marginBottom: 20,
          }}>
            Search through Arabic verses, classical English translations, and Urdu commentaries across all 6,236 Ayahs.
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
              <BookOpen size={14} className="shiny-icon" /> 6,236 Searchable Ayahs
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
              <Sparkles size={14} className="shiny-icon" /> Multilingual Support
            </span>
          </div>
        </div>
      </div>

      {/* ─── Search Controls Box ─── */}
      <div className="card" style={{ padding: '24px 28px', marginBottom: 28, borderRadius: 20, border: '2px solid var(--color-border-gold)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
          {/* Input field */}
          <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gold-500)' }} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search words, topics, or references (e.g. mercy, patience, 2:255)…"
              autoFocus
              style={{
                width: '100%',
                padding: '14px 40px 14px 44px',
                borderRadius: 12,
                border: '2px solid var(--color-border-gold)',
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Translation Edition Selector */}
          <select
            value={edition}
            onChange={(e) => setEdition(e.target.value)}
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              border: '2px solid var(--color-border-gold)',
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {AVAILABLE_TRANSLATIONS.map((t) => (
              <option key={t.identifier} value={t.identifier}>
                {t.englishName} ({t.language.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {/* Quick Sample Search Tags */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
            Suggested:
          </span>
          {SAMPLE_SEARCHES.map((s) => (
            <button
              key={s.label}
              onClick={() => setQuery(s.query)}
              style={{
                background: query === s.query ? 'var(--color-brand)' : 'var(--color-cream-100)',
                color: query === s.query ? '#ffffff' : 'var(--color-brand)',
                border: '1px solid var(--color-border)',
                borderRadius: 9999,
                padding: '4px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Direct Reference Match Card ─── */}
      {directRef && debouncedQuery && (
        <div
          style={{
            padding: '24px 28px',
            background: 'var(--gradient-emerald)',
            color: '#ffffff',
            borderRadius: 20,
            border: '2px solid var(--color-gold-500)',
            boxShadow: '0 12px 32px rgba(27,67,50,0.3)',
            marginBottom: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', color: '#fef08a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              Direct Ayah Jump
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 800 }}>
              Surah {directRef.surah}, Ayah {directRef.ayah}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#bce5cf', marginTop: 4 }}>
              Instantly open and recite this verse in full reader mode.
            </div>
          </div>

          <Link
            to={`/surah/${directRef.surah}#ayah-${directRef.ayah}`}
            className="btn-gold"
            style={{
              padding: '10px 22px',
              borderRadius: 12,
              fontWeight: 800,
              fontSize: '0.92rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              textDecoration: 'none',
            }}
          >
            <span>Open Ayah</span>
            <ExternalLink size={16} />
          </Link>
        </div>
      )}

      {/* ─── Results / State Indicators ─── */}
      {loading && <LoadingSpinner text="Searching through the Holy Quran…" />}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 18, background: '#fff5f5', border: '1.5px solid #fed7d7', borderRadius: 14, marginBottom: 24 }}>
          <AlertCircle size={20} style={{ color: '#c0392b', flexShrink: 0 }} />
          <span style={{ fontSize: '0.92rem', color: '#c0392b', fontWeight: 600 }}>{error}</span>
        </div>
      )}

      {!loading && !error && results === null && !debouncedQuery && (
        <EmptyState
          title="Begin Your Quran Search"
          message="Enter a search term above, choose a translation, or tap one of the suggested topics to explore verses."
          icon={<Search size={44} style={{ color: 'var(--color-gold-500)', opacity: 0.6 }} />}
        />
      )}

      {!loading && !error && results && !directRef && (
        <div>
          {/* Matches Counter */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-text)' }}>
              Found <span style={{ color: 'var(--color-accent)' }}>{totalCount}</span> {totalCount === 1 ? 'verse' : 'verses'} matching "{debouncedQuery}"
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              in {translationInfo?.name}
            </span>
          </div>

          {results.length === 0 ? (
            <EmptyState
              title="No verses found"
              message={`No exact matches found for "${debouncedQuery}" in ${translationInfo?.name}. Try alternative keywords or search in a different translation edition.`}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {results.map((match) => (
                <div
                  key={`${match.surah.number}:${match.numberInSurah}`}
                  className="card"
                  style={{
                    padding: '22px 26px',
                    borderRadius: 18,
                    border: '1.5px solid var(--color-border)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="icon-badge-gold" style={{ width: 34, height: 34, borderRadius: '50%', fontWeight: 800, fontSize: '0.82rem' }}>
                        {match.numberInSurah}
                      </div>
                      <span style={{ fontWeight: 800, color: 'var(--color-brand)', fontSize: '0.95rem' }}>
                        Surah {match.surah.englishName} ({match.surah.number}:{match.numberInSurah})
                      </span>
                    </div>

                    <Link
                      to={`/surah/${match.surah.number}#ayah-${match.numberInSurah}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        color: 'var(--color-accent)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        textDecoration: 'none',
                      }}
                    >
                      <span>Read in Context</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>

                  <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.7, color: 'var(--color-text)' }}>
                    {match.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
