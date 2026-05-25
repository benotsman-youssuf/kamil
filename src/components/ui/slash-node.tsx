"use client";

import * as React from "react";
import type { PlateEditor, PlateElementProps } from "platejs/react";
import { type TComboboxInputElement } from "platejs";
import { PlateElement } from "platejs/react";

import { searchQuran } from "@/lib/qf/api";
import type { SearchVerseResult } from "@/lib/qf/api";
import { useDebounce } from "@/hooks/use-debounce";
import { SURAH_NAMES } from "@/constants/surahs";
import { searchHadiths } from "@/lib/hadith/api";
import type { Hadith, HadithGrade } from "@/lib/hadith/types";

import {
  InlineCombobox,
  InlineComboboxContent,
  InlineComboboxInput,
  InlineComboboxItem,
} from "./inline-combobox";
import { KEYS } from "platejs";

const COLLECTION_NAMES: Record<string, string> = {
  bukhari: "صحيح البخاري",
  muslim: "صحيح مسلم",
  nasai: "سنن النسائي",
  abudawud: "سنن أبي داود",
  tirmidhi: "جامع الترمذي",
  ibnmajah: "سنن ابن ماجه",
  malik: "موطأ مالك",
  ahmad: "مسند أحمد",
  darimi: "سنن الدارمي",
  riyadussalihin: "رياض الصالحين",
  adab: "الأدب المفرد",
  shamail: "الشمائل المحمدية",
  mishkat: "مشكاة المصابيح",
  bulugh: "بلوغ المرام",
  forty: "الأربعون النووية",
  hisn: "حصن المسلم",
  virtues: "فضائل القرآن",
};

function GradeBadge({ grades }: { grades?: HadithGrade[] }) {
  if (!grades || grades.length === 0) return null;
  const gradeText = grades[0].grade;
  const grade = gradeText.toLowerCase();

  let colorClass: string;
  if (grade.includes("sahih")) {
    colorClass = "bg-green-50 text-green-700 border-green-200";
  } else if (grade.includes("hasan")) {
    colorClass = "bg-yellow-50 text-yellow-700 border-yellow-200";
  } else if (grade.includes("da")) {
    colorClass = "bg-red-50 text-red-700 border-red-200";
  } else {
    colorClass = "bg-gray-50 text-gray-600 border-gray-200";
  }

  return (
    <span className={`inline-flex items-center rounded px-1 py-0 text-[10px] font-medium border mr-1 ${colorClass}`}>
      {gradeText}
    </span>
  );
}

type SearchMode = "verse" | "hadith";

