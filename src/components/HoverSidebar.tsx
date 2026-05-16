"use client";

import { useEffect, useRef, useState, useCallback, useId } from "react";
import { cn } from "@/lib/utils";
import { Pin, PinOff } from "lucide-react";

interface HoverSidebarProps {
  children: React.ReactNode;
}

// Touch state for swipe-from-edge detection
const SWIPE_EDGE_THRESHOLD = 24; // px from left edge to trigger
const HOVER_DELAY_CLOSE = 400;   // ms before sidebar hides after mouse leaves

export function HoverSidebar({ children }: HoverSidebarProps) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("sidebar-pinned") === "true";
  });
  const [isMobile, setIsMobile] = useState(false);

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Touch state
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);

  // ─── Responsive ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ─── Persistence ────────────────────────────────────────────────────────────
  const togglePin = useCallback(() => {
    setPinned((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-pinned", String(next));
      if (next) setOpen(true);
      return next;
    });
  }, []);

  // ─── Desktop: hover zone (invisible strip on left edge) ─────────────────────
  const handleHoverZoneEnter = useCallback(() => {
    if (pinned || isMobile) return;
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setOpen(true);
  }, [pinned, isMobile]);

  const handleSidebarLeave = useCallback(() => {
    if (pinned || isMobile) return;
    closeTimerRef.current = setTimeout(() => setOpen(false), HOVER_DELAY_CLOSE);
  }, [pinned, isMobile]);

  const handleSidebarEnter = useCallback(() => {
    if (pinned || isMobile) return;
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, [pinned, isMobile]);

  // ─── Mobile: swipe from left edge ────────────────────────────────────────────
  useEffect(() => {
    if (!isMobile) return;

    const onTouchStart = (e: TouchEvent) => {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartXRef.current;
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartYRef.current);

      // Swipe right from left edge → open
      if (touchStartXRef.current < SWIPE_EDGE_THRESHOLD && dx > 48 && dy < 80) {
        setOpen(true);
      }
      // Swipe left while open → close
      if (open && dx < -48 && dy < 80) {
        setOpen(false);
      }
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [isMobile, open]);

  // ─── Mobile: tap outside to close ────────────────────────────────────────────
  useEffect(() => {
    if (!isMobile || !open) return;
    const handleClick = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isMobile, open]);

  // ─── ESC to close ────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open && !pinned) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, pinned]);

  const isVisible = pinned || open;

  return (
    <div className="flex h-full relative">
      {/* ── Invisible hover trigger strip (desktop only) ────────────────────── */}
      {!isMobile && !pinned && (
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 bottom-0 w-3 z-[60] cursor-default"
          onMouseEnter={handleHoverZoneEnter}
        />
      )}

      {/* ── Mobile overlay backdrop ─────────────────────────────────────────── */}
      {isMobile && open && (
        <div
          className="fixed inset-0 z-[55] bg-black/30 backdrop-blur-[1px] transition-opacity duration-200"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar panel ───────────────────────────────────────────────────── */}
      <div
        ref={sidebarRef}
        onMouseEnter={handleSidebarEnter}
        onMouseLeave={handleSidebarLeave}
        className={cn(
          "flex flex-col h-full z-[60] will-change-transform",
          // Desktop: absolute overlay that doesn't push content
          !isMobile && !pinned && "absolute left-0 top-0 bottom-0",
          // Desktop pinned: relative, pushes content
          !isMobile && pinned && "relative",
          // Mobile: fixed overlay
          isMobile && "fixed left-0 top-0 bottom-0",
          // Transitions
          "transition-[transform,width,opacity] duration-250 ease-out",
          !isVisible && "-translate-x-full opacity-0",
          isVisible && "translate-x-0 opacity-100",
          // Shadow when floating
          !pinned && isVisible && "shadow-[4px_0_24px_rgba(0,0,0,0.12)]",
        )}
        style={{ width: isVisible ? undefined : 0 }}
      >
        {/* Pin toggle button */}
        <button
          onClick={togglePin}
          title={pinned ? "إلغاء تثبيت الشريط الجانبي" : "تثبيت الشريط الجانبي"}
          className={cn(
            "absolute top-3 right-2 z-10 p-1 rounded-md transition-all duration-150",
            "text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/60",
          )}
        >
          {pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5 rotate-45" />}
        </button>

        {children}
      </div>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-[margin] duration-250 ease-out",
          // When pinned on desktop, the sidebar takes space naturally
        )}
      >
        {/* Pass-through slot — content injected by parent */}
      </div>
    </div>
  );
}
