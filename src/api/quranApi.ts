/**
 * Al Quran Cloud API Adapter
 *
 * Data Source: Al Quran Cloud REST API v1
 * Base URL: https://api.alquran.cloud/v1
 * Documentation: https://alquran.cloud/api
 * Maintained by: Islamic Network (https://islamic.network)
 * License: Free to use; no API key required for reading endpoints.
 *          Audio CDN usage subject to Islamic Network terms.
 *
 * Arabic Quran text editions served are derived from standard scholarly
 * Quran manuscripts. The Uthmani text (quran-uthmani) is the default.
 * The API does NOT alter Quran text. All text is returned as-is from
 * the canonical Unicode representation.
 *
 * ⚠️  IMPORTANT: Never fabricate, modify, or generate Quran text.
 *     Always fetch from this API or a verified dataset.
 */

import type {
  ApiResponse,
  Ayah,
  Edition,
  SearchResult,
  Surah,
  SurahMeta,
} from '../types/quran';

const BASE_URL = 'https://api.alquran.cloud/v1';

/** Default Arabic text edition — Uthmani script */
export const ARABIC_EDITION = 'quran-uthmani';

/** Default English translation — Abdullah Yusuf Ali (public domain) */
export const DEFAULT_TRANSLATION_EN = 'en.yusufali';

/** Available text translations with metadata */
export const AVAILABLE_TRANSLATIONS: Edition[] = [
  {
    identifier: 'en.yusufali',
    language: 'en',
    name: 'Abdullah Yusuf Ali',
    englishName: 'Yusuf Ali',
    format: 'text',
    type: 'translation',
    direction: 'ltr',
  },
  {
    identifier: 'en.sahih',
    language: 'en',
    name: 'Saheeh International',
    englishName: 'Saheeh International',
    format: 'text',
    type: 'translation',
    direction: 'ltr',
  },
  {
    identifier: 'en.pickthall',
    language: 'en',
    name: 'Mohammed Marmaduke William Pickthall',
    englishName: 'Pickthall',
    format: 'text',
    type: 'translation',
    direction: 'ltr',
  },
  {
    identifier: 'ur.jalandhry',
    language: 'ur',
    name: 'Fateh Muhammad Jalandhry',
    englishName: 'Jalandhry (Urdu)',
    format: 'text',
    type: 'translation',
    direction: 'rtl',
  },
  {
    identifier: 'ur.ahmedali',
    language: 'ur',
    name: 'Ahmed Ali',
    englishName: 'Ahmed Ali (Urdu)',
    format: 'text',
    type: 'translation',
    direction: 'rtl',
  },
];

export const SEARCHABLE_EDITIONS: Edition[] = [
  {
    identifier: ARABIC_EDITION,
    language: 'ar',
    name: 'القرآن الكريم (Uthmani Text)',
    englishName: 'Arabic (Uthmani Original)',
    format: 'text',
    type: 'quran',
    direction: 'rtl',
  },
  ...AVAILABLE_TRANSLATIONS,
];

