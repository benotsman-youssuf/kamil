import { createRxDatabase, addRxPlugin, type RxDatabase, type RxCollection } from "rxdb/plugins/core";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { replicateSupabase, RxSupabaseReplicationState } from "rxdb/plugins/replication-supabase";
import { createClient } from "@supabase/supabase-js";
import { getValidAccessToken } from "@/lib/qf/auth";
import { QF_CONFIG } from "@/lib/qf/config";

addRxPlugin(RxDBQueryBuilderPlugin);

export type PageDocType = {
  id: string;
  qf_user_id: string;
  name: string;
  title: string;
  content: string;
  description: string;
  is_public: boolean;
  is_fork: boolean;
  fork_count: number;
  forked_from: string;
  created_at: string;
  updated_at: string;
  isPinned?: boolean;
  _deleted?: boolean;
  like_count?: number;
};

export type PageCollection = RxCollection<PageDocType>;

export type KamilDatabase = RxDatabase<{
  pages: PageCollection;
}>;

export const PAGE_SCHEMA = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: { type: "string", maxLength: 100 },
    qf_user_id: { type: "string" },
    name: { type: "string" },
    title: { type: "string" },
    content: { type: "string" },
    description: { type: "string" },
    is_public: { type: "boolean" },
    is_fork: { type: "boolean" },
    fork_count: { type: "number" },
    forked_from: { type: "string" },
    created_at: { type: "string" },
    updated_at: { type: "string" },
    isPinned: { type: "boolean" },
    _deleted: { type: "boolean" },
    like_count: { type: "number" },
  },
  required: ["id", "qf_user_id", "title", "content", "created_at", "updated_at"],
};

let dbInstance: KamilDatabase | null = null;
let initPromise: Promise<KamilDatabase> | null = null;
let replicationInstance: RxSupabaseReplicationState<PageDocType> | null = null;
let syncPromise: Promise<RxSupabaseReplicationState<PageDocType> | void> | null = null;

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://zcedrrgiprkguvdxblvx.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjZWRycmdpcHJrZ3V2ZHhibHZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMzEzNTYsImV4cCI6MjA5NDcwNzM1Nn0.VwlnmuNO1QKQsoaK5xgZ8K71TG3dcstx3vSPbA5iY7M";

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function getDb(): Promise<KamilDatabase> {
  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;
  initPromise = createRxDatabase<KamilDatabase>({
    name: "kamil",
    storage: getRxStorageDexie(),
  }).then(async (db) => {
    await db.addCollections({
      pages: {
        schema: PAGE_SCHEMA,
      },
    });
    dbInstance = db;
    return db;
  });
  return initPromise;
}

function getUserIdFromToken(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload)).sub;
  } catch {
    return null;
  }
}

export async function syncFetch(path: string, options?: { method?: string; body?: any }) {
  const token = await getValidAccessToken();
  if (!token) throw new Error("Not authenticated");

  const url = `/api${path}`;
  const headers: Record<string, string> = {
    "Authorization": `Bearer ${token}`,
    "x-auth-token": token,
  };
  if (options?.body || options?.method === "POST" || options?.method === "PATCH") {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    method: options?.method || "GET",
    headers,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 401) {
    const refreshed = await getValidAccessToken();
    if (refreshed) {
      headers["Authorization"] = `Bearer ${refreshed}`;
      headers["x-auth-token"] = refreshed;
      const retryRes = await fetch(url, {
        method: options?.method || "GET",
        headers,
        body: options?.body ? JSON.stringify(options.body) : undefined,
      });
      if (!retryRes.ok) throw new Error(`sync request failed: ${retryRes.status}`);
      return retryRes.json();
    }
    throw new Error("Not authenticated");
  }

  if (!res.ok) throw new Error(`sync request failed: ${res.status}`);
  return res.json();
}