export function SlashInputElement(
  props: PlateElementProps<TComboboxInputElement>
) {
  const { editor, element } = props;
  const [value, setValue] = React.useState("");
  const [apiResults, setApiResults] = React.useState<any[]>([]);
  const [hadithResults, setHadithResults] = React.useState<Hadith[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const debouncedValue = useDebounce(value, 400);
  const [searchMode, setSearchMode] = React.useState<SearchMode | null>(null);

  React.useEffect(() => {
    if (searchMode === null) {
      setHadithResults([]);
      setApiResults([]);
    }
  }, [searchMode]);

  React.useEffect(() => {
    if (searchMode === "verse") {
      if (debouncedValue.length > 0) {
        setIsSearching(true);
        searchQuran(debouncedValue).then(response => {
          const verses = response?.result?.verses || [];
          setApiResults(verses.map((r: SearchVerseResult) => {
            const [sId, aNum] = r.key.split(':').map(Number);
            const surahName = SURAH_NAMES[sId] ? "سورة " + SURAH_NAMES[sId] : "سورة " + sId;

            return {
              id: r.key,
              surah: surahName,
              surah_id: sId,
              aya: aNum,
              textTashkeel: r.name,
              textNoTashkeel: r.isArabic ? r.name.replace(/<[^>]*>?/gm, '') : r.name,
              highlighted: r.highlighted,
              onSelect: (editor: PlateEditor, val: string) => {
                editor.tf.insertNodes({
                  type: "verse",
                  verseKey: r.key,
                  surahName: surahName,
                  ayaNumber: aNum,
                  verseText: val,
                  children: [{ text: `﴿${val}﴾ [${surahName} ${aNum}]` }],
                });
                editor.tf.insertText(" ");
                editor.tf.move({ distance: 1, unit: 'character' });
              }
            };
          }));
        }).catch(console.error).finally(() => setIsSearching(false));
      } else {
        setApiResults([]);
      }
    }
  }, [debouncedValue, searchMode]);

  React.useEffect(() => {
    if (searchMode === "hadith") {
      if (debouncedValue.length > 1) {
        setIsSearching(true);

        const normalizeArabic = (text: string) =>
          text.normalize('NFD').replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0610-\u061A]/g, '')
            .replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه');

        const hasArabic = /[\u0600-\u06FF]/.test(debouncedValue);

        const qVariants = [debouncedValue];
        if (hasArabic) {
          const norm = normalizeArabic(debouncedValue);
          if (norm !== debouncedValue) qVariants.push(norm);
          qVariants.push('ال' + norm);
          const stripped = norm.replace(/^ال/, '');
          if (stripped !== norm) qVariants.push(stripped);
        }
        const unique = [...new Set(qVariants)].slice(0, 4);

        Promise.all(
          unique.map(q =>
            searchHadiths({ q, lang: hasArabic ? "both" : "en", limit: 30 })
              .then(r => r.results || [])
              .catch(() => [] as Hadith[])
          )
        ).then(batches => {
          const seen = new Set<string>();
          const all: Hadith[] = [];
          for (const batch of batches)
            for (const h of batch) {
              const key = `${h.collection}-${h.bookNumber}-${h.hadithNumber}`;
              if (!seen.has(key)) { seen.add(key); all.push(h); }
            }

          const CANONICAL_SIX = new Set(["bukhari", "muslim", "nasai", "abudawud", "tirmidhi", "ibnmajah"]);

          const nq = normalizeArabic(debouncedValue);
          const scored = all.map(h => {
            const text = h.ar?.text || h.en?.text || '';
            const nt = normalizeArabic(text);
            let score = 0;
            if (nt.includes(nq)) score = 1;
            else {
              const qWords = nq.split(/\s+/).filter(Boolean);
              const tWords = nt.split(/\s+/).filter(Boolean);
              let matches = 0;
              for (const qw of qWords)
                if (tWords.some(tw => tw.includes(qw))) matches++;
              score = matches / Math.max(qWords.length, 1);
            }
            if (CANONICAL_SIX.has(h.collection)) score += 0.1;
            return { h, score };
          });

          scored.sort((a, b) => b.score - a.score);
          setHadithResults(scored.filter(s => s.score > 0).slice(0, 10).map(s => s.h));
          setIsSearching(false);
        }).catch(() => setIsSearching(false));
      } else if (debouncedValue.length === 0) {
        setHadithResults([]);
      }
    }
  }, [debouncedValue, searchMode]);

  const fontSize = editor.api.marks()?.[KEYS.fontSize];
  const insertHadith = (hadith: Hadith) => {
    const rawAr = hadith.ar?.body || hadith.ar?.text || "";
    const rawEn = hadith.en?.body || hadith.en?.text || "";
    
    // Strip HTML tags (like <p>) that the API returns in the body field
    const hadithText = rawAr.replace(/<[^>]*>?/gm, '');
    const hadithTextEn = rawEn.replace(/<[^>]*>?/gm, '');

    editor.tf.insertNodes({
      type: "hadith",
      collection: hadith.collection,
      bookNumber: hadith.bookNumber,
      hadithNumber: hadith.hadithNumber,
      hadithText,
      hadithTextEn,
      grades: hadith.ar?.grades || hadith.en?.grades || [],
      chapterTitle: hadith.chapterTitle?.ar || "",
      children: [{ text: `﴿${hadithText}﴾ [${COLLECTION_NAMES[hadith.collection] || hadith.collection} ${hadith.hadithNumber}]` }],
    });
    editor.tf.insertText(" ");
    editor.tf.move({ distance: 1, unit: 'character' });
  };

  return (
    <PlateElement {...props} as="span">
      <InlineCombobox
        element={element}
        trigger="/"
        setValue={setValue}
        value={value}
        filter={false}
      >
        <span
          style={{
            fontSize: fontSize !== undefined ? (typeof fontSize === "number" ? `${fontSize}px` : String(fontSize)) : "inherit",
          } as React.CSSProperties}
        >
          <InlineComboboxInput />
        </span>

        <InlineComboboxContent className="z-50 overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md min-w-[340px] max-h-[400px] p-1 font-[amiri]" dir="rtl">
          <InlineComboboxItem value={value || "dummy"} className="hidden" disabled />
          
          {searchMode === null ? (
            <div className="flex flex-col gap-1 w-full min-h-0">
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground text-right w-full">اختر نوع البحث</div>
              <div
                onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setSearchMode("verse"); }}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground w-full"
              >
                بحث عن آية
              </div>
              <div
                onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setSearchMode("hadith"); }}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground w-full"
              >
                بحث عن حديث
              </div>
            </div>
          ) : (
            <>
              {/* Header with back button */}
              <div className="flex items-center px-2 py-1.5 border-b mb-1">
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setSearchMode(null); setValue(""); }}
                  className="text-xs text-muted-foreground hover:text-foreground ml-2 px-2 py-1 rounded-sm hover:bg-accent transition-colors"
                >
                  &rarr; رجوع
                </button>
                <span className="text-xs font-medium text-muted-foreground mr-auto">
                  {searchMode === "verse" ? "البحث في القرآن..." : "البحث في الحديث..."}
                </span>
                {isSearching && (
                  <span className="text-xs text-muted-foreground animate-pulse mr-2">جاري البحث...</span>
                )}
              </div>

              {/* Search content */}
              {value.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground bg-transparent w-full">
                  {searchMode === "verse" ? "اكتب للبحث عن آية" : "اكتب للبحث عن حديث"}
                </div>
              ) : searchMode === "verse" ? (
                apiResults.length === 0 && !isSearching ? (
                  <div className="py-6 text-center text-muted-foreground text-sm w-full">
                    لا يوجد نتائج
                  </div>
                ) : isSearching && apiResults.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground animate-pulse w-full">
                    جاري البحث في القرآن...
                  </div>
                ) : (
                  apiResults.map((item) => (
                    <InlineComboboxItem
                      key={item.id}
                      value={item.textNoTashkeel}
                      focusEditor={false}
                      onClick={() => item.onSelect(editor, item.textTashkeel)}
                      className="relative flex cursor-pointer select-none flex-col items-start gap-1 rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[active-item=true]:bg-accent data-[active-item=true]:text-accent-foreground"
                    >
                      <span className="text-sm text-muted-foreground block mb-0.5" dir="ltr">
                        {item.surah} — {item.aya}
                      </span>
                      <span
                        className="text-lg font-medium leading-relaxed font-['Amiri'] [&_em]:bg-amber-200/60 [&_em]:text-amber-900 [&_em]:not-italic [&_em]:rounded-sm [&_em]:px-0.5"
                        dir="rtl"
                        dangerouslySetInnerHTML={{ __html: item.highlighted || item.textTashkeel }}
                      />
                    </InlineComboboxItem>
                  ))
                )
              ) : (
                /* Hadith search results */
                hadithResults.length === 0 && debouncedValue.length > 1 && !isSearching ? (
                  <div className="py-6 text-center text-muted-foreground text-sm w-full">
                    لا يوجد نتائج
                  </div>
                ) : debouncedValue.length <= 1 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    اكتب كلمتين على الأقل للبحث
                  </div>
                ) : isSearching && hadithResults.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground animate-pulse w-full">
                    جاري البحث في الحديث...
                  </div>
                ) : (
                  hadithResults.map((hadith, i) => (
                    <InlineComboboxItem
                      key={`${hadith.collection}-${hadith.bookNumber}-${hadith.hadithNumber}-${i}`}
                      value={hadith.ar?.text || hadith.ar?.body || hadith.en?.text || `hadith-${i}`}
                      focusEditor={false}
                      onClick={() => insertHadith(hadith)}
                      className="relative flex cursor-pointer select-none flex-col items-start gap-1 rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[active-item=true]:bg-accent data-[active-item=true]:text-accent-foreground"
                    >
                      <div className="flex items-center gap-2 flex-wrap w-full mb-1">
                        <span className="text-sm text-muted-foreground font-medium">
                          {COLLECTION_NAMES[hadith.collection] || hadith.collection}
                          {hadith.hadithNumber ? ` — ${hadith.hadithNumber}` : ""}
                        </span>
                        <GradeBadge grades={hadith.ar?.grades || hadith.en?.grades || []} />
                      </div>
                      <span 
                        className="text-lg leading-relaxed block text-foreground font-['Amiri'] [&_mark]:bg-amber-200/60 [&_mark]:text-amber-900 [&_mark]:rounded-sm [&_mark]:px-0.5" 
                        dir="auto"
                        dangerouslySetInnerHTML={{ 
                          __html: hadith.snippet?.ar || hadith.snippet?.en || (hadith.ar?.text || "").slice(0, 200) + ((hadith.ar?.text || "").length > 200 ? "…" : "")
                        }}
                      />
                    </InlineComboboxItem>
                  ))
                )
              )}
            </>
          )}
        </InlineComboboxContent>
      </InlineCombobox>
      {props.children}
    </PlateElement>
  );
}
