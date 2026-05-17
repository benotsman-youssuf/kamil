import { getValidAccessToken, fetchContentToken } from "./auth";
import { QF_CONFIG } from "./config";

const API_BASE_URL = QF_CONFIG.apiBaseUrl;
const CLIENT_ID = QF_CONFIG.clientId;

// API base paths per spec
const CONTENT_API = `${API_BASE_URL}/content/api/v4`;
const SEARCH_API = `${API_BASE_URL}/search/api/v1`;
const USER_API = `${API_BASE_URL}/auth/v1`;

let contentToken: string | null = null;
let contentTokenPromise: Promise<string | null> | null = null;
const hadithRequestBlocklist = new Set<string>();

async function ensureContentToken(): Promise<string | null> {
  if (contentToken) return contentToken;
  if (!contentTokenPromise) {
    contentTokenPromise = fetchContentToken().then((token) => {
      contentToken = token;
      contentTokenPromise = null;
      return token;
    });
  }
  return contentTokenPromise;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "x-client-id": CLIENT_ID,
  };

  const ct = await ensureContentToken();
  if (ct) {
    headers["x-auth-token"] = ct;
    return headers;
  }

  const token = await getValidAccessToken();
  if (token) {
    headers["x-auth-token"] = token;
  }

  return headers;
}

// ─── Types ────────────────────────────────────────────────────────

export interface Translation {
  id: number;
  resource_id: number;
  text: string;
  language_name?: string;
}

export interface Tafsir {
  id: number;
  resource_id: number;
  text: string;
  language_name?: string;
  name?: string;
  verse_key?: string;
}

export interface HadithItem {
  lang: string;
  chapterNumber?: string;
  chapterTitle?: string;
  body: string;
  urn: number;
  grades?: { graded_by: string; grade: string }[];
}

export interface Hadith {
  urn: number;
  collection: string;
  bookNumber: string;
  chapterId: string;
  hadithNumber: string;
  name: string;
  hadith: HadithItem[];
}

export interface Word {
  id: number;
  position: number;
  audio_url?: string;
  char_type_name: string;
  translation?: { text: string; language_name: string };
  transliteration?: { text: string; language_name: string };
  code_v1?: string;
  text?: string;
  line_number?: number;
  page_number?: number;
}

export interface VerseDetails {
  id: number;
  verse_number: number;
  verse_key: string;
  chapter_id?: number;
  text_uthmani?: string;
  text_uthmani_simple?: string;
  text_imlaei?: string;
  text_imlaei_simple?: string;
  text_indopak?: string;
  juz_number?: number;
  hizb_number?: number;
  rub_el_hizb_number?: number;
  page_number?: number;
  image_url?: string;
  words?: Word[];
  translations?: Translation[];
  tafsirs?: Tafsir[];
  hadiths?: Hadith[];
  audio_url?: string;
}

export interface SearchNavigationResult {
  result_type: string;
  key: number | string;
  name: string;
  isArabic: boolean;
}

export interface SearchVerseResult {
  result_type: string;
  key: string;
  name: string;
  isArabic: boolean;
}

export interface SearchResponse {
  pagination: {
    current_page: number;
    next_page: number | null;
    per_page: number;
    total_pages: number;
    total_records: number;
  };
  result: {
    navigation: SearchNavigationResult[];
    verses: SearchVerseResult[];
  };
}

export interface ApiErrorResponse {
  message?: string;
  type?: string;
  success?: boolean;
  status?: number;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
}

// ─── User Types ─────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  photoUrl?: string;
  avatarUrls?: { small: string; medium: string; large: string };
  bio?: string;
  country?: string;
  languageIsoCode?: string;
  verified?: boolean;
  postsCount?: number;
  followersCount?: number;
  likesCount?: number;
  createdAt?: string;
  joiningYear?: number;
}

export interface BookmarkItem {
  id: string;
  type: "ayah";
  key: number;
  verseNumber: number;
  group: string;
  createdAt: string;
  isInDefaultCollection?: boolean;
  isReading?: boolean;
  collectionsCount?: number;
}

export interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  isPrivate: boolean;
  isDefault: boolean;
  bookmarksCount: number;
  count: number;
  updatedAt: string;
}

export interface CollectionBookmarkItem {
  id: string;
  type: "ayah";
  key: number;
  verseNumber: number;
  createdAt: string;
}

