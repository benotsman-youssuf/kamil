"use client";

import { PlateElement } from "platejs/react";
import type { PlateElementProps } from "platejs/react";
import { cn } from "@/lib/utils";
import type { HadithGrade } from "@/lib/hadith/types";

export interface HadithElementNode {
  type: "hadith";
  children: [{ text: string }];
  collection: string;
  bookNumber: string;
  hadithNumber: string;
  hadithText: string;
  hadithTextEn?: string;
  grades?: HadithGrade[];
  chapterTitle?: string;
  [key: string]: unknown;
}

function GradeBadge({ grades }: { grades?: HadithGrade[] }) {
  if (!grades || grades.length === 0) return null;
  const grade = grades[0].grade.toLowerCase();

  let colorClass: string;
  if (grade.includes("sahih")) {
    colorClass = "bg-green-100 text-green-700 border-green-300";
  } else if (grade.includes("hasan")) {
    colorClass = "bg-yellow-100 text-yellow-700 border-yellow-300";
  } else if (grade.includes("da")) {
    colorClass = "bg-red-100 text-red-700 border-red-300";
  } else {
    colorClass = "bg-gray-100 text-gray-600 border-gray-300";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1 py-0 text-[10px] font-medium border mr-1",
        colorClass
      )}
    >
      {grades[0].grade}
    </span>
  );
}

export function HadithElement(props: PlateElementProps<HadithElementNode>) {
  const { element, children, className } = props;
  const { collection, bookNumber, hadithNumber, grades, hadithText, hadithTextEn } = element;

  return (
    <PlateElement
      {...props}
      as="span"
      className={cn(
        "hadith-node cursor-pointer rounded-sm bg-amber-50/40 px-0.5 font-medium text-amber-950/90 transition-all hover:bg-amber-100/60 border-b border-amber-600/20 inline decoration-amber-600/30",
        className
      )}
    >
      <span
        onMouseDown={(e) => {
          console.log("HadithElement inner: onMouseDown", hadithNumber);
          
          const event = new CustomEvent("open-hadith-panel", {
            detail: {
              collection,
              bookNumber,
              hadithNumber,
              hadithText,
              hadithTextEn,
              grades,
            },
            bubbles: true,
            composed: true,
          });
          window.dispatchEvent(event);
        }}
      >
        {children}
      </span>
    </PlateElement>
  );
}
