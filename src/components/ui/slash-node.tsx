"use client";

import * as React from "react";
import type { PlateEditor, PlateElementProps } from "platejs/react";
import { type TComboboxInputElement } from "platejs";
import { PlateElement } from "platejs/react";
import { useFuzzySearchList, Highlight } from '@nozbe/microfuzz/react'

import {
  InlineCombobox,
  InlineComboboxContent,
  InlineComboboxEmpty,
  InlineComboboxInput,
  InlineComboboxItem,
} from "./inline-combobox";
// Fuse.js import removed as we're using @nozbe/microfuzz
import { KEYS } from "platejs";

type Group = {
  id: number;
  surah: string;
  aya: number;
  textNoTashkeel: string;
  textMinTashkeel: string;
  textTashkeel: string;
  onSelect: (editor: PlateEditor, value: string, color?: string) => void;
};

const loadQuran = async () => {
  try {
    const response = await fetch(import.meta.env.VITE_DATA_URL);
    if (!response.ok) {
      console.error("Failed to load quran data");
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to load quran data", error);
    return [];
  }
};

const quran = await loadQuran();

interface Aya {
  surah: string;
  aya: number;
  textNoTashkeel: string;
  textMinTashkeel: string;
  textTashkeel: string;
}

const groups: Group[] = quran.map((item: Aya) => ({
  ...item,
  onSelect: (editor: PlateEditor, value: string, color = "#16a34a") => {
    const fontSize = editor.api.marks()?.[KEYS.fontSize];
    editor.tf.addMarks({ color });
    editor.tf.addMarks({ fontSize });
    editor.tf.insertText(` ﴿${value}﴾ [${item.surah} ${item.aya}] `);
    editor.tf.removeMark("color");

  },
}));

// const fuse = new Fuse(groups, {
//   keys: ["textNoTashkeel"],
// });



export function SlashInputElement(
  props: PlateElementProps<TComboboxInputElement>
) {
  const { editor, element } = props;
  const [value, setValue] = React.useState("");
  const fontSize = editor.api.marks()?.[KEYS.fontSize];
  const filteredResults = useFuzzySearchList({
    list: groups,
    queryText: value,
    getText: (item: Group) => [item.textNoTashkeel],
    mapResultItem: ({ item, matches: [highlightRanges] }) => ({
      item,
      highlightRanges,
    }),
  }).slice(0, 10); // Limit to 10 results
  return (
    <PlateElement {...props} as="span">
      <InlineCombobox
        element={element}
        trigger="/"
        setValue={setValue}
        value={value}
      >
        <span
          style={
            {
              fontSize:
                fontSize !== undefined
                  ? typeof fontSize === "number"
                    ? `${fontSize}px`
                    : String(fontSize)
                  : "inherit",
            } as React.CSSProperties
          }
        >
          ﴿<InlineComboboxInput className="bg-green-50" />﴾
        </span>

        <InlineComboboxContent className=" font-[amiri] divide-y divide-gray-100/50 p-0 shadow-lg rounded-xl border border-gray-200/60 bg-white">
          {filteredResults.length === 0 ? (
            <InlineComboboxEmpty>
              <span className="block px-3 py-6 text-center text-gray-500 text-base">
                لا يوجد نتائج
              </span>
            </InlineComboboxEmpty>
          ) : (
            filteredResults.map(({ item, highlightRanges }) => (
              <InlineComboboxItem
                key={item.id}
                value={item.textNoTashkeel}
                focusEditor={false}
                onClick={() =>
                  item.onSelect(editor, item.textTashkeel, "#16a34a")
                }
                className="py-3 px-4 hover:bg-gray-50/80 transition-colors duration-200 cursor-pointer"
                style={{
                  direction: "rtl",
                  fontSize: "1.2rem",
                }}
              >
                <span
                  className="text-xs text-green-600 block mb-2"
                  dir="ltr"
                  style={{ fontSize: "1.2rem" }}
                >
                  {item.surah} {item.aya}
                </span>
                <span
                  className="font-medium text-gray-900 leading-relaxed"
                  dir="rtl"
                  style={{ fontSize: "1.2rem" }}
                >
                  <Highlight text={item.textTashkeel} ranges={highlightRanges} />
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
