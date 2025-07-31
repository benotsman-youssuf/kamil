import { usePlateEditor } from "platejs/react";
import { editorPlugins, initialValue } from "../constants/editor";
import { EditorLayout } from "../components/editor/EditorLayout";

const Editor = () => {
  // Initialize editor
  const editor = usePlateEditor({
    plugins: editorPlugins,
    value: initialValue,
  });

  return (
      <EditorLayout editor={editor} />
  );
};

export default Editor;
