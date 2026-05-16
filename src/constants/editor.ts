import { BoldPlugin, ItalicPlugin, UnderlinePlugin } from "@platejs/basic-nodes/react";
import { AlignKit } from '@/components/editor/plugins/align-kit';
import { SlashKit } from "@/components/editor/plugins/slash-kit";
import { FontKit } from '@/components/editor/plugins/font-kit';
import { MarkdownKit } from '@/components/editor/plugins/markdown-kit';
import { VersePlugin } from '@/components/editor/plugins/verse-kit';
import { HadithPlugin } from '@/components/editor/plugins/hadith-kit';

export const editorPlugins = [
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  ...AlignKit,
  ...SlashKit,
  ...FontKit,
  ...MarkdownKit,
  VersePlugin,
  HadithPlugin,
];
