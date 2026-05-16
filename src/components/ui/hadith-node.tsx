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
        onMouseDown={() => {
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
