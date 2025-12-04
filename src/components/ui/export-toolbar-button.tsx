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
      props: {
        style: {
          padding: "40px calc(50% - 350px)",
          paddingBottom: "60px",
          fontFamily: `"Amiri", serif`,
          lineHeight: "1.8",
        },
      },
    });

    const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl" class="dark">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<!-- Ensure Amiri font loads in print -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet" />

<style>
  body {
    font-family: 'Amiri', serif;
    margin: 0;
    padding: 0;
    direction: rtl;
    background: white;
    color: black;
    font-size: 18px;
  }

  @page {
    size: A4;
    margin: 10mm;
  }

  /* Force dark-mode friendly printing */
  @media print {
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
</style>

</head>
<body>
${editorHtml}
</body>
</html>`;

    // Create print window
    const printWindow = window.open("", "_blank", "width=900,height=1000");

    if (!printWindow) {
      alert("Unable to open print window.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for fonts to load — critical for Amiri
    printWindow.onload = () => {
      printWindow.document.fonts.ready.then(() => {
        printWindow.focus();
        printWindow.print();

        // auto-close after printing
        setTimeout(() => {
          printWindow.close();
        }, 500);
      });
    };
  };

  return (
    <Download
      className="p-1.5 rounded-md text-white hover:bg-[#3a3a3d] active:bg-[#454548] transition-all duration-150 ease-out group cursor-pointer"
      onClick={exportToPdf}
    />
  );
}
