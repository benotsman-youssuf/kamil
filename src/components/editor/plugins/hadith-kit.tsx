import { createPlatePlugin } from "@platejs/core/react";
import { HadithElement } from "@/components/ui/hadith-node";

export const HadithPlugin = createPlatePlugin({
  key: "hadith",
  node: {
    isElement: true,
    isInline: true,
    isVoid: false,
    component: HadithElement,
  },
});
