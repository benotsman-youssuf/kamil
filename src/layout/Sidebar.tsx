import { AppSidebar } from "@/components/app-sidebar";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "sonner";


import { EditorLayout } from "@/components/editor/EditorLayout";

export default function SideBar() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset >
        <header className="flex h-10 shrink-0 items-center gap-2 ">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </header>
        <EditorLayout />
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
