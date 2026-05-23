import { AlignKit } from '@/components/editor/plugins/align-kit';
import { BasicBlocksKit } from '@/components/editor/plugins/basic-blocks-kit';
import { BasicMarksKit } from '@/components/editor/plugins/basic-marks-kit';
import { ListKit } from '@/components/editor/plugins/list-classic-kit';
import { SlashKit } from "@/components/editor/plugins/slash-kit";
import { FontKit } from '@/components/editor/plugins/font-kit';
import { MarkdownKit } from '@/components/editor/plugins/markdown-kit';
import { VersePlugin } from '@/components/editor/plugins/verse-kit';
import { HadithPlugin } from '@/components/editor/plugins/hadith-kit';

export const editorPlugins = [
  ...BasicBlocksKit,
  ...BasicMarksKit,
  ...AlignKit,
  ...ListKit,
  ...SlashKit,
  ...FontKit,
  ...MarkdownKit,
  VersePlugin,
  HadithPlugin,
];
