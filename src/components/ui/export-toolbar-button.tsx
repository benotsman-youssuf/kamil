"use client";

import { Download } from "lucide-react";

import { createSlateEditor, serializeHtml } from "platejs";
import { useEditorRef } from "platejs/react";

import { BaseEditorKit } from "@/components/editor/editor-base-kit";

import { EditorStatic } from "./editor-static";

export function ExportToolbarButton() {
  const editor = useEditorRef();

  const exportToPdf = async () => {
    const editorStatic = createSlateEditor({
      plugins: BaseEditorKit,
      value: editor.children,
    });

    const editorHtml = await serializeHtml(editorStatic, {
      editorComponent: EditorStatic,
      props: { style: { padding: "0 calc(50% - 350px)", paddingBottom: "" } },
    });

    const html = `<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />

  </head>
  <body dir="rtl" style="font-family: 'Amiri', serif;">
    ${editorHtml}
  </body>
</html>`;

    // Open a new window with the generated HTML and invoke print dialog
    const printWindow = window.open();
    if (!printWindow) throw new Error("Unable to open print window.");
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    // Wait for the content to load before printing
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  return (
    <Download
      className="p-1.5 rounded-md text-white hover:bg-[#3a3a3d] active:bg-[#454548] transition-all duration-150 ease-out group cursor-pointer"
      onClick={exportToPdf}
    />
  );
}
