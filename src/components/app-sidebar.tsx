import * as React from "react";
// import {
//   AudioWaveform,
//   Command,
//   Home,
//   Inbox,
//   Search,
//   Sparkles,
// } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { AddPageDialog } from "./AddPageDialog";
import { usePages } from "@/hooks/use-pages";
import { Button } from "@/components/ui/button";
// This is sample data.
// const data = {
//   teams: [
//     {
//       name: "Acme Inc",
//       logo: Command,
//       plan: "Enterprise",
//     },
//     {
//       name: "Acme Corp.",
//       logo: AudioWaveform,
//       plan: "Startup",
//     },
//     {
//       name: "Evil Corp.",
//       logo: Command,
//       plan: "Free",
//     },
//   ],
//   navMain: [
//     {
//       title: "Search",
//       url: "#",
//       icon: Search,
//     },
//     {
//       title: "Ask AI",
//       url: "#",
//       icon: Sparkles,
//     },
//     {
//       title: "Home",
//       url: "#",
//       icon: Home,
//       isActive: true,
//     },
//     {
//       title: "Inbox",
//       url: "#",
//       icon: Inbox,
//       badge: "10",
//     },
//   ],
// };

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
            <Button variant="ghost" className="w-full justify-start">
              {page.name}
            </Button>
          </div>
        ))}
      </div>
      <SidebarRail />
    </Sidebar>
  );
}
