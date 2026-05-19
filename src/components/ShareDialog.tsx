import { useState, useEffect } from "react";
import { getDb, syncFetch } from "@/lib/rxdb";
import { Share2, Globe, Lock, Copy, Check, Loader2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareDialogProps {
  pageId: string;
}

export function ShareDialog({ pageId }: ShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPublic, setIsPublic] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setCopied(false);
    getDb()
      .then((db) => db.pages.findOne(pageId).exec())
      .then((page) => {
        setIsPublic(page?.toJSON().is_public ?? false);
      })
      .catch(() => setIsPublic(false));
  }, [open, pageId]);

  const publish = async () => {
    setLoading(true);
    setError(null);
    try {
      const db = await getDb();
      const page = await db.pages.findOne(pageId).exec();
      if (!page) throw new Error("Page not found");

      const pageData = page.toJSON();
      await syncFetch("/sync", {
        method: "POST",
        body: {
          pages: [{
            id: pageData.id,
            name: pageData.name || pageData.title,
            title: pageData.title || pageData.name,
            content: pageData.content,
            description: pageData.description || "",
            is_public: true,
            is_fork: pageData.is_fork ?? false,
            fork_count: pageData.fork_count ?? 0,
            forked_from: pageData.forked_from || "",
            created_at: pageData.created_at,
            updated_at: new Date().toISOString(),
            isPinned: pageData.isPinned ?? false,
          }],
        },
      });

      await page.patch({ is_public: true });
      setIsPublic(true);
      toast.success("تم نشر المقالة");
    } catch (e: any) {
      setError(e.message || "فشل النشر");
      toast.error("فشل نشر المقالة");
    } finally {
      setLoading(false);
    }
  };

  const unpublish = async () => {
    setLoading(true);
    setError(null);
    try {
      await syncFetch(`/pages/${pageId}`, {
        method: "PATCH",
        body: { is_public: false },
      });

      const db = await getDb();
      const doc = await db.pages.findOne(pageId).exec();
      if (doc) await doc.patch({ is_public: false });
      setIsPublic(false);
      toast.success("تم إخفاء المقالة");
    } catch (e: any) {
      setError(e.message || "فشل الإخفاء");
      toast.error("فشل إخفاء المقالة");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/read/${pageId}`;
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

        <div className="space-y-4 py-4">
          {isPublic === null ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                {isPublic ? (
                  <Globe className="h-5 w-5 text-emerald-500 shrink-0" />
                ) : (
                  <Lock className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {isPublic ? "منشورة للعامة" : "خاصة"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isPublic
                      ? "يمكن لأي شخص قراءة هذه المقالة عبر الرابط"
                      : "أنت فقط من يمكنه قراءة هذه المقالة"
                    }
                  </p>
                </div>
              </div>

              <Button
                onClick={isPublic ? unpublish : publish}
                disabled={loading}
                className="w-full"
                variant={isPublic ? "outline" : "default"}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
                {loading ? "جاري النشر..." : isPublic ? "إخفاء المقالة" : "نشر المقالة للعامة"}
              </Button>

              {error && (
                <p className="text-xs text-red-500 text-center">{error}</p>
              )}

              {isPublic && (
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={`${window.location.origin}/read/${pageId}`}
                    className="flex-1 px-3 py-2 bg-muted border rounded-lg text-sm font-mono"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <Button size="sm" variant="outline" onClick={handleCopyLink}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
