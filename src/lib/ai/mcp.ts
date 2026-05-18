import type { HadithEvidence, VerseEvidence } from "@/types/ai-evidence";

const QURAN_MCP_URL = process.env.QURAN_MCP_URL || "https://mcp.quran.ai";
const HADITH_MCP_URL = process.env.HADITH_MCP_URL || "https://hadith-mcp.org";

export async function searchQuranMcp(query: string): Promise<VerseEvidence[]> {
  const response = await fetch(`${QURAN_MCP_URL}/search`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) return [];
  const json = await response.json();
  const rows = Array.isArray(json?.verses) ? json.verses : Array.isArray(json?.results) ? json.results : [];

  return rows.slice(0, 5).map((row: any) => ({
    source: "quran_mcp",
    verseKey: String(row.verse_key || row.verseKey || ""),
    arabicText: String(row.arabic || row.text || ""),
    translation: row.translation ? String(row.translation) : undefined,
    surahName: row.surah_name ? String(row.surah_name) : undefined,
    ayahNumber: row.ayah_number ? Number(row.ayah_number) : undefined,
    citation: `quran_mcp:${row.verse_key || row.verseKey || "unknown"}`,
  }));
}

export async function searchHadithMcp(query: string): Promise<HadithEvidence[]> {
  const response = await fetch(`${HADITH_MCP_URL}/search_hadith`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) return [];
  const json = await response.json();
  const rows = Array.isArray(json?.hadiths) ? json.hadiths : Array.isArray(json?.results) ? json.results : [];

  return rows.slice(0, 5).map((row: any) => ({
    source: "hadith_mcp",
    collection: String(row.collection || ""),
    bookNumber: row.book_number ? String(row.book_number) : undefined,
    hadithNumber: String(row.hadith_number || row.hadithNumber || ""),
    arabicText: String(row.arabic || row.text || ""),
    englishText: row.english ? String(row.english) : undefined,
    grades: Array.isArray(row.grades) ? row.grades : [],
    citation: `hadith_mcp:${row.collection || "unknown"}:${row.hadith_number || row.hadithNumber || ""}`,
  }));
}
