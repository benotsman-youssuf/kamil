import { useState } from 'react';
import { usePlateEditor } from "platejs/react";
import { editorPlugins, initialValue } from "./constants/editor";
import { EditorLayout } from "./components/editor/EditorLayout";
import { CommandPalette } from "./components/command-palette/CommandPalette";
import { useKeyboardShortcut } from "./hooks/useKeyboardShortcut";

export default function App() {
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  
  // Initialize editor
  const editor = usePlateEditor({
    plugins: editorPlugins,
    value: initialValue,
  });

  // Toggle command palette with Cmd+K/Ctrl+K
  useKeyboardShortcut('k', () => {
    setCommandPaletteOpen(prev => !prev);
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <EditorLayout editor={editor} />
      <CommandPalette 
        open={isCommandPaletteOpen} 
        onOpenChange={setCommandPaletteOpen} 
      />
    </div>
  );
}
