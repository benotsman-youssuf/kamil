import { Editor } from "@/components/ui/editor";
import { EditorContainer } from "@/components/ui/editor";
import { cn } from "@/lib/utils";



interface EditorContentProps {
  placeholder?: string;
  className?: string;

}

export function EditorContent({
  placeholder = "",
  className = "",
}: EditorContentProps) {
  return (
    <div className={cn("prose max-w-none focus:outline-none bg", className)}>
      <EditorContainer>
        <Editor 
          placeholder={placeholder}
          className="min-h-[400px] p-6 focus:outline-none text-gray-800 bg"
          style={{
            lineHeight: '1.6',
            fontSize: '1rem',
          }}
        />
      </EditorContainer>
    </div>
  );
}
