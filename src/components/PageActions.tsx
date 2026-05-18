import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pin, Trash, Pencil, PinOff } from "lucide-react";
import { useState } from "react";
import { getDb, apiRequest } from "@/lib/rxdb";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

interface PageActionsProps {
  page: { id: string; name: string; isPinned?: boolean; is_public?: boolean };
  isActive?: boolean;
}

export function PageActions({ page, isActive }: PageActionsProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showRenameDialog, setShowRenameDialog] = useState(false);
    const [newName, setNewName] = useState(page.name);
    const navigate = useNavigate();
    const { id } = useParams();

    const handleTogglePin = async () => {
        try {
            const db = await getDb();
            const doc = await db.pages.findOne(page.id).exec();
            if (doc) {
                await doc.patch({ isPinned: !page.isPinned });
            }
            toast.success(page.isPinned ? "تم إلغاء تثبيت الصفحة" : "تم تثبيت الصفحة");
        } catch (error) {
            toast.error("حدث خطأ أثناء تحديث الصفحة");
        }
    };

    const handleDelete = async () => {
        try {
            const db = await getDb();
            await db.pages.bulkRemove([page.id]);
            toast.success("تم حذف الصفحة بنجاح");

            apiRequest(`/pages/${page.id}`, { method: "DELETE" }).catch(() => {});

            if (id === page.id) {
                const remaining = await db.pages.find().exec();
                if (remaining.length > 0) {
                    navigate(`/pages/${remaining[0].id}`);
                } else {
                    navigate("/");
                }
            }
        } catch (error) {
            toast.error("حدث خطأ أثناء حذف الصفحة");
        } finally {
            setShowDeleteDialog(false);
        }
    };

    const handleRename = async () => {
        if (!newName.trim()) return;
        try {
            const db = await getDb();
            const doc = await db.pages.findOne(page.id).exec();
            if (doc) {
                await doc.patch({
                    name: newName,
                    title: newName,
                    updated_at: new Date().toISOString(),
                });
            }
            toast.success("تم تغيير اسم الصفحة");
            setShowRenameDialog(false);
        } catch (error) {
            toast.error("حدث خطأ أثناء تغيير الاسم");
        }
    };

    return (
        <>
            <DropdownMenu dir="rtl">
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 p-0 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                    >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleTogglePin} className="gap-2 cursor-pointer">
                        {page.isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                        {page.isPinned ? "إلغاء التثبيت" : "تثبيت"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowRenameDialog(true)} className="gap-2 cursor-pointer">
                        <Pencil className="h-4 w-4" />
                        إعادة تسمية
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                    >
                        <Trash className="h-4 w-4" />
                        حذف
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                        <AlertDialogDescription>
                            سيتم حذف الصفحة "{page.name}" بشكل نهائي. لا يمكن التراجع عن هذا الإجراء.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                            حذف
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>إعادة تسمية الصفحة</DialogTitle>
                        <DialogDescription>
                            أدخل الاسم الجديد للصفحة.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Input
                            id="name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="col-span-3"
                            onKeyDown={(e) => e.key === "Enter" && handleRename()}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRenameDialog(false)}>إلغاء</Button>
                        <Button onClick={handleRename}>حفظ</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
