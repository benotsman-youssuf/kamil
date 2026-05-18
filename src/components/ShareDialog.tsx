import { useState, useEffect } from "react";
import { getDb, pushPageToServer } from "@/lib/rxdb";
import { getTokens, getValidAccessToken } from "@/lib/qf/auth";
import { QF_CONFIG } from "@/lib/qf/config";
import { Share2, Globe, Lock, Copy, Check, Loader2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface ShareDialogProps {
  pageId: string;
}

export function ShareDialog({ pageId }: ShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [remoteId, setRemoteId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    getDb().then((db) => {
      db.pages.findOne(pageId).exec().then((page: any) => {
        if (page) {
          setRemoteId(page.id);
          if (getTokens()?.access_token) {
            fetchPageStatus(page.id);
          }
        }
      });
    });
  }, [open, pageId]);

  const fetchPageStatus = async (id: string) => {
    try {
      const token = await getValidAccessToken();
      if (!token) return;

      const res = await fetch(`${QF_CONFIG.apiBaseUrl}/pages/${id}`, {
        headers: { "x-auth-token": token },
      });
      if (res.ok) {
        const data = await res.json();
        setIsPublic(data.page?.is_public || false);
      }
    } catch {
      // silent
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const db = await getDb();
      const page = await db.pages.findOne(pageId).exec();
      if (!page) return;

      const pageData = page.toJSON();
      const data = await pushPageToServer([{
        id: pageData.id,
        name: pageData.name || pageData.title,
        title: pageData.title || pageData.name,
        content: pageData.content,
        description: pageData.description || "",
        is_public: false,
        is_fork: pageData.is_fork ?? false,
        fork_count: pageData.fork_count ?? 0,
        forked_from: pageData.forked_from || "",
        created_at: pageData.created_at,
        updated_at: pageData.updated_at,
        isPinned: pageData.isPinned ?? false,
      }]);

      const result = data?.synced?.[0];
      if (result?.id) {
        setRemoteId(result.id);
        toast.success("تمت المزامنة");
      }
    } catch {
      toast.error("فشل المزامنة");
    } finally {
      setSyncing(false);
    }
  };

  const handleTogglePublic = async () => {
    if (!remoteId) {
      await handleSync();
      return;
    }

    setLoading(true);
    try {
      const token = await getValidAccessToken();
      if (!token) return;

      const res = await fetch(`${QF_CONFIG.apiBaseUrl}/pages/${remoteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ is_public: !isPublic }),
      });

      if (!res.ok) throw new Error("Toggle failed");

      setIsPublic(!isPublic);
      toast.success(isPublic ? "تم إخفاء المقالة" : "تم نشر المقالة");
    } catch {
      toast.error("فشل التحديث");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!remoteId) return;
    const url = `${window.location.origin}/read/${remoteId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("تم نسخ الرابط");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="p-1.5 h-9 w-9 inline-flex items-center justify-center rounded-md text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
          title="مشاركة"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            مشاركة المقالة
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Public toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-3">
              {isPublic ? (
                <Globe className="h-5 w-5 text-emerald-500" />
              ) : (
                <Lock className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium">
                  {isPublic ? "منشورة للعامة" : "خاصة"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isPublic
                    ? "يمكن لأي شخص قراءة هذه المقالة"
                    : "يمكنك فقط قراءة هذه المقالة"
                  }
                </p>
              </div>
            </div>
            <Switch
              checked={isPublic}
              onCheckedChange={handleTogglePublic}
              disabled={loading || syncing}
            />
          </div>

          {/* Sync status */}
          {!remoteId && (
            <div className="p-4 rounded-lg border bg-amber-500/5 text-amber-600 dark:text-amber-400">
              <p className="text-sm font-medium mb-2">هذه الصفحة غير متزامنة مع السحابة</p>
              <p className="text-xs mb-3">يجب مزامنة الصفحة أولاً لنشرها</p>
              <Button
                size="sm"
                onClick={handleSync}
                disabled={syncing}
                className="w-full"
              >
                {syncing ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : null}
                مزامنة ونشر
              </Button>
            </div>
          )}

          {/* Copy link */}
          {isPublic && remoteId && (
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={`${window.location.origin}/read/${remoteId}`}
                className="flex-1 px-3 py-2 bg-muted border rounded-lg text-sm font-mono"
              />
              <Button size="sm" variant="outline" onClick={handleCopyLink}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
