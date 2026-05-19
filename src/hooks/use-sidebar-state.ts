import { useState, useEffect, useCallback, useRef } from "react";

const HOVER_CLOSE_DELAY = 350;
const SWIPE_EDGE_PX = 24;

export function useSidebarState() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  // Mobile swipe from edge
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

  // Click outside to close
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

  // ESC to close
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

  // MutationObserver for dropdown state changes
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

  return {
    sidebarOpen,
    setSidebarOpen,
    sidebarPinned,
    isMobile,
    sidebarRef,
    isVisible: sidebarPinned || sidebarOpen,
    togglePin,
    handleHoverZoneEnter,
    handleSidebarMouseEnter,
    handleSidebarMouseLeave,
  };
}
