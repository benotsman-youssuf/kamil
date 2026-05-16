import { createSlateEditor, serializeHtml } from "platejs";
import { BaseEditorKit } from "@/components/editor/editor-base-kit";
import { EditorStatic } from "@/components/ui/editor-static";

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getPageName(name?: string) {
  return name || "document";
}

function createStaticEditor(content: any[]) {
  return createSlateEditor({
    plugins: BaseEditorKit,
    value: content,
  });
}

export function exportToJSON(content: any[], pageName: string) {
  const jsonContent = JSON.stringify(content, null, 2);
  const filename = `${getPageName(pageName)}_${Date.now()}.json`;
  downloadFile(jsonContent, filename, "application/json");
}

export async function exportToHTMLAsync(content: any[], pageName: string) {
  const editorStatic = createStaticEditor(content);
  const editorHtml = await serializeHtml(editorStatic, {
    editorComponent: EditorStatic,
    props: {
      style: {
        padding: "40px calc(50% - 350px)",
        paddingBottom: "60px",
        fontFamily: '"Amiri", serif',
        lineHeight: "1.8",
      },
    },
  });

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl" data-theme="light">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${getPageName(pageName)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/light.min.css" />
<style>
  body {
    font-family: 'Amiri', serif;
    line-height: 1.8;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    direction: rtl;
    font-size: 18px;
  }
  .verse-node {
    background-color: #f0fdf4;
    border-bottom: 2px solid #16a34a33;
    font-weight: bold;
    color: #064e3b;
    padding: 0 4px;
    border-radius: 4px;
  }
  .hadith-node {
    background-color: #fffbeb;
    border-bottom: 2px solid #d9770633;
    font-weight: 500;
    color: #451a03;
    padding: 0 4px;
    border-radius: 4px;
  }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .verse-node, .hadith-node { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>
</head>
<body>
<h1>${getPageName(pageName)}</h1>
${editorHtml}
</body>
</html>`;

  const filename = `${getPageName(pageName)}_${Date.now()}.html`;
  downloadFile(html, filename, "text/html");
}

export async function exportToMarkdownAsync(content: any[], pageName: string) {
  const editorStatic = createStaticEditor(content);
  const md = editorStatic.api.markdown.serialize({ value: content });

  const markdownContent = `# ${getPageName(pageName)}\n\n${md}`;
  const filename = `${getPageName(pageName)}_${Date.now()}.md`;
  downloadFile(markdownContent, filename, "text/markdown");
}

export function exportToPDF(content: any[], pageName: string) {
  const name = getPageName(pageName);
  const editorStatic = createStaticEditor(content);

  serializeHtml(editorStatic, {
    editorComponent: EditorStatic,
    props: {
      style: {
        padding: "40px calc(50% - 350px)",
        paddingBottom: "60px",
        fontFamily: '"Amiri", serif',
        lineHeight: "1.8",
      },
    },
  }).then((editorHtml) => {
    const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet" />
<style>
  body {
    font-family: 'Amiri', serif;
    margin: 0;
    padding: 40px;
    direction: rtl;
    background: white;
    color: black;
    font-size: 18px;
    line-height: 1.8;
  }
  @page { size: A4; margin: 10mm; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  h1, h2, h3 { color: #2b2b2b; margin-top: 1.5em; margin-bottom: 0.5em; }
  h1 { font-size: 32px; } h2 { font-size: 28px; } h3 { font-size: 24px; }
  p { margin: 1em 0; }
  code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
  pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; font-family: monospace; }
  blockquote { border-right: 4px solid #ddd; padding-right: 15px; margin: 1em 0; color: #666; }
  ul, ol { margin: 1em 0; padding-right: 40px; }
  li { margin: 0.5em 0; }
  .verse-node {
    background-color: #f0fdf4 !important;
    border-bottom: 2px solid rgba(22, 163, 74, 0.2) !important;
    font-weight: bold;
    color: #064e3b !important;
    padding: 0 4px;
    border-radius: 4px;
  }
  .hadith-node {
    background-color: #fffbeb !important;
    border-bottom: 2px solid rgba(217, 119, 6, 0.2) !important;
    font-weight: 500;
    color: #451a03 !important;
    padding: 0 4px;
    border-radius: 4px;
  }
</style>
</head>
<body>
  <h1>${name}</h1>
  ${editorHtml}
</body>
</html>`;

    const printWindow = window.open("", "_blank", "width=900,height=1000");
    if (!printWindow) { alert("غير قادر على فتح نافذة الطباعة"); return; }
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.document.fonts.ready.then(() => {
        printWindow.focus();
        printWindow.print();
        setTimeout(() => printWindow.close(), 500);
      });
    };
  });
}
