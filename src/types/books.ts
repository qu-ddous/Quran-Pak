export type BookCategory = 
  | 'all'
  | 'namaz'
  | 'kalima'
  | 'duas'
  | 'quranic'
  | 'special'
  | 'ruqyah'
  | 'custom';

export interface BookItem {
  id: string;
  title: string;
  arabicTitle?: string;
  arabicText: string;
  transliteration?: string;
  translationUrdu: string;
  translationEnglish: string;
  reference?: string;
  benefits?: string;
  repeatCount?: number;
  tags?: string[];
}

export interface BookChapter {
  id: string;
  title: string;
  arabicTitle?: string;
  description?: string;
  items: BookItem[];
}

export interface IslamicBook {
  id: string;
  title: string;
  arabicTitle: string;
  author: string;
  category: BookCategory;
  categoryLabel: string;
  description: string;
  coverGradient: string;
  accentColor: string;
  totalItems: number;
  readTime: string;
  tags: string[];
  isCustom?: boolean;
  createdAt?: string;
  chapters: BookChapter[];
}

export interface UserCustomBookInput {
  title: string;
  arabicTitle?: string;
  author?: string;
  category: BookCategory;
  description: string;
  items: {
    title: string;
    arabicText: string;
    transliteration?: string;
    translationUrdu: string;
    translationEnglish: string;
    reference?: string;
    benefits?: string;
    repeatCount?: number;
  }[];
}
