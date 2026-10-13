export type BookCategory = 
  | 'all'
  | 'hadith'
  | 'namaz'
  | 'duas'
  | 'kalima'
  | 'seerah'
  | 'adab'
  | 'fiqh'
  | 'quranic'
  | 'special'
  | 'ruqyah'
  | 'custom';

export interface BookItem {
  id: string;
  // Trilingual Item Titles
  title: string;           // Primary display title
  titleEnglish: string;    // English title e.g. "Step 1: Takbeer-e-Tehreema"
  titleUrdu: string;       // Urdu title e.g. "پہلا رکن: تکبیرِ تحریمہ"
  titleArabic?: string;    // Arabic title e.g. "التَّكْبِيرَةُ الأُولَى"
  
  arabicText: string;
  transliteration?: string;
  translationUrdu: string;
  translationEnglish: string;
  reference?: string;
  benefits?: string;
  repeatCount?: number;
  tags?: string[];
  pageNumber?: number;
}

export interface BookChapter {
  id: string;
  title: string;
  titleEnglish?: string;
  titleUrdu?: string;
  titleArabic?: string;
  description?: string;
  items: BookItem[];
}

export interface IslamicBook {
  id: string;
  title: string;           // Main composite title
  titleEnglish: string;    // Clear English Title e.g. "Taleem-ul-Islam: Complete Hanafi Prayer Guide"
  titleUrdu: string;       // Clear Urdu Title e.g. "تعلیم الاسلام: مکمل نمازِ حنفی مع اردو ترجمہ و مسائل"
  titleArabic: string;     // Clear Arabic Title e.g. "تَعْلِيمُ الإِسْلَامِ فِي الفِقْهِ الحَنَفِيِّ"
  arabicTitle?: string;    // Alias for titleArabic
  author: string;          // Author name in Urdu
  authorEnglish: string;   // Author name in English e.g. "Grand Mufti Kifayatullah Dehlawi"
  publishedEra?: string;   // Era or classical attribution
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
  titleEnglish?: string;
  titleUrdu?: string;
  titleArabic?: string;
  arabicTitle?: string;
  author?: string;
  authorEnglish?: string;
  category: BookCategory;
  description: string;
  items: {
    title: string;
    titleEnglish?: string;
    titleUrdu?: string;
    titleArabic?: string;
    arabicText: string;
    transliteration?: string;
    translationUrdu: string;
    translationEnglish: string;
    reference?: string;
    benefits?: string;
    repeatCount?: number;
  }[];
}
