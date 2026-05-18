import React from 'react';

import { Editor } from "@/components/ui/editor";
import { EditorContainer } from "@/components/ui/editor";
import { useIsAndroid } from "@/hooks/use-is-android";
import { cn } from "@/lib/utils";

interface EditorContentProps {
  placeholder?: string;
  className?: string;
}

function EditorContentInner({
  placeholder = "اكتب  /  ﻹدراج آية",
  className = "",
}: EditorContentProps) {
  const isAndroid = useIsAndroid();

  const renderLeaf = React.useCallback(
    (props: {
      attributes: Record<string, unknown>;
      children: React.ReactNode;
      leaf: { text: string };
    }) => {
      const { attributes, children } = props;
      if (isAndroid) {
        return (
          <span {...attributes} key={props.leaf.text}>
            {children}
          </span>
        );
      }
      return <span {...attributes}>{children}</span>;
    },
    [isAndroid]
  );

  return (
    <div className={cn("flex-1 min-h-0 overflow-hidden", className)}>
      <EditorContainer className="h-full overflow-y-auto bg-background">
        <Editor
          placeholder={placeholder}
          renderLeaf={renderLeaf}
          className="min-h-full pb-[40vh] focus:outline-none text-foreground"
          style={{
            lineHeight: "1.9",
            fontSize: "1.25rem",
            direction: "rtl",
            textAlign: "right",
            unicodeBidi: "plaintext",
          }}
        />
      </EditorContainer>
    </div>
  );
}

export const EditorContent = React.memo(EditorContentInner);
