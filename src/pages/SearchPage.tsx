import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search, ExternalLink, AlertCircle, Sparkles, BookOpen,
  ArrowRight, X, Headphones, CheckCircle2, RotateCcw
} from 'lucide-react';
import {
  searchQuran, SEARCHABLE_EDITIONS, DEFAULT_TRANSLATION_EN,
  fetchSurahList
} from '../api/quranApi';
import { useSettings } from '../context/SettingsContext';
import { useAudio } from '../context/AudioContext';
import type { SearchMatch, SurahMeta } from '../types/quran';
import { LoadingSpinner, EmptyState } from '../components/ui/SharedComponents';

// Clean text for flexible transliteration comparisons
function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/^(surah|surat|soorah|chapter|para|juz)\s+/i, '')
    .replace(/[^a-z0-9]/gi, '');
}

// Parse "2:255" style references
function parseSurahAyahRef(query: string): { surah: number; ayah: number } | null {
  const match = query.trim().match(/^(\d{1,3})\s*[:\s,-]\s*(\d{1,3})$/);
  if (!match) return null;
  const s = parseInt(match[1], 10);
  const a = parseInt(match[2], 10);
  if (s >= 1 && s <= 114 && a >= 1) return { surah: s, ayah: a };
  return null;
}

// Famous passages and Quranic landmarks
const FAMOUS_ALIASES: Record<string, { surah: number; ayah: number; title: string }> = {
  'ayatulkursi': { surah: 2, ayah: 255, title: 'Ayatul Kursi (The Throne Verse)' },
  'ayatalkursi': { surah: 2, ayah: 255, title: 'Ayatul Kursi (The Throne Verse)' },
  'kursi': { surah: 2, ayah: 255, title: 'Ayatul Kursi (The Throne Verse)' },
  'amanarrasul': { surah: 2, ayah: 285, title: 'Amanar Rasul (Last Verses of Al-Baqarah)' },
  'amanarasul': { surah: 2, ayah: 285, title: 'Amanar Rasul (Last Verses of Al-Baqarah)' },
};

const SAMPLE_SEARCHES = [
  { label: 'Mercy (رحمة)', query: 'mercy' },
  { label: 'Patience (صبر)', query: 'patience' },
  { label: 'Paradise (جنة)', query: 'gardens' },
  { label: 'Light (نور)', query: 'light' },
  { label: 'Ayatul Kursi', query: 'Ayatul Kursi' },
  { label: 'Surah Yaseen', query: 'Yaseen' },
  { label: 'Surah Mulk', query: 'Mulk' },
  { label: 'Surah Kahf', query: 'Kahf' },
];

