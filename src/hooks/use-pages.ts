import { useEffect, useState } from "react";
import { getDb } from "@/lib/rxdb";

export function usePages() {
  const [pages, setPages] = useState<any[]>([]);

  useEffect(() => {
    let sub: any;
    let destroyed = false;

    getDb().then((db) => {
      if (destroyed) return;
      sub = db.pages
        .find()
        .sort({ updated_at: "desc" })
        .$.subscribe((docs: any[]) => {
          setPages(docs);
        });
    });

    return () => {
      destroyed = true;
      if (sub) sub.unsubscribe();
    };
  }, []);

  return pages;
}
