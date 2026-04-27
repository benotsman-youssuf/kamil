export interface QuranVerseResult {
  id: string;
  surah: string;
  aya: number;
  textNoTashkeel: string;
  textMinTashkeel: string;
  textTashkeel: string;
  source: "local" | "qf";
}

interface QfSearchResponse {
  search?: {
    results?: Array<{
      verse_key?: string;
      text?: string;
      highlighted?: string;
    }>;
  };
}

const QF_ENDPOINT =
  import.meta.env.VITE_QF_ENDPOINT ||
  import.meta.env.VITE_QF_CONTENT_API_BASE ||
  "https://api.quran.com/api/v4";

const QF_CLIENT_ID = import.meta.env.VITE_QF_CLIENT_ID || "";
const QF_CLIENT_SECRET = import.meta.env.VITE_QF_CLIENT_SECRET || "";

const normalizeArabic = (input: string) =>
  input
    .replace(/[\u064B-\u0652\u0670]/g, "")
    .replace(/[إأآا]/g, "ا")
    .replace(/ى/g, "ي")
    .trim();

export async function searchQuranFoundationVerses(
  query: string,
  limit = 7
): Promise<QuranVerseResult[]> {
  if (!query.trim()) return [];

  try {
    const params = new URLSearchParams({
      q: query,
      size: String(limit),
      language: "ar",
    });

    const response = await fetch(`${QF_ENDPOINT}/search?${params.toString()}`, {
      headers: {
        ...(QF_CLIENT_ID ? { "x-client-id": QF_CLIENT_ID } : {}),
        ...(QF_CLIENT_SECRET ? { "x-client-secret": QF_CLIENT_SECRET } : {}),
      },
    });

    if (!response.ok) return [];

    const data = (await response.json()) as QfSearchResponse;
    const results = data.search?.results ?? [];

    return results
      .map((item, index) => {
        const [surah, aya] = (item.verse_key ?? "0:0").split(":");
        const plainText = (item.text || item.highlighted || "").replace(/<[^>]+>/g, "");

        return {
          id: `qf-${item.verse_key ?? index}`,
          surah,
          aya: Number(aya || 0),
          textNoTashkeel: normalizeArabic(plainText),
          textMinTashkeel: plainText,
          textTashkeel: plainText,
          source: "qf" as const,
        };
      })
      .filter((item) => item.aya > 0 && item.surah !== "0");
  } catch {
    return [];
  }
}

export function shouldUseQfContentApi() {
  return import.meta.env.VITE_USE_QF_CONTENT_API === "true";
}
