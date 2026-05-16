"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { VersePanelContent } from "./VersePanel";
import { HadithPanelContent } from "./HadithPanel";

export function SharedRightPanel() {
  const [open, setOpen] = useState(false);
  const [activeType, setActiveType] = useState<"verse" | "hadith" | null>(null);
  const [activeData, setActiveData] = useState<any>(null);

  const MIN_WIDTH = 280;
  const MAX_WIDTH = 600;
  const [panelWidth, setPanelWidth] = useState(() => {
    if (typeof window === "undefined") return 360;
    const saved = localStorage.getItem("right-panel-width");
    return saved ? Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, parseInt(saved))) : 360;
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, width: 0 });
  const panelWidthRef = useRef(panelWidth);
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => { panelWidthRef.current = panelWidth; }, [panelWidth]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, width: panelWidth };
  }, [panelWidth]);

  useEffect(() => {
    if (!isDragging) return;
    const startX = dragStartRef.current.x;
    const startWidth = dragStartRef.current.width;

    const onMove = (e: MouseEvent) => {
      const delta = startX - e.clientX;
      setPanelWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth + delta)));
    };

    const onUp = () => {
      setIsDragging(false);
      localStorage.setItem("right-panel-width", String(panelWidthRef.current));
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  useEffect(() => {
    const handleOpenVerse = (e: any) => {
      console.log("SharedRightPanel: Received open-verse-panel", e.detail);
      setActiveData(e.detail);
      setActiveType("verse");
      setOpen(true);
    };

    const handleOpenHadith = (e: any) => {
      console.log("SharedRightPanel: Received open-hadith-panel", e.detail);
      setActiveData(e.detail);
      setActiveType("hadith");
      setOpen(true);
    };

    window.addEventListener("open-verse-panel", handleOpenVerse);
    window.addEventListener("open-hadith-panel", handleOpenHadith);
    return () => {
      window.removeEventListener("open-verse-panel", handleOpenVerse);
      window.removeEventListener("open-hadith-panel", handleOpenHadith);
    };
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    // Don't clear data immediately so exit animation looks good
    setTimeout(() => {
      setActiveType(null);
      setActiveData(null);
    }, 200);
  }, []);

  return (
    <div
      ref={panelRef}
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground flex-shrink-0 overflow-hidden",
        isDragging ? "" : "transition-all duration-200 ease-linear",
        isMobile 
          ? "fixed inset-y-0 right-0 z-[100] border-l shadow-2xl" 
          : "relative border-l border-sidebar-border",
        open ? "" : "pointer-events-none"
      )}
      style={{ 
        width: open ? (isMobile ? "100%" : panelWidth + "px") : "0px",
        transform: isMobile && !open ? "translateX(100%)" : "translateX(0)",
      }}
    >
      {!isMobile && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1 z-10 cursor-col-resize hover:bg-foreground/10 active:bg-foreground/20 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-border before:opacity-0 hover:before:opacity-100 before:transition-opacity"
          onMouseDown={handleResizeStart}
        />
      )}
      {activeType === "verse" && activeData && (
        <VersePanelContent verseData={activeData} close={close} />
      )}
      {activeType === "hadith" && activeData && (
        <HadithPanelContent hadithData={activeData} close={close} />
      )}
    </div>
  );
}
