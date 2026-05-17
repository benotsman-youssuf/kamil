"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCollection } from "@/lib/qf/api";
import type { CollectionItem } from "@/lib/qf/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CreateCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (collection: CollectionItem) => void;
}

export function CreateCollectionDialog({ open, onOpenChange, onCreated }: CreateCollectionDialogProps) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed || saving) return;
    setSaving(true);
    try {
      const collection = await createCollection(trimmed);
      onCreated(collection);
      setName("");
      toast.success("تم إنشاء المجلد بنجاح");
    } catch {
      toast.error("فشل إنشاء المجلد");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[360px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>مجلد جديد</DialogTitle>
        </DialogHeader>
        <div className="py-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسم المجلد"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            autoFocus
            dir="rtl"
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={!name.trim() || saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            إنشاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
