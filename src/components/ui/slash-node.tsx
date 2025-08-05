"use client";

import * as React from "react";

import type { PlateEditor, PlateElementProps } from "platejs/react";

import { type TComboboxInputElement } from "platejs";
import { PlateElement } from "platejs/react";

import {
  InlineCombobox,
  InlineComboboxContent,
  InlineComboboxEmpty,
  InlineComboboxInput,
  InlineComboboxItem,
} from "./inline-combobox";
import Fuse from "fuse.js";
import { quran } from "@/constants/quran";

type Group = {
  id: number;
  surah: string;
  aya: number;
  textNoTashkeel: string;
  textMinTashkeel: string;
  textTashkeel: string;
  onSelect: (editor: PlateEditor, value: string, color?: string) => void;
};

const groups: Group[] = quran.map((item) => ({
  ...item,
  onSelect: (editor: PlateEditor, value: string, color = "#16a34a") => {
    editor.tf.addMarks({ color });
    editor.tf.addMarks({ fontSize: "" });

    editor.tf.insertText(` ﴿${value}﴾ ${item.surah} ${item.aya} `);

    editor.tf.removeMark("color");
    editor.tf.removeMark("fontSize");
  },
}));

const fuse = new Fuse(groups, {
  keys: ["textNoTashkeel", "textMinTashkeel", "textTashkeel", "surah"],
  threshold: 0.3,
  distance: 100,
  minMatchCharLength: 2,
  shouldSort: true,
  ignoreLocation: true,
  isCaseSensitive: false,
  useExtendedSearch: true,
});


export function SlashInputElement(
  props: PlateElementProps<TComboboxInputElement>
) {
  const { editor, element } = props;
  const [value, setValue] = React.useState("");
  const results = fuse.search(value).slice(0, 10);
  return (
    <PlateElement {...props} as="span">
      <InlineCombobox
        element={element}
        trigger="/"
        setValue={setValue}
        value={value}
      >
        <span className="inline-block rounded-md px-1.5 py-0.5 align-baseline text-sm ring-ring focus-within:ring-2">
          ﴾<InlineComboboxInput />﴿
        </span>
        <InlineComboboxContent className="my-1.5 divide-y divide-border p-0 shadow-lg">
          {results.length === 0 ? (
            <InlineComboboxEmpty>
              <span className="block px-3 py-2 text-center text-muted-foreground text-sm">
                No results found
              </span>
            </InlineComboboxEmpty>
          ) : (
            results.map((item) => (
              <InlineComboboxItem
                key={item.item.id}
                value={item.item.textNoTashkeel}
                onClick={() =>
                  item.item.onSelect(editor, item.item.textTashkeel, "#16a34a")
                }
                className="py-1 px-2"
              >
                <span className="text-xs text-muted-foreground dir-ltr">
                  {item.item.surah} {item.item.aya}
                </span>
                <span className="font-medium text-foreground" dir="rtl">
                  {item.item.textTashkeel}
                </span>
              </InlineComboboxItem>
            ))
          )}
        </InlineComboboxContent>
      </InlineCombobox>
      {props.children}
    </PlateElement>
  );
}
