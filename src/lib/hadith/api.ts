import type {
  ApiResponse,
  HadithCollection,
  HadithBook,
  HadithChapter,
  Hadith,
  HadithListResponse,
  HadithSearchResponse,
  SearchFilters,
} from "./types";

const HADITH_API_BASE = "https://api.islamic.app/v1/hadith";

async function request<T>(url: string): Promise<T> {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Hadith API error HTTP ${response.status}: ${response.statusText}`);
  }

  const json = await response.json();
  
  // Handle case where API might wrap in { code: 200, data: ... } or return directly
  if (json && typeof json === 'object' && 'code' in json && 'data' in json) {
    if (json.code !== 200) {
      throw new Error(`Hadith API error ${json.code}: ${json.status} — ${JSON.stringify(json.data)}`);
    }
    return json.data as T;
  }

  return json as T;
}

export async function fetchCollections(type?: string): Promise<HadithCollection[]> {
  const params = type ? `?type=${encodeURIComponent(type)}` : "";
  return request<HadithCollection[]>(`${HADITH_API_BASE}/collections${params}`);
}

export async function fetchCollection(slug: string): Promise<HadithCollection> {
  return request<HadithCollection>(`${HADITH_API_BASE}/collections/${encodeURIComponent(slug)}`);
}

export async function fetchBooks(slug: string): Promise<HadithBook[]> {
  return request<HadithBook[]>(`${HADITH_API_BASE}/collections/${encodeURIComponent(slug)}/books`);
}

export async function fetchBook(slug: string, bookNumber: string): Promise<HadithBook> {
  return request<HadithBook>(
    `${HADITH_API_BASE}/collections/${encodeURIComponent(slug)}/books/${encodeURIComponent(bookNumber)}`
  );
}

export async function fetchChapters(slug: string, bookNumber: string): Promise<HadithChapter[]> {
  return request<HadithChapter[]>(
    `${HADITH_API_BASE}/collections/${encodeURIComponent(slug)}/books/${encodeURIComponent(bookNumber)}/chapters`
  );
}

export async function fetchChapter(
  slug: string,
  bookNumber: string,
  chapterId: string
): Promise<HadithChapter> {
  return request<HadithChapter>(
    `${HADITH_API_BASE}/collections/${encodeURIComponent(slug)}/books/${encodeURIComponent(bookNumber)}/chapters/${encodeURIComponent(chapterId)}`
  );
}

export async function fetchHadithsByBook(
  slug: string,
  bookNumber: string,
  limit = 50,
  offset = 0
): Promise<HadithListResponse> {
  return request<HadithListResponse>(
    `${HADITH_API_BASE}/collections/${encodeURIComponent(slug)}/books/${encodeURIComponent(bookNumber)}/hadiths?limit=${limit}&offset=${offset}`
  );
}

export async function fetchHadith(
  slug: string,
  bookNumber: string,
  hadithNumber: string
): Promise<Hadith> {
  return request<Hadith>(
    `${HADITH_API_BASE}/collections/${encodeURIComponent(slug)}/books/${encodeURIComponent(bookNumber)}/hadiths/${encodeURIComponent(hadithNumber)}`
  );
}

export async function fetchHadithByURN(urn: number): Promise<Hadith> {
  return request<Hadith>(`${HADITH_API_BASE}/urn/${urn}`);
}

export async function fetchRandomHadith(slug?: string): Promise<Hadith> {
  const path = slug ? `/random/${encodeURIComponent(slug)}` : "/random";
  return request<Hadith>(`${HADITH_API_BASE}${path}`);
}

export async function fetchHadithOfTheDay(slug?: string): Promise<Hadith> {
  const path = slug ? `/today/${encodeURIComponent(slug)}` : "/today";
  return request<Hadith>(`${HADITH_API_BASE}${path}`);
}

export async function searchHadiths(filters: SearchFilters): Promise<HadithSearchResponse> {
  const params = new URLSearchParams();
  params.set("q", filters.q);
  if (filters.lang) params.set("lang", filters.lang);
  if (filters.collection) params.set("collection", filters.collection);
  if (filters.book) params.set("book", filters.book);
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.offset) params.set("offset", String(filters.offset));

  return request<HadithSearchResponse>(`${HADITH_API_BASE}/search?${params.toString()}`);
}
