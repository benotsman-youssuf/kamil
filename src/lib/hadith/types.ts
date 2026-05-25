export interface HadithGrade {
  name: string;
  grade: string;
}

export interface Hadith {
  collection: string;
  hadithNumber: string;
  hadithText: string;
  hadithTextEn?: string;
  grades: HadithGrade[];
  chapterTitle?: string;
}

export interface HadithSearchResponse {
  results: Hadith[];
  count: number;
}

export interface SearchFilters {
  q: string;
  limit?: number;
}

// Internal: API response shapes from fawazahmed0/hadith-api
export interface HadithApiGrade {
  name: string;
  grade: string;
}

export interface HadithApiRecord {
  hadithnumber: number;
  arabicnumber: number;
  text: string;
  grades: HadithApiGrade[];
  reference: {
    book: number;
    hadith: number;
  };
}

export interface HadithApiFile {
  metadata: {
    name: string;
    sections: Record<string, string>;
    section_detail?: Record<string, {
      hadithnumber_first: number;
      hadithnumber_last: number;
    }>;
  };
  hadiths: HadithApiRecord[];
}

export interface HadithApiEditionMeta {
  name: string;
  book: string;
  author: string;
  language: string;
  has_sections: boolean;
  direction: string;
  source: string;
  comments: string;
  link: string;
  linkmin: string;
}

export interface HadithApiEditions {
  [collection: string]: {
    name: string;
    collection: HadithApiEditionMeta[];
  };
}
