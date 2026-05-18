import { createRxDatabase, type RxDatabase, type RxCollection } from "rxdb/plugins/core";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { replicateRxCollection } from "rxdb/plugins/replication";
import { getValidAccessToken } from "@/lib/qf/auth";
import { QF_CONFIG } from "@/lib/qf/config";

export type PageDocType = {
  id: string;
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
  },
  required: ["id", "title", "content", "created_at", "updated_at"],
};

let dbInstance: KamilDatabase | null = null;
let replicationInstance: any = null;

export async function getDb(): Promise<KamilDatabase> {
  if (dbInstance) return dbInstance;
  const db = await createRxDatabase<KamilDatabase>({
    name: "kamil",
    storage: getRxStorageDexie(),
  });
  await db.addCollections({
    pages: {
      schema: PAGE_SCHEMA,
    },
  });
  dbInstance = db;
  return db;
}

async function getAuthToken(): Promise<string | null> {
  return getValidAccessToken();
}

export async function startSync() {
  const db = await getDb();
  const token = await getAuthToken();
  if (!token) return;

  if (replicationInstance) {
    await replicationInstance.cancel();
    replicationInstance = null;
  }

  const rep = replicateRxCollection({
    replicationIdentifier: "kamil-sync",
    collection: db.pages,
    pull: {
      handler: async (checkpoint: string | undefined, batchSize: number) => {
        const token = await getAuthToken();
        if (!token) return { documents: [], checkpoint };

        const since = checkpoint || "";
        const url = `${QF_CONFIG.apiBaseUrl}/sync?since=${encodeURIComponent(since)}&limit=${batchSize}`;
        const res = await fetch(url, {
          headers: { "x-auth-token": token },
        });
        if (!res.ok) throw new Error(`Pull failed: ${res.status}`);

        const data = await res.json();
        const pages = (data.pages || []).map((p: any) => ({
          id: p.id,
          name: p.name || p.title,
          title: p.title || p.name,
          content:
            typeof p.content === "string"
              ? p.content
              : JSON.stringify(p.content),
          description: p.description || "",
          is_public: p.is_public ?? false,
          is_fork: p.is_fork ?? false,
          fork_count: p.fork_count ?? 0,
          forked_from: p.forked_from || "",
          created_at: p.created_at,
          updated_at: p.updated_at,
          isPinned: p.isPinned ?? false,
        }));

        const lastDoc = pages[pages.length - 1];
        return {
          documents: pages,
          checkpoint: lastDoc?.updated_at || checkpoint,
        };
      },
      batchSize: 50,
    },
    push: {
      handler: async (rows) => {
        const token = await getAuthToken();
        if (!token) return rows.map((r) => (r as any).newDocumentState);

        const pages = rows.map((row: any) => ({
          id: row.newDocumentState.id,
          name: row.newDocumentState.name || row.newDocumentState.title,
          title: row.newDocumentState.title || row.newDocumentState.name,
          content: row.newDocumentState.content,
          description: row.newDocumentState.description || "",
          is_public: row.newDocumentState.is_public ?? false,
          is_fork: row.newDocumentState.is_fork ?? false,
          fork_count: row.newDocumentState.fork_count ?? 0,
          forked_from: row.newDocumentState.forked_from || "",
          created_at: row.newDocumentState.created_at,
          updated_at: row.newDocumentState.updated_at,
          isPinned: row.newDocumentState.isPinned ?? false,
        }));

        const url = `${QF_CONFIG.apiBaseUrl}/sync`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({ pages }),
        });
        if (!res.ok) throw new Error(`Push failed: ${res.status}`);

        return rows.map((r: any) => r.newDocumentState);
      },
      batchSize: 50,
    },
    live: true,
    retryTime: 5000,
    autoStart: true,
  });

  (rep as any).error$.subscribe((err: any) => console.error("[rxdb-sync]", err));
  replicationInstance = rep;
  return rep;
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
  const token = await getAuthToken();
  if (token) {
    return startSync().catch((err) => console.error("[rxdb] sync start failed", err));
  }
}

export async function pushPageToServer(pages: any[]) {
  const token = await getAuthToken();
  if (!token) return null;

  const url = `${QF_CONFIG.apiBaseUrl}/sync`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": token,
    },
    body: JSON.stringify({ pages }),
  });
  if (!res.ok) throw new Error(`Push failed: ${res.status}`);
  return res.json();
}
