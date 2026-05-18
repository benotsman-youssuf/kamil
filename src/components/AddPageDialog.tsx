import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getDb } from "@/lib/rxdb";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";


import { useState } from "react";

export function AddPageDialog({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const addPage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");

    try {
      if (typeof name === "string") {
        const db = await getDb();
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        await db.pages.insert({
          id,
          name,
          title: name,
          description: "",
          content: JSON.stringify([]),
          created_at: now,
          updated_at: now,
          is_public: false,
          is_fork: false,
          fork_count: 0,
          forked_from: "",
        });
        toast.success("تمت إضافة الصفحة بنجاح", { duration: 1000 });
        setOpen(false);
        navigate(`/pages/${id}`);
      }
    } catch (error) {
      toast.error("فشل إضافة الصفحة", { duration: 1000 });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {compact ? (
          <button
            title="صفحة جديدة"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-150"
          >
            <Plus className="h-4 w-4" />
          </button>
        ) : (
          <Button
            variant="default"
            className="w-full justify-start gap-2"
          >
            <Plus className="h-4 w-4" />
            إضافة صفحة
          </Button>
        )}
      </DialogTrigger>

      {/* Add dir="rtl" here for RTL direction */}
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <form onSubmit={addPage}>
          <DialogHeader className="flex flex-col items-center">
            <DialogTitle>إضافة صفحة جديدة</DialogTitle>
            <DialogDescription>
              أضف صفحة جديدة إلى مساحة العمل الخاصة بك.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2 text-right">
              <label htmlFor="name" className="text-sm font-medium">اسم الصفحة</label>
              <Input id="name" name="name" required className="text-right" placeholder="أدخل اسم الصفحة..." />
            </div>
          </div>

          <DialogFooter className="mt-4 flex justify-between">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                إلغاء
              </Button>
            </DialogClose>
            <Button type="submit">إضافة الصفحة</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
