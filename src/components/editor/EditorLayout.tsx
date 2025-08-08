import { Plate } from "@platejs/core/react";
import { FixedToolbar } from "@/components/ui/fixed-toolbar";
import { EditorToolbar } from "./EditorToolbar";
import { EditorContent } from "./EditorContent";
import { usePlateEditor } from "@platejs/core/react";
import { editorPlugins } from "../../constants/editor";
import { Button } from "../ui/button";
import { db } from "@/lib/db";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

interface EditorLayoutProps {
  className?: string;
}

export function EditorLayout({ className = "" }: EditorLayoutProps) {
  const { id } = useParams();

  const editor = usePlateEditor({
    plugins: editorPlugins,
    value: [],
  });

  const savePage = async () => {
    try {
      await db.pages.update(Number(id), {
        content: JSON.stringify(editor.children),
        updatedAt: new Date().toISOString()
      });
      console.log('Page saved successfully');
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  useEffect(()=>{
    const fetchPage = async () => {
      try {
        const page = await db.pages.get(Number(id));
        const data = page?.content;
        if(data){
          editor.tf.setValue(JSON.parse(data));
        }else{
          editor.tf.setValue([]);
        }
      } catch (error) {
        console.error('Error fetching page:', error);
      }
    };
    fetchPage();
  }, [id, editor]);

  return (
    <div className={`${className}`}>
      <Plate editor={editor}>
        <FixedToolbar className="w-fit mx-auto rounded-xl bg-[#1e1e1f] border border-[#38383a] shadow-[0_4px_14px_rgba(0,0,0,0.25)] backdrop-blur-lg py-1 px-2">
          <EditorToolbar className="gap-1" />
          <Button onClick={savePage}>Save</Button>
        </FixedToolbar>
        <EditorContent />
      </Plate>
    </div>
  );
}