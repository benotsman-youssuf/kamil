import { Plate } from "@platejs/core/react";
import { FixedToolbar } from "@/components/ui/fixed-toolbar";
import { FloatingToolbar } from "@/components/ui/floating-toolbar";
import { EditorToolbar } from "./EditorToolbar";
import { EditorContent } from "./EditorContent";
import {
  Bold,
  Italic,
  Underline,
  Code,
  Strikethrough,
} from "lucide-react";
import { MarkToolbarButton } from "@/components/ui/mark-toolbar-button";
import { ToolbarSeparator } from "@/components/ui/toolbar";

interface EditorLayoutProps {
  className?: string;
  editor: any;
  onChange?: (value: any[]) => void;
}

export function EditorLayout({
  className = "",
  editor,
  onChange,
}: EditorLayoutProps) {

  return (
    <div className={`${className}`}>
      <Plate editor={editor} onChange={({ value }) => onChange?.(value)}>
        <FixedToolbar className="w-fit max-w-[calc(100%-2rem)] mx-auto rounded-xl bg-[#2b2b2b] shadow-[0_4px_14px_rgba(0,0,0,0.25)] backdrop-blur-lg py-1 px-2 ">
          <EditorToolbar className="gap-1 flex-nowrap" editor={editor} />
        </FixedToolbar>
        <FloatingToolbar>
          <MarkToolbarButton nodeType="bold" tooltip="Bold">
            <Bold className="size-4" />
          </MarkToolbarButton>
          <MarkToolbarButton nodeType="italic" tooltip="Italic">
            <Italic className="size-4" />
          </MarkToolbarButton>
          <MarkToolbarButton nodeType="underline" tooltip="Underline">
            <Underline className="size-4" />
          </MarkToolbarButton>
          <ToolbarSeparator />
          <MarkToolbarButton nodeType="code" tooltip="Code">
            <Code className="size-4" />
          </MarkToolbarButton>
          <MarkToolbarButton nodeType="strikethrough" tooltip="Strikethrough">
            <Strikethrough className="size-4" />
          </MarkToolbarButton>
        </FloatingToolbar>
        <EditorContent />
      </Plate>
    </div>
  );
}