export interface NoteItem {
  id: string;
  body: string;
  ranges: string[];
  isPublic?: boolean;
  hasAttachment?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface StreakItem {
  currentStreak: number;
  longestStreak: number;
  startDate?: string;
  endDate?: string;
}

export interface ActivityDay {
  date: string;
  count?: number;
  duration?: number;
  pagesRead?: number;
}

export interface ReadingSession {
  id?: string;
  date: string;
  duration: number;
  startVerse?: string;
  endVerse?: string;
  pagesRead?: number;
}

export interface Goal {
  id: string;
  type: string;
  targetAmount: number;
  currentAmount?: number;
  startDate?: string;
  endDate?: string;
  isCompleted?: boolean;
}

export interface Preference {
  key: string;
  value: string | number | boolean;
}

export interface CursorPagination {
  startCursor?: string;
  endCursor?: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BookmarkListResponse {
  success: boolean;
  data: BookmarkItem[];
  pagination: CursorPagination;
}

export interface CollectionListResponse {
  success: boolean;
  data: CollectionItem[];
  pagination: CursorPagination;
}

export interface NoteListResponse {
  success: boolean;
  data: NoteItem[];
  pagination: CursorPagination;
}

// ─── Content APIs ─────────────────────────────────────────────────

export async function fetchVerseDetails(verseKey: string): Promise<VerseDetails> {
  const headers = await getAuthHeaders();
  const params = new URLSearchParams({
    language: "ar",
    words: "true",
    translations: "85",
    tafsirs: "169",
    audio: "7",
    fields: "text_uthmani,text_imlaei,text_indopak,image_url",
  });

  const url = `${CONTENT_API}/verses/by_key/${verseKey}?${params}`;
  const response = await fetch(url, { headers });

  if (!response.ok) {
    const err: ApiErrorResponse = await response.json().catch(() => ({}));
    throw new Error(err.message || err.error?.message || `Failed to fetch verse: ${response.status}`);
  }

  const data = await response.json();
  const verse: VerseDetails = data.verse;

  if (data.verse?.audio) {
    verse.audio_url = data.verse.audio.url;
  }

  // Fetch hadith references separately
  try {
    const hadiths = await fetchHadithsByAyah(verseKey);
    verse.hadiths = hadiths;
  } catch {
    // hadiths may not be available in prelive
  }

  return verse;
}

export async function fetchHadithsByAyah(ayahKey: string): Promise<Hadith[]> {
  if (hadithRequestBlocklist.has(ayahKey)) return [];

  const headers = await getAuthHeaders();
  const params = new URLSearchParams({ language: "ar", per_page: "5" });
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(
      `${CONTENT_API}/hadith_references/by_ayah/${ayahKey}/hadiths?${params}`,
      { headers, signal: controller.signal }
    );

    if (!response.ok) {
      if ([429, 500, 502, 503, 504].includes(response.status)) {
        hadithRequestBlocklist.add(ayahKey);
      }
      return [];
    }

    const data = await response.json();
    return data.hadiths || [];
  } catch {
    hadithRequestBlocklist.add(ayahKey);
    return [];
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function fetchTafsir(verseKey: string, tafsirId: number): Promise<Tafsir | null> {
  const headers = await getAuthHeaders();
  try {
    const params = new URLSearchParams({ fields: "verse_key", tafsirs: String(tafsirId) });
    const response = await fetch(`${CONTENT_API}/verses/by_key/${verseKey}?${params}`, { headers });
    if (!response.ok) return null;
    const data = await response.json();
    return data.verse?.tafsirs?.[0] || null;
  } catch {
    return null;
  }
}

export async function fetchTafsirsBulk(verseKey: string, tafsirIds: number[]): Promise<Record<number, Tafsir>> {
  if (tafsirIds.length === 0) return {};
  const headers = await getAuthHeaders();
  const result: Record<number, Tafsir> = {};

  const chunkSize = 5;
  for (let i = 0; i < tafsirIds.length; i += chunkSize) {
    const chunk = tafsirIds.slice(i, i + chunkSize);
    try {
      const params = new URLSearchParams({
        fields: "verse_key",
        tafsirs: chunk.join(","),
      });
      const response = await fetch(`${CONTENT_API}/verses/by_key/${verseKey}?${params}`, { headers });
      if (response.ok) {
        const data = await response.json();
        const tafsirs: Tafsir[] = data.verse?.tafsirs || [];
        for (const t of tafsirs) {
          result[t.resource_id] = t;
        }
      }
    } catch {
      // skip failed chunk
    }
  }

  return result;
}

export async function fetchTranslation(verseKey: string, translationId: number = 131): Promise<Translation | null> {
  const headers = await getAuthHeaders();
  try {
    const url = `${CONTENT_API}/translations/${translationId}/by_ayah/${verseKey}`;
    const response = await fetch(url, { headers });
    if (!response.ok) return null;
    const data = await response.json();
    return data.translations?.[0] || null;
  } catch {
    return null;
  }
}

export async function fetchAyahRecitation(verseKey: string, reciterId: number = 7): Promise<string | null> {
  const headers = await getAuthHeaders();
  try {
    const params = new URLSearchParams({ audio: String(reciterId), fields: "verse_key" });
    const response = await fetch(`${CONTENT_API}/verses/by_key/${verseKey}?${params}`, { headers });
    if (!response.ok) return null;
    const data = await response.json();
    return data.verse?.audio?.url || null;
  } catch {
    return null;
  }
}

export async function listChapters(): Promise<any[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${CONTENT_API}/chapters`, { headers });

  if (!response.ok) {
    throw new Error(`Failed to fetch chapters: ${response.status}`);
  }

  const data = await response.json();
  return data.chapters || [];
}

export async function getChapter(chapterId: number): Promise<any> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${CONTENT_API}/chapters/${chapterId}`, { headers });

  if (!response.ok) {
    throw new Error(`Failed to fetch chapter: ${response.status}`);
  }

  const data = await response.json();
  return data.chapter;
}

export async function getResourcesTranslations(): Promise<any[]> {
  const headers = await getAuthHeaders();
  try {
    const response = await fetch(`${CONTENT_API}/resources/translations`, { headers });
    if (!response.ok) return [];
    const data = await response.json();
    return data.translations || [];
  } catch {
    return [];
  }
}

export async function getResourcesTafsirs(language?: string): Promise<any[]> {
  const headers = await getAuthHeaders();

  try {
    const params = language ? `?language=${encodeURIComponent(language)}` : "";
    const response = await fetch(`${CONTENT_API}/resources/tafsirs${params}`, { headers });
    if (response.ok) {
      const data = await response.json();
      const tafsirs = data.tafsirs || [];
      if (tafsirs.length >= 12) return tafsirs;
    }
  } catch {
    // fall through
  }

  try {
    const response = await fetch("https://api.quran.com/api/v4/resources/tafsirs");
    if (response.ok) {
      const data = await response.json();
      return data.tafsirs || [];
    }
  } catch {
    // fall through
  }

  return [];
}

export async function getRecitations(): Promise<any[]> {
  const headers = await getAuthHeaders();
  try {
    const response = await fetch(`${CONTENT_API}/recitations`, { headers });
    if (!response.ok) return [];
    const data = await response.json();
    return data.recitations || [];
  } catch {
    return [];
  }
}

// ─── Search API ───────────────────────────────────────────────────

export async function searchQuran(query: string, options?: {
  mode?: "quick" | "advanced";
  size?: number;
  page?: number;
  navigationalResultsNumber?: number;
  versesResultsNumber?: number;
  translationIds?: number[];
}): Promise<SearchResponse> {
  const headers = await getAuthHeaders();
  const mode = options?.mode || "advanced";

  const params = new URLSearchParams({ mode, query });
  if (options?.navigationalResultsNumber) params.set("navigationalResultsNumber", String(options.navigationalResultsNumber));
  if (options?.versesResultsNumber) params.set("versesResultsNumber", String(options.versesResultsNumber));
  if (options?.size) params.set("size", String(options.size));
  if (options?.page) params.set("page", String(options.page));
  if (options?.translationIds?.length) {
    params.set("translation_ids", options.translationIds.join(","));
  }

  const url = `${SEARCH_API}/search?${params.toString()}`;

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      console.warn("Search API error:", response.status, "- falling back to legacy search");
      return legacySearch(query, options?.size || 20);
    }
    return await response.json();
  } catch (error) {
    console.error("Search error, falling back to legacy search:", error);
    return legacySearch(query, options?.size || 20);
  }
}

