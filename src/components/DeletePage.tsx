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
import {Trash} from "lucide-react";
import { db } from "@/lib/db";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const DeletePage = ({pageId}: {pageId: number}) => {


  const navigate = useNavigate();
  const handleDelete = async () => {
    if (!pageId) return;
    try {
      if (pageId === 1) {
        navigate(`/pages/1`);
        toast.success(`لا يمكن حذف الصفحة الرئيسية`);
      } else {
        await db.pages.delete(pageId);
        toast.success(`تم حذف الصفحة بنجاح ${pageId}`);
      }

    } catch (error) {
      toast.error(`حدث خطأ أثناء حذف الصفحة ${pageId}`);
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
