import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportToJSON, exportToHTMLAsync, exportToMarkdownAsync, exportToPDF } from "@/lib/utils/export";
import { toast } from "sonner";
import { getDb } from "@/lib/rxdb";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
interface ExportDropdownProps {
    editor: any;
    className?: string;
    variant?: "default" | "ghost" | "outline";
    showText?: boolean;
}

export function ExportDropdown({
    editor,
    className = "",
    variant = "default",
    showText = true
}: ExportDropdownProps) {
    const { id } = useParams();
    const [pageName, setPageName] = useState<string>("document");

    useEffect(() => {
      if (id) {
        getDb().then((db) => {
          db.pages.findOne(id!).exec().then((page: any) => {
            if (page?.name || page?.title) {
              setPageName(page.name || page.title);
            }
          });
        });
      }
    }, [id]);

    const handleExport = async (type: "pdf" | "json" | "html" | "markdown") => {
        if (!editor) return;

        switch (type) {
            case "pdf":
                exportToPDF(editor.children, pageName);
                toast.success("تم فتح نافذة الطباعة لحفظ PDF");
                break;
            case "json":
                exportToJSON(editor.children, pageName);
                toast.success("تم تصدير الملف بصيغة JSON");
                break;
            case "html":
                await exportToHTMLAsync(editor.children, pageName);
                toast.success("تم تصدير الملف بصيغة HTML");
                break;
            case "markdown":
                await exportToMarkdownAsync(editor.children, pageName);
                toast.success("تم تصدير الملف بصيغة Markdown");
                break;
        }
    };

    return (
        <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
                <Button
                    variant={variant}
                    size="sm"
                    className={`flex items-center gap-2 cursor-pointer ${className}`}
                    title="تصدير"
                >
                    <Download className="w-4 h-4" />
                    {showText && <span>تصدير</span>}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px]">
                <DropdownMenuItem onClick={() => handleExport("pdf")} className="cursor-pointer">
                    تصدير بصيغة PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("json")} className="cursor-pointer">
                    تصدير بصيغة JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("html")} className="cursor-pointer">
                    تصدير بصيغة HTML
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("markdown")} className="cursor-pointer">
                    تصدير بصيغة Markdown
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
