export async function fetchVerse(surah, ayah) {
  const res = await fetch(`/api/verse?surah=${surah}&ayah=${ayah}`);
  if (!res.ok) throw new Error(`Failed to fetch verse: ${res.statusText}`);
  return res.json();
}

export function parseVerseMarkers(text) {
  const regex = /\[INSERT_VERSE:\s*surah=(\d+)\s*ayah=(\d+)\]/g;
  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push({ surah: parseInt(match[1]), ayah: parseInt(match[2]) });
  }
  return matches;
}

export function parseHadithMarkers(text) {
  const regex = /\[INSERT_HADITH:\s*collection=([^\]]+?)\s*number=(\d+)\]/g;
  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push({ collection: match[1], number: parseInt(match[2]) });
  }
  return matches;
}

export function removeMarkers(text) {
  return text
    .replace(/\[INSERT_VERSE:\s*surah=\d+\s*ayah=\d+\]/g, '')
    .replace(/\[INSERT_HADITH:\s*collection=[^\]]+?\s*number=\d+\]/g, '')
    .trim();
}
