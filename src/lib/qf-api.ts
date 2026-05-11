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
const USER_ACCESS_TOKEN = getEnv("VITE_QF_USER_ACCESS_TOKEN");

async function getClientAccessToken() {
  if (tokenCache && Date.now() < tokenCache.expiresAt) return tokenCache.accessToken;
  if (!CLIENT_ID || !CLIENT_SECRET) throw new Error("Missing QF client credentials.");

  const resp = await fetch(`${AUTH_BASE_URL}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: CLIENT_ID, client_secret: CLIENT_SECRET }),
  });
  if (!resp.ok) throw new Error(`Auth failed (${resp.status})`);

  const data = await resp.json();
  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + (Number(data.expires_in || 3600) - 30) * 1000,
  };
  return tokenCache.accessToken;
}

async function qfGet(path: string) {
  const token = await getClientAccessToken();
  const resp = await fetch(`${API_BASE_URL}${path}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!resp.ok) throw new Error(`QF API error (${resp.status}) for ${path}`);
  return resp.json();
}

export async function fetchVerseContent(verseKey: string) {
  const verse = await qfGet(`/content/api/v4/verses/by_key/${verseKey}`);
  const [translations, tafsir, recitation] = await Promise.allSettled([
    qfGet(`/content/api/v4/verses/by_key/${verseKey}/translations?translations=131`),
    qfGet(`/content/api/v4/verses/by_key/${verseKey}/tafsirs?tafsirs=169`),
    qfGet(`/content/api/v4/recitations/7/by_ayah/${verseKey}`),
  ]);

  return {
    verse: verse?.verse ?? null,
    translations: translations.status === "fulfilled" ? translations.value : null,
    tafsir: tafsir.status === "fulfilled" ? tafsir.value : null,
    audio: recitation.status === "fulfilled" ? recitation.value : null,
  };
}

export async function createBookmark(verseKey: string) {
  const token = USER_ACCESS_TOKEN || (await getClientAccessToken());
  const resp = await fetch(`${API_BASE_URL}/user/api/v1/bookmarks`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ key: verseKey }),
  });
  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`Bookmark API error (${resp.status}): ${body}`);
  }
  return resp.json();
}
