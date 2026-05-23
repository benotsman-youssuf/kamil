import { useEffect, useState } from "react";
import { getDb, type PageDocType } from "@/lib/rxdb";

export function usePages() {
  const [pages, setPages] = useState<PageDocType[]>([]);

  useEffect(() => {
    let sub: any;
    let destroyed = false;

    getDb().then((db) => {
      if (destroyed) return;
      sub = db.pages
        .find({ selector: { _deleted: { $ne: true } } })
        .sort({ updated_at: "desc" })
        .$.subscribe((docs: any[]) => {
          setPages(docs.map((d: any) => d.toJSON()));
        });
    });

    return () => {
      destroyed = true;
      if (sub) sub.unsubscribe();
    };
  }, []);

  return pages;
}
