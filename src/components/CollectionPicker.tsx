"use client";

import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Bookmark, FolderOpen, Plus, Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchCollections, addBookmarkToCollection, removeBookmarkFromCollection, getBookmark } from "@/lib/qf/api";
import type { CollectionItem } from "@/lib/qf/api";
import { CreateCollectionDialog } from "./CreateCollectionDialog";
import { toast } from "sonner";

interface CollectionPickerProps {
  verseKey: string;
}

export function CollectionPicker({ verseKey }: CollectionPickerProps) {
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [toggling, setToggling] = useState<Set<string>>(new Set());
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    Promise.all([
      fetchCollections({ first: 20, sortBy: "recentlyUpdated" }),
      getBookmark(verseKey),
    ])
      .then(([colRes, bm]) => {
        setCollections(Array.isArray(colRes.data) ? colRes.data : []);
        if (bm?.data?.isInDefaultCollection) {
          const defaultCol = colRes.data?.find((c: CollectionItem) => c.isDefault);
          if (defaultCol) {
            setSelectedIds(new Set([defaultCol.id]));
          }
        }
      })
      .catch(() => toast.error("فشل تحميل المجلدات"))
      .finally(() => setLoading(false));
  }, [open, verseKey]);

  const defaultCollection = collections.find((c) => c.isDefault);
  const userCollections = collections.filter((c) => !c.isDefault);

  const handleToggle = async (collectionId: string) => {
    if (toggling.has(collectionId)) return;
    setToggling((prev) => new Set(prev).add(collectionId));

    const isAdding = !selectedIds.has(collectionId);

    try {
      if (isAdding) {
        await addBookmarkToCollection(collectionId, verseKey);
      } else {
        await removeBookmarkFromCollection(collectionId, verseKey);
      }
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (isAdding) next.add(collectionId);
        else next.delete(collectionId);
        return next;
      });
    } catch {
      toast.error(isAdding ? "فشل الإضافة إلى المجلد" : "فشل الإزالة من المجلد");
    } finally {
      setToggling((prev) => {
        const next = new Set(prev);
        next.delete(collectionId);
        return next;
      });
    }
  };

  const handleCollectionCreated = (collection: CollectionItem) => {
    setCollections((prev) => [collection, ...prev]);
    setShowCreate(false);
    handleToggle(collection.id);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "h-7 w-7 rounded-md hover:bg-sidebar-accent",
              selectedIds.size > 0
                ? "text-amber-500 hover:text-amber-600"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="حفظ في مجلد"
          >
            <Bookmark className={cn("h-4 w-4", selectedIds.size > 0 && "fill-amber-500")} />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" side="bottom" className="w-64 p-0" dir="rtl">
          <div className="p-3 border-b border-border/50">
            <p className="text-sm font-semibold text-foreground">احفظ في مجلد</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto py-1">
              {defaultCollection && (
                <CollectionItemRow
                  icon={<Star className="h-4 w-4 text-amber-500" />}
                  name={defaultCollection.name}
                  isChecked={selectedIds.has(defaultCollection.id)}
                  isToggling={toggling.has(defaultCollection.id)}
                  onToggle={() => handleToggle(defaultCollection.id)}
                />
              )}
              {userCollections.map((col) => (
                <CollectionItemRow
                  key={col.id}
                  icon={<FolderOpen className="h-4 w-4 text-primary" />}
                  name={col.name}
                  isChecked={selectedIds.has(col.id)}
                  isToggling={toggling.has(col.id)}
                  onToggle={() => handleToggle(col.id)}
                />
              ))}
              {collections.length === 0 && !loading && (
                <p className="px-3 py-4 text-xs text-muted-foreground text-center">
                  لا توجد مجلدات بعد
                </p>
              )}
            </div>
          )}

          <div className="border-t border-border/50 p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 h-8 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setShowCreate(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              إنشاء مجلد جديد
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <CreateCollectionDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onCreated={handleCollectionCreated}
      />
    </>
  );
}

function CollectionItemRow({
  icon,
  name,
  isChecked,
  isToggling,
  onToggle,
}: {
  icon: React.ReactNode;
  name: string;
  isChecked: boolean;
  isToggling: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      disabled={isToggling}
      className="flex items-center gap-3 w-full px-3 py-2 text-right hover:bg-accent/50 transition-colors disabled:opacity-50"
    >
      <Checkbox checked={isChecked} disabled={isToggling} />
      <span className="flex-shrink-0">{icon}</span>
      <span className="text-sm font-medium truncate flex-1">{name}</span>
      {isToggling && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground shrink-0" />}
    </button>
  );
}