async function legacySearch(query: string, size: number): Promise<SearchResponse> {
  try {
    const url = `https://api.quran.com/api/v4/search?q=${encodeURIComponent(query)}&size=${size}`;
    const response = await fetch(url);
    if (!response.ok) return emptySearchResponse();
    const data = await response.json();
    const results = data.search?.results || [];
    return {
      pagination: {
        current_page: data.search?.current_page || 1,
        next_page: null,
        per_page: size,
        total_pages: data.search?.total_pages || 1,
        total_records: data.search?.total_results || results.length,
      },
      result: {
        navigation: [],
        verses: results.map((r: any) => ({
          result_type: "ayah",
          key: r.verse_key,
          name: r.text || "",
          isArabic: true,
        })),
      },
    };
  } catch {
    return emptySearchResponse();
  }
}

function emptySearchResponse(): SearchResponse {
  return {
    pagination: { current_page: 1, next_page: null, per_page: 20, total_pages: 0, total_records: 0 },
    result: { navigation: [], verses: [] },
  };
}

// ─── User APIs (authenticated) ────────────────────────────────────

async function userApiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = await getValidAccessToken();
  if (!token) throw new Error("Not authenticated");

  const url = `${USER_API}${path}`;
  const headers: Record<string, string> = {
    "x-auth-token": token,
    "x-client-id": CLIENT_ID,
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string> || {}),
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("qf_tokens");
    }
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || err.error?.message || `User API error: ${response.status}`);
  }

  return response.json();
}

