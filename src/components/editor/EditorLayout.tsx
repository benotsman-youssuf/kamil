import { Plate } from "@platejs/core/react";
import { FixedToolbar } from "@/components/ui/fixed-toolbar";
import { EditorToolbar } from "./EditorToolbar";
import { EditorContent } from "./EditorContent";
// import { Button } from "../ui/button";
// import { db } from "@/lib/db";
interface EditorLayoutProps {
  editor: any; // Consider creating a proper type for your editor
  className?: string;
}

export function EditorLayout({ editor, className = "" }: EditorLayoutProps) {
  // const savePage = async () => {
  //   try {
  //     await db.pages.update(1, {
  //       content: editor.children,
  //       updatedAt: new Date().toISOString()
  //     });
  //     console.log('Page saved successfully');
  //   } catch (error) {
  //     console.error('Error saving page:', error);
  //   }
  // };
  return (
    <div className={`${className}`}>
      <Plate editor={editor}>
        <FixedToolbar className="w-fit mx-auto rounded-xl bg-[#1e1e1f] border border-[#38383a] shadow-[0_4px_14px_rgba(0,0,0,0.25)] backdrop-blur-lg py-1 px-2">
          <EditorToolbar className="gap-1" />
          {/* <Button onClick={savePage}>save</Button> */}
        </FixedToolbar>
        <EditorContent/>
      </Plate>
    </div>
  );
}
