import { QF_CONFIG } from "./config";
import { createRemoteJWKSet, jwtVerify } from "jose";

const AUTH_BASE_URL = QF_CONFIG.authBaseUrl;
const TOKEN_BASE_URL = QF_CONFIG.tokenBaseUrl;
const PROXY_BASE_URL = QF_CONFIG.proxyBaseUrl;
const CLIENT_ID = QF_CONFIG.clientId;
const REDIRECT_URI = QF_CONFIG.redirectUri;

const JWKS_URL = TOKEN_BASE_URL.startsWith("http")
  ? `${TOKEN_BASE_URL}/jwks`
  : `${window.location.origin}${TOKEN_BASE_URL}/jwks`;

const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

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

  const requestedScope = scope || "openid offline_access user collection bookmark note goal streak activity_day";

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

interface DecodedIdToken {
  sub: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  nonce?: string;
  iss: string;
  aud: string[];
  exp: number;
  iat: number;
}

async function verifyIdToken(idToken: string, expectedNonce: string | null): Promise<DecodedIdToken> {
  const { payload } = await jwtVerify(idToken, JWKS, {
    audience: CLIENT_ID,
  });

  const decoded = payload as unknown as DecodedIdToken;

  if (expectedNonce && decoded.nonce !== expectedNonce) {
    throw new Error("Nonce mismatch - possible replay attack");
  }

  return decoded;
}

export async function handleCallback(code: string, state: string): Promise<TokenSet> {
  const savedState = localStorage.getItem("qf_auth_state");
  const savedNonce = localStorage.getItem("qf_nonce");
  const codeVerifier = localStorage.getItem("qf_code_verifier");

  if (state !== savedState) {
    throw new Error("State mismatch - possible CSRF attack");
  }

  const response = await fetch(`${TOKEN_BASE_URL}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const hint = data.error_hint || data.error_description || data.error || "Unknown error";
    throw new Error(`Token exchange failed: ${hint}`);
  }

  if (data.id_token) {
    await verifyIdToken(data.id_token, savedNonce);
  }

  data.expires_at = Date.now() + (data.expires_in * 1000);

  localStorage.setItem("qf_tokens", JSON.stringify(data));
  localStorage.removeItem("qf_auth_state");
  localStorage.removeItem("qf_code_verifier");
  localStorage.removeItem("qf_nonce");

  return data;
}

let refreshPromise: Promise<TokenSet | null> | null = null;

export async function refreshTokens(): Promise<TokenSet | null> {
  if (refreshPromise) return refreshPromise;

  const tokens = getTokensRaw();
  if (!tokens?.refresh_token) return null;

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${TOKEN_BASE_URL}/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "refresh_token",
          refresh_token: tokens.refresh_token,
        }),
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
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
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
  localStorage.removeItem("qf_tokens");
  localStorage.removeItem("qf_auth_state");
  localStorage.removeItem("qf_code_verifier");
  localStorage.removeItem("qf_nonce");
  window.location.href = "/";
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
    const response = await fetch(`${PROXY_BASE_URL}/userinfo`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export function getUserId(): string | null {
  const tokens = getTokensRaw();
  if (!tokens?.id_token) return null;

  try {
    const parts = tokens.id_token.split(".");
    const payload = JSON.parse(atob(parts[1]));
    return payload.sub || null;
  } catch {
    return null;
  }
}

let cachedContentToken: string | null = null;
let cachedContentTokenExpiry = 0;

export async function fetchContentToken(): Promise<string | null> {
  if (cachedContentToken && Date.now() < cachedContentTokenExpiry - 60000) return cachedContentToken;

  try {
    const response = await fetch(`${TOKEN_BASE_URL}/content-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) return null;

    const data = await response.json();
    cachedContentToken = data.access_token;
    cachedContentTokenExpiry = Date.now() + (data.expires_in * 1000);
    return cachedContentToken;
  } catch {
    return null;
  }
}
