import { Plate } from "@platejs/core/react";
import { FixedToolbar } from "@/components/ui/fixed-toolbar";
import { EditorToolbar } from "./EditorToolbar";
import { EditorContent } from "./EditorContent";

interface EditorLayoutProps {
  editor: any; // Consider creating a proper type for your editor
  className?: string;
}

export function EditorLayout({ editor, className = "" }: EditorLayoutProps) {
  return (
    <div className={`${className}`}>
      <Plate editor={editor}>
        <FixedToolbar className="w-fit mx-auto rounded-xl bg-[#1e1e1f] border border-[#38383a] shadow-[0_4px_14px_rgba(0,0,0,0.25)] backdrop-blur-lg py-1 px-2">
          <EditorToolbar className="gap-1" />
        </FixedToolbar>
        <EditorContent/>
      </Plate>
    </div>
  );
}