export default function SearchPage() {
  const { settings } = useSettings();
  const { playSurah } = useAudio();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [edition, setEdition] = useState(settings.translationEdition || DEFAULT_TRANSLATION_EN);
  const [allSurahs, setAllSurahs] = useState<SurahMeta[]>([]);
  const [results, setResults] = useState<SearchMatch[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const debounceRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    document.title = 'Search Holy Quran — Noor Quran';
    fetchSurahList().then(setAllSurahs).catch(() => {});
  }, []);

  // Sync debounced input
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setDebouncedQuery(query);
      if (query.trim()) {
        setSearchParams({ q: query.trim() });
      } else {
        setSearchParams({});
      }
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [query, setSearchParams]);

  // Check for direct reference (e.g. 2:255) or famous alias (e.g. Ayatul Kursi)
  const directRef = useMemo(() => {
    if (!debouncedQuery.trim()) return null;
    const direct = parseSurahAyahRef(debouncedQuery);
    if (direct) {
      return { surah: direct.surah, ayah: direct.ayah, title: `Surah ${direct.surah}, Verse ${direct.ayah}` };
    }
    const normalizedKey = normalize(debouncedQuery);
    if (FAMOUS_ALIASES[normalizedKey]) {
      return FAMOUS_ALIASES[normalizedKey];
    }
    return null;
  }, [debouncedQuery]);

  // Filter Surahs locally by name, transliteration, translation, or chapter number
  const matchingSurahs = useMemo(() => {
    const q = debouncedQuery.trim();
    if (!q || allSurahs.length === 0) return [];

    const normQ = normalize(q);
    const numQ = parseInt(q, 10);

    return allSurahs.filter((s) => {
      // Direct number match (e.g. searching "36" matches Surah 36)
      if (!isNaN(numQ) && s.number === numQ) return true;

      const normName = normalize(s.englishName);
      const normTrans = normalize(s.englishNameTranslation);

      // Exact or partial name match
      if (normName.includes(normQ) || normQ.includes(normName)) return true;
      if (normTrans.includes(normQ)) return true;

      // Arabic text match
      if (s.name.includes(q)) return true;

      // Common transliteration phonetics
      if (normQ.includes('yaseen') && normName.includes('yasin')) return true;
      if (normQ.includes('yasin') && normName.includes('yasin')) return true;
      if (normQ.includes('rehman') && normName.includes('rahman')) return true;
      if (normQ.includes('fatiha') && normName.includes('fatihah')) return true;
      if (normQ.includes('baqara') && normName.includes('baqarah')) return true;
      if (normQ.includes('waqia') && normName.includes('waqiah')) return true;

      return false;
    });
  }, [debouncedQuery, allSurahs]);

  // Main search function
  const doSearch = useCallback(async () => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed) {
      setResults(null);
      setError(null);
      return;
    }

    // If query is an exact number (1-114), prioritize showing the matched Surah
    const parsedNum = parseInt(trimmed, 10);
    if (!isNaN(parsedNum) && parsedNum >= 1 && parsedNum <= 114 && trimmed === parsedNum.toString()) {
      setResults([]);
      setTotalCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await searchQuran(trimmed, edition);
      setResults(data.matches || []);
      setTotalCount(data.count || (data.matches ? data.matches.length : 0));
    } catch (e: unknown) {
      console.warn('Search query error:', e);
      // Graceful fallback: If search returns no verses, set empty results rather than hard crash
      setResults([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, edition]);

  useEffect(() => {
    doSearch();
  }, [doSearch]);

  const selectedEditionInfo = SEARCHABLE_EDITIONS.find((t) => t.identifier === edition) || SEARCHABLE_EDITIONS[0];

  return (
    <div className="quran-page-container" style={{ paddingBottom: 100 }}>
      {/* ─── Panoramic Luxury Header Banner ─── */}
      <div className="quran-hero-banner hero-bg-search">
        <div className="quran-hero-overlay" />
        <div className="hero-glass-card">
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
            marginBottom: 20,
          }}>
            Search through Arabic verses, chapter names, classical English translations, and Urdu commentaries across all 6,236 Ayahs.
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
              <BookOpen size={14} className="shiny-icon" /> 114 Surahs & 6,236 Ayahs
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 9999,
              background: 'rgba(45, 106, 79, 0.16)',
              border: '1.5px solid var(--color-border-gold)',
              fontWeight: 800,
              fontSize: '0.85rem',
              color: 'var(--color-brand)',
            }}>
              <Sparkles size={14} className="shiny-icon" /> Smart Chapter & Verse Detection
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
              placeholder="Search chapters (e.g. Yaseen, Mulk), words (e.g. mercy), or verse (e.g. 2:255)…"
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
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Search Edition / Translation Selector */}
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
            {SEARCHABLE_EDITIONS.map((t) => (
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
                background: query.toLowerCase() === s.query.toLowerCase() ? 'var(--color-brand)' : 'var(--color-cream-100)',
                color: query.toLowerCase() === s.query.toLowerCase() ? '#ffffff' : 'var(--color-brand)',
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

      {/* ─── Direct Ayah Reference or Famous Landmark Match Card ─── */}
      {directRef && (
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
            <div style={{ fontSize: '0.8rem', color: '#fef08a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={16} /> Direct Passage Match
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 800 }}>
              {directRef.title}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#bce5cf', marginTop: 4 }}>
              Surah {directRef.surah}, Ayah {directRef.ayah} — Open directly in full reader mode with word-by-word recitations.
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
            <span>Open in Reader</span>
            <ExternalLink size={16} />
          </Link>
        </div>
      )}

      {/* ─── Matching Surahs (Chapters) Section ─── */}
      {matchingSurahs.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <BookOpen size={18} className="shiny-icon text-gold" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-brand)', margin: 0 }}>
              Matching Chapters ({matchingSurahs.length})
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 14 }}>
            {matchingSurahs.map((s) => (
              <div
                key={s.number}
                className="card"
                style={{
                  padding: '18px 20px',
                  borderRadius: 16,
                  border: '1.5px solid var(--color-border-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: 'var(--color-gold-500)',
                      color: '#143526',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      flexShrink: 0,
                    }}
                  >
                    #{s.number}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--color-brand)' }}>
                      Surah {s.englishName}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      "{s.englishNameTranslation}" • {s.numberOfAyahs} Ayahs
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => playSurah(s.number)}
                    className="btn-ghost"
                    style={{
                      padding: '7px 10px',
                      borderRadius: 10,
                      background: 'rgba(212, 175, 55, 0.12)',
                      border: '1px solid var(--color-border-gold)',
                      color: 'var(--color-brand)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '0.76rem',
                      fontWeight: 700,
                    }}
                    title={`Listen to Surah ${s.englishName}`}
                  >
                    <Headphones size={13} className="shiny-icon" />
                    <span>Listen</span>
                  </button>

                  <Link
                    to={`/surah/${s.number}`}
                    style={{
                      padding: '7px 12px',
                      borderRadius: 10,
                      background: 'var(--color-brand)',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span>Read</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── State Indicators ─── */}
      {loading && <LoadingSpinner text="Searching through the Holy Quran verses…" />}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 18, background: '#fff5f5', border: '1.5px solid #fed7d7', borderRadius: 14, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <AlertCircle size={20} style={{ color: '#c0392b', flexShrink: 0 }} />
            <span style={{ fontSize: '0.92rem', color: '#c0392b', fontWeight: 600 }}>{error}</span>
          </div>
          <button
            onClick={() => doSearch()}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              background: '#c0392b',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <RotateCcw size={14} /> Retry
          </button>
        </div>
      )}

      {/* Initial Landing State */}
      {!loading && !error && results === null && !debouncedQuery && (
        <EmptyState
          title="Begin Your Quran Search"
          message="Enter a search term above, type a Surah name (e.g. Yaseen, Mulk), or tap one of the suggested topics."
          icon={<Search size={44} style={{ color: 'var(--color-gold-500)', opacity: 0.6 }} />}
        />
      )}

      {/* ─── Matching Verses Results List ─── */}
      {!loading && !error && results && results.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--color-brand)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={18} className="shiny-icon text-gold" />
              Found <span style={{ color: 'var(--color-gold-600)' }}>{totalCount}</span> {totalCount === 1 ? 'verse' : 'verses'} matching "{debouncedQuery}"
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              in {selectedEditionInfo?.name}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
                    <span style={{ fontWeight: 800, color: 'var(--color-brand)', fontSize: '0.98rem' }}>
                      Surah {match.surah.englishName} ({match.surah.number}:{match.numberInSurah})
                    </span>
                  </div>

                  <Link
                    to={`/surah/${match.surah.number}#ayah-${match.numberInSurah}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      color: 'var(--color-gold-600)',
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Read in Context</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>

                <p style={{
                  margin: 0,
                  fontSize: '1.02rem',
                  lineHeight: 1.7,
                  color: 'var(--color-text)',
                  fontFamily: match.edition?.format === 'text' && match.edition?.language === 'ar' ? "'Noto Naskh Arabic', serif" : 'inherit',
                  direction: match.edition?.direction === 'rtl' ? 'rtl' : 'ltr',
                }}>
                  {match.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── No Results State ─── */}
      {!loading && !error && debouncedQuery && matchingSurahs.length === 0 && !directRef && results && results.length === 0 && (
        <EmptyState
          title={`No results found for "${debouncedQuery}"`}
          message={`We couldn't find any chapters or verses matching "${debouncedQuery}" in ${selectedEditionInfo?.name}. Try alternative keywords, search in Arabic script, or switch the translation edition.`}
          icon={<Compass size={44} style={{ color: 'var(--color-gold-500)', opacity: 0.6 }} />}
        />
      )}
    </div>
  );
}
