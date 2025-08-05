import Dexie, { type EntityTable } from 'dexie';


interface Page {
  id: number;
  name: string;
  description: string;
  content: string;
  updatedAt?: string;
}

const db = new Dexie('FriendsDatabase') as Dexie & {
  pages: EntityTable<
    Page,
    'id' // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  pages: '++id, name, description, content, updatedAt' // primary key "id" (for the runtime!)
});


export type { Page };
export { db };