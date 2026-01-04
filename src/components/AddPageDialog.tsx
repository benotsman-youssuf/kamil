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
import { db } from "@/lib/db";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";


import { useState } from "react";

export function AddPageDialog() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const addPage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");

    try {
      if (typeof name === "string") {
        const page = await db.pages.add({
          name,
          description: "",
          content: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        toast.success("تمت إضافة الصفحة بنجاح", {
          duration: 1000,
        });
        setOpen(false);
        navigate(`/pages/${page}`);
      }
    } catch (error) {
      toast.error("فشل إضافة الصفحة", {
        duration: 1000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="flex items-center gap-2 rounded-xl bg-[#2b2b2b] px-4 py-2 text-lg font-medium text-white shadow-md transition-all duration-200 hover:bg-[#2a2a2b] hover:shadow-lg active:scale-95 h-10 w-40"
        >
          <Plus className="h-9 w-9" />
          إضافة صفحة
        </Button>
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
