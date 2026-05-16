import { AppSidebar } from "@/components/app-sidebar";
import { cn } from "@/lib/utils";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditorLayout } from "@/components/editor/EditorLayout";
import { usePlateEditor } from "@platejs/core/react";
import { editorPlugins } from "@/constants/editor";
import { db } from "@/lib/db";
import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import { FileText, Download, SquarePen } from "lucide-react";
import { SaveStatus, type SaveState } from "@/components/SaveStatus";
import { exportToJSON, exportToHTMLAsync, exportToMarkdownAsync, exportToPDF } from "@/lib/utils/export";
import { debounce } from "@/lib/utils/debounce";

import { SharedRightPanel } from "@/components/SharedRightPanel";

export default function SideBar() {
  const [pageContent, setPageContent] = useState<string>();
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const { id } = useParams();
  const editor = usePlateEditor({
    plugins: editorPlugins,
    value: [],
  });

  // Auto-save function
  const savePage = useCallback(async () => {
    try {
      setSaveState("saving");
      const updatedAt = new Date().toISOString();
      const content = JSON.stringify(editor.children);

      await db.pages.update(Number(id), {
        content,
        updatedAt,
      });

      // Update local state without re-fetching from DB
      setPageContent(prev => {
        if (!prev) return prev;
        const page = JSON.parse(prev);
        return JSON.stringify({ ...page, content, updatedAt });
      });

      setSaveState("saved");

      // Reset to idle after showing success
      setTimeout(() => setSaveState("idle"), 1500);
    } catch (error) {
      console.error("Error saving:", error);
      setSaveState("error");
      toast.error("فشل الحفظ", {
        duration: 1000,
      });
      setTimeout(() => setSaveState("idle"), 3000);
    }
  }, [id, editor.children]);

  // Debounced auto-save
  const debouncedSave = useRef(
    debounce((save: () => void) => save(), 750)
  ).current;



  const fetchPage = async () => {
    try {
      const page = await db.pages.get(Number(id));
      editor.tf.setValue(page?.content ? JSON.parse(page.content) : []);
      setPageContent(JSON.stringify(page));
    } catch (error) {
      console.error("Error fetching page:", error);
    }
  };

  // Export handlers
  const handleExportJSON = () => {
    if (pageContent) {
      const page = JSON.parse(pageContent);
      exportToJSON(editor.children, page.name);
      toast.success("تم تصدير الملف بصيغة JSON", { duration: 2000 });
    }
  };

  const handleExportHTML = async () => {
    if (pageContent) {
      const page = JSON.parse(pageContent);
      await exportToHTMLAsync(editor.children, page.name);
      toast.success("تم تصدير الملف بصيغة HTML", { duration: 2000 });
    }
  };

  const handleExportMarkdown = async () => {
    if (pageContent) {
      const page = JSON.parse(pageContent);
      await exportToMarkdownAsync(editor.children, page.name);
      toast.success("تم تصدير الملف بصيغة Markdown", { duration: 2000 });
    }
  };

  const handleExportPDF = () => {
    if (pageContent) {
      const page = JSON.parse(pageContent);
      exportToPDF(editor.children, page.name);
      toast.success("تم فتح نافذة الطباعة لحفظ PDF", { duration: 2000 });
    }
  };

  const handleUpdateTitle = async () => {
    if (!titleValue.trim() || !id) return;
    try {
      await db.pages.update(Number(id), {
        name: titleValue,
        updatedAt: new Date().toISOString(),
      });
      setIsEditingTitle(false);
      fetchPage();
      toast.success("تم تحديث العنوان");
    } catch (error) {
      console.error("Error updating title:", error);
      toast.error("فشل تحديث العنوان");
    }
  };

  useEffect(() => {
    if (pageContent) {
      setTitleValue(JSON.parse(pageContent).name);
    }
  }, [pageContent]);

  useEffect(() => {
    fetchPage();
  }, [id]);

  // Listen for hadith insertion from VersePanel
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail) return;

      editor.tf.insertNodes({
        type: "hadith",
        collection: detail.collection || "",
        bookNumber: detail.bookNumber || "",
        hadithNumber: detail.hadithNumber || "",
        hadithText: detail.hadithText || "",
        hadithTextEn: detail.hadithTextEn || "",
        grades: detail.grades || [],
        chapterTitle: detail.chapterTitle || "",
        children: [{ text: `﴿${detail.hadithText || ""}﴾ [${detail.collection || ""} ${detail.hadithNumber || ""}]` }],
      });
      editor.tf.insertText(" ");
      editor.tf.move({ distance: 1, unit: 'character' });
    };

    window.addEventListener("insert-hadith", handler);
    return () => window.removeEventListener("insert-hadith", handler);
  }, [editor]);

  return (
    <div className="editor-container">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 min-h-0">
            <div className="flex-1 flex flex-col min-w-0">
              <header className="flex h-12 items-center gap-3 px-4 bg-transparent flex-shrink-0">
                {/* Sidebar Toggle */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <SidebarTrigger className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-ring" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden h-8 w-8 p-0"
                    onClick={() => setIsEditingTitle(true)}
                    title="تغيير العنوان"
                  >
                    <SquarePen className="h-4 w-4" />
                  </Button>
                </div>

                {/* File Name */}
                {pageContent && (
                  <div className={cn(
                    "items-center gap-2 min-w-0",
                    isEditingTitle ? "flex" : "hidden md:flex"
                  )}>
                    <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    {isEditingTitle ? (
                      <Input
                        value={titleValue}
                        onChange={(e) => setTitleValue(e.target.value)}
                        onBlur={handleUpdateTitle}
                        onKeyDown={(e) => e.key === "Enter" && handleUpdateTitle()}
                        autoFocus
                        className="h-7 text-sm py-0 w-32"
                      />
                    ) : (
                      <span
                        className="text-sm font-medium truncate whitespace-nowrap cursor-pointer hover:bg-muted/50 px-1 rounded transition-colors"
                        onClick={() => setIsEditingTitle(true)}
                        title="اضغط لتغيير العنوان"
                      >
                        {JSON.parse(pageContent)?.name}
                      </span>
                    )}
                  </div>
                )}

                {/* Centered Last Updated & Save Status */}
                <div className="flex-1 flex justify-center items-center gap-3 min-w-0">
                  {pageContent && (
                    <>
                      <SaveStatus state={saveState} />
                    </>
                  )}
                </div>

                {/* Export Button */}
                <div className="hidden md:block">
                  <DropdownMenu dir="rtl">
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="default"
                        size="sm"
                        disabled={editor.children.length === 0}
                        className="bg-[#2b2b2b] text-white hover:bg-[#2a2a2c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        تصدير
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[160px]">
                      <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer">
                        تصدير بصيغة PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleExportJSON} className="cursor-pointer">
                        تصدير بصيغة JSON
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleExportHTML} className="cursor-pointer">
                        تصدير بصيغة HTML
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleExportMarkdown} className="cursor-pointer">
                        تصدير بصيغة Markdown
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </header>

              <EditorLayout
                editor={editor}
                className="font-['Amiri'] overflow-hidden"
                onChange={() => {
                  if (editor.children.length > 0) {
                    debouncedSave(savePage);
                  }
                }}
              />
            </div>
            <SharedRightPanel />
          </div>
        </SidebarInset>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(8px)",
            },
          }}
        />
      </SidebarProvider>
    </div>
  );
}
