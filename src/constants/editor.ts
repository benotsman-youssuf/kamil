import { BoldPlugin, ItalicPlugin, UnderlinePlugin } from "@platejs/basic-nodes/react";
import { AlignKit } from '@/components/editor/plugins/align-kit';
import { SlashKit } from "@/components/editor/plugins/slash-kit";
import { FontKit } from '@/components/editor/plugins/font-kit'; 

export const initialValue = [
  {
    type: "p",
    children: [
      { text: "! " },
      { text: "bold", bold: true },
      { text: " , " },
      { text: "italic", italic: true },
      { text: " , " },
      { text: "underline", underline: true },
      { text: " ." },
    ],
  },
];

export const editorPlugins = [
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  ...AlignKit,
  ...SlashKit,
  ...FontKit
];
