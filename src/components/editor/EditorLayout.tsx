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

interface ExportHandlers {
  onExportJSON?: () => void;
  onExportHTML?: () => Promise<void>;
  onExportMarkdown?: () => Promise<void>;
  onExportPDF?: () => void;
}

interface EditorLayoutProps {
  className?: string;
  editor: any;
  pageId?: string;
  onChange?: (value: any[]) => void;
  exportHandlers?: ExportHandlers;
}

export function EditorLayout({
  className = "",
  editor,
  pageId,
  onChange,
  exportHandlers,
}: EditorLayoutProps) {
  return (
    <div className={`flex flex-col h-full overflow-hidden ${className}`}>
      <Plate editor={editor} onChange={({ value }) => onChange?.(value)}>
        {/* Sticky toolbar — stays at top when scrolling */}
        <FixedToolbar className="w-fit max-w-[calc(100%-2rem)] mx-auto rounded-xl bg-primary shadow-[0_4px_24px_rgba(0,0,0,0.18)] backdrop-blur-lg py-1 px-2 mb-6 mt-3 flex-shrink-0">
          <EditorToolbar
            className="gap-1 flex-nowrap"
            editor={editor}
            pageId={pageId}
            exportHandlers={exportHandlers}
          />
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

        {/* Scrollable writing area */}
        <EditorContent />
      </Plate>
    </div>
  );
}
