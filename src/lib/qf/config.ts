const ENV = import.meta.env.VITE_QF_ENV || "prelive";
const isDev = import.meta.env.DEV;

function getDefaultRedirectUri(): string {
  return `${window.location.origin}/callback`;
}

interface QFConfig {
  clientId: string;
  clientSecret: string;
  authBaseUrl: string;
  apiBaseUrl: string;
  redirectUri: string;
  tokenBaseUrl: string;
  env: string;
  isProduction: boolean;
}

function getConfig(): QFConfig {
  const isQfProduction = ENV === "production" || ENV === "prod";

  if (isQfProduction) {
    return {
      env: "production",
      isProduction: true,
      clientId: import.meta.env.VITE_QF_PROD_CLIENT_ID || import.meta.env.VITE_QF_CLIENT_ID,
      clientSecret: import.meta.env.VITE_QF_PROD_CLIENT_SECRET || import.meta.env.VITE_QF_CLIENT_SECRET,
      authBaseUrl: import.meta.env.VITE_QF_PROD_AUTH_BASE_URL || "https://oauth2.quran.foundation",
      apiBaseUrl: import.meta.env.VITE_QF_PROD_API_BASE_URL || "https://apis.quran.foundation",
      tokenBaseUrl: isDev ? "/proxy-auth" : import.meta.env.VITE_QF_PROD_AUTH_BASE_URL || "https://oauth2.quran.foundation",
      redirectUri: import.meta.env.VITE_QF_PROD_REDIRECT_URI || import.meta.env.VITE_QF_REDIRECT_URI || getDefaultRedirectUri(),
    };
  }

  return {
    env: "prelive",
    isProduction: false,
    clientId: import.meta.env.VITE_QF_PRELIVE_CLIENT_ID || import.meta.env.VITE_QF_CLIENT_ID,
    clientSecret: import.meta.env.VITE_QF_PRELIVE_CLIENT_SECRET || import.meta.env.VITE_QF_CLIENT_SECRET,
    authBaseUrl: import.meta.env.VITE_QF_PRELIVE_AUTH_BASE_URL || import.meta.env.VITE_QF_AUTH_BASE_URL || "https://prelive-oauth2.quran.foundation",
    apiBaseUrl: isDev ? "/proxy-api" : import.meta.env.VITE_QF_PRELIVE_API_BASE_URL || import.meta.env.VITE_QF_API_BASE_URL || "https://apis-prelive.quran.foundation",
    tokenBaseUrl: isDev ? "/proxy-auth" : import.meta.env.VITE_QF_PRELIVE_AUTH_BASE_URL || import.meta.env.VITE_QF_AUTH_BASE_URL || "https://prelive-oauth2.quran.foundation",
    redirectUri: import.meta.env.VITE_QF_PRELIVE_REDIRECT_URI || import.meta.env.VITE_QF_REDIRECT_URI || getDefaultRedirectUri(),
  };
}

export const QF_CONFIG = getConfig();
