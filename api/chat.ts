import { streamText, convertToCoreMessages, tool } from "ai";
import { createMCPClient } from "@ai-sdk/mcp";
import { openrouter, DEFAULT_OPENROUTER_MODEL } from "../src/lib/ai/openrouter.js";
import type { IncomingMessage, ServerResponse } from "node:http";
import { z } from "zod";

export const maxDuration = 60;

async function buildTools(): Promise<Record<string, ReturnType<typeof tool>>> {
  const tools: Record<string, ReturnType<typeof tool>> = {};

  try {
    const quranMcp = await createMCPClient({
      transport: {
        type: "http",
        url: process.env.QURAN_MCP_URL || "https://mcp.quran.ai",
      },
    });
    const mcpTools = await quranMcp.tools();
    setTimeout(() => { quranMcp.close().catch(() => {}); }, 60_000).unref();

    const rawSearchQuran = mcpTools.search_quran as any;
    const rawFetchQuran = mcpTools.fetch_quran as any;
    const rawFetchGrounding = mcpTools.fetch_grounding_rules as any;
    const rawFetchSkillGuide = mcpTools.fetch_skill_guide as any;

    if (rawSearchQuran?.execute) {
      tools.search_quran = rawSearchQuran;
    }

    if (rawFetchQuran?.execute) {
      tools.fetch_quran = rawFetchQuran;
    }

    if (rawFetchGrounding?.execute) {
      tools.fetch_grounding_rules = rawFetchGrounding;
    }

    if (rawFetchSkillGuide?.execute) {
      tools.fetch_skill_guide = rawFetchSkillGuide;
    }
  } catch (e: unknown) {
    console.error("Quran MCP error:", e instanceof Error ? e.message : e);
  }

  try {
    const hadithMcp = await createMCPClient({
      transport: {
        type: "http",
        url: process.env.HADITH_MCP_URL || "https://hadith-mcp.org",
      },
    });
    const mcpTools = await hadithMcp.tools();
    setTimeout(() => { hadithMcp.close().catch(() => {}); }, 60_000).unref();

    const rawSearchHadith = mcpTools.search_hadith as any;
    if (rawSearchHadith?.execute) {
      tools.search_hadith = tool({
        description: "Search hadith collections for a query",
        parameters: z.object({
          query: z.string().describe("Search query"),
          limit: z.number().optional().describe("Max results (default 20)"),
          collection: z.string().optional().describe("Filter by collection name"),
          collection_slug: z.string().optional(),
          mode: z.string().optional().describe("semantic, keyword, or both"),
        }),
        execute: async (args) => {
          const mcpResult = await rawSearchHadith.execute(args);
          return normalizeHadithResult(mcpResult);
        },
      });
    }

    const rawFetchHadith = mcpTools.fetch_hadith as any;
    if (rawFetchHadith?.execute) {
      tools.fetch_hadith = tool({
        description: "Fetch a specific hadith by ID, collection, or number",
        parameters: z.object({
          hadith_id: z.number().optional().describe("Global hadith ID"),
          collection: z.string().optional().describe("Collection name (e.g. Sahih al-Bukhari)"),
          collection_slug: z.string().optional(),
          hadith_number: z.union([z.number(), z.string()]).optional(),
          id_in_book: z.number().optional(),
          include_cross_references: z.boolean().optional(),
        }),
        execute: async (args) => {
          const mcpResult = await rawFetchHadith.execute(args);
          return normalizeHadithResult(mcpResult);
        },
      });
    }
  } catch (e: unknown) {
    console.error("Hadith MCP error:", e instanceof Error ? e.message : e);
  }

  return tools;
}

function normalizeHadithResult(mcpResult: unknown): object {
  const r = (mcpResult || {}) as Record<string, unknown>;
  if (r.structuredContent && typeof r.structuredContent === "object") {
    const sc = r.structuredContent as Record<string, unknown>;
    const rawResults = sc.hadiths || sc.results || [];
    const results = Array.isArray(rawResults) ? rawResults : [];
    return {
      hadiths: results.map(normalizeHadith),
      total: sc.total_found || results.length,
    };
  }
  const raw = extractFirstText(r);
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return normalizeHadithResult(parsed);
    } catch {}
  }
  return { hadiths: [], raw };
}

function normalizeHadith(item: any): object {
  return {
    source: "hadith_mcp" as const,
    collection: item.collection || item.source || "",
    bookNumber: item.book_number || item.bookNumber,
    hadithNumber: item.hadith_number || item.reference || item.hadithNumber || "",
    arabicText: item.text || item.body || item.arabicText || "",
    englishText: item.englishText || item.translation || item.english_text,
    grades: Array.isArray(item.grades) ? item.grades : undefined,
    citation: item.url || item.citation || "",
  };
}

function extractFirstText(obj: Record<string, unknown>): string | null {
  if (Array.isArray(obj.content)) {
    for (const part of obj.content) {
      if (part && typeof part === "object" && (part as any).type === "text") {
        return (part as any).text || null;
      }
    }
  }
  return null;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  if (req.method !== "POST") {
    res.writeHead(405).end("Method not allowed");
    return;
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const body = JSON.parse(Buffer.concat(chunks).toString());

  const tools = await buildTools();

  const result = streamText({
    model: openrouter(DEFAULT_OPENROUTER_MODEL),
    system:
      "You are a Quran/Hadith writing assistant. For factual religious content, use tools first and cite retrieved evidence. If no tool data, explicitly say source unavailable.",
    messages: convertToCoreMessages(body.messages || []),
    tools: Object.keys(tools).length > 0 ? tools : undefined,
    maxSteps: 5,
  });

  result.pipeDataStreamToResponse(res, {
    getErrorMessage: (error: unknown) => {
      console.error("Stream error:", error);
      return error instanceof Error ? error.message : String(error);
    },
  });
}
