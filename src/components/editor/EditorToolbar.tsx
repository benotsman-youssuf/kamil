import { MarkToolbarButton } from "@/components/ui/mark-toolbar-button";
import { AlignToolbarButton } from "@/components/ui/align-toolbar-button";
import { Bold, Italic, Underline } from "lucide-react";
import { FontSizeToolbarButton } from '@/components/ui/font-size-toolbar-button';
import { ExportDropdown } from "./ExportDropdown";


interface EditorToolbarProps {
  className?: string;
  editor: any;
}

export function EditorToolbar({ className = "", editor }: EditorToolbarProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center border-r border-gray-700 pr-2 mr-2">
        <MarkToolbarButton
          nodeType="bold"
          tooltip="Bold (⌘+B)"
          className="p-1.5 rounded-md hover:bg-[#3a3a3d] active:bg-[#454548] transition-all duration-150 ease-out group"
        >
          <Bold className="w-5 h-5 text-gray-300 group-hover:text-white" />
        </MarkToolbarButton>
        <MarkToolbarButton
          nodeType="italic"
          tooltip="Italic (⌘+I)"
          className="p-1.5 rounded-md hover:bg-[#3a3a3d] active:bg-[#454548] transition-all duration-150 ease-out group ml-1"
        >
          <Italic className="w-5 h-5 text-gray-300 group-hover:text-white" />
        </MarkToolbarButton>
        <MarkToolbarButton
          nodeType="underline"
          tooltip="Underline (⌘+U)"
          className="p-1.5 rounded-md hover:bg-[#3a3a3d] active:bg-[#454548] transition-all duration-150 ease-out group ml-1"
        >
          <Underline className="w-5 h-5 text-gray-300 group-hover:text-white" />
        </MarkToolbarButton>


      </div>

      <AlignToolbarButton />
      <FontSizeToolbarButton />
      <ExportDropdown
        editor={editor}
        variant="ghost"
        showText={false}
        className="md:hidden ml-1 p-1.5 h-8 w-8 text-gray-300 hover:text-white hover:bg-[#3a3a3d]"
      />
    </div>
  );
}
