import { AppSidebar } from "@/components/app-sidebar";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SharedRightPanel } from "@/components/SharedRightPanel";
import { useEffect, useState, useCallback, useRef, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HOVER_CLOSE_DELAY = 350;
const SWIPE_EDGE_PX = 24;

export function UserLayout({ children, title }: { children: ReactNode; title: string }) {
  const navigate = useNavigate();
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
  const isHovered = useRef(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const togglePin = useCallback(() => {
    setSidebarPinned((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-pinned", String(next));
      if (next) setSidebarOpen(true);
      return next;
    });
  }, []);

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
    if (sidebarRef.current?.querySelector('[data-state="open"]')) return;
    closeTimerRef.current = setTimeout(() => setSidebarOpen(false), HOVER_CLOSE_DELAY);
  }, [sidebarPinned, isMobile]);

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

  useEffect(() => {
    if (sidebarPinned || !sidebarOpen) return;
    const handle = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        if ((e.target as Element).closest('[data-radix-popper-content-wrapper], [role="dialog"]')) return;
        if ((e.target as Element).closest(".hover-trigger-strip")) return;
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [sidebarPinned, sidebarOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && sidebarOpen && !sidebarPinned) {
        if (document.querySelector('[data-state="open"], [role="dialog"]')) return;
        setSidebarOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [sidebarOpen, sidebarPinned]);

  useEffect(() => {
    if (sidebarPinned || isMobile || !sidebarOpen) return;
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === "data-state") {
          const el = mutation.target as HTMLElement;
          if (el.getAttribute("data-state") === "closed") {
            if (!isHovered.current) {
              if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
              closeTimerRef.current = setTimeout(() => setSidebarOpen(false), HOVER_CLOSE_DELAY);
            }
          }
        }
      }
    });
    if (sidebarRef.current) {
      observer.observe(sidebarRef.current, { attributes: true, subtree: true, attributeFilter: ["data-state"] });
    }
    return () => observer.disconnect();
  }, [sidebarPinned, isMobile, sidebarOpen]);

  const isVisible = sidebarPinned || sidebarOpen;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background relative">
      {!isMobile && !sidebarPinned && (
        <div
          aria-hidden
          className="hover-trigger-strip absolute left-0 top-0 bottom-0 w-4 z-40"
          onMouseEnter={handleHoverZoneEnter}
        />
      )}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/25 backdrop-blur-[2px] transition-opacity duration-200"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}
      <div
        ref={sidebarRef}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
        className={cn(
          "flex-shrink-0 h-full z-40 will-change-transform",
          "transition-[transform,opacity,width] duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          !isMobile && sidebarPinned && "relative",
          !isMobile && !sidebarPinned && "absolute left-0 top-0 bottom-0",
          isMobile && "fixed left-0 top-0 bottom-0",
          !sidebarPinned && isVisible && "shadow-[4px_0_32px_rgba(0,0,0,0.15)]",
          !isVisible && "-translate-x-full opacity-0 pointer-events-none",
          isVisible && "translate-x-0 opacity-100",
        )}
      >
        <SidebarProvider
          className="!min-h-0 !h-full flex flex-col"
          style={{ "--sidebar-width": "240px" } as React.CSSProperties}
        >
          <AppSidebar pinned={sidebarPinned} onTogglePin={togglePin} />
        </SidebarProvider>
      </div>

      <div className={cn("flex-1 flex flex-col min-w-0 h-full overflow-hidden")}>
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <div className="flex-1 min-w-0 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-6 py-8">
              <div className="flex items-center gap-3 mb-8">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold font-amiri">{title}</h1>
              </div>
              {children}
            </div>
          </div>
          <SharedRightPanel />
        </div>
      </div>
    </div>
  );
}
