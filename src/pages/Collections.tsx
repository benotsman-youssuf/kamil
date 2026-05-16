import { useEffect, useState } from "react";
import { fetchCollections } from "@/lib/qf/api";
import type { CollectionItem } from "@/lib/qf/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BookOpen, FolderOpen, AlertCircle, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function Collections() {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchCollections({ first: 50 })
      .then((res) => setCollections(res.data))
      .catch(() => setError("فشل تحميل المجلدات"))
      .finally(() => setLoading(false));
  }, []);

  const selected = collections.find((c) => c.id === selectedId);

  if (loading) {
    return (
      <div className="space-y-4" dir="rtl">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg border">
            <Skeleton className="h-5 w-40 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4" dir="rtl">
        <AlertCircle className="h-12 w-12 text-red-400" />
        <p className="text-lg text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4" dir="rtl">
        <FolderOpen className="h-16 w-16 text-muted-foreground/40" />
        <p className="text-xl font-amiri text-muted-foreground">لا توجد مجلدات بعد</p>
        <p className="text-sm text-muted-foreground/60">نظم آياتك المفضلة في مجلدات</p>
      </div>
    );
  }

  if (selected) {
    return (
      <div dir="rtl">
        <Button variant="ghost" className="mb-6 gap-2" onClick={() => setSelectedId(null)}>
          <ChevronLeft className="h-4 w-4" />
          <span>العودة إلى المجلدات</span>
        </Button>
        <div className="p-6 rounded-lg border bg-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary">
              <FolderOpen className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-amiri">{selected.name}</h2>
              <p className="text-sm text-muted-foreground">
                {selected.bookmarksCount} {selected.bookmarksCount === 1 ? "إشارة مرجعية" : "إشارات مرجعية"}
              </p>
            </div>
          </div>
          {selected.isPrivate && (
            <p className="text-xs text-muted-foreground/60">خاص · غير ظاهر للعامة</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2" dir="rtl">
      {collections.map((col) => (
        <button
          key={col.id}
          onClick={() => setSelectedId(col.id)}
          className={cn(
            "group flex items-start gap-4 p-5 rounded-lg border text-right transition-all",
            "hover:bg-accent/50 hover:shadow-sm hover:border-primary/20"
          )}
        >
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary shrink-0 group-hover:bg-primary/15 transition-colors">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold font-amiri text-base truncate">{col.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {col.bookmarksCount} {col.bookmarksCount === 1 ? "آية" : "آيات"}
            </p>
            {col.isDefault && (
              <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                افتراضي
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
