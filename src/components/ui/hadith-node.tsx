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
    colorClass = "bg-primary/10 text-primary border-primary/20";
  } else if (grade.includes("hasan")) {
    colorClass = "bg-secondary/40 text-secondary-foreground border-secondary/50";
  } else if (grade.includes("da")) {
    colorClass = "bg-destructive/10 text-destructive border-destructive/20";
  } else {
    colorClass = "bg-muted text-muted-foreground border-border";
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
        "hadith-node cursor-pointer rounded-sm bg-secondary/30 px-1 py-0.5 font-medium text-foreground transition-all hover:bg-secondary/60 border-b border-border inline decoration-muted-foreground/30",
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
