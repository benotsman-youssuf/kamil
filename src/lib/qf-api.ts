export type VerseRef = {
  surah: string;
  ayah: number;
  verseKey: string;
  text?: string;
};

type TokenCache = {
  accessToken: string;
  expiresAt: number;
} | null;

let tokenCache: TokenCache = null;

const getEnv = (key: string, fallback = "") =>
  (import.meta.env[key] as string | undefined) ?? fallback;

const API_BASE_URL = getEnv("VITE_QF_API_BASE_URL", "https://apis-prelive.quran.foundation");
const AUTH_BASE_URL = getEnv("VITE_QF_AUTH_BASE_URL", "https://prelive-oauth2.quran.foundation");
const CLIENT_ID = getEnv("VITE_QF_CLIENT_ID");
const CLIENT_SECRET = getEnv("VITE_QF_CLIENT_SECRET");

async function getAccessToken() {
  if (tokenCache && Date.now() < tokenCache.expiresAt) return tokenCache.accessToken;
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("QF credentials are missing. Set VITE_QF_CLIENT_ID and VITE_QF_CLIENT_SECRET.");
  }

  const resp = await fetch(`${AUTH_BASE_URL}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  if (!resp.ok) throw new Error("Failed to authenticate with Quran Foundation APIs");
  const data = await resp.json();
  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + (Number(data.expires_in) - 30) * 1000,
  };
  return tokenCache.accessToken;
}

async function qfGet(path: string) {
  const token = await getAccessToken();
  const resp = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) throw new Error(`QF API error (${resp.status})`);
  return resp.json();
}

export async function fetchVerseContent(verse: VerseRef) {
  const [translations, tafsir, audio] = await Promise.allSettled([
    qfGet(`/content/api/v4/verses/by_key/${verse.verseKey}/translations?language=en`),
    qfGet(`/content/api/v4/verses/by_key/${verse.verseKey}/tafsirs`),
    qfGet(`/content/api/v4/chapter_recitations/7/${verse.verseKey.split(":")[0]}`),
  ]);

  return {
    translations: translations.status === "fulfilled" ? translations.value : null,
    tafsir: tafsir.status === "fulfilled" ? tafsir.value : null,
    audio: audio.status === "fulfilled" ? audio.value : null,
  };
}

export async function createBookmark(verse: VerseRef) {
  const token = await getAccessToken();
  const resp = await fetch(`${API_BASE_URL}/user/api/v1/bookmarks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: verse.verseKey,
      notes: "Saved from Kamil editor",
      folder_name: "Kamil Hackathon",
    }),
  });

  if (!resp.ok) throw new Error(`Bookmark API error (${resp.status})`);
  return resp.json();
}
