"use client";

import * as React from "react";
import type { PlateEditor, PlateElementProps } from "platejs/react";
import { type TComboboxInputElement } from "platejs";
import { PlateElement } from "platejs/react";
import { useFuzzySearchList, Highlight } from "@nozbe/microfuzz/react";
import { BookmarkPlus } from "lucide-react";
import { toast } from "sonner";

import {
  InlineCombobox,
  InlineComboboxContent,
  InlineComboboxEmpty,
  InlineComboboxInput,
  InlineComboboxItem,
} from "./inline-combobox";
import { KEYS } from "platejs";
import {
  type QuranVerseResult,
  searchQuranFoundationVerses,
  shouldUseQfContentApi,
} from "@/lib/quran-foundation";
import { db } from "@/lib/db";
import {
  enqueueBookmarkSync,
  flushSyncQueue,
  hasUserApiCredentials,
} from "@/lib/qf-sync";

type Group = QuranVerseResult & {
  onSelect: (editor: PlateEditor, value: string, color?: string) => void;
};

const loadQuran = async (): Promise<QuranVerseResult[]> => {
  try {
    const response = await fetch(import.meta.env.VITE_DATA_URL);
    if (!response.ok) {
      console.error("Failed to load quran data");
      return [];
    }

    const data = await response.json();

    return (data as Array<Omit<QuranVerseResult, "id" | "source">>).map(
      (item, index) => ({
        ...item,
        id: `local-${index}`,
        source: "local",
      })
    );
  } catch (error) {
    console.error("Failed to load quran data", error);
    return [];
  }
};

const quran = await loadQuran();

const groups: Group[] = quran.map((item) => ({
  ...item,
  onSelect: (editor: PlateEditor, value: string, color = "#16a34a") => {
    const fontSize = editor.api.marks()?.[KEYS.fontSize];
    editor.tf.addMarks({ color });
    editor.tf.addMarks({ fontSize });
    editor.tf.insertText(` ﴿${value}﴾ [${item.surah} ${item.aya}] `);
    editor.tf.removeMark("color");
  },
}));

const toSelectableGroup = (item: QuranVerseResult): Group => ({
  ...item,
  onSelect: (editor: PlateEditor, value: string, color = "#16a34a") => {
    const fontSize = editor.api.marks()?.[KEYS.fontSize];
    editor.tf.addMarks({ color });
    editor.tf.addMarks({ fontSize });
    editor.tf.insertText(` ﴿${value}﴾ [${item.surah} ${item.aya}] `);
    editor.tf.removeMark("color");
  },
});

export function SlashInputElement(
  props: PlateElementProps<TComboboxInputElement>
) {
  const { editor, element } = props;
  const [value, setValue] = React.useState("");
  const [remoteResults, setRemoteResults] = React.useState<Group[]>([]);
  const fontSize = editor.api.marks()?.[KEYS.fontSize];

  const filteredLocalResults = useFuzzySearchList({
    list: groups,
    queryText: value,
    getText: (item: Group) => [item.textNoTashkeel],
    mapResultItem: ({ item, matches: [highlightRanges] }) => ({
      item,
      highlightRanges,
    }),
  }).slice(0, 10);

  React.useEffect(() => {
    void flushSyncQueue();
  }, []);

  React.useEffect(() => {
    if (!value || value.trim().length < 3 || !shouldUseQfContentApi()) {
      setRemoteResults([]);
      return;
    }

    const timer = setTimeout(() => {
      searchQuranFoundationVerses(value, 6)
        .then((result) => {
          setRemoteResults(result.map(toSelectableGroup));
        })
        .catch(() => setRemoteResults([]));
    }, 250);

    return () => clearTimeout(timer);
  }, [value]);

  const combinedResults = React.useMemo(() => {
    const resultMap = new Map<string, Group>();

    filteredLocalResults.forEach(({ item }) => {
      resultMap.set(`${item.surah}:${item.aya}`, item);
    });

    remoteResults.forEach((item) => {
      const key = `${item.surah}:${item.aya}`;
      if (!resultMap.has(key)) {
        resultMap.set(key, item);
      }
    });

    return Array.from(resultMap.values()).slice(0, 10);
  }, [filteredLocalResults, remoteResults]);

  const handleBookmark = async (item: Group) => {
    const verseKey = `${item.surah}:${item.aya}`;

    await db.verseBookmarks.add({
      verseKey,
      surah: item.surah,
      aya: item.aya,
      ayahText: item.textTashkeel,
      source: item.source,
      createdAt: new Date().toISOString(),
      syncedAt: undefined,
    });

    if (hasUserApiCredentials()) {
      await enqueueBookmarkSync({
        ayahText: item.textTashkeel,
        surah: item.surah,
        aya: item.aya,
        verseKey,
      });
      await flushSyncQueue();
      toast.success("تم حفظ الآية محلياً ومزامنتها مع الحساب");
      return;
    }

    toast.success("تم حفظ الآية محلياً");
  };

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
          {combinedResults.length === 0 ? (
            <InlineComboboxEmpty>
              <span className="block px-3 py-6 text-center text-gray-500 text-base">
                لا يوجد نتائج
              </span>
            </InlineComboboxEmpty>
          ) : (
            combinedResults.map((item) => (
              <InlineComboboxItem
                key={item.id}
                value={item.textNoTashkeel}
                focusEditor={false}
                onClick={() => item.onSelect(editor, item.textTashkeel, "#16a34a")}
                className="py-3 px-4 hover:bg-gray-50/80 transition-colors duration-200 cursor-pointer"
                style={{
                  direction: "rtl",
                  fontSize: "1.2rem",
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className="text-xs text-green-600 block mb-2"
                      dir="ltr"
                      style={{ fontSize: "1.2rem" }}
                    >
                      {item.surah} {item.aya}
                      {item.source === "qf" ? " · API" : " · محلي"}
                    </span>
                    <span
                      className="font-medium text-gray-900 leading-relaxed"
                      dir="rtl"
                      style={{ fontSize: "1.2rem" }}
                    >
                      <Highlight text={item.textTashkeel} ranges={[]} />
                    </span>
                  </div>
                  <button
                    type="button"
                    aria-label="حفظ الآية"
                    className="rounded-md border p-1.5 hover:bg-green-50"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      void handleBookmark(item);
                    }}
                  >
                    <BookmarkPlus className="h-4 w-4 text-green-700" />
                  </button>
                </div>
              </InlineComboboxItem>
            ))
          )}
        </InlineComboboxContent>
      </InlineCombobox>
      {props.children}
    </PlateElement>
  );
}
