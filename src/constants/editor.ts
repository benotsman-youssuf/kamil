import { BoldPlugin, ItalicPlugin, UnderlinePlugin } from "@platejs/basic-nodes/react";
import { AlignKit } from '@/components/editor/plugins/align-kit';
import { SlashKit } from "@/components/editor/plugins/slash-kit";
import { FontKit } from '@/components/editor/plugins/font-kit';

export const initialValue = [
  
];

export const editorPlugins = [
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  ...AlignKit,
  ...SlashKit,
  ...FontKit
];
