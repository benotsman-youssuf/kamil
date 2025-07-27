import { useEffect } from 'react';

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  ctrlKey = true
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === key && (!ctrlKey || e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [key, callback, ctrlKey]);
}
