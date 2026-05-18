import { tool } from "ai";
import { z } from "zod";
import { searchHadithMcp, searchQuranMcp } from "./mcp";

export const quranSearchTool = tool({
  description: "Search the Quran MCP source and return grounded verses",
  parameters: z.object({ query: z.string().min(1) }),
  execute: async ({ query }) => {
    const verses = await searchQuranMcp(query);
    return { verses };
  },
});

export const hadithSearchTool = tool({
  description: "Search the Hadith MCP source and return grounded hadith references",
  parameters: z.object({ query: z.string().min(1) }),
  execute: async ({ query }) => {
    const hadiths = await searchHadithMcp(query);
    return { hadiths };
  },
});
