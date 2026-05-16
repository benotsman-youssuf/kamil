import { MarkdownPlugin, remarkMdx, remarkMention } from '@platejs/markdown';
import { KEYS } from 'platejs';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

export const MarkdownKit = [
  MarkdownPlugin.configure({
    options: {
      disallowedNodes: [KEYS.suggestion],
      remarkPlugins: [remarkMath, remarkGfm, remarkMdx, remarkMention],
      rules: {
        verse: {
          deserialize(mdastNode: any) {
            const attrs = mdastNode.attributes || [];
            const getAttr = (name: string) => {
              const attr = attrs.find((a: any) => a.name === name);
              return attr ? String(attr.value ?? "") : "";
            };
            return {
              type: "verse",
              verseKey: getAttr("verseKey"),
              surahName: getAttr("surahName"),
              ayaNumber: parseInt(getAttr("ayaNumber") || "0"),
              verseText: getAttr("verseText"),
              children: [{ text: getAttr("verseText") }],
            };
          },
          serialize(slateNode: any) {
            return {
              type: "mdxJsxTextElement",
              name: "verse",
              attributes: [
                { type: "mdxJsxAttribute", name: "verseKey", value: slateNode.verseKey || "" },
                { type: "mdxJsxAttribute", name: "surahName", value: slateNode.surahName || "" },
                { type: "mdxJsxAttribute", name: "ayaNumber", value: String(slateNode.ayaNumber || "") },
                { type: "mdxJsxAttribute", name: "verseText", value: slateNode.verseText || "" },
              ],
              children: [{ type: "text", value: slateNode.verseText || "" }],
            };
          },
        },
        hadith: {
          deserialize(mdastNode: any) {
            const attrs = mdastNode.attributes || [];
            const getAttr = (name: string) => {
              const attr = attrs.find((a: any) => a.name === name);
              return attr ? String(attr.value ?? "") : "";
            };
            return {
              type: "hadith",
              collection: getAttr("collection"),
              hadithNumber: getAttr("hadithNumber"),
              hadithText: getAttr("hadithText"),
              children: [{ text: getAttr("hadithText") }],
            };
          },
          serialize(slateNode: any) {
            return {
              type: "mdxJsxTextElement",
              name: "hadith",
              attributes: [
                { type: "mdxJsxAttribute", name: "collection", value: slateNode.collection || "" },
                { type: "mdxJsxAttribute", name: "hadithNumber", value: String(slateNode.hadithNumber || "") },
                { type: "mdxJsxAttribute", name: "hadithText", value: slateNode.hadithText || "" },
              ],
              children: [{ type: "text", value: slateNode.hadithText || "" }],
            };
          },
        },
      },
    },
  }),
];
