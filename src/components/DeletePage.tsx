import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";
import { getDb, apiRequest } from "@/lib/rxdb";
import { toast } from "sonner";

export const DeletePage = ({ pageId }: { pageId: string }) => {
  const handleDelete = async () => {
    if (!pageId) return;
    try {
      const db = await getDb();
      await db.pages.bulkRemove([pageId]);
      toast.success(`تم حذف الصفحة بنجاح`);

      apiRequest(`/pages/${pageId}`, { method: "DELETE" }).catch(() => {});
    } catch (error) {
      toast.error(`حدث خطأ أثناء حذف الصفحة`);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Trash className="w-4 h-4 text-red-500" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>هل انت متأكد؟</AlertDialogTitle>
          <AlertDialogDescription>
            هذه الخطوة لا يمكن التراجع عنها. سيتم حذف الصفحة بشكل نهائي
            وستتم حذف بياناتك من الخادم.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>حذف</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePage;
