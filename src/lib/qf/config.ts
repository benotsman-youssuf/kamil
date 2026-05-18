const ENV = import.meta.env.VITE_ENV || "prelive";
const isDev = import.meta.env.DEV;

export const QF_CONFIG = {
  env: ENV,
  isProduction: ENV === "production",
  clientId: import.meta.env.VITE_CLIENT_ID,
  authBaseUrl: import.meta.env.VITE_OAUTH_ENDPOINT,
  apiBaseUrl: import.meta.env.VITE_API_BASE || "",
  tokenBaseUrl: isDev ? "/proxy-auth" : "/api/auth",
  proxyBaseUrl: isDev ? "/proxy-auth" : "/api/auth",
  redirectUri: import.meta.env.VITE_REDIRECT_URI,
};
