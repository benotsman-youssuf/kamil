import * as React from "react";
import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar";
import { AddPageDialog } from "./AddPageDialog";
import { usePages } from "@/hooks/use-pages";
import { Link, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { PageActions } from "./PageActions";
import { Pin, Sun, Moon, Compass } from "lucide-react";
import { UserAccount } from "./UserAccount";
import { useTheme } from "@/hooks/use-theme";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  pinned?: boolean;
  onTogglePin?: () => void;
}

export function AppSidebar({ pinned, onTogglePin, ...props }: AppSidebarProps) {
  const pages = usePages();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const sortedPages = React.useMemo(() => {
    if (!pages) return [];
    return [...pages].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [pages]);

  const firstPageId = sortedPages?.[0]?.id;

  return (
    <Sidebar
      collapsible="none"
      className="h-full w-[240px] flex-shrink-0 border-r border-sidebar-border bg-sidebar flex flex-col"
      {...props}
    >
      {/* ── Top bar: Logo + Actions ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3 py-3 flex-shrink-0 border-b border-sidebar-border">
        {/* Logo */}
        <Link
          to={firstPageId ? `/pages/${firstPageId}` : "/"}
          className="flex items-center gap-2 group"
          aria-label="العودة للرئيسية"
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="h-7 w-7 rounded-md shadow-sm ring-1 ring-border/20 bg-white transition-transform duration-150 group-hover:scale-105"
            draggable={false}
          />
        </Link>

        {/* Action icons row */}
        <div className="flex items-center gap-0.5">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-150"
          >
            {theme === "dark"
              ? <Sun className="h-4 w-4" />
              : <Moon className="h-4 w-4" />}
          </button>

          {/* Pin / Unpin sidebar */}
          {onTogglePin && (
            <button
              onClick={onTogglePin}
              title={pinned ? "إلغاء تثبيت الشريط" : "تثبيت الشريط الجانبي"}
              className={cn(
                "p-1.5 rounded-md transition-all duration-150",
                pinned
                  ? "text-foreground bg-muted/60"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <Pin className={cn("h-4 w-4 transition-transform duration-150", pinned ? "" : "rotate-45")} />
            </button>
          )}

          {/* New page — compact icon-only button */}
          <AddPageDialog compact />
        </div>
      </div>

      {/* ── Pages list ──────────────────────────────────────────────────────── */}
      <SidebarContent className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          {/* Discover link */}
          <div className="px-2 py-2">
            <Link
              to="/discover"
              className={cn(
                "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-all duration-150",
                location.pathname === "/discover"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <Compass className="h-4 w-4" />
              <span>اكتشف</span>
            </Link>
          </div>

          <nav className="flex flex-col gap-0.5 px-2 pb-2">
            {sortedPages?.map((page) => {
              const isActive = location.pathname === `/pages/${page.id}`;
              return (
                <div
                  key={page.id}
                  className={cn(
                    "group flex items-center justify-between rounded-lg px-2 py-1.5 text-sm",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <Link
                    to={`/pages/${page.id}`}
                    className="flex items-center gap-2 overflow-hidden flex-1 min-w-0"
                    title={page.name}
                  >
                    {page.isPinned && (
                      <Pin className="h-3 w-3 rotate-45 flex-shrink-0 opacity-50" />
                    )}
                    <span className="truncate">{page.name}</span>
                  </Link>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-100 flex-shrink-0">
                    <PageActions page={page} isActive={isActive} />
                  </div>
                </div>
              );
            })}
          </nav>
        </ScrollArea>
      </SidebarContent>

      {/* ── Bottom: User account ─────────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-t border-sidebar-border">
        <UserAccount />
      </div>
    </Sidebar>
  );
}
