'use client';

import { useEffect, useRef } from 'react';

import { NodeApi } from 'platejs';
import { ReactEditor } from 'slate-react';

interface InputState {
  isComposing: boolean;
}

function pointsEqual(
  a: { path: number[]; offset: number },
  b: { path: number[]; offset: number }
) {
  if (a.offset !== b.offset) return false;
  if (a.path.length !== b.path.length) return false;
  return a.path.every((v, i) => v === b.path[i]);
}

export function useArabicAndroidInput(editor: any, isAndroid: boolean) {
  const stateRef = useRef<InputState>({
    isComposing: false,
  });

  useEffect(() => {
    if (!isAndroid || !editor) return;

    const { insertText } = editor;

    editor.insertText = (text: string) => {
      if (!stateRef.current.isComposing) {
        return insertText(text);
      }

      // Dedup: skip if IME already committed this text at cursor
      const { selection } = editor;
      if (selection) {
        try {
          const nodeEntry = editor.api.node({ at: selection.focus.path });
          if (nodeEntry) {
            const [node] = nodeEntry;
            const nodeText = NodeApi.string(node);
            const offset = selection.focus.offset;
            if (nodeText.slice(offset, offset + text.length) === text && text.length > 0) {
              return;
            }
          }
        } catch {
          // dedup check failed — proceed
        }
      }

      // Reconcile DOM selection with Slate model
      try {
        const domSelection = window.getSelection();
        if (domSelection && domSelection.focusNode && editor.selection) {
          const slatePoint = ReactEditor.toSlatePoint(editor, [
            domSelection.focusNode,
            domSelection.focusOffset,
          ], { exactMatch: false, suppressThrow: true });
          if (
            slatePoint &&
            !pointsEqual(slatePoint, editor.selection.focus)
          ) {
            editor.tf.select(slatePoint);
          }
        }
      } catch {
        // reconciliation failed — proceed with existing selection
      }

      insertText(text);
    };

    return () => {
      editor.insertText = insertText;
    };
  }, [isAndroid, editor]);

  // Attach native DOM event listeners
  // (bypasses Slate swallowing onCompositionEnd/Start on Android)
  useEffect(() => {
    if (!isAndroid || !editor) return;

    let domEl: HTMLElement | null = null;
    try {
      domEl = ReactEditor.toDOMNode(editor, editor) as HTMLElement;
    } catch {
      return;
    }
    if (!domEl) return;

    const onCompositionStart = () => {
      stateRef.current.isComposing = true;
    };

    const onCompositionUpdate = () => {
      stateRef.current.isComposing = true;
    };

    const onCompositionEnd = () => {
      // Delay clearing isComposing — browser fires compositionend
      // before it finishes mutating the DOM
      setTimeout(() => {
        stateRef.current.isComposing = false;
      }, 30);
    };

    domEl.addEventListener('compositionstart', onCompositionStart);
    domEl.addEventListener('compositionupdate', onCompositionUpdate);
    domEl.addEventListener('compositionend', onCompositionEnd);

    return () => {
      domEl?.removeEventListener('compositionstart', onCompositionStart);
      domEl?.removeEventListener('compositionupdate', onCompositionUpdate);
      domEl?.removeEventListener('compositionend', onCompositionEnd);
    };
  }, [isAndroid, editor]);
}
