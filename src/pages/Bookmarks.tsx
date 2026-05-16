import { useEffect, useState, useCallback } from "react";
import { fetchBookmarks, deleteBookmark } from "@/lib/qf/api";
import type { BookmarkItem } from "@/lib/qf/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Bookmark, Trash2, BookOpen, AlertCircle } from "lucide-react";
import { SURAH_NAMES } from "@/constants/surahs";
import { cn } from "@/lib/utils";

export function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>();
  const [loadingMore, setLoadingMore] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadBookmarks = useCallback(async (after?: string) => {
    try {
      const res = await fetchBookmarks({ first: 20, after });
      return res;
    } catch (err) {
      throw err;
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    loadBookmarks()
      .then((res) => {
        setBookmarks(res.data);
        setHasMore(res.pagination.hasNextPage);
        setCursor(res.pagination.endCursor);
      })
      .catch(() => setError("فشل تحميل العلامات المرجعية"))
      .finally(() => setLoading(false));
  }, [loadBookmarks]);

  const handleLoadMore = async () => {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await loadBookmarks(cursor);
      setBookmarks((prev) => [...prev, ...res.data]);
      setHasMore(res.pagination.hasNextPage);
      setCursor(res.pagination.endCursor);
    } catch {
      // ignore
    } finally {
      setLoadingMore(false);
    }
  };

  const handleDelete = async (item: BookmarkItem) => {
    setDeleting(item.id);
    try {
      await deleteBookmark(item.id);
      setBookmarks((prev) => prev.filter((b) => b.id !== item.id));
    } catch {
      // ignore
    } finally {
      setDeleting(null);
    }
  };

  const handleOpenVerse = (item: BookmarkItem) => {
    const surahName = SURAH_NAMES[item.key] || `سورة ${item.key}`;
    window.dispatchEvent(
      new CustomEvent("open-verse-panel", {
        detail: {
          verseKey: `${item.key}:${item.verseNumber}`,
          surahName,
          ayaNumber: item.verseNumber,
          verseText: "",
        },
      })
    );
  };

  if (loading) {
    return (
      <div className="space-y-4" dir="rtl">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-4 rounded-lg border">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
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

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4" dir="rtl">
        <Bookmark className="h-16 w-16 text-muted-foreground/40" />
        <p className="text-xl font-amiri text-muted-foreground">لا توجد علامات مرجعية بعد</p>
        <p className="text-sm text-muted-foreground/60">أضف آيات إلى علاماتك المرجعية من لوحة الآية</p>
      </div>
    );
  }

  return (
    <div className="space-y-3" dir="rtl">
      <div className="flex items-center gap-2 mb-6">
        <Bookmark className="h-5 w-5 text-primary" />
        <span className="text-sm text-muted-foreground">
          {bookmarks.length} آية
        </span>
      </div>
      {bookmarks.map((item) => {
        const surahName = SURAH_NAMES[item.key] || `سورة ${item.key}`;
        return (
          <div
            key={item.id}
            className={cn(
              "group flex items-center gap-3 p-4 rounded-lg border transition-all hover:bg-accent/50 hover:shadow-sm",
              deleting === item.id && "opacity-50 pointer-events-none"
            )}
          >
            <button
              onClick={() => handleOpenVerse(item)}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary shrink-0 hover:bg-primary/20 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="font-amiri font-bold text-base truncate">
                {surahName}
              </p>
              <p className="text-xs text-muted-foreground">
                الآية {item.verseNumber}
                {item.collectionsCount && item.collectionsCount > 0 && (
                  <span className="mr-2">
                    · {item.collectionsCount} {item.collectionsCount === 1 ? "مجموعة" : "مجموعات"}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-red-500"
                onClick={() => handleDelete(item)}
                disabled={deleting === item.id}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? "جاري التحميل..." : "عرض المزيد"}
          </Button>
        </div>
      )}
    </div>
  );
}
