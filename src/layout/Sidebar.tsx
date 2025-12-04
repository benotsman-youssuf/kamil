import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EditorLayout } from "@/components/editor/EditorLayout";
import { usePlateEditor } from "@platejs/core/react";
import { editorPlugins } from "@/constants/editor";
import { db } from "@/lib/db";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

export default function SideBar() {
  const [pageContent, setPageContent] = useState<string>();
  const { id } = useParams();
  const editor = usePlateEditor({
    plugins: editorPlugins,
    value: [],
  });

  const savePage = async () => {
    try {
      await db.pages.update(Number(id), {
        content: JSON.stringify(editor.children),
        updatedAt: new Date().toISOString(),
      });
      console.log(editor);
      const page = await db.pages.get(Number(id));
      setPageContent(JSON.stringify(page));
      toast.success("تم الحفظ بنجاح", {
        duration: 1000,
      });
    } catch {
      toast.error("فشل الحفظ", {
        duration: 1000,
      });
    }
  };

  const fetchPage = async () => {
    try {
      const page = await db.pages.get(Number(id));
      editor.tf.setValue(page?.content ? JSON.parse(page.content) : []);
      setPageContent(JSON.stringify(page));
    } catch (error) {
      console.error("Error fetching page:", error);
    }
  };

  useEffect(() => {
    fetchPage();
  }, [id]);

  return (
    <div className="editor-container">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
        <header className="flex h-12 items-center gap-3 px-4 bg-transparent">
          {/* Sidebar Toggle */}
          <SidebarTrigger className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-ring" />

          {/* File Name */}
          {pageContent && (
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-medium truncate whitespace-nowrap">
                {JSON.parse(pageContent)?.name}
              </span>
            </div>
          )}

          {/* Centered Last Updated */}
          <div className="flex-1 flex justify-center">
            {pageContent && (
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                آخر تحديث:{" "}
                {new Date(
                  JSON.parse(pageContent)?.updatedAt || Date.now()
                ).toLocaleDateString("ar-EG", {
                  day: "numeric",
                  month: "short",
                })}{" "}
                {new Date(
                  JSON.parse(pageContent)?.updatedAt || Date.now()
                ).toLocaleTimeString("ar-EG", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </span>
            )}
          </div>

          {/* Save Button */}
          <Button
            variant="default"
            size="sm"
            onClick={savePage}
            disabled={editor.children.length === 0}
            className="bg-[#2b2b2b] text-white hover:bg-[#2a2a2c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
          >
            حفظ
          </Button>
        </header>

        <EditorLayout editor={editor} className="font-['Amiri'] overflow-hidden"/>
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
