export interface VerseEvidence {
  source: "quran_mcp";
  verseKey: string;
  arabicText: string;
  translation?: string;
  surahName?: string;
  ayahNumber?: number;
  citation?: string;
}

export interface HadithEvidence {
  source: "hadith_mcp";
  collection: string;
  bookNumber?: string;
  hadithNumber: string;
  arabicText: string;
  englishText?: string;
  grades?: Array<{ graded_by?: string; grade: string }>;
  citation?: string;
}

export interface EvidencePayload {
  verses?: VerseEvidence[];
  hadiths?: HadithEvidence[];
}
