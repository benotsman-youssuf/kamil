"use client";

import * as React from "react";

import type { TElement } from "platejs";

import { toUnitLess } from "@platejs/basic-styles";
import { FontSizePlugin } from "@platejs/basic-styles/react";
import { Minus, Plus } from "lucide-react";
import { KEYS } from "platejs";
import { useEditorPlugin, useEditorSelector } from "platejs/react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const DEFAULT_FONT_SIZE = "16";

const FONT_SIZE_MAP = {
  h1: "36",
  h2: "24",
  h3: "20",
} as const;

export function FontSizeToolbarButton() {
  const [inputValue, setInputValue] = React.useState(DEFAULT_FONT_SIZE);
  const [isFocused, setIsFocused] = React.useState(false);
  const { editor, tf } = useEditorPlugin(FontSizePlugin);

  const cursorFontSize = useEditorSelector((editor) => {
    const fontSize = editor.api.marks()?.[KEYS.fontSize];

    if (fontSize) {
      return toUnitLess(fontSize as string);
    }

    const [block] = editor.api.block<TElement>() || [];

    if (!block?.type) return DEFAULT_FONT_SIZE;

    return block.type in FONT_SIZE_MAP
      ? FONT_SIZE_MAP[block.type as keyof typeof FONT_SIZE_MAP]
      : DEFAULT_FONT_SIZE;
  }, []);

  const handleInputChange = () => {
    const newSize = toUnitLess(inputValue);

    if (Number.parseInt(newSize) < 1 || Number.parseInt(newSize) > 100) {
      editor.tf.focus();
      return;
    }
    if (newSize !== toUnitLess(cursorFontSize)) {
      tf.fontSize.addMark(`${newSize}px`);
    }

    editor.tf.focus();
  };

  const handleFontSizeChange = (delta: number) => {
    const currentSize = Number(displayValue);
    let newSize = currentSize + delta;

    // Clamp between reasonable bounds
    newSize = Math.max(8, Math.min(100, newSize));

    tf.fontSize.addMark(`${newSize}px`);
    editor.tf.focus();
  };

  const displayValue = isFocused ? inputValue : cursorFontSize;

  return (
    <div className="flex items-center">
      {/* Decrease button */}
      <button
        onClick={() => handleFontSizeChange(-1)}
        className={cn(
          "p-1.5 rounded-md hover:bg-[#3a3a3d] active:bg-[#454548]",
          "transition-all duration-150 ease-out group",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
        disabled={Number(displayValue) <= 8}
        title="Decrease font size"
      >
        <Minus className="w-4 h-4 text-gray-300 group-hover:text-white" />
      </button>

      {/* Font size input */}
      <Popover open={isFocused} modal={false}>
        <PopoverTrigger asChild>
          <input
            className={cn(
              "w-9 h-7 mx-1 px-1 text-center text-sm",
              "text-gray-300 hover:text-white hover:bg-[#3a3a3d] rounded-md",
              "transition-all duration-150 ease-out border-none outline-none",
              "focus:bg-[#3a3a3d] focus:text-white selection:bg-blue-500/30",
              "bg-transparent cursor-pointer"
            )}
            value={displayValue}
            onBlur={() => {
              setIsFocused(false);
              handleInputChange();
            }}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setInputValue(toUnitLess(cursorFontSize));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleInputChange();
                setIsFocused(false);
              }
              if (e.key === "Escape") {
                setIsFocused(false);
                editor.tf.focus();
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                handleFontSizeChange(1);
              }
              if (e.key === "ArrowDown") {
                e.preventDefault();
                handleFontSizeChange(-1);
              }
            }}
            data-plate-focus="true"
            type="text"
            title="Font size"
          />
        </PopoverTrigger>
        <PopoverContent
          className="w-auto px-2 py-1 bg-[#1e1e1f] border-[#38383a] text-xs text-gray-400"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          Type size or use ↑↓ arrows
        </PopoverContent>
      </Popover>

      {/* Increase button */}
      <button
        onClick={() => handleFontSizeChange(1)}
        className={cn(
          "p-1.5 rounded-md hover:bg-[#3a3a3d] active:bg-[#454548]",
          "transition-all duration-150 ease-out group",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
        disabled={Number(displayValue) >= 100}
        title="Increase font size"
      >
        <Plus className="w-4 h-4 text-gray-300 group-hover:text-white" />
      </button>
    </div>
  );
}
