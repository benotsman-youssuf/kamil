import { useEffect, useState, useCallback } from "react";
import { fetchCollections, fetchCollectionItems, createCollection, updateCollection, deleteCollection } from "@/lib/qf/api";
import type { CollectionItem, CollectionBookmarkItem } from "@/lib/qf/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BookOpen, FolderOpen, AlertCircle, ChevronRight, Lock, Star, BookMarked, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SURAH_NAMES } from "@/constants/surahs";
import { toast } from "sonner";

function isDomainName(name: string) {
  return /^[a-zA-Z0-9][a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(name);
}

function faviconImg(name: string) {
  return `https://favicon.im/${encodeURIComponent(name)}?larger=true`;
}

export function Collections() {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [items, setItems] = useState<CollectionBookmarkItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [hasMoreItems, setHasMoreItems] = useState(false);
  const [itemsCursor, setItemsCursor] = useState<string | undefined>();

  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [creating, setCreating] = useState(false);

  const [renameTarget, setRenameTarget] = useState<CollectionItem | null>(null);
  const [renameName, setRenameName] = useState("");
  const [renaming, setRenaming] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<CollectionItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadCollections = useCallback(() => {
    setLoading(true);
    fetchCollections({ first: 20 })
      .then((res) => setCollections(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError("فشل تحميل المجلدات"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadCollections(); }, [loadCollections]);

  useEffect(() => {
    if (!selectedId) { setItems([]); return; }
    setItemsLoading(true);
    fetchCollectionItems(selectedId, { first: 20 })
      .then((res) => {
        setItems(Array.isArray(res.data) ? res.data : []);
        setHasMoreItems(res.pagination?.hasNextPage ?? false);
        setItemsCursor(res.pagination?.endCursor);
      })
      .catch(() => setItems([]))
      .finally(() => setItemsLoading(false));
  }, [selectedId]);

  const handleLoadMoreItems = async () => {
    if (!selectedId || !itemsCursor) return;
    const res = await fetchCollectionItems(selectedId, { first: 20, after: itemsCursor });
    setItems((prev) => [...prev, ...(Array.isArray(res.data) ? res.data : [])]);
    setHasMoreItems(res.pagination?.hasNextPage ?? false);
    setItemsCursor(res.pagination?.endCursor);
  };

  const openVerse = (item: CollectionBookmarkItem) => {
    const surahName = SURAH_NAMES[item.key] || `سورة ${item.key}`;
    window.dispatchEvent(new CustomEvent("open-verse-panel", {
      detail: { verseKey: `${item.key}:${item.verseNumber}`, surahName, ayaNumber: item.verseNumber, verseText: "" },
    }));
  };

  const handleCreate = async () => {
    if (!createName.trim()) return;
    setCreating(true);
    try {
      const col = await createCollection(createName.trim());
      setCollections((prev) => [col, ...prev]);
      setCreateOpen(false);
      setCreateName("");
      toast.success("تم إنشاء المجلد");
    } catch {
      toast.error("فشل إنشاء المجلد");
    } finally {
      setCreating(false);
    }
  };

  const handleRename = async () => {
    if (!renameTarget || !renameName.trim()) return;
    setRenaming(true);
    try {
      const updated = await updateCollection(renameTarget.id, renameName.trim());
      setCollections((prev) => prev.map((c) => c.id === updated.id ? { ...c, name: updated.name } : c));
      setRenameTarget(null);
      toast.success("تم تعديل الاسم");
    } catch {
      toast.error("فشل تعديل الاسم");
    } finally {
      setRenaming(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCollection(deleteTarget.id);
      setCollections((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      if (selectedId === deleteTarget.id) setSelectedId(null);
      setDeleteTarget(null);
      toast.success("تم حذف المجلد");
    } catch {
      toast.error("فشل حذف المجلد");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3" dir="rtl">
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

  const selected = collections.find((c) => c.id === selectedId);

  if (selected) {
    return (
      <div dir="rtl">
        <Button variant="ghost" size="sm" className="mb-5 gap-2 text-muted-foreground" onClick={() => setSelectedId(null)}>
          <ChevronRight className="h-4 w-4" />
          العودة إلى المجلدات
        </Button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-primary/10 text-primary shrink-0 overflow-hidden">
            {isDomainName(selected.name) ? (
              <img src={faviconImg(selected.name)} alt="" className="h-full w-full object-contain bg-muted/20" />
            ) : (
              <FolderOpen className="h-5 w-5" />
            )}
          </div>
          <div>
            <h2 className="font-bold text-lg">{selected.name}</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{selected.bookmarksCount} آية</span>
              {selected.isDefault && <span className="px-1.5 py-0.5 rounded bg-muted">افتراضي</span>}
              {selected.isPrivate && (
                <span className="flex items-center gap-0.5"><Lock className="h-3 w-3" />خاص</span>
              )}
            </div>
          </div>
        </div>

        {itemsLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">
            لا توجد آيات في هذا المجلد بعد
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => {
              const surahName = SURAH_NAMES[item.key] || `سورة ${item.key}`;
              return (
                <div
                  key={item.id}
                  onClick={() => openVerse(item)}
                  className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent/40 hover:border-primary/20 transition-all group"
                >
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary shrink-0">
                    <BookOpen className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{surahName}</p>
                    <p className="text-xs text-muted-foreground">الآية {item.verseNumber}</p>
                  </div>
                  <BookMarked className="h-3.5 w-3.5 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              );
            })}
            {hasMoreItems && (
              <div className="flex justify-center pt-2">
                <Button variant="outline" size="sm" onClick={handleLoadMoreItems}>عرض المزيد</Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold">المجلدات ({collections.length})</h2>
        <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          مجلد جديد
        </Button>
      </div>

      {collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <FolderOpen className="h-16 w-16 text-muted-foreground/30" />
          <p className="text-xl font-amiri text-muted-foreground">لا توجد مجلدات بعد</p>
          <p className="text-sm text-muted-foreground/60">نظم آياتك المفضلة في مجلدات</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => setSelectedId(col.id)}
              className={cn(
                "group flex items-start gap-4 p-4 rounded-xl border text-right transition-all text-right",
                "hover:bg-accent/50 hover:shadow-sm hover:border-primary/20"
              )}
            >
              <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-primary/10 text-primary shrink-0 overflow-hidden group-hover:bg-primary/15 transition-colors">
                {col.isDefault ? (
                  <Star className="h-5 w-5" />
                ) : isDomainName(col.name) ? (
                  <img src={faviconImg(col.name)} alt="" className="h-full w-full object-contain bg-muted/20" />
                ) : (
                  <FolderOpen className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <h3 className="font-bold text-sm truncate">{col.name}</h3>
                  {!col.isDefault && (
                    <span className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); setRenameTarget(col); setRenameName(col.name); }}>
                      <Pencil className="h-3 w-3 text-muted-foreground hover:text-primary cursor-pointer" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {col.bookmarksCount} {col.bookmarksCount === 1 ? "آية" : "آيات"}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  {col.isDefault && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">افتراضي</span>}
                  {col.isPrivate && <span className="text-[10px] flex items-center gap-0.5 text-muted-foreground"><Lock className="h-2.5 w-2.5" />خاص</span>}
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ChevronRight className="h-4 w-4 text-muted-foreground/50 mt-1 group-hover:text-primary transition-colors" />
                {!col.isDefault && (
                  <Trash2
                    className="h-3 w-3 text-muted-foreground/30 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(col); }}
                  />
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>مجلد جديد</DialogTitle>
          </DialogHeader>
          <Input
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            placeholder="اسم المجلد"
            dir="rtl"
            onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>إلغاء</Button>
            <Button onClick={handleCreate} disabled={!createName.trim() || creating}>
              {creating && <Loader2 className="h-4 w-4 ml-1 animate-spin" />}
              إنشاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!renameTarget} onOpenChange={(o) => { if (!o) setRenameTarget(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تعديل الاسم</DialogTitle>
          </DialogHeader>
          <Input
            value={renameName}
            onChange={(e) => setRenameName(e.target.value)}
            placeholder="اسم المجلد"
            dir="rtl"
            onKeyDown={(e) => { if (e.key === "Enter") handleRename(); }}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameTarget(null)}>إلغاء</Button>
            <Button onClick={handleRename} disabled={!renameName.trim() || renaming}>
              {renaming && <Loader2 className="h-4 w-4 ml-1 animate-spin" />}
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف المجلد</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف "{deleteTarget?.name}"؟ لن تُحذف الآيات المخزنة في مجلدات أخرى.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting && <Loader2 className="h-4 w-4 ml-1 animate-spin" />}
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