/** Fetch with error handling and timeout */
async function apiFetch<T>(path: string, signal?: AbortSignal): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    signal,
    headers: { 'Accept': 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${response.statusText} — ${url}`);
  }
  const json: ApiResponse<T> = await response.json();
  if (json.code !== 200) {
    throw new Error(`API returned non-200 status: ${json.status}`);
  }
  return json.data;
}

/** Fetch the list of all 114 Surahs */
export async function fetchSurahList(signal?: AbortSignal): Promise<SurahMeta[]> {
  return apiFetch<SurahMeta[]>('/surah', signal);
}

/** Fetch a single Surah in Arabic (Uthmani edition) */
export async function fetchSurahArabic(
  surahNumber: number,
  signal?: AbortSignal,
): Promise<Surah> {
  if (surahNumber < 1 || surahNumber > 114) {
    throw new Error(`Invalid Surah number: ${surahNumber}. Must be 1–114.`);
  }
  return apiFetch<Surah>(`/surah/${surahNumber}/${ARABIC_EDITION}`, signal);
}

/** Fetch a single Surah in a given translation edition */
export async function fetchSurahTranslation(
  surahNumber: number,
  editionIdentifier: string,
  signal?: AbortSignal,
): Promise<Surah> {
  if (surahNumber < 1 || surahNumber > 114) {
    throw new Error(`Invalid Surah number: ${surahNumber}. Must be 1–114.`);
  }
  return apiFetch<Surah>(`/surah/${surahNumber}/${editionIdentifier}`, signal);
}

/** Fetch Arabic + translation together (two editions) */
export async function fetchSurahWithTranslation(
  surahNumber: number,
  editionIdentifier: string,
  signal?: AbortSignal,
): Promise<{ arabic: Surah; translation: Surah }> {
  const [arabic, translation] = await Promise.all([
    fetchSurahArabic(surahNumber, signal),
    fetchSurahTranslation(surahNumber, editionIdentifier, signal),
  ]);
  return { arabic, translation };
}

/** Fetch a single ayah in Arabic + audio */
export async function fetchAyahAudio(
  ayahNumber: number,
  reciterIdentifier: string,
  signal?: AbortSignal,
): Promise<Ayah> {
  return apiFetch<Ayah>(`/ayah/${ayahNumber}/${reciterIdentifier}`, signal);
}

/** Fetch all Surahs for a Juz (Arabic Uthmani) */
export async function fetchJuzArabic(
  juzNumber: number,
  signal?: AbortSignal,
): Promise<{ ayahs: Ayah[]; juz: number }> {
  if (juzNumber < 1 || juzNumber > 30) {
    throw new Error(`Invalid Juz number: ${juzNumber}. Must be 1–30.`);
  }
  return apiFetch<{ ayahs: Ayah[]; juz: number }>(
    `/juz/${juzNumber}/${ARABIC_EDITION}`,
    signal,
  );
}

/** Fetch Juz with translation */
export async function fetchJuzWithTranslation(
  juzNumber: number,
  editionIdentifier: string,
  signal?: AbortSignal,
): Promise<{ arabic: { ayahs: Ayah[]; juz: number }; translation: { ayahs: Ayah[]; juz: number } }> {
  const [arabic, translation] = await Promise.all([
    fetchJuzArabic(juzNumber, signal),
    apiFetch<{ ayahs: Ayah[]; juz: number }>(`/juz/${juzNumber}/${editionIdentifier}`, signal),
  ]);
  return { arabic, translation };
}

/** Search the Quran in a given edition with 404 resilience and auto-language detection */
export async function searchQuran(
  query: string,
  edition: string = DEFAULT_TRANSLATION_EN,
  signal?: AbortSignal,
): Promise<SearchResult> {
  const clean = query.trim();
  if (!clean) {
    return { count: 0, matches: [] };
  }

  // Detect if query contains Arabic script
  const isArabic = /[\u0600-\u06FF]/.test(clean);
  let targetEdition = edition;
  if (isArabic && (edition.startsWith('en.') || !edition)) {
    targetEdition = ARABIC_EDITION;
  }

  const encoded = encodeURIComponent(clean);
  const url = `${BASE_URL}/search/${encoded}/all/${targetEdition}`;

  try {
    const response = await fetch(url, {
      signal,
      headers: { 'Accept': 'application/json' },
    });

    // Al Quran Cloud returns 404 when no verses match the search term
    if (response.status === 404) {
      return { count: 0, matches: [] };
    }

    if (!response.ok) {
      throw new Error(`Search request failed with status ${response.status}`);
    }

    const json = await response.json();
    if (json.code === 200 && json.data) {
      return json.data;
    }
    if (json.code === 404) {
      return { count: 0, matches: [] };
    }
    return { count: 0, matches: [] };
  } catch (err: unknown) {
    if ((err as Error).name === 'AbortError') throw err;
    if ((err as Error).message?.includes('404')) {
      return { count: 0, matches: [] };
    }
    throw err;
  }
}

/** Fetch list of available editions from the API */
export async function fetchEditions(signal?: AbortSignal): Promise<Edition[]> {
  return apiFetch<Edition[]>('/edition', signal);
}

const SURAH_AUDIO_MAP: Record<string, string> = {
  'ar.alafasy': 'https://server8.mp3quran.net/afs/',
  'ar.abdurrahmaansudais': 'https://server11.mp3quran.net/sds/',
  'ar.husary': 'https://server13.mp3quran.net/husr/',
  'ar.minshawi': 'https://server10.mp3quran.net/minsh/',
  'ar.maher': 'https://server12.mp3quran.net/maher/',
  'ar.basit': 'https://server7.mp3quran.net/basit/',
  'ar.ghamadi': 'https://server7.mp3quran.net/s_gmd/',
};

const VERSE_AUDIO_MAP: Record<string, string> = {
  'ar.alafasy': 'https://everyayah.com/data/Alafasy_128kbps/',
  'ar.abdurrahmaansudais': 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/',
  'ar.husary': 'https://everyayah.com/data/Husary_128kbps/',
  'ar.minshawi': 'https://everyayah.com/data/Minshawy_Murattal_128kbps/',
  'ar.maher': 'https://everyayah.com/data/MaherAlMuaiqly128kbps/',
  'ar.basit': 'https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/',
  'ar.ghamadi': 'https://everyayah.com/data/Ghamadi_40kbps/',
};

/** Build audio URL for a given global ayah number and reciter edition */
export function buildAudioUrl(
  globalAyahNumber: number,
  reciterIdentifier: string,
  surahNumber?: number,
  ayahNumberInSurah?: number,
): string {
  if (surahNumber && ayahNumberInSurah) {
    const s = String(surahNumber).padStart(3, '0');
    const a = String(ayahNumberInSurah).padStart(3, '0');
    const base = VERSE_AUDIO_MAP[reciterIdentifier];
    if (base) {
      return `${base}${s}${a}.mp3`;
    }
  }
  return `https://cdn.islamic.network/quran/audio/128/${reciterIdentifier}/${globalAyahNumber}.mp3`;
}

/** Build audio URL for an entire Surah */
export function buildSurahAudioUrl(surahNumber: number, reciterIdentifier: string): string {
  const base = SURAH_AUDIO_MAP[reciterIdentifier] || 'https://server8.mp3quran.net/afs/';
  const padded = String(surahNumber).padStart(3, '0');
  return `${base}${padded}.mp3`;
}
