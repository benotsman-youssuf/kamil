import { Plate } from "@platejs/core/react";
import { FixedToolbar } from "@/components/ui/fixed-toolbar";
import { EditorToolbar } from "./EditorToolbar";
import { EditorContent } from "./EditorContent";

interface EditorLayoutProps {
  className?: string;
  editor: any;
}

export function EditorLayout({
  className = "",
  editor,
}: EditorLayoutProps) {

  return (
    <div className={`${className}`}>
      <Plate editor={editor}>
        <FixedToolbar className="w-fit mx-auto rounded-xl bg-[#2b2b2b] shadow-[0_4px_14px_rgba(0,0,0,0.25)] backdrop-blur-lg py-1 px-2 ">
          <EditorToolbar className="gap-1" />
        </FixedToolbar>
        <EditorContent />
      </Plate>
    </div>
  );
}
