import { ISLAMIC_BOOKS_DATA } from '../data/islamicBooksData';
import type { IslamicBook, BookItem, UserCustomBookInput } from '../types/books';

const CUSTOM_BOOKS_STORAGE_KEY = 'noor_quran_custom_books_v1';
const SAVED_DUAS_STORAGE_KEY = 'noor_quran_saved_duas_v1';

export interface SavedDuaRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  item: BookItem;
  savedAt: string;
}

// ─── Fetch All Books (Preset + Custom) ───────────────────────────────────────
export function getAllBooks(): IslamicBook[] {
  try {
    const rawCustom = localStorage.getItem(CUSTOM_BOOKS_STORAGE_KEY);
    const customBooks: IslamicBook[] = rawCustom ? JSON.parse(rawCustom) : [];
    return [...ISLAMIC_BOOKS_DATA, ...customBooks];
  } catch (e) {
    console.error('Failed to load custom books from storage:', e);
    return ISLAMIC_BOOKS_DATA;
  }
}

// ─── Get Single Book by ID ───────────────────────────────────────────────────
export function getBookById(id: string): IslamicBook | undefined {
  const all = getAllBooks();
  return all.find((b) => b.id === id);
}

// ─── Save New Custom Book ────────────────────────────────────────────────────
export function addCustomBook(input: UserCustomBookInput): IslamicBook {
  const existing = getAllBooks().filter((b) => b.isCustom);
  const newId = `custom-book-${Date.now()}`;
  
  const gradients = [
    'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #172554 100%)',
    'linear-gradient(135deg, #064e3b 0%, #059669 50%, #022c22 100%)',
    'linear-gradient(135deg, #701a75 0%, #a21caf 50%, #4a044e 100%)',
    'linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #431407 100%)',
  ];
  const chosenGradient = gradients[existing.length % gradients.length];

  const bookItems: BookItem[] = input.items.map((it, idx) => ({
    id: `${newId}-item-${idx + 1}`,
    title: it.title,
    arabicText: it.arabicText,
    transliteration: it.transliteration || '',
    translationUrdu: it.translationUrdu,
    translationEnglish: it.translationEnglish,
    reference: it.reference || 'Custom Collection',
    benefits: it.benefits || '',
    repeatCount: it.repeatCount || 1,
    tags: ['custom', input.category],
  }));

  const newBook: IslamicBook = {
    id: newId,
    title: input.title,
    arabicTitle: input.arabicTitle || 'كِتَابٌ إِسْلَامِيٌّ',
    author: input.author || 'User Contribution',
    category: input.category,
    categoryLabel: input.category === 'namaz' ? 'نماز • Salah' :
                   input.category === 'kalima' ? 'کلمے • Kalimas' :
                   input.category === 'duas' ? 'دعائیں • Duas' :
                   input.category === 'quranic' ? 'قرآنی • Quranic' :
                   input.category === 'special' ? 'خصوصی • Special' :
                   input.category === 'ruqyah' ? 'شفا • Healing' : 'جامع • Collection',
    description: input.description,
    coverGradient: chosenGradient,
    accentColor: '#d4af37',
    totalItems: bookItems.length,
    readTime: `${Math.max(5, Math.ceil(bookItems.length * 1.5))} mins`,
    tags: ['custom', input.category, input.title.toLowerCase()],
    isCustom: true,
    createdAt: new Date().toISOString(),
    chapters: [
      {
        id: `${newId}-ch-1`,
        title: input.title,
        items: bookItems,
      },
    ],
  };

  const updatedCustom = [newBook, ...existing];
  localStorage.setItem(CUSTOM_BOOKS_STORAGE_KEY, JSON.stringify(updatedCustom));
  return newBook;
}

// ─── Delete Custom Book ──────────────────────────────────────────────────────
export function deleteCustomBook(bookId: string): boolean {
  try {
    const rawCustom = localStorage.getItem(CUSTOM_BOOKS_STORAGE_KEY);
    if (!rawCustom) return false;
    const customBooks: IslamicBook[] = JSON.parse(rawCustom);
    const filtered = customBooks.filter((b) => b.id !== bookId);
    localStorage.setItem(CUSTOM_BOOKS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('Failed to delete custom book:', e);
    return false;
  }
}

// ─── Saved / Favorite Duas ───────────────────────────────────────────────────
export function getSavedDuas(): SavedDuaRecord[] {
  try {
    const raw = localStorage.getItem(SAVED_DUAS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load saved duas:', e);
    return [];
  }
}

export function isDuaSaved(itemId: string): boolean {
  const saved = getSavedDuas();
  return saved.some((s) => s.item.id === itemId || s.id === itemId);
}

export function toggleSaveDua(bookId: string, bookTitle: string, item: BookItem): boolean {
  try {
    const current = getSavedDuas();
    const index = current.findIndex((s) => s.item.id === item.id);
    if (index >= 0) {
      current.splice(index, 1);
      localStorage.setItem(SAVED_DUAS_STORAGE_KEY, JSON.stringify(current));
      return false; // removed
    } else {
      current.unshift({
        id: item.id,
        bookId,
        bookTitle,
        item,
        savedAt: new Date().toISOString(),
      });
      localStorage.setItem(SAVED_DUAS_STORAGE_KEY, JSON.stringify(current));
      return true; // added
    }
  } catch (e) {
    console.error('Failed to toggle saved dua:', e);
    return false;
  }
}

// ─── Search Across All Islamic Books and Duas ────────────────────────────────
export interface DuaSearchResult {
  book: IslamicBook;
  chapter: { id: string; title: string };
  item: BookItem;
  matchSnippet: string;
}

export function searchAllDuas(query: string, categoryFilter: string = 'all'): DuaSearchResult[] {
  const cleanQ = query.trim().toLowerCase();
  if (!cleanQ) return [];

  const allBooks = getAllBooks();
  const results: DuaSearchResult[] = [];

  for (const book of allBooks) {
    if (categoryFilter !== 'all' && book.category !== categoryFilter) {
      continue;
    }

    for (const chapter of book.chapters) {
      for (const item of chapter.items) {
        const titleMatch = item.title.toLowerCase().includes(cleanQ);
        const urduMatch = item.translationUrdu.includes(cleanQ);
        const englishMatch = item.translationEnglish.toLowerCase().includes(cleanQ);
        const arabicMatch = item.arabicText.includes(cleanQ);
        const translitMatch = item.transliteration?.toLowerCase().includes(cleanQ);
        const benefitsMatch = item.benefits?.toLowerCase().includes(cleanQ);
        const tagMatch = item.tags?.some((t) => t.toLowerCase().includes(cleanQ));
        const bookMatch = book.tags.some((t) => t.toLowerCase().includes(cleanQ));

        if (titleMatch || urduMatch || englishMatch || arabicMatch || translitMatch || benefitsMatch || tagMatch || bookMatch) {
          let snippet = item.translationUrdu;
          if (englishMatch) {
            snippet = item.translationEnglish;
          } else if (arabicMatch) {
            snippet = item.arabicText;
          }

          results.push({
            book,
            chapter: { id: chapter.id, title: chapter.title },
            item,
            matchSnippet: snippet,
          });
        }
      }
    }
  }

  return results;
}
