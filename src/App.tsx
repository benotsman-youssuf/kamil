import { usePlateEditor } from "platejs/react";
import { editorPlugins, initialValue } from "./constants/editor";
import { EditorLayout } from "./components/editor/EditorLayout";

export default function App() {
  
  // Initialize editor
  const editor = usePlateEditor({
    plugins: editorPlugins,
    value: initialValue,
  });

  // Toggle command palette with Cmd+K/Ctrl+K


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <EditorLayout editor={editor} />
    </div>
  );
}
