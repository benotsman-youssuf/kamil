import { AppSidebar } from "@/components/app-sidebar";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SharedRightPanel } from "@/components/SharedRightPanel";
import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useSidebarState } from "@/hooks/use-sidebar-state";

export function UserLayout({ children, title }: { children: ReactNode; title: string }) {
  const navigate = useNavigate();
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
