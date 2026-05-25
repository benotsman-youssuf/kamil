import type {
  Hadith,
  HadithSearchResponse,
  SearchFilters,
  HadithApiFile,
  HadithApiRecord,
  HadithApiEditions,
} from "./types";

const CDN_BASE = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1";

const NAME_TO_EDITION: Record<string, string> = {
  "صحيح البخاري": "ara-bukhari",
  "صحيح مسلم": "ara-muslim",
  "سنن النسائي": "ara-nasai",
  "سنن أبي داود": "ara-abudawud",
  "جامع الترمذي": "ara-tirmidhi",
  "سنن ابن ماجه": "ara-ibnmajah",
  "موطأ مالك": "ara-malik",
  "رياض الصالحين": "ara-nawawi",
  "sahih al-bukhari": "ara-bukhari",
  "sahih muslim": "ara-muslim",
  "sunan an-nasai": "ara-nasai",
  "sunan abi dawud": "ara-abudawud",
  "jami at-tirmidhi": "ara-tirmidhi",
  "sunan ibn majah": "ara-ibnmajah",
  "muvatta malik": "ara-malik",
  "riyad us-salihin": "ara-nawawi",
};

export const COLLECTION_NAMES: Record<string, string> = {
  bukhari: "صحيح البخاري",
  muslim: "صحيح مسلم",
  nasai: "سنن النسائي",
  abudawud: "سنن أبي داود",
  tirmidhi: "جامع الترمذي",
  ibnmajah: "سنن ابن ماجه",
  malik: "موطأ مالك",
  nawawi: "رياض الصالحين",
  qudsi: "الحديث القدسي",
};

export const EDITION_TO_COLLECTION: Record<string, string> = {
  "ara-bukhari": "bukhari",
  "ara-muslim": "muslim",
  "ara-nasai": "nasai",
  "ara-abudawud": "abudawud",
  "ara-tirmidhi": "tirmidhi",
  "ara-ibnmajah": "ibnmajah",
  "ara-malik": "malik",
  "ara-nawawi": "nawawi",
  "ara-qudsi": "qudsi",
};

const COLLECTION_TO_EDITION: Record<string, string> = {
  bukhari: "ara-bukhari",
  muslim: "ara-muslim",
  nasai: "ara-nasai",
  abudawud: "ara-abudawud",
  tirmidhi: "ara-tirmidhi",
  ibnmajah: "ara-ibnmajah",
  malik: "ara-malik",
  nawawi: "ara-nawawi",
  qudsi: "ara-qudsi",
};

function mapRecordToHadith(
  record: HadithApiRecord,
  collection: string,
): Hadith {
  return {
    collection,
    hadithNumber: String(record.hadithnumber),
    hadithText: record.text,
    grades: record.grades.map((g) => ({ name: g.name, grade: g.grade })),
  };
}

export async function fetchEditions(): Promise<HadithApiEditions> {
  const res = await fetch(`${CDN_BASE}/editions.min.json`);
  if (!res.ok) throw new Error(`Editions API error HTTP ${res.status}`);
  return res.json();
}

export async function fetchHadith(
  collection: string,
  hadithNumber: string,
): Promise<Hadith> {
  const edition = COLLECTION_TO_EDITION[collection];
  if (!edition) throw new Error(`Unknown collection: ${collection}`);

  const res = await fetch(`${CDN_BASE}/editions/${edition}/${hadithNumber}.min.json`);
  if (!res.ok) throw new Error(`Hadith API error HTTP ${res.status}`);

  const json: HadithApiFile = await res.json();
  const record = json.hadiths[0];
  if (!record) throw new Error(`Hadith ${hadithNumber} not found in ${collection}`);

  return mapRecordToHadith(record, collection);
}

export async function fetchHadithByNumber(
  slugOrName: string,
  hadithNumber: string,
): Promise<Hadith> {
  const slug =
    NAME_TO_EDITION[slugOrName.toLowerCase()] ||
    NAME_TO_EDITION[slugOrName] ||
    slugOrName;
  const edition =
    COLLECTION_TO_EDITION[slug] ||
    (EDITION_TO_COLLECTION[slug] ? slug : `ara-${slug}`);
  const collection =
    EDITION_TO_COLLECTION[edition] ||
    EDITION_TO_COLLECTION[`ara-${slug}`] ||
    slug;

  const res = await fetch(`${CDN_BASE}/editions/${edition}/${hadithNumber}.min.json`);
  if (!res.ok) throw new Error(`Hadith API error HTTP ${res.status}`);

  const json: HadithApiFile = await res.json();
  const record = json.hadiths[0];
  if (!record) throw new Error(`Hadith ${hadithNumber} not found`);

  return mapRecordToHadith(record, collection);
}

export async function searchHadiths(
  filters: SearchFilters,
): Promise<HadithSearchResponse> {
  const params = new URLSearchParams();
  params.set("q", filters.q);
  if (filters.limit) params.set("limit", String(filters.limit));

  const res = await fetch(`/api/hadith-search?${params.toString()}`);
  if (!res.ok) throw new Error(`Hadith search error HTTP ${res.status}`);

  return res.json();
}
