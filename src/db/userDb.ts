/**
 * Local IndexedDB repository for user data.
 * Uses the `idb` wrapper library for a clean async API.
 *
 * Stores:
 *  - bookmarks    : { id, surahNumber, ayahNumber, surahName, ayahText, createdAt }
 *  - notes        : { id, surahNumber, ayahNumber, text, createdAt, updatedAt }
 *  - readingHistory : { surahNumber, ayahNumber, visitedAt }
 *  - settings     : key-value pairs for user preferences
 *  - cachedSurahs : full Surah data cached for offline reading
 */

import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'noor-quran-db';
const DB_VERSION = 1;

export interface Bookmark {
  id: string; // `${surahNumber}:${ayahNumber}`
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  surahEnglishName: string;
  ayahText: string; // First ~80 chars of Arabic text
  createdAt: number; // Unix ms timestamp
}

export interface Note {
  id: string; // UUID
  surahNumber: number;
  ayahNumber: number;
  text: string;
  createdAt: number;
  updatedAt: number;
}

export interface ReadingHistory {
  key: string; // `${surahNumber}:${ayahNumber}`
  surahNumber: number;
  ayahNumber: number;
  visitedAt: number; // latest visit timestamp
}

export interface UserSettings {
  key: string;
  value: unknown;
}

type NoorDB = IDBPDatabase<{
  bookmarks: { key: string; value: Bookmark; indexes: { 'by-surah': number } };
  notes: { key: string; value: Note; indexes: { 'by-surah': number } };
  readingHistory: { key: string; value: ReadingHistory; indexes: { 'by-visited': number } };
  settings: { key: string; value: UserSettings };
  cachedSurahs: { key: number; value: { surahNumber: number; arabicData: unknown; updatedAt: number } };
}>;

let _db: NoorDB | null = null;

async function getDb(): Promise<NoorDB> {
  if (_db) return _db;
  _db = await openDB<any>(DB_NAME, DB_VERSION, {
    upgrade(db: any) {
      // Bookmarks
      if (!db.objectStoreNames.contains('bookmarks')) {
        const bs = db.createObjectStore('bookmarks', { keyPath: 'id' });
        bs.createIndex('by-surah', 'surahNumber');
      }
      // Notes
      if (!db.objectStoreNames.contains('notes')) {
        const ns = db.createObjectStore('notes', { keyPath: 'id' });
        ns.createIndex('by-surah', 'surahNumber');
      }
      // Reading History
      if (!db.objectStoreNames.contains('readingHistory')) {
        const rh = db.createObjectStore('readingHistory', { keyPath: 'key' });
        rh.createIndex('by-visited', 'visitedAt');
      }
      // Settings
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
      // Cached Surahs for offline
      if (!db.objectStoreNames.contains('cachedSurahs')) {
        db.createObjectStore('cachedSurahs', { keyPath: 'surahNumber' });
      }
    },
  }) as NoorDB;
  return _db;
}

// ─── Bookmarks ────────────────────────────────────────────────────────────────

export async function addBookmark(bm: Bookmark): Promise<void> {
  const db = await getDb();
  await db.put('bookmarks', bm);
}

export async function removeBookmark(id: string): Promise<void> {
  const db = await getDb();
  await db.delete('bookmarks', id);
}

export async function getBookmarks(): Promise<Bookmark[]> {
  const db = await getDb();
  const all: Bookmark[] = await db.getAll('bookmarks');
  return all.sort((a: Bookmark, b: Bookmark) => b.createdAt - a.createdAt);
}

export async function isBookmarked(id: string): Promise<boolean> {
  const db = await getDb();
  const item = await db.get('bookmarks', id);
  return !!item;
}

// ─── Notes ────────────────────────────────────────────────────────────────────

export function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function saveNote(note: Note): Promise<void> {
  const db = await getDb();
  await db.put('notes', note);
}

export async function deleteNote(id: string): Promise<void> {
  const db = await getDb();
  await db.delete('notes', id);
}

export async function getNotes(): Promise<Note[]> {
  const db = await getDb();
  const all: Note[] = await db.getAll('notes');
  return all.sort((a: Note, b: Note) => b.updatedAt - a.updatedAt);
}

export async function getNotesBySurah(surahNumber: number): Promise<Note[]> {
  const db = await getDb();
  const index = db.transaction('notes').store.index('by-surah');
  const all: Note[] = await index.getAll(surahNumber);
  return all.sort((a: Note, b: Note) => b.updatedAt - a.updatedAt);
}

// ─── Reading History ──────────────────────────────────────────────────────────

export async function recordVisit(surahNumber: number, ayahNumber: number): Promise<void> {
  const db = await getDb();
  const key = `${surahNumber}:${ayahNumber}`;
  await db.put('readingHistory', { key, surahNumber, ayahNumber, visitedAt: Date.now() });
}

export async function getRecentHistory(limit = 20): Promise<ReadingHistory[]> {
  const db = await getDb();
  const all: ReadingHistory[] = await db.getAll('readingHistory');
  return all.sort((a: ReadingHistory, b: ReadingHistory) => b.visitedAt - a.visitedAt).slice(0, limit);
}

export async function getLastRead(): Promise<ReadingHistory | null> {
  const history = await getRecentHistory(1);
  return history[0] ?? null;
}

export async function clearHistory(): Promise<void> {
  const db = await getDb();
  await db.clear('readingHistory');
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
  const db = await getDb();
  const record = await db.get('settings', key);
  if (!record) return defaultValue;
  return record.value as T;
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  const db = await getDb();
  await db.put('settings', { key, value });
}

export async function clearAllData(): Promise<void> {
  const db = await getDb();
  await db.clear('bookmarks');
  await db.clear('notes');
  await db.clear('readingHistory');
  await db.clear('settings');
  await db.clear('cachedSurahs');
}

// ─── Cached Surahs ────────────────────────────────────────────────────────────

export async function cacheSurah(surahNumber: number, arabicData: unknown): Promise<void> {
  const db = await getDb();
  await db.put('cachedSurahs', { surahNumber, arabicData, updatedAt: Date.now() });
}

export async function getCachedSurah(surahNumber: number): Promise<unknown | null> {
  const db = await getDb();
  const record = await db.get('cachedSurahs', surahNumber);
  return record?.arabicData ?? null;
}

export async function getCachedSurahNumbers(): Promise<number[]> {
  const db = await getDb();
  return db.getAllKeys('cachedSurahs');
}

export async function removeCachedSurah(surahNumber: number): Promise<void> {
  const db = await getDb();
  await db.delete('cachedSurahs', surahNumber);
}

export async function clearCachedSurahs(): Promise<void> {
  const db = await getDb();
  await db.clear('cachedSurahs');
}
