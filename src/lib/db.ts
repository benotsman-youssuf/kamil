import Dexie, { type EntityTable } from 'dexie';

interface Page {
  id: number;
  name: string;
  description: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
}

interface VerseBookmark {
  id: number;
  verseKey: string;
  surah: string;
  aya: number;
  ayahText: string;
  source: 'local' | 'qf';
  createdAt: string;
  syncedAt?: string;
}

interface SyncQueueItem {
  id: number;
  action: 'create_bookmark';
  payload: string;
  status: 'pending' | 'done' | 'failed';
  createdAt: string;
  lastError: string;
}

const db = new Dexie('PagesDatabase') as Dexie & {
  pages: EntityTable<Page, 'id'>;
  verseBookmarks: EntityTable<VerseBookmark, 'id'>;
  syncQueue: EntityTable<SyncQueueItem, 'id'>;
};

// Schema declaration:
db.version(1).stores({
  pages: '++id, name, description, content, createdAt, updatedAt'
});

db.version(2).stores({
  pages: '++id, name, description, content, createdAt, updatedAt, isPinned'
});

db.version(3).stores({
  pages: '++id, name, description, content, createdAt, updatedAt, isPinned',
  verseBookmarks: '++id, verseKey, surah, aya, source, createdAt, syncedAt',
  syncQueue: '++id, action, status, createdAt'
});

export type { Page, VerseBookmark, SyncQueueItem };
export { db };
