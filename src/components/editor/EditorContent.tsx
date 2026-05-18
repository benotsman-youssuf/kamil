import { Editor } from "@/components/ui/editor";
import { EditorContainer } from "@/components/ui/editor";
import { cn } from "@/lib/utils";

interface EditorContentProps {
  placeholder?: string;
  className?: string;
}

export function EditorContent({
  placeholder = "اكتب  /  ﻹدراج آية",
  className = "",
}: EditorContentProps) {
  return (
    <div className={cn("flex-1 min-h-0 overflow-hidden", className)}>
      <EditorContainer className="h-full overflow-y-auto bg-background">
        <Editor
          placeholder={placeholder}
          dir="rtl"
          className="min-h-full pb-[40vh] focus:outline-none text-foreground"
          style={{
            lineHeight: "1.9",
            fontSize: "1.25rem",
            textAlign: "start",
          }}
        />
      </EditorContainer>
    </div>
  );
}
