import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";

export const usePages = () => useLiveQuery(() => db.pages.toArray());