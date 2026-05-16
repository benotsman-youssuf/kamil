import { QF_CONFIG } from "./config";

const AUTH_BASE_URL = QF_CONFIG.authBaseUrl;
const TOKEN_BASE_URL = QF_CONFIG.tokenBaseUrl;
const CLIENT_ID = QF_CONFIG.clientId;
const CLIENT_SECRET = QF_CONFIG.clientSecret;
const REDIRECT_URI = QF_CONFIG.redirectUri;

function base64URLEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function randomBytes(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return base64URLEncode(array.buffer);
}

interface PkcePair {
  codeVerifier: string;
  codeChallenge: string;
}

async function generatePkcePair(): Promise<PkcePair> {
  const codeVerifier = randomBytes(32);
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const codeChallenge = base64URLEncode(digest);
  return { codeVerifier, codeChallenge };
}

export async function login(scope?: string) {
  const state = randomBytes(16);
  const nonce = randomBytes(16);
  const { codeVerifier, codeChallenge } = await generatePkcePair();

  localStorage.setItem("qf_auth_state", state);
  localStorage.setItem("qf_nonce", nonce);
  localStorage.setItem("qf_code_verifier", codeVerifier);

  const requestedScope = scope || "openid offline_access user collection";

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    scope: requestedScope,
    redirect_uri: REDIRECT_URI,
    state,
    nonce,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  window.location.href = `${AUTH_BASE_URL}/oauth2/auth?${params.toString()}`;
}

interface TokenSet {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  expires_in: number;
  scope?: string;
  token_type?: string;
  expires_at?: number;
}

export async function handleCallback(code: string, state: string): Promise<TokenSet> {
  const savedState = localStorage.getItem("qf_auth_state");
  const codeVerifier = localStorage.getItem("qf_code_verifier");

  if (state !== savedState) {
    throw new Error("State mismatch - possible CSRF attack");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier!,
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  if (CLIENT_SECRET) {
    const basicAuth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    headers["Authorization"] = `Basic ${basicAuth}`;
  }

  const response = await fetch(`${TOKEN_BASE_URL}/oauth2/token`, {
    method: "POST",
    headers,
    body,
  });

  const data = await response.json();

  if (!response.ok) {
    const hint = data.error_hint || data.error_description || data.error || "Unknown error";
    throw new Error(`Token exchange failed: ${hint}`);
  }

  data.expires_at = Date.now() + (data.expires_in * 1000);

  localStorage.setItem("qf_tokens", JSON.stringify(data));
  localStorage.removeItem("qf_auth_state");
  localStorage.removeItem("qf_code_verifier");
  localStorage.removeItem("qf_nonce");

  return data;
}

export async function refreshTokens(): Promise<TokenSet | null> {
  const tokens = getTokensRaw();
  if (!tokens?.refresh_token) return null;

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: tokens.refresh_token,
    client_id: CLIENT_ID,
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  if (CLIENT_SECRET) {
    const basicAuth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    headers["Authorization"] = `Basic ${basicAuth}`;
  }

  try {
    const response = await fetch(`${TOKEN_BASE_URL}/oauth2/token`, {
      method: "POST",
      headers,
      body,
    });

    if (!response.ok) {
      logout();
      return null;
    }

    const data: TokenSet = await response.json();
    data.expires_at = Date.now() + (data.expires_in * 1000);
    localStorage.setItem("qf_tokens", JSON.stringify(data));
    return data;
  } catch {
    logout();
    return null;
  }
}

export function getTokens(): TokenSet | null {
  const raw = getTokensRaw();
  if (!raw) return null;
  return raw;
}

function getTokensRaw(): TokenSet | null {
  try {
    const raw = localStorage.getItem("qf_tokens");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function getValidAccessToken(): Promise<string | null> {
  const tokens = getTokensRaw();
  if (!tokens?.access_token) return null;

  if (tokens.expires_at && Date.now() >= tokens.expires_at - 60000) {
    const refreshed = await refreshTokens();
    return refreshed?.access_token ?? null;
  }

  return tokens.access_token;
}

export function logout() {
  const tokens = getTokensRaw();
  const idToken = tokens?.id_token;

  localStorage.removeItem("qf_tokens");
  localStorage.removeItem("qf_auth_state");
  localStorage.removeItem("qf_code_verifier");
  localStorage.removeItem("qf_nonce");

  if (idToken) {
    const params = new URLSearchParams({
      id_token_hint: idToken,
      post_logout_redirect_uri: window.location.origin,
    });
    window.location.href = `${AUTH_BASE_URL}/oauth2/sessions/logout?${params.toString()}`;
  } else {
    window.location.href = "/";
  }
}

export async function fetchUserInfo(): Promise<{
  sub?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
} | null> {
  const token = await getValidAccessToken();
  if (!token) return null;

  try {
    const response = await fetch(`${AUTH_BASE_URL}/userinfo`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function fetchContentToken(): Promise<string | null> {
  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  if (CLIENT_SECRET) {
    const basicAuth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    headers["Authorization"] = `Basic ${basicAuth}`;
  }

  try {
    const response = await fetch(`${TOKEN_BASE_URL}/oauth2/token`, {
      method: "POST",
      headers,
      body: new URLSearchParams({
        grant_type: "client_credentials",
        scope: "content",
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.access_token;
  } catch {
    return null;
  }
}
