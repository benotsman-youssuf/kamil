import { useState, useEffect, useCallback } from "react";
import { getSyncStatus, onSyncStatusChange, sync, pullFromRemote, pushToRemote, type SyncStatus } from "@/lib/sync";

export function useSync() {
  const [status, setStatus] = useState<SyncStatus>(getSyncStatus());

  useEffect(() => {
    return onSyncStatusChange(setStatus);
  }, []);

  const doSync = useCallback(async () => {
    try {
      await sync();
    } catch {
      // Error is already reflected in status
    }
  }, []);

  const doPull = useCallback(async () => {
    try {
      await pullFromRemote();
    } catch {
      // Error is already reflected in status
    }
  }, []);

  const doPush = useCallback(async () => {
    try {
      await pushToRemote();
    } catch {
      // Error is already reflected in status
    }
  }, []);

  return {
    status,
    sync: doSync,
    pull: doPull,
    push: doPush,
    isSyncing: status.state === "syncing",
  };
}
