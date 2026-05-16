import { createPlatePlugin } from "@platejs/core/react";
import { VerseElement } from "@/components/ui/verse-node";

export const VersePlugin = createPlatePlugin({
  key: "verse",
  node: {
    isElement: true,
    isInline: true,
    isVoid: false,
    component: VerseElement,
  },
});
