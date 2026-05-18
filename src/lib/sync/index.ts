import { db } from "@/lib/db";
import type { Page } from "@/lib/db";

export interface SyncStatus {
  state: "idle" | "syncing" | "success" | "error";
  message?: string;
  lastSync?: string;
}

let currentStatus: SyncStatus = { state: "idle" };
const listeners = new Set<(status: SyncStatus) => void>();

export function getSyncStatus(): SyncStatus {
  return { ...currentStatus };
}

export function onSyncStatusChange(fn: (status: SyncStatus) => void): () => void {
  listeners.add(fn);
  fn(currentStatus);
  return () => listeners.delete(fn);
}

function setStatus(status: SyncStatus) {
  currentStatus = status;
  listeners.forEach((fn) => fn(status));
}

function getAuthToken(): string | null {
  try {
    const raw = localStorage.getItem("qf_tokens");
    if (!raw) return null;
    const tokens = JSON.parse(raw);
    return tokens.access_token || null;
  } catch {
    return null;
  }
}

async function apiFetch(path: string, options?: RequestInit) {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": token,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `API error: ${res.status}`);
  }

  return res.json();
}

export async function pullFromRemote(): Promise<{ synced: number }> {
  setStatus({ state: "syncing", message: "Pulling from cloud..." });

  try {
    // Get last sync timestamp
    const lastSync = localStorage.getItem("kamil_last_sync");

    const url = new URL("/api/sync", window.location.origin);
    if (lastSync) url.searchParams.set("since", lastSync);

    const data = await apiFetch(url.pathname + url.search);

    const remotePages = data.pages || [];
    let syncedCount = 0;

    for (const remotePage of remotePages) {
      // Check if we have this page locally
      const existing = await db.pages.where("remoteId").equals(remotePage.id).first();

      if (existing) {
        // Compare timestamps
        const localTime = new Date(existing.updatedAt).getTime();
        const remoteTime = new Date(remotePage.updated_at).getTime();

        if (remoteTime > localTime) {
          // Remote is newer, update local
          await db.pages.update(existing.id, {
            name: remotePage.title,
            content: JSON.stringify(remotePage.content),
            updatedAt: remotePage.updated_at,
            synced: true,
            syncedAt: new Date().toISOString(),
          });
          syncedCount++;
        }
      } else {
        // New page from cloud, add to local
        await db.pages.add({
          name: remotePage.title,
          description: "",
          content: JSON.stringify(remotePage.content),
          createdAt: remotePage.created_at,
          updatedAt: remotePage.updated_at,
          isPinned: false,
          remoteId: remotePage.id,
          synced: true,
          syncedAt: new Date().toISOString(),
        });
        syncedCount++;
      }
    }

    localStorage.setItem("kamil_last_sync", new Date().toISOString());
    setStatus({
      state: "success",
      message: `Pulled ${syncedCount} page(s)`,
      lastSync: new Date().toISOString(),
    });

    return { synced: syncedCount };
  } catch (e: any) {
    setStatus({ state: "error", message: e.message });
    throw e;
  }
}

export async function pushToRemote(): Promise<{ synced: number }> {
  setStatus({ state: "syncing", message: "Pushing to cloud..." });

  try {
    // Find pages that have been modified since last sync
    const lastSync = localStorage.getItem("kamil_last_sync");
    const unsyncedPages = await db.pages
      .filter((page) => {
        if (!page.remoteId && !page.synced) return true;
        if (!lastSync) return true;
        return new Date(page.updatedAt).getTime() > new Date(lastSync).getTime();
      })
      .toArray();

    if (unsyncedPages.length === 0) {
      setStatus({ state: "success", message: "Already up to date", lastSync: lastSync || undefined });
      return { synced: 0 };
    }

    const pages = unsyncedPages.map((page) => ({
      id: page.remoteId || crypto.randomUUID(),
      title: page.name,
      content: JSON.parse(page.content),
      is_public: false,
      created_at: page.createdAt,
      updated_at: page.updatedAt,
    }));

    const data = await apiFetch("/api/sync", {
      method: "POST",
      body: JSON.stringify({ pages }),
    });

    // Update local pages with remote IDs
    const results = data.synced || [];
    for (const result of results) {
      if (result.action === "upserted") {
        const localPage = unsyncedPages.find((p) => p.remoteId === result.id || !p.remoteId);
        if (localPage) {
          await db.pages.update(localPage.id, {
            remoteId: result.id,
            synced: true,
            syncedAt: new Date().toISOString(),
          });
        }
      }
    }

    const now = new Date().toISOString();
    localStorage.setItem("kamil_last_sync", now);
    setStatus({
      state: "success",
      message: `Pushed ${results.length} page(s)`,
      lastSync: now,
    });

    return { synced: results.length };
  } catch (e: any) {
    setStatus({ state: "error", message: e.message });
    throw e;
  }
}

export async function sync(): Promise<{ pushed: number; pulled: number }> {
  setStatus({ state: "syncing", message: "Syncing..." });

  try {
    const pushed = await pushToRemote();
    const pulled = await pullFromRemote();

    return { pushed: pushed.synced, pulled: pulled.synced };
  } catch (e: any) {
    setStatus({ state: "error", message: e.message });
    throw e;
  }
}

export async function syncSinglePage(page: Page): Promise<void> {
  try {
    const pages = [{
      id: page.remoteId || crypto.randomUUID(),
      title: page.name,
      content: JSON.parse(page.content),
      is_public: false,
      created_at: page.createdAt,
      updated_at: page.updatedAt,
    }];

    const data = await apiFetch("/api/sync", {
      method: "POST",
      body: JSON.stringify({ pages }),
    });

    const result = data.synced?.[0];
    if (result?.action === "upserted") {
      await db.pages.update(page.id, {
        remoteId: result.id,
        synced: true,
        syncedAt: new Date().toISOString(),
      });
    }
  } catch {
    // Silently fail for single page sync (auto-save)
  }
}