// ─── Bookmarks ────────────────────────────────────────────────────

export async function fetchBookmarks(params?: { first?: number; after?: string; mushafId?: number }): Promise<BookmarkListResponse> {
  const qp = new URLSearchParams();
  qp.set("mushafId", String(params?.mushafId ?? 1));
  if (params?.first) qp.set("first", String(Math.min(params.first, 20)));
  if (params?.after) qp.set("after", params.after);
  const qs = qp.toString();
  return userApiFetch<BookmarkListResponse>(`/bookmarks?${qs}`);
}

export async function addBookmark(verseKey: string): Promise<{ success: boolean; data: BookmarkItem }> {
  const [chapterId, verseNumber] = verseKey.split(":").map(Number);
  return userApiFetch<{ success: boolean; data: BookmarkItem }>("/bookmarks", {
    method: "POST",
    body: JSON.stringify({ key: chapterId, verseNumber, type: "ayah", mushafId: 1 }),
  });
}

export async function deleteBookmark(bookmarkId: string): Promise<{ success: boolean }> {
  return userApiFetch<{ success: boolean }>(`/bookmarks/${bookmarkId}?mushafId=1`, { method: "DELETE" });
}

export async function getBookmark(verseKey: string): Promise<{ success: boolean; data: BookmarkItem } | null> {
  const [chapterId, verseNumber] = verseKey.split(":").map(Number);
  try {
    return await userApiFetch<{ success: boolean; data: BookmarkItem }>(
      `/bookmarks/bookmark?key=${chapterId}&verseNumber=${verseNumber}&type=ayah&mushafId=1`
    );
  } catch {
    return null;
  }
}

// ─── Collections ──────────────────────────────────────────────────

export async function fetchCollections(params?: { first?: number; after?: string; type?: string; sortBy?: string }): Promise<CollectionListResponse> {
  const qp = new URLSearchParams();
  if (params?.first) qp.set("first", String(params.first));
  if (params?.after) qp.set("after", params.after);
  if (params?.type) qp.set("type", params.type);
  if (params?.sortBy) qp.set("sortBy", params.sortBy);
  const qs = qp.toString();
  return userApiFetch<CollectionListResponse>(`/collections${qs ? `?${qs}` : ""}`);
}

export async function fetchCollectionItems(
  collectionId: string,
  params?: { first?: number; after?: string }
): Promise<{ success: boolean; data: CollectionBookmarkItem[]; pagination: CursorPagination }> {
  const qp = new URLSearchParams();
  if (params?.first) qp.set("first", String(params.first));
  if (params?.after) qp.set("after", params.after);
  const qs = qp.toString();
  return userApiFetch<{ success: boolean; data: CollectionBookmarkItem[]; pagination: CursorPagination }>(
    `/collections/${collectionId}${qs ? `?${qs}` : ""}`
  );
}

// ─── Notes ────────────────────────────────────────────────────────

export async function fetchNotesByVerse(verseKey: string): Promise<{ success: boolean; data: NoteItem[]; pagination: any }> {
  return userApiFetch<any>(`/notes/by-verse/${verseKey}`);
}

export async function fetchAllNotes(params?: { limit?: number; cursor?: string; sortBy?: string }): Promise<NoteListResponse> {
  const qp = new URLSearchParams();
  if (params?.limit) qp.set("limit", String(params.limit));
  if (params?.cursor) qp.set("cursor", params.cursor);
  if (params?.sortBy) qp.set("sortBy", params.sortBy);
  const qs = qp.toString();
  return userApiFetch<NoteListResponse>(`/notes${qs ? `?${qs}` : ""}`);
}

export async function addNote(data: { verse_key: string; text: string }) {
  if (data.text.length < 6) {
    throw new Error("يجب أن تحتوي الملاحظة على 6 أحرف على الأقل");
  }
  const formattedRange = data.verse_key.includes("-") ? data.verse_key : `${data.verse_key}-${data.verse_key}`;
  return userApiFetch<any>("/notes", {
    method: "POST",
    body: JSON.stringify({
      body: data.text,
      saveToQR: false,
      ranges: [formattedRange],
    }),
  });
}

