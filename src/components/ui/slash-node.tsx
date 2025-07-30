"use client";

import type { PlateEditor, PlateElementProps } from "platejs/react";
import { Square } from "lucide-react";
import { type TComboboxInputElement } from "platejs";
import { PlateElement } from "platejs/react";

import {
  InlineCombobox,
  InlineComboboxContent,
  InlineComboboxEmpty,
  InlineComboboxGroup,
  InlineComboboxGroupLabel,
  InlineComboboxInput,
  InlineComboboxItem,
} from "./inline-combobox";

type Group = {
  group: string;
  items: {
    icon: React.ReactNode;
    value: string;
    onSelect: (editor: PlateEditor, value: string) => void;
    className?: string;
    focusEditor?: boolean;
    keywords?: string[];
    label?: string;
  }[];
};

const groups: Group[] = [
  {
    group: "الفاتحة",
    items: [
        {
          icon: <Square />,
          keywords: ["ayah", "quran", "verse", "[]"],
          label: "﻿بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
          value: "﻿بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
        },
        {
          icon: <Square />,
          keywords: ["ayah", "quran", "verse", "[]"],
          label: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
          value: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
      },
      {
        icon: <Square />,
        keywords: ["ayah", "quran", "verse", "[]"],
        label: "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
        value: "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
      },
      {
        icon: <Square />,
        keywords: ["ayah", "quran", "verse", "[]"],
        label: "ملك يَوْمِ ٱلدِّينِ",
        value: "مَٰلِكِ يَوْمِ ٱلدِّينِ",
      },
      {
        icon: <Square />,
        keywords: ["ayah", "quran", "verse", "[]"],
        label: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        value: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      },
      {
        icon: <Square />,
        keywords: ["ayah", "quran", "verse", "[]"],
        label: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
        value: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
      },
      {
        icon: <Square />,
        keywords: ["ayah", "quran", "verse", "[]"],
        label:
          "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
        value:
          "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value, color = "#16a34a") => {
        editor.tf.addMarks({ color });
        editor.tf.addMarks({ fontSize: "" });

        editor.tf.insertText(` ﴿${value}﴾ `);

        editor.tf.removeMark("color");
        editor.tf.removeMark("fontSize");


      },
    })),
  },
];

export function SlashInputElement(
  props: PlateElementProps<TComboboxInputElement>
) {
  const { editor, element } = props;

  return (
    <PlateElement {...props} as="span">
      <InlineCombobox element={element} trigger="/">
        <InlineComboboxInput />

        <InlineComboboxContent>
          <InlineComboboxEmpty>No results</InlineComboboxEmpty>

          {groups.map(({ group, items }) => (
            <InlineComboboxGroup key={group}>
              <InlineComboboxGroupLabel>{group}</InlineComboboxGroupLabel>

              {items.map(
                ({ focusEditor, icon, keywords, label, value, onSelect }) => (
                  <InlineComboboxItem
                    key={value}
                    value={value}
                    onClick={() => onSelect(editor, value)}
                    label={label}
                    focusEditor={focusEditor}
                    group={group}
                    keywords={keywords}
                  >
                    <div className="mr-2 text-muted-foreground">{icon}</div>
                    {label ?? value}
                  </InlineComboboxItem>
                )
              )}
            </InlineComboboxGroup>
          ))}
        </InlineComboboxContent>
      </InlineCombobox>

      {props.children}
    </PlateElement>
  );
}
