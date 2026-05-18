import { MarkToolbarButton } from "@/components/ui/mark-toolbar-button";
import { AlignToolbarButton } from "@/components/ui/align-toolbar-button";
import { Bold, Italic, Underline, Bot } from "lucide-react";
import { FontSizeToolbarButton } from "@/components/ui/font-size-toolbar-button";
import { ExportDropdown } from "./ExportDropdown";

interface ExportHandlers {
  onExportJSON?: () => void;
  onExportHTML?: () => Promise<void>;
  onExportMarkdown?: () => Promise<void>;
  onExportPDF?: () => void;
}

interface EditorToolbarProps {
  className?: string;
  editor: any;
  exportHandlers?: ExportHandlers;
}

export function EditorToolbar({ className = "", editor }: EditorToolbarProps) {
  // Icon + hover style for the dark toolbar
  const btnCls = "p-1.5 rounded-lg hover:bg-primary-foreground/10 active:bg-primary-foreground/20 transition-all duration-150 ease-out group";
  const iconCls = "w-5 h-5 text-primary-foreground/70 group-hover:text-primary-foreground transition-colors";

  return (
    <div className={`flex items-center ${className}`}>
      {/* Formatting */}
      <div className="flex items-center gap-0.5 border-r border-primary-foreground/10 pr-2 mr-2">
        <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)" className={btnCls}>
          <Bold className={iconCls} />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType="italic" tooltip="Italic (⌘+I)" className={btnCls}>
          <Italic className={iconCls} />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType="underline" tooltip="Underline (⌘+U)" className={btnCls}>
          <Underline className={iconCls} />
        </MarkToolbarButton>
      </div>

      <AlignToolbarButton />
      <FontSizeToolbarButton />


      <div className="ml-1 border-l border-primary-foreground/10 pl-2">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("open-ai-chat"))}
          className="p-1.5 h-9 w-9 inline-flex items-center justify-center rounded-md text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
          title="AI Chat"
        >
          <Bot className="w-5 h-5" />
        </button>
      </div>

      {/* Export */}
      <div className="ml-1 border-l border-primary-foreground/10 pl-2">
        <ExportDropdown
          editor={editor}
          variant="ghost"
          showText={false}
          className="p-1.5 h-9 w-9 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
        />
      </div>
    </div>
  );
}
