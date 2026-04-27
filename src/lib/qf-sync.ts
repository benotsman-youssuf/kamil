import { db } from "@/lib/db";

export type SyncAction = "create_bookmark";

export interface SyncQueueItemPayload {
  ayahText: string;
  surah: string;
  aya: number;
  verseKey: string;
}

const QF_ENDPOINT =
  import.meta.env.VITE_QF_ENDPOINT ||
  import.meta.env.VITE_QF_USER_API_BASE ||
  "";
const QF_CLIENT_ID = import.meta.env.VITE_QF_CLIENT_ID || "";
const QF_CLIENT_SECRET =
  import.meta.env.VITE_QF_CLIENT_SECRET ||
  import.meta.env.VITE_QF_USER_API_TOKEN ||
  "";

export function hasUserApiCredentials() {
  return Boolean(QF_ENDPOINT && QF_CLIENT_ID && QF_CLIENT_SECRET);
}

export async function enqueueBookmarkSync(payload: SyncQueueItemPayload) {
  await db.syncQueue.add({
    action: "create_bookmark",
    payload: JSON.stringify(payload),
    status: "pending",
    createdAt: new Date().toISOString(),
    lastError: "",
  });
}

async function pushBookmark(payload: SyncQueueItemPayload) {
  const response = await fetch(`${QF_ENDPOINT}/bookmarks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": QF_CLIENT_ID,
      "x-client-secret": QF_CLIENT_SECRET,
    },
    body: JSON.stringify({
      verse_key: payload.verseKey,
      notes: payload.ayahText,
      source: "kamil",
    }),
  });

  if (!response.ok) {
    throw new Error(`User API request failed with ${response.status}`);
  }
}

export async function flushSyncQueue() {
  if (!hasUserApiCredentials()) return;

  const pendingItems = await db.syncQueue.where("status").equals("pending").toArray();

  for (const item of pendingItems) {
    try {
      if (item.action === "create_bookmark") {
        await pushBookmark(JSON.parse(item.payload));
      }

      await db.syncQueue.update(item.id, {
        status: "done",
        lastError: "",
      });
    } catch (error) {
      await db.syncQueue.update(item.id, {
        status: "failed",
        lastError: error instanceof Error ? error.message : "Unknown sync error",
      });
    }
  }
}
