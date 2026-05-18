import { AppSidebar } from "@/components/app-sidebar";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster, toast } from "sonner";
import { EditorLayout } from "@/components/editor/EditorLayout";
import { usePlateEditor } from "@platejs/core/react";
import { editorPlugins } from "@/constants/editor";
import { getDb } from "@/lib/rxdb";
import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import type { SaveState } from "@/components/SaveStatus";
import { exportToJSON, exportToHTMLAsync, exportToMarkdownAsync, exportToPDF } from "@/lib/utils/export";
import { debounce } from "@/lib/utils/debounce";
import { SharedRightPanel } from "@/components/SharedRightPanel";
import { fetchVerseDetails } from "@/lib/qf/api";
import { useSidebarState } from "@/hooks/use-sidebar-state";

export default function SideBar() {
  const [pageContent, setPageContent] = useState<string>();
  const [_saveState, setSaveState] = useState<SaveState>("idle");
  const [_titleValue, setTitleValue] = useState("");
  const { id } = useParams();

  const {
    sidebarOpen,
    setSidebarOpen,
    sidebarPinned,
    isMobile,
    sidebarRef,
    isVisible,
    togglePin,
    handleHoverZoneEnter,
    handleSidebarMouseEnter,
    handleSidebarMouseLeave,
  } = useSidebarState();

  const editor = usePlateEditor({
    plugins: editorPlugins,
    value: [],
  });

  // ── Start RxDB sync on mount if authenticated ────────────────────────
  useEffect(() => {
    import("@/lib/rxdb").then(({ startSyncIfAuthenticated }) => {
      startSyncIfAuthenticated();
    });
  }, []);

  // ── Auto-save ─────────────────────────────────────────────────────────────
  const savePage = useCallback(async () => {
    try {
      setSaveState("saving");
      const updatedAt = new Date().toISOString();
      const content = JSON.stringify(editor.children);
      const db = await getDb();
      const existing = await db.pages.findOne(id!).exec();
      if (existing) {
        await existing.patch({ content, updated_at: updatedAt });
      }
      setPageContent((prev) => {
        if (!prev) return prev;
        const page = JSON.parse(prev);
        return JSON.stringify({ ...page, content, updatedAt });
      });
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1500);
    } catch (error) {
      console.error("Error saving:", error);
      setSaveState("error");
      toast.error("فشل الحفظ", { duration: 1000 });
      setTimeout(() => setSaveState("idle"), 3000);
    }
  }, [id, editor.children]);

  const debouncedSave = useRef(debounce((save: () => void) => save(), 750)).current;

  const fetchPage = async () => {
    try {
      const db = await getDb();
      const page = await db.pages.findOne(id!).exec();
      editor.tf.setValue(page?.content ? JSON.parse(page.content) : []);
      setPageContent(JSON.stringify(page?.toJSON() || null));
    } catch (error) {
      console.error("Error fetching page:", error);
    }
  };

  // Export handlers
  const handleExportJSON = () => {
    if (pageContent) { exportToJSON(editor.children, JSON.parse(pageContent).name); toast.success("تم تصدير الملف بصيغة JSON", { duration: 2000 }); }
  };
  const handleExportHTML = async () => {
    if (pageContent) { await exportToHTMLAsync(editor.children, JSON.parse(pageContent).name); toast.success("تم تصدير الملف بصيغة HTML", { duration: 2000 }); }
  };
  const handleExportMarkdown = async () => {
    if (pageContent) { await exportToMarkdownAsync(editor.children, JSON.parse(pageContent).name); toast.success("تم تصدير الملف بصيغة Markdown", { duration: 2000 }); }
  };
  const handleExportPDF = () => {
    if (pageContent) { exportToPDF(editor.children, JSON.parse(pageContent).name); toast.success("تم فتح نافذة الطباعة لحفظ PDF", { duration: 2000 }); }
  };

  useEffect(() => {
    if (pageContent) setTitleValue(JSON.parse(pageContent).name);
  }, [pageContent]);

  useEffect(() => { fetchPage(); }, [id]);

  // Listen for verse insertion
  useEffect(() => {
    const handler = async (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail?.verseKey) return;

      let verseText = detail.verseText || "";
      let surahName = detail.surahName || "";
      let ayaNumber = detail.ayaNumber || 0;

      if (!verseText) {
        try {
          const verse = await fetchVerseDetails(detail.verseKey);
          verseText = verse.text_uthmani || verse.text_imlaei || "";
          ayaNumber = Number(detail.verseKey.split(":")[1] || 0);
        } catch {}
      }

      editor.tf.insertNodes({
        type: "verse",
        verseKey: detail.verseKey,
        surahName,
        ayaNumber,
        verseText,
        children: [{ text: `﴿${verseText || detail.verseKey}﴾` }],
      });
      editor.tf.insertText(" ");
      editor.tf.move({ distance: 1, unit: "character" });
    };

    window.addEventListener("insert-verse", handler);
    return () => window.removeEventListener("insert-verse", handler);
  }, [editor]);

  // Listen for hadith insertion
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
      editor.tf.move({ distance: 1, unit: "character" });
    };
    window.addEventListener("insert-hadith", handler);
    return () => window.removeEventListener("insert-hadith", handler);
  }, [editor]);

  return (
    <div className="editor-container flex h-screen w-full overflow-hidden bg-background relative">
      {/* ── Invisible hover trigger strip (desktop, unpinned) ─────────────── */}
      {!isMobile && !sidebarPinned && (
        <div
          aria-hidden
          className="hover-trigger-strip absolute left-0 top-0 bottom-0 w-4 z-40"
          onMouseEnter={handleHoverZoneEnter}
        />
      )}

      {/* ── Mobile overlay backdrop ────────────────────────────────────────── */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-[55] bg-black/25 backdrop-blur-[2px] transition-opacity duration-200"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* ── Sidebar panel ─────────────────────────────────────────────────── */}
      <div
        ref={sidebarRef}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
        className={cn(
          "flex-shrink-0 h-full will-change-transform",
          "transition-[transform,opacity,width] duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          isMobile ? "z-[60]" : "z-40",
          // Desktop pinned: inline, pushes content
          !isMobile && sidebarPinned && "relative",
          // Desktop floating (hover): absolute overlay
          !isMobile && !sidebarPinned && "absolute left-0 top-0 bottom-0",
          // Mobile: fixed slide-in
          isMobile && "fixed left-0 top-0 bottom-0",
          // Shadow when floating/mobile
          !sidebarPinned && isVisible && "shadow-[4px_0_32px_rgba(0,0,0,0.15)]",
          !isVisible && "-translate-x-full opacity-0 pointer-events-none",
          isVisible && "translate-x-0 opacity-100",
        )}
      >
        {/* AppSidebar — receives pin state so it can render the pin button in its header */}
        <SidebarProvider
          className="!min-h-0 !h-full flex flex-col"
          style={{ "--sidebar-width": "240px" } as React.CSSProperties}
        >
          <AppSidebar pinned={sidebarPinned} onTogglePin={togglePin} />
        </SidebarProvider>
      </div>

      {/* ── Main content area ─────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 h-full overflow-hidden",
          "transition-[margin] duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
        )}
      >
        {/* Editor + Right Panel - fills full height */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <EditorLayout
            editor={editor}
            pageId={id}
            className="flex-1 font-['Amiri'] min-w-0 overflow-hidden"
            onChange={() => {
              if (editor.children.length > 0) {
                debouncedSave(savePage);
              }
            }}
            exportHandlers={{
              onExportJSON: handleExportJSON,
              onExportHTML: handleExportHTML,
              onExportMarkdown: handleExportMarkdown,
              onExportPDF: handleExportPDF,
            }}
          />
          <SharedRightPanel />
        </div>
      </div>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "hsl(var(--card) / 0.95)",
            color: "hsl(var(--card-foreground))",
            backdropFilter: "blur(8px)",
            border: "1px solid hsl(var(--border))"
          },
        }}
      />
    </div>
  );
}
