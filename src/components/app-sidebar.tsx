import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { AddPageDialog } from "./AddPageDialog";
import { usePages } from "@/hooks/use-pages";
import { Link, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { DeletePage } from "./DeletePage";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pages = usePages();
  const location = useLocation();

  return (
    <Sidebar
      className="border-r-0 bg-gradient-to-b from-muted/50 to-muted/30 backdrop-blur-md"
      {...props}
    >
      {/* Logo Section */}
      

      {/* Add Page */}
      <SidebarHeader className="px-4 py-5 border-b border-border/30 bg-gradient-to-r from-background/90 to-muted/40 shadow-sm flex flex-row ">
          <Link
            to="/"
            className="flex items-center gap-2 hover:scale-105 transition-transform duration-150"
            aria-label="العودة للرئيسية"
          >
            <img
              src="/logo.png"
              alt="Logo"
              className="h-10 w-10 rounded-lg shadow ring-1 ring-border/20 bg-white"
              draggable={false}
            />
          </Link>
        <AddPageDialog />
      </SidebarHeader>

      {/* Pages List */}
      <SidebarContent>
        <ScrollArea className="h-full px-3">
          <nav className="flex flex-col gap-1 py-3">
            {pages?.map((page) => {
              const isActive = location.pathname === `/pages/${page.id}`;
              return (
                <div
                  key={page.id}
                  className={cn(
                    "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ease-out",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm border border-primary/20"
                      : "text-muted-foreground hover:bg-accent/20 hover:text-foreground"
                  )}
                >
                  <Link
                    to={`/pages/${page.id}`}
                    className="flex items-center gap-2 overflow-hidden flex-1"
                    title={page.name}
                    aria-label={`فتح ${page.name}`}
                  >
                    <span className="truncate">{page.name}</span>
                  </Link>
                  {isActive && <DeletePage pageId={page.id} />}
                </div>
              );
            })}
          </nav>
        </ScrollArea>
      </SidebarContent>

      {/* Rail */}
      <SidebarRail />
    </Sidebar>
  );
}
