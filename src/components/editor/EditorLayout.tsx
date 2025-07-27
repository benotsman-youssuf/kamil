import { Plate } from "platejs/react";
import { FixedToolbar } from "@/components/ui/fixed-toolbar";
import { EditorToolbar } from "./EditorToolbar";
import { EditorContent } from "./EditorContent";

interface EditorLayoutProps {
  editor: any; // Consider creating a proper type for your editor
  className?: string;
}

export function EditorLayout({ editor, className = "" }: EditorLayoutProps) {
  return (
    <div className={` ${className}`}>
      <Plate editor={editor}>
        <FixedToolbar className="border-none w-fit mx-auto overflow-hidden rounded-2xl bg-[#262628]">
          <EditorToolbar className="flex items-center justify-center gap-0.5" />
        </FixedToolbar>
        <EditorContent />
      </Plate>
    </div>
  );
}