export async function startSync() {
  if (replicationInstance) {
    return replicationInstance;
  }
  if (syncPromise) {
    return syncPromise;
  }

  syncPromise = (async () => {
    const db = await getDb();
    const token = await getValidAccessToken();
    if (!token) return;

    const userId = getUserIdFromToken(token);

    const rep = replicateSupabase({
      tableName: "pages",
      client: supabaseClient,
      collection: db.pages,
      replicationIdentifier: "kamil-supabase-sync",
      live: true,
      pull: {
        batchSize: 50,
        modifier: (doc: any) => {
          if (userId && doc.qf_user_id !== userId) {
            return null;
          }
          return doc;
        },
        queryBuilder: ({ query }) => {
          if (userId) {
            return query.eq("qf_user_id", userId);
          }
          return query;
        },
      },
      push: {
        batchSize: 50,
      },
      modifiedField: "_modified",
      deletedField: "_deleted",
    });

    rep.error$.subscribe((err: any) => console.error("[rxdb-supabase-sync]", err));
    replicationInstance = rep;
    return rep;
  })();

  syncPromise.finally(() => { syncPromise = null; });
  return syncPromise;
}

export async function stopSync() {
  if (replicationInstance) {
    await replicationInstance.cancel();
    replicationInstance = null;
  }
}

export async function destroyDb() {
  await stopSync();
  if (dbInstance) {
    await (dbInstance as any).destroy();
    dbInstance = null;
  }
}

export async function startSyncIfAuthenticated() {
  const token = await getValidAccessToken();
  if (token) {
    return startSync().catch((err) => console.error("[rxdb] sync start failed", err));
  }
}

export async function apiRequest<T = any>(
  path: string,
  options?: { method?: string; body?: any }
): Promise<T> {
  const token = await getValidAccessToken();
  if (!token) throw new Error("Not authenticated");

  const url = `${QF_CONFIG.apiBaseUrl}${path}`;
  const headers: Record<string, string> = {
    "Authorization": `Bearer ${token}`,
    "x-auth-token": token,
  };
  if (options?.body || options?.method === "POST" || options?.method === "PATCH") {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    method: options?.method || "GET",
    headers,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 401) {
    const refreshed = await getValidAccessToken();
    if (refreshed) {
      headers["Authorization"] = `Bearer ${refreshed}`;
      headers["x-auth-token"] = refreshed;
      const retryRes = await fetch(url, {
        method: options?.method || "GET",
        headers,
        body: options?.body ? JSON.stringify(options.body) : undefined,
      });
      if (!retryRes.ok) throw new Error(`API request failed: ${retryRes.status}`);
      return retryRes.json();
    }
    throw new Error("Not authenticated");
  }

  if (!res.ok) throw new Error(`API request failed: ${res.status}`);
  return res.json();
}

export async function pushPageToServer(pages: any[]) {
  try {
    return await apiRequest("/sync", { method: "POST", body: { pages } });
  } catch {
    return null;
  }
}

export function getReplicationInstance() {
  return replicationInstance;
}

const WELCOME_CONTENT = [
  {
    type: "h1",
    children: [{ text: "مرحباً بك في كمّل" }],
  },
  {
    type: "p",
    children: [{ text: "أهلاً بك في مساحتك الخاصة! يمكنك البدء بكتابة أفكارك وملاحظاتك هنا." }],
  },
  {
    type: "p",
    children: [{ text: "استخدم اختصارات لوحة المفاتيح، أو القائمة العائمة لإضافة الآيات والأحاديث بكل سهولة." }],
  }
];

export async function createPage(name: string): Promise<string> {
  const db = await getDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const token = await getValidAccessToken();
  const userId = token ? getUserIdFromToken(token) : "";

  await db.pages.insert({
    id,
    qf_user_id: userId || "",
    name,
    title: name,
    content: JSON.stringify(WELCOME_CONTENT),
    description: "",
    created_at: now,
    updated_at: now,
    is_public: false,
    is_fork: false,
    fork_count: 0,
    forked_from: "",
    isPinned: false,
    _deleted: false,
    like_count: 0,
  });

  return id;
}