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


export function AddPageDialog() {
  const navigate = useNavigate();
  const addPage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const description = formData.get("description");

    try {
      if (typeof name === "string" && typeof description === "string") {
        const page = await db.pages.add({
          name,
          description,
          content: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        toast.success("تمت إضافة الصفحة بنجاح", {
          duration: 1000,
        });
        navigate(`/pages/${page}`);
      }
    } catch (error) {
      toast.error("فشل إضافة الصفحة", {
        duration: 1000,
      });
    }
  };

  return (
    <Dialog>
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

          <div className="grid gap-4">
            <div className="grid gap-1 text-right">
              <label htmlFor="name">اسم الصفحة</label>
              <Input id="name" name="name" required className="text-right" />
            </div>
            <div className="grid gap-1 text-right">
              <label htmlFor="description">وصف الصفحة</label>
              <Input id="description" name="description" className="text-right" />
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
