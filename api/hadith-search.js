export const maxDuration = 60;

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1';

const COLLECTION_TO_EDITION = {
  bukhari: 'ara-bukhari',
  muslim: 'ara-muslim',
  abudawud: 'ara-abudawud',
  tirmidhi: 'ara-tirmidhi',
  nasai: 'ara-nasai',
  ibnmajah: 'ara-ibnmajah',
  malik: 'ara-malik',
  nawawi: 'ara-nawawi',
  qudsi: 'ara-qudsi',
};

const EDITION_TO_COLLECTION = Object.fromEntries(
  Object.entries(COLLECTION_TO_EDITION).map(([k, v]) => [v, k])
);

const EDITIONS = Object.values(COLLECTION_TO_EDITION);

const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000;

async function getEdition(edition) {
  const cached = cache.get(edition);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  const res = await fetch(`${CDN_BASE}/editions/${edition}.min.json`);
  if (!res.ok) throw new Error(`Failed to fetch ${edition}: HTTP ${res.status}`);
  const data = await res.json();
  cache.set(edition, { data, timestamp: Date.now() });
  return data;
}

export default async function handler(req, res) {
  const { q, limit = 30 } = req.query;
  if (!q || q.length < 2) {
    return res.status(400).json({ results: [], count: 0 });
  }

  try {
    const query = q.toLowerCase();
    const maxResults = Math.min(parseInt(limit, 10) || 30, 50);

    const allResults = [];

    for (const edition of EDITIONS) {
      const file = await getEdition(edition);
      const collection = EDITION_TO_COLLECTION[edition];
      const hadiths = file.hadiths || [];

      for (const h of hadiths) {
        if (h.text && h.text.toLowerCase().includes(query)) {
          allResults.push({
            collection,
            hadithNumber: String(h.hadithnumber),
            hadithText: h.text,
            grades: (h.grades || []).map((g) => ({
              name: g.name || '',
              grade: g.grade || '',
            })),
          });
          if (allResults.length >= maxResults) break;
        }
      }
      if (allResults.length >= maxResults) break;
    }

    res.setHeader('Cache-Control', 'public, max-age=60');
    res.json({ results: allResults.slice(0, maxResults), count: allResults.length });
  } catch (e) {
    console.error('Hadith search error:', e);
    res.status(500).json({ error: e.message, results: [], count: 0 });
  }
}
