import type { HadithEvidence, VerseEvidence } from "../../types/ai-evidence.js";

const QURAN_API = "https://api.quran.com/api/v4";
const HADITH_API = "https://api.islamic.app/v1/hadith";

export async function searchQuranMcp(query: string): Promise<VerseEvidence[]> {
  try {
    const searchRes = await fetch(
      `${QURAN_API}/search?q=${encodeURIComponent(query)}&size=5`
    );
    if (!searchRes.ok) return [];
    const searchData = await searchRes.json();
    const results: { verse_key: string }[] = searchData.search?.results || [];

    const verses: VerseEvidence[] = [];
    for (const r of results.slice(0, 5)) {
      const vrRes = await fetch(
        `${QURAN_API}/verses/by_key/${r.verse_key}?words=false`
      );
      if (!vrRes.ok) continue;
      const vrData = await vrRes.json();
      const verse = vrData.verse;
      if (!verse) continue;

      verses.push({
        source: "quran_mcp",
        verseKey: r.verse_key,
        arabicText: verse.text_uthmani || verse.text_imlaei || "",
        translation: verse.translations?.[0]?.text || undefined,
        surahName: verse.chapter?.name_arabic || undefined,
        ayahNumber: verse.verse_number || undefined,
        citation: `quran_mcp:${r.verse_key}`,
      });
    }
    return verses;
  } catch {
    return [];
  }
}

export async function searchHadithMcp(query: string): Promise<HadithEvidence[]> {
  try {
    const res = await fetch(
      `${HADITH_API}/search?q=${encodeURIComponent(query)}&limit=5&lang=both`
    );
    if (!res.ok) return [];
    const data = await res.json();

    const raw = data.results || data.hadiths || [];
    const rows = Array.isArray(raw) ? raw : [];

    return rows.slice(0, 5).map((row: any) => ({
      source: "hadith_mcp" as const,
      collection: String(row.collection || ""),
      bookNumber: row.bookNumber ? String(row.bookNumber) : undefined,
      hadithNumber: String(row.hadithNumber || row.hadith_number || ""),
      arabicText: String(row.ar?.text || row.arabic || row.text || ""),
      englishText: row.en?.text || row.english || undefined,
      grades: Array.isArray(row.ar?.grades)
        ? row.ar.grades.map((g: any) => ({
            graded_by: g.graded_by || "",
            grade: g.grade || "",
          }))
        : [],
      citation: `hadith_mcp:${row.collection || "unknown"}:${row.hadithNumber || row.hadith_number || ""}`,
    }));
  } catch {
    return [];
  }
}
