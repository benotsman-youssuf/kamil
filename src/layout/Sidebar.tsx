import { AppSidebar } from "@/components/app-sidebar";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster, toast } from "sonner";
import { EditorLayout } from "@/components/editor/EditorLayout";
import { usePlateEditor } from "@platejs/core/react";
import { editorPlugins } from "@/constants/editor";
import { db } from "@/lib/db";
import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import type { SaveState } from "@/components/SaveStatus";
import { exportToJSON, exportToHTMLAsync, exportToMarkdownAsync, exportToPDF } from "@/lib/utils/export";
import { debounce } from "@/lib/utils/debounce";
import { SharedRightPanel } from "@/components/SharedRightPanel";



const HOVER_CLOSE_DELAY = 350;
const SWIPE_EDGE_PX = 24;

export default function SideBar() {
  const [pageContent, setPageContent] = useState<string>();
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [titleValue, setTitleValue] = useState("");
  const { id } = useParams();

  // ── Sidebar open/pin state ────────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("sidebar-pinned") === "true";
  });
  const [isMobile, setIsMobile] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const editor = usePlateEditor({
    plugins: editorPlugins,
    value: [],
  });

  // ── Responsive ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Pin toggle ─────────────────────────────────────────────────────────────
  const togglePin = useCallback(() => {
    setSidebarPinned((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-pinned", String(next));
      if (next) setSidebarOpen(true);
      return next;
    });
  }, []);

  // ── Desktop hover handlers ─────────────────────────────────────────────────
  const handleHoverZoneEnter = useCallback(() => {
    if (sidebarPinned || isMobile) return;
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setSidebarOpen(true);
  }, [sidebarPinned, isMobile]);

  const handleSidebarMouseEnter = useCallback(() => {
    if (sidebarPinned || isMobile) return;
    isHovered.current = true;
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, [sidebarPinned, isMobile]);

  const handleSidebarMouseLeave = useCallback(() => {
    if (sidebarPinned || isMobile) return;
    isHovered.current = false;
    
    // If a radix popover/dropdown/dialog triggered from inside the sidebar is open,
    // prevent auto-closing. The MutationObserver or click-outside handler will catch the closure.
    if (sidebarRef.current?.querySelector('[data-state="open"]')) {
      return;
    }

    closeTimerRef.current = setTimeout(() => setSidebarOpen(false), HOVER_CLOSE_DELAY);
  }, [sidebarPinned, isMobile]);

  // ── Mobile swipe from edge ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isMobile) return;
    const onTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
      if (touchStartX.current < SWIPE_EDGE_PX && dx > 60 && dy < 80) setSidebarOpen(true);
      if (sidebarOpen && dx < -60 && dy < 80) setSidebarOpen(false);
    };
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [isMobile, sidebarOpen]);

  const isHovered = useRef(false);

  // ── Click outside to close (Mobile & Desktop floating) ───────────────
  useEffect(() => {
    if (sidebarPinned || !sidebarOpen) return;
    const handle = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        // Do not close if clicking inside a Radix portal (dropdown menu, dialog, etc.)
        if ((e.target as Element).closest('[data-radix-popper-content-wrapper], [role="dialog"]')) {
          return;
        }
        // Do not close if clicking on the invisible hover trigger strip
        if ((e.target as Element).closest('.hover-trigger-strip')) {
          return;
        }
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [sidebarPinned, sidebarOpen]);

  // ── ESC to close ──────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && sidebarOpen && !sidebarPinned) {
        // Prevent closing if a Radix dialog or dropdown is open
        if (document.querySelector('[data-state="open"], [role="dialog"]')) return;
        setSidebarOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [sidebarOpen, sidebarPinned]);

  // ── Observer for Dropdown state changes ───────────────────────────────────
  // Automatically close sidebar if a dropdown closes and the mouse is outside
  useEffect(() => {
    if (sidebarPinned || isMobile || !sidebarOpen) return;
    
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-state') {
          const el = mutation.target as HTMLElement;
          if (el.getAttribute('data-state') === 'closed') {
            if (!isHovered.current) {
              if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
              closeTimerRef.current = setTimeout(() => setSidebarOpen(false), HOVER_CLOSE_DELAY);
            }
          }
        }
      }
    });

    if (sidebarRef.current) {
      observer.observe(sidebarRef.current, { attributes: true, subtree: true, attributeFilter: ['data-state'] });
    }

    return () => observer.disconnect();
  }, [sidebarPinned, isMobile, sidebarOpen]);

  // ── Auto-save ─────────────────────────────────────────────────────────────
  const savePage = useCallback(async () => {
    try {
      setSaveState("saving");
      const updatedAt = new Date().toISOString();
      const content = JSON.stringify(editor.children);
      await db.pages.update(Number(id), { content, updatedAt });
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
      const page = await db.pages.get(Number(id));
      editor.tf.setValue(page?.content ? JSON.parse(page.content) : []);
      setPageContent(JSON.stringify(page));
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

  const isVisible = sidebarPinned || sidebarOpen;

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
          className="fixed inset-0 z-30 bg-black/25 backdrop-blur-[2px] transition-opacity duration-200"
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
          "flex-shrink-0 h-full z-40 will-change-transform",
          "transition-[transform,opacity,width] duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
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
