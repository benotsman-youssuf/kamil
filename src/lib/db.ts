import Dexie, { type EntityTable } from 'dexie';

interface Page {
  name: string;
  description: string;
  createdAt: string;
  id: string;
  content: string;
}

const db = new Dexie('FriendsDatabase') as Dexie & {
  pages: EntityTable<
    Page,
    'id' // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  pages: '++id, name, description, createdAt, content' // primary key "id" (for the runtime!)
});

export type { Page };
export { db };