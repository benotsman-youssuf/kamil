import Dexie, { type EntityTable } from 'dexie';


interface Page {
  id: number;
  name: string;
  description: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
  remoteId?: string;       // Supabase page UUID
  synced?: boolean;        // Whether synced to Supabase
  syncedAt?: string;       // Last sync timestamp
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

db.version(2).stores({
  pages: '++id, name, description, content, createdAt, updatedAt, isPinned'
});

db.version(3).stores({
  pages: '++id, name, description, content, createdAt, updatedAt, isPinned, remoteId, synced, syncedAt'
});


export type { Page };
export { db };