"use client";

import { PlateElement } from "platejs/react";
import type { PlateElementProps } from "platejs/react";
import { cn } from "@/lib/utils";

export interface VerseElementNode {
  type: "verse";
  children: [{ text: string }];
  verseKey: string;
  surahName: string;
  ayaNumber: number;
  verseText: string;
  [key: string]: unknown;
}

export function VerseElement(props: PlateElementProps<VerseElementNode>) {
  const { element, children, className } = props;
  const { verseKey, surahName, ayaNumber } = element;

  return (
    <PlateElement
      {...props}
      as="span"
      className={cn(
        "verse-node cursor-pointer rounded-sm bg-green-50/40 px-0.5 font-bold text-green-900/90 transition-all hover:bg-green-100/60 border-b border-green-600/20 inline decoration-green-600/30",
        className
      )}
    >
      <span
        onMouseDown={(e) => {
          console.log("VerseElement inner: onMouseDown", verseKey);
          
          const event = new CustomEvent("open-verse-panel", {
            detail: { 
              verseKey, 
              surahName, 
              ayaNumber, 
              verseText: element.verseText 
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
