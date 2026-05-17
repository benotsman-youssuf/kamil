import { useEffect, useState, useCallback, useMemo } from "react";
import { fetchBookmarks, deleteBookmark } from "@/lib/qf/api";
import type { BookmarkItem } from "@/lib/qf/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bookmark, Trash2, BookOpen, AlertCircle, Search, LayoutList, Layers } from "lucide-react";
import { SURAH_NAMES } from "@/constants/surahs";
import { cn } from "@/lib/utils";

type SortOrder = "newest" | "oldest" | "surah";
type GroupBy = "none" | "surah";

export function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>();
  const [loadingMore, setLoadingMore] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOrder>("newest");
  const [groupBy, setGroupBy] = useState<GroupBy>("none");

  const loadBookmarks = useCallback(async (after?: string) => {
    const res = await fetchBookmarks({ first: 50, after });
    return res;
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
    } finally {
      setLoadingMore(false);
    }
  };

  const handleDelete = async (item: BookmarkItem) => {
    setDeleting(item.id);
    try {
      await deleteBookmark(item.id);
      setBookmarks((prev) => prev.filter((b) => b.id !== item.id));
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

  const filtered = useMemo(() => {
    let list = [...bookmarks];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((b) => {
        const name = (SURAH_NAMES[b.key] || "").toLowerCase();
        return name.includes(q) || String(b.key).includes(q) || String(b.verseNumber).includes(q);
      });
    }
    if (sort === "newest") list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    else if (sort === "oldest") list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    else if (sort === "surah") list.sort((a, b) => a.key - b.key || a.verseNumber - b.verseNumber);
    return list;
  }, [bookmarks, search, sort]);

  const grouped = useMemo(() => {
    if (groupBy === "none") return { "": filtered };
    const map: Record<string, BookmarkItem[]> = {};
    for (const b of filtered) {
      const key = SURAH_NAMES[b.key] || `سورة ${b.key}`;
      if (!map[key]) map[key] = [];
      map[key].push(b);
    }
    return map;
  }, [filtered, groupBy]);

  if (loading) {
    return (
      <div className="space-y-3" dir="rtl">
        {Array.from({ length: 5 }).map((_, i) => (
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

  return (
    <div className="space-y-4" dir="rtl">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالسورة..."
            className="pr-9 h-9 text-sm"
            dir="rtl"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOrder)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground"
        >
          <option value="newest">الأحدث أولاً</option>
          <option value="oldest">الأقدم أولاً</option>
          <option value="surah">ترتيب المصحف</option>
        </select>
        <Button
          variant={groupBy === "surah" ? "secondary" : "outline"}
          size="sm"
          className="h-9 gap-1.5"
          onClick={() => setGroupBy(g => g === "surah" ? "none" : "surah")}
        >
          {groupBy === "surah" ? <Layers className="h-3.5 w-3.5" /> : <LayoutList className="h-3.5 w-3.5" />}
          {groupBy === "surah" ? "مجمّع" : "تجميع"}
        </Button>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Bookmark className="h-3.5 w-3.5" />
        <span>{filtered.length} آية محفوظة</span>
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Bookmark className="h-16 w-16 text-muted-foreground/30" />
          <p className="text-muted-foreground text-sm">لا توجد نتائج</p>
        </div>
      )}

      {Object.entries(grouped).map(([group, items]) => (
        <div key={group}>
          {group && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 pb-1 border-b">
              {group}
            </h3>
          )}
          <div className="space-y-2">
            {items.map((item) => {
              const surahName = SURAH_NAMES[item.key] || `سورة ${item.key}`;
              const date = item.createdAt
                ? new Date(item.createdAt).toLocaleDateString("ar-SA", { year: "numeric", month: "short", day: "numeric" })
                : "";
              return (
                <div
                  key={item.id}
                  className={cn(
                    "group flex items-center gap-3 p-3.5 rounded-lg border transition-all hover:bg-accent/40 hover:border-primary/20 cursor-pointer",
                    deleting === item.id && "opacity-50 pointer-events-none"
                  )}
                  onClick={() => handleOpenVerse(item)}
                >
                  <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/10 text-primary shrink-0">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{surahName}</p>
                    <p className="text-xs text-muted-foreground">
                      الآية {item.verseNumber}
                      {item.collectionsCount && item.collectionsCount > 0 && (
                        <span className="mr-2">· {item.collectionsCount} {item.collectionsCount === 1 ? "مجموعة" : "مجموعات"}</span>
                      )}
                      {date && <span className="mr-2">· {date}</span>}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 shrink-0"
                    onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                    disabled={deleting === item.id}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button variant="outline" size="sm" onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? "جاري التحميل..." : "عرض المزيد"}
          </Button>
        </div>
      )}
    </div>
  );
}
