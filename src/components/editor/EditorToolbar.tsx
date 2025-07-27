import { MarkToolbarButton } from "@/components/ui/mark-toolbar-button";
import { AlignToolbarButton } from "@/components/ui/align-toolbar-button";
import { Bold, Italic, Underline } from "lucide-react";

interface EditorToolbarProps {
  className?: string;
}

export function EditorToolbar({ className = "" }: EditorToolbarProps) {
  return (
    <div className={`${className}`}>
      <MarkToolbarButton
        nodeType="bold"
        tooltip="Bold (⌘+B)"
        className="px-1.5 py-1 hover:bg-[#2e2e30] rounded-md transition-colors"
      >
        <Bold className="w-4 h-4 text-white" />
      </MarkToolbarButton>
      <MarkToolbarButton
        nodeType="italic"
        tooltip="Italic (⌘+I)"
        className="px-1.5 py-1 hover:bg-[#2e2e30] rounded-md transition-colors"
      >
        <Italic className="w-4 h-4 text-white" />
      </MarkToolbarButton>
      <MarkToolbarButton
        nodeType="underline"
        tooltip="Underline (⌘+U)"
        className="px-1.5 py-1 hover:bg-[#2e2e30] rounded-md transition-colors"
      >
        <Underline className="w-4 h-4 text-white" />
      </MarkToolbarButton>
      <div className="px-1.5 py-1">
        <AlignToolbarButton />
      </div>
    </div>
  );
}
