import Dexie, { type EntityTable } from 'dexie';


interface Page {
  id: number;
  name: string;
  description: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const db = new Dexie('PagesDatabase') as Dexie & {
  pages: EntityTable<
    Page,
    'id' // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  pages: '++id, name, description, content, createdAt, updatedAt' // primary key "id" (for the runtime!)
});


export type { Page };
export { db };