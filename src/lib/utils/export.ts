

/**
 * Download a file with the given content and filename
 */
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

/**
 * Export editor content as JSON
 */
export function exportToJSON(content: any[], pageName: string) {
    const jsonContent = JSON.stringify(content, null, 2);
    const filename = `${pageName}_${new Date().getTime()}.json`;
    downloadFile(jsonContent, filename, "application/json");
}



/**
 * Convert editor content to HTML
 */
function editorToHTML(nodes: any[]): string {
    return nodes
        .map((node) => {
            if (node.text !== undefined) {
                let text = node.text;
                if (node.bold) text = `<strong>${text}</strong>`;
                if (node.italic) text = `<em>${text}</em>`;
                if (node.underline) text = `<u>${text}</u>`;
                if (node.code) text = `<code>${text}</code>`;
                return text;
            }

            if (node.children) {
                const content = editorToHTML(node.children);

                switch (node.type) {
                    case "h1":
                        return `<h1>${content}</h1>`;
                    case "h2":
                        return `<h2>${content}</h2>`;
                    case "h3":
                        return `<h3>${content}</h3>`;
                    case "p":
                        return `<p>${content}</p>`;
                    case "blockquote":
                        return `<blockquote>${content}</blockquote>`;
                    case "ul":
                        return `<ul>${content}</ul>`;
                    case "ol":
                        return `<ol>${content}</ol>`;
                    case "li":
                        return `<li>${content}</li>`;
                    case "code_block":
                        return `<pre><code>${content}</code></pre>`;
                    default:
                        return `<div>${content}</div>`;
                }
            }
            return "";
        })
        .join("\n");
}

/**
 * Export editor content as HTML
 */
export function exportToHTML(content: any[], pageName: string) {
    const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageName}</title>
  <style>
    body {
      font-family: 'Amiri', serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      direction: rtl;
    }
    h1, h2, h3 { color: #2b2b2b; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
    pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
    blockquote { border-right: 4px solid #ddd; padding-right: 15px; color: #666; }
  </style>
</head>
<body>
  <h1>${pageName}</h1>
  ${editorToHTML(content as any[])}
</body>
</html>`;

    const filename = `${pageName}_${new Date().getTime()}.html`;
    downloadFile(htmlContent, filename, "text/html");
}

/**
 * Convert editor content to Markdown
 */
function editorToMarkdown(nodes: any[]): string {
    return nodes
        .map((node) => {
            if (node.text !== undefined) {
                let text = node.text;
                if (node.bold) text = `**${text}**`;
                if (node.italic) text = `*${text}*`;
                if (node.code) text = `\`${text}\``;
                return text;
            }

            if (node.children) {
                const content = editorToMarkdown(node.children);

                switch (node.type) {
                    case "h1":
                        return `# ${content}\n`;
                    case "h2":
                        return `## ${content}\n`;
                    case "h3":
                        return `### ${content}\n`;
                    case "p":
                        return `${content}\n`;
                    case "blockquote":
                        return `> ${content}\n`;
                    case "li":
                        return `- ${content}\n`;
                    case "code_block":
                        return `\`\`\`\n${content}\n\`\`\`\n`;
                    default:
                        return `${content}\n`;
                }
            }
            return "";
        })
        .join("");
}

/**
 * Export editor content as Markdown
 */
export function exportToMarkdown(content: any[], pageName: string) {
    const markdownContent = `# ${pageName}\n\n${editorToMarkdown(content as any[])}`;
    const filename = `${pageName}_${new Date().getTime()}.md`;
    downloadFile(markdownContent, filename, "text/markdown");
}

/**
 * Export editor content as PDF using browser print dialog
 */
export function exportToPDF(content: any[], pageName: string) {
    const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
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
    padding: 40px;
    direction: rtl;
    background: white;
    color: black;
    font-size: 18px;
    line-height: 1.8;
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

  h1, h2, h3 { 
    color: #2b2b2b; 
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }
  
  h1 { font-size: 32px; }
  h2 { font-size: 28px; }
  h3 { font-size: 24px; }
  
  p { margin: 1em 0; }
  
  code { 
    background: #f4f4f4; 
    padding: 2px 6px; 
    border-radius: 3px; 
    font-family: monospace;
  }
  
  pre { 
    background: #f4f4f4; 
    padding: 15px; 
    border-radius: 5px; 
    overflow-x: auto;
    font-family: monospace;
  }
  
  blockquote { 
    border-right: 4px solid #ddd; 
    padding-right: 15px; 
    margin: 1em 0;
    color: #666; 
  }

  ul, ol {
    margin: 1em 0;
    padding-right: 40px;
  }

  li {
    margin: 0.5em 0;
  }
</style>

</head>
<body>
  <h1>${pageName}</h1>
  ${editorToHTML(content)}
</body>
</html>`;

    // Create print window
    const printWindow = window.open("", "_blank", "width=900,height=1000");

    if (!printWindow) {
        alert("غير قادر على فتح نافذة الطباعة");
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
}
