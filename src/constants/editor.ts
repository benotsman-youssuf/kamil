import type { Value } from "platejs";
import { BoldPlugin, ItalicPlugin, UnderlinePlugin } from "@platejs/basic-nodes/react";
import { AlignKit } from '@/components/editor/plugins/align-kit';
import { SlashKit } from "@/components/editor/plugins/slash-kit";

export const initialValue: Value = [
  {
    type: "p",
    children: [
      { text: "Hello! Try out the " },
      { text: "bold", bold: true },
      { text: ", " },
      { text: "italic", italic: true },
      { text: ", and " },
      { text: "underline", underline: true },
      { text: " formatting." },
    ],
  },
];

export const editorPlugins = [
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  ...AlignKit,
  ...SlashKit,
];
