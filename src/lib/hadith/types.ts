export interface ApiResponse<T> {
  code: number;
  status: string;
  data: T;
}

export interface CollectionName {
  en: string;
  ar: string;
}

export interface HadithCollection {
  slug: string;
  type: "hadith" | "dua" | "virtues";
  name: CollectionName;
  intro: { en: string | null; ar: string | null };
  hasBooks: boolean;
  hasChapters: boolean;
  totalHadith: number;
  totalAvailable: number;
}

export interface HadithBook {
  collection: string;
  bookNumber: string;
  name: CollectionName;
  intro: { en: string | null; ar: string | null };
  hadithStartNumber: number;
  hadithEndNumber: number;
  hadithCount: number;
}

export interface HadithChapter {
  collection: string;
  bookNumber: string;
  chapterId: string;
  chapterNumber: string;
  title: CollectionName;
  intro: { en: string | null; ar: string | null };
  ending: { en: string | null; ar: string | null };
}

export interface HadithGrade {
  graded_by: string;
  grade: string;
}

export interface HadithLanguage {
  urn: number;
  body: string;
  text: string;
  grades: HadithGrade[];
}

export interface HadithSnippet {
  en: string;
  ar: string;
}

export interface Hadith {
  collection: string;
  bookNumber: string;
  hadithNumber: string;
  chapterId: string;
  chapterNumber: string | null;
  chapterTitle: CollectionName | null;
  en: HadithLanguage;
  ar: HadithLanguage;
  snippet?: HadithSnippet;
}

export interface HadithListResponse {
  total: number;
  limit: number;
  offset: number;
  hadiths: Hadith[];
}

export interface HadithSearchResponse {
  query: string;
  lang: string;
  count: number;
  limit: number;
  offset: number;
  results: Hadith[];
}

export interface SearchFilters {
  q: string;
  lang?: "en" | "ar" | "both";
  collection?: string;
  book?: string;
  limit?: number;
  offset?: number;
}
