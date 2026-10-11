// ─── Quran Data Types ────────────────────────────────────────────────────────
// All types map to the Al Quran Cloud API v1 (api.alquran.cloud)
// Source: https://alquran.cloud/api
// These types are used throughout the application to ensure type safety.

export interface SurahMeta {
  number: number;
  name: string;          // Arabic name e.g. الفاتحة
  englishName: string;   // Transliterated e.g. Al-Faatiha
  englishNameTranslation: string; // e.g. The Opening
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface Ayah {
  number: number;          // Global ayah number (1-6236)
  numberInSurah: number;   // Ayah number within Surah
  surah?: SurahMeta;
  text: string;            // Arabic text (or translated text depending on edition)
  audio?: string;          // URL to audio file
  audioSecondary?: string[];
  page?: number;
  juz?: number;
  manzil?: number;
  ruku?: number;
  hizbQuarter?: number;
  sajda?: boolean | SajdaDetail;
}

export interface SajdaDetail {
  id: number;
  recommended: boolean;
  obligatory: boolean;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  ayahs: Ayah[];
}

export interface Edition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: 'text' | 'audio';
  type: 'translation' | 'tafsir' | 'transliteration' | 'versebyverse' | 'quran';
  direction?: 'rtl' | 'ltr' | null;
}

export interface JuzInfo {
  number: number;
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
}

export interface SearchResult {
  count: number;
  matches: SearchMatch[];
}

export interface SearchMatch {
  number: number;
  text: string;
  surah: SurahMeta;
  numberInSurah: number;
  edition?: Edition;
}

export interface AyahWithTranslation {
  arabic: Ayah;
  translation?: Ayah;
  transliteration?: Ayah;
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  code: number;
  status: string;
  data: T;
}

// ─── Audio Reciter ────────────────────────────────────────────────────────────

export interface Reciter {
  identifier: string;         // Edition identifier for API
  name: string;               // Display name
  englishName: string;
  attribution: string;        // Full attribution text
  sourceUrl: string;          // URL to source / rights info
  format: 'mp3' | 'opus';
  bitrate?: string;
}

export const KNOWN_RECITERS: Reciter[] = [
  {
    identifier: 'ar.alafasy',
    name: 'Mishary Rashid Alafasy',
    englishName: 'Alafasy',
    attribution: 'Mishary Rashid Alafasy — via Al Quran Cloud CDN (Islamic Network)',
    sourceUrl: 'https://alquran.cloud',
    format: 'mp3',
  },
  {
    identifier: 'ar.abdurrahmaansudais',
    name: 'Abdurrahmaan As-Sudais',
    englishName: 'As-Sudais',
    attribution: 'Abdurrahmaan As-Sudais — via Al Quran Cloud CDN (Islamic Network)',
    sourceUrl: 'https://alquran.cloud',
    format: 'mp3',
  },
  {
    identifier: 'ar.husary',
    name: 'Mahmoud Khalil Al-Husary',
    englishName: 'Al-Husary',
    attribution: 'Mahmoud Khalil Al-Husary — via Al Quran Cloud CDN (Islamic Network)',
    sourceUrl: 'https://alquran.cloud',
    format: 'mp3',
  },
  {
    identifier: 'ar.minshawi',
    name: 'Mohamed Siddiq Al-Minshawi',
    englishName: 'Al-Minshawi',
    attribution: 'Mohamed Siddiq Al-Minshawi — via Al Quran Cloud CDN (Islamic Network)',
    sourceUrl: 'https://alquran.cloud',
    format: 'mp3',
  },
];

// ─── Juz Boundaries ───────────────────────────────────────────────────────────
// Sourced from Al Quran Cloud API (authoritative Islamic scholarly consensus)

export interface JuzBoundary {
  number: number;
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
}

export const JUZ_META: JuzBoundary[] = [
  { number: 1, startSurah: 1, startAyah: 1, endSurah: 2, endAyah: 141 },
  { number: 2, startSurah: 2, startAyah: 142, endSurah: 2, endAyah: 252 },
  { number: 3, startSurah: 2, startAyah: 253, endSurah: 3, endAyah: 92 },
  { number: 4, startSurah: 3, startAyah: 93, endSurah: 4, endAyah: 23 },
  { number: 5, startSurah: 4, startAyah: 24, endSurah: 4, endAyah: 147 },
  { number: 6, startSurah: 4, startAyah: 148, endSurah: 5, endAyah: 81 },
  { number: 7, startSurah: 5, startAyah: 82, endSurah: 6, endAyah: 110 },
  { number: 8, startSurah: 6, startAyah: 111, endSurah: 7, endAyah: 87 },
  { number: 9, startSurah: 7, startAyah: 88, endSurah: 8, endAyah: 40 },
  { number: 10, startSurah: 8, startAyah: 41, endSurah: 9, endAyah: 92 },
  { number: 11, startSurah: 9, startAyah: 93, endSurah: 11, endAyah: 5 },
  { number: 12, startSurah: 11, startAyah: 6, endSurah: 12, endAyah: 52 },
  { number: 13, startSurah: 12, startAyah: 53, endSurah: 14, endAyah: 52 },
  { number: 14, startSurah: 14, startAyah: 53, endSurah: 16, endAyah: 128 },
  { number: 15, startSurah: 17, startAyah: 1, endSurah: 18, endAyah: 74 },
  { number: 16, startSurah: 18, startAyah: 75, endSurah: 20, endAyah: 135 },
  { number: 17, startSurah: 21, startAyah: 1, endSurah: 22, endAyah: 78 },
  { number: 18, startSurah: 23, startAyah: 1, endSurah: 25, endAyah: 20 },
  { number: 19, startSurah: 25, startAyah: 21, endSurah: 27, endAyah: 55 },
  { number: 20, startSurah: 27, startAyah: 56, endSurah: 29, endAyah: 45 },
  { number: 21, startSurah: 29, startAyah: 46, endSurah: 33, endAyah: 30 },
  { number: 22, startSurah: 33, startAyah: 31, endSurah: 36, endAyah: 27 },
  { number: 23, startSurah: 36, startAyah: 28, endSurah: 39, endAyah: 31 },
  { number: 24, startSurah: 39, startAyah: 32, endSurah: 41, endAyah: 46 },
  { number: 25, startSurah: 41, startAyah: 47, endSurah: 45, endAyah: 37 },
  { number: 26, startSurah: 46, startAyah: 1, endSurah: 51, endAyah: 30 },
  { number: 27, startSurah: 51, startAyah: 31, endSurah: 57, endAyah: 29 },
  { number: 28, startSurah: 58, startAyah: 1, endSurah: 66, endAyah: 12 },
  { number: 29, startSurah: 67, startAyah: 1, endSurah: 77, endAyah: 50 },
  { number: 30, startSurah: 78, startAyah: 1, endSurah: 114, endAyah: 6 },
];
