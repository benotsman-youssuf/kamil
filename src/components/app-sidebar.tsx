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
    <Sidebar className="border-r-0 bg-muted/40" {...props}>
      <SidebarHeader className="px-4 py-3 border-b">
        <AddPageDialog />
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-full px-2">
          <nav className="flex flex-col gap-1 py-3">
            {pages?.map((page) => {
              const isActive = location.pathname === `/pages/${page.id}`;
              return (
                <div
                  key={page.id}
                  className={cn(
                    "group flex items-center justify-between rounded px-3 py-1.5 text-sm transition-colors duration-150",
                    isActive
                      ? "font-semibold text-primary border-l-2 border-primary bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                  )}
                >
                  <Link
                    to={`/pages/${page.id}`}
                    className="flex items-center gap-2 overflow-hidden flex-1 px-0 py-0.5 rounded focus:outline-none"
                    title={page.name}
                    aria-label={`Open ${page.name}`}
                  >
                    <span className="truncate text-sm font-medium">{page.name}</span>
                  </Link>
                  {isActive && (
                    <DeletePage
                      pageId={page.id}
                    />
                  )}
                </div>
              );
            })}
          </nav>
        </ScrollArea>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
