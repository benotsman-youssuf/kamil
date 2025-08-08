import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { AddPageDialog } from "./AddPageDialog";
import { usePages } from "@/hooks/use-pages";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pages = usePages()

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <AddPageDialog />
      </SidebarHeader>
      <SidebarContent>
      </SidebarContent>
      <div className="flex flex-col gap-2">
        {pages?.map((page) => (
          <div key={page.id}>
            <Link to={`/pages/${page.id}`}>{page.name}</Link>
          </div>
        ))}
      </div>
      <SidebarRail />
    </Sidebar>
  );
}
