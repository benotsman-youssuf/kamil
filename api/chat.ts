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

    if (rawSearchQuran?.execute) {
      tools.search_quran = tool({
        description: "Search the Quran for verses matching a query",
        parameters: z.object({
          query: z.string().describe("Search query"),
        }),
        execute: async ({ query }) => {
          const result = await rawSearchQuran.execute({ query });
          const text = extractText(result);
          try {
            return JSON.parse(text);
          } catch {
            return { verses: [], raw: text };
          }
        },
      });
    }

    if (rawFetchQuran?.execute) {
      tools.fetch_quran = tool({
        description: "Fetch a specific Quran verse by surah and ayah number",
        parameters: z.object({
          surah: z.number().describe("Surah number"),
          ayah: z.number().describe("Ayah number"),
        }),
        execute: async ({ surah, ayah }) => {
          const result = await rawFetchQuran.execute({ surah, ayah });
          const text = extractText(result);
          try {
            return JSON.parse(text);
          } catch {
            return { verses: [], raw: text };
          }
        },
      });
    }

    const rawFetchGrounding = mcpTools.fetch_grounding_rules as any;
    if (rawFetchGrounding?.execute) {
      tools.fetch_grounding_rules = tool({
        description: "Fetch grounding rules for Quran citation",
        parameters: z.object({}),
        execute: async () => {
          const result = await rawFetchGrounding.execute({});
          const text = extractText(result);
          try {
            return JSON.parse(text);
          } catch {
            return { raw: text };
          }
        },
      });
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
        }),
        execute: async ({ query }) => {
          const result = await rawSearchHadith.execute({ query });
          const text = extractText(result);
          try {
            return JSON.parse(text);
          } catch {
            return { hadiths: [], raw: text };
          }
        },
      });
    }

    const rawFetchHadith = mcpTools.fetch_hadith as any;
    if (rawFetchHadith?.execute) {
      tools.fetch_hadith = tool({
        description: "Fetch a specific hadith by ID",
        parameters: z.object({
          id: z.string().describe("Hadith ID"),
        }),
        execute: async ({ id }) => {
          const result = await rawFetchHadith.execute({ id });
          const text = extractText(result);
          try {
            return JSON.parse(text);
          } catch {
            return { hadiths: [], raw: text };
          }
        },
      });
    }
  } catch (e: unknown) {
    console.error("Hadith MCP error:", e instanceof Error ? e.message : e);
  }

  return tools;
}

function extractText(result: unknown): string {
  if (!result || typeof result !== "object") return String(result);
  const r = result as Record<string, unknown>;
  if (r.type === "content" && Array.isArray(r.value)) {
    for (const part of r.value) {
      if (part && typeof part === "object" && (part as any).type === "text") {
        return (part as any).text || "";
      }
    }
  }
  return JSON.stringify(result);
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
  });

  result.pipeDataStreamToResponse(res, {
    getErrorMessage: (error: unknown) => {
      console.error("Stream error:", error);
      return error instanceof Error ? error.message : String(error);
    },
  });
}