export async function updateNote(noteId: string, text: string) {
  return userApiFetch<any>(`/notes/${noteId}`, {
    method: "PATCH",
    body: JSON.stringify({ body: text }),
  });
}

export async function deleteNote(noteId: string) {
  return userApiFetch<any>(`/notes/${noteId}`, { method: "DELETE" });
}

// ─── Streaks & Activity ───────────────────────────────────────────

export async function fetchStreaks(): Promise<{ success: boolean; data: StreakItem }> {
  try {
    const res = await userApiFetch<{ success: boolean; data: Array<{ id: string; days: number; status: string }> }>("/streaks?type=QURAN");
    if (res.success && Array.isArray(res.data)) {
      const activeStreak = res.data.find((s) => s.status === "ACTIVE");
      const currentStreak = activeStreak ? activeStreak.days : 0;
      const longestStreak = res.data.reduce((max, s) => Math.max(max, s.days), 0);
      return {
        success: true,
        data: { currentStreak, longestStreak },
      };
    }
    return { success: false, data: { currentStreak: 0, longestStreak: 0 } };
  } catch {
    return { success: false, data: { currentStreak: 0, longestStreak: 0 } };
  }
}

export async function fetchActivityDays(params?: { from?: string; to?: string }): Promise<{ success: boolean; data: ActivityDay[] }> {
  try {
    const qp = new URLSearchParams();
    qp.set("type", "QURAN");
    if (params?.from) qp.set("from", params.from);
    if (params?.to) qp.set("to", params.to);
    const qs = qp.toString();
    return await userApiFetch<{ success: boolean; data: ActivityDay[] }>(`/activity-days?${qs}`);
  } catch {
    return { success: false, data: [] };
  }
}

export async function addOrUpdateActivityDay(data: { date: string; duration?: number; pagesRead?: number }) {
  return userApiFetch<any>("/activity-days", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ─── Reading Sessions ─────────────────────────────────────────────

export async function fetchReadingSessions(params?: { from?: string; to?: string; first?: number }): Promise<{ success: boolean; data: ReadingSession[] }> {
  try {
    const qp = new URLSearchParams();
    if (params?.from) qp.set("from", params.from);
    if (params?.to) qp.set("to", params.to);
    if (params?.first) qp.set("first", String(params.first));
    const qs = qp.toString();
    return await userApiFetch<{ success: boolean; data: ReadingSession[] }>(`/reading-sessions${qs ? `?${qs}` : ""}`);
  } catch {
    return { success: false, data: [] };
  }
}

// ─── Goals ────────────────────────────────────────────────────────

export async function fetchGoals(): Promise<{ success: boolean; data: Goal[] }> {
  try {
    const res = await fetchTodaysGoalPlan();
    if (res.success && res.data && res.data.hasGoal) {
      const plan = res.data;
      const isPages = plan.dailyTargetPages && plan.dailyTargetPages > 0;
      const targetAmount = isPages ? plan.dailyTargetPages : (plan.dailyTargetSeconds || 0);
      const currentAmount = isPages ? plan.pagesRead : (plan.secondsRead || 0);
      const typeLabel = isPages ? "قراءة الصفحات اليومية" : "وقت القراءة اليومي";

      const goal: Goal = {
        id: plan.goalId || plan.id || "today-goal",
        type: typeLabel,
        targetAmount: Math.round(targetAmount * 10) / 10,
        currentAmount: Math.round((currentAmount || 0) * 10) / 10,
        isCompleted: plan.progress >= 1,
      };
      return { success: true, data: [goal] };
    }
    return { success: true, data: [] };
  } catch {
    return { success: false, data: [] };
  }
}

export async function fetchTodaysGoalPlan(): Promise<{ success: boolean; data: any }> {
  try {
    const qp = new URLSearchParams({
      type: "QURAN_TIME",
      mushafId: "1",
    });
    return await userApiFetch<{ success: boolean; data: any }>(`/goals/get-todays-plan?${qp.toString()}`);
  } catch {
    return { success: false, data: null };
  }
}

// ─── Preferences ──────────────────────────────────────────────────

export async function fetchUserPreferences(): Promise<{ success: boolean; data: Preference[] }> {
  try {
    return await userApiFetch<{ success: boolean; data: Preference[] }>("/preferences");
  } catch {
    return { success: false, data: [] };
  }
}

// ─── User Profile ─────────────────────────────────────────────────

export async function fetchUserProfile(): Promise<{ success: boolean; data: UserProfile }> {
  return userApiFetch<{ success: boolean; data: UserProfile }>("/users/profile");
}
