import { db } from "@/lib/db";
import { flushSyncQueue, hasUserApiCredentials } from "@/lib/qf-sync";
import { useLiveQuery } from "dexie-react-hooks";
import { CloudOff, CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SyncStatusBadge() {
  const pending = useLiveQuery(
    () => db.syncQueue.where("status").equals("pending").count(),
    [],
    0
  );
  const failed = useLiveQuery(
    () => db.syncQueue.where("status").equals("failed").count(),
    [],
    0
  );

  if (!hasUserApiCredentials()) {
    return (
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <CloudOff className="h-3.5 w-3.5" />
        مزامنة سحابية غير مفعلة
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="flex items-center gap-1 text-muted-foreground">
        <CloudUpload className="h-3.5 w-3.5" />
        {pending} انتظار / {failed} فشل
      </div>
      <Button
        size="sm"
        variant="outline"
        className="h-6 px-2 text-xs"
        onClick={() => void flushSyncQueue()}
      >
        مزامنة الآن
      </Button>
    </div>
  );
}
