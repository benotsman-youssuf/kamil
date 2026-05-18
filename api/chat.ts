import { streamText, convertToCoreMessages, tool } from "ai";
import { openrouter, DEFAULT_OPENROUTER_MODEL } from "../src/lib/ai/openrouter.js";
import type { IncomingMessage, ServerResponse } from "node:http";
import { z } from "zod";

export const maxDuration = 60;

interface MCPConn {
  url: string;
  sessionId: string;
}

async function mcpInit(url: string): Promise<MCPConn> {
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "init",
      method: "initialize",
      params: { protocolVersion: "2025-11-25", capabilities: {}, clientInfo: { name: "kamil", version: "1.0" } },
    }),
  });
  const sessionId = resp.headers.get("mcp-session-id") || "";
  await resp.text(); // drain SSE body
  return { url, sessionId };
}

async function mcpCall(conn: MCPConn, method: string, params: Record<string, unknown>): Promise<any> {
  const resp = await fetch(conn.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      "mcp-session-id": conn.sessionId,
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: "call", method, params }),
  });
  const text = await resp.text();
  for (const line of text.split("\n")) {
    const s = line.trim();
    if (s.startsWith("data: ")) {
      try {
        const parsed = JSON.parse(s.slice(6));
        if (parsed.result) return parsed.result;
        if (parsed.error) throw new Error(parsed.error.message || "MCP error");
      } catch {}
    }
  }
  try {
    const parsed = JSON.parse(text);
    if (parsed.result) return parsed.result;
    if (parsed.error) throw new Error(parsed.error.message || "MCP error");
    return parsed;
  } catch {}
  throw new Error(`MCP ${method} failed: ${text.slice(0, 200)}`);
}

function extractResults(mcpResult: any): any {
  if (mcpResult.structuredContent) return mcpResult.structuredContent;
  if (Array.isArray(mcpResult.content) && mcpResult.content.length > 0) {
    const text = mcpResult.content[0].text || "";
    try {
      return JSON.parse(text);
    } catch {}
  }
  return mcpResult;
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

  const tools: Record<string, ReturnType<typeof tool>> = {};

  try {
    const quran = await mcpInit(process.env.QURAN_MCP_URL || "https://mcp.quran.ai");

    tools.search_quran = tool({
      description: "Search the Quran for verses matching a query",
      parameters: z.object({ query: z.string() }),
      execute: async (args) => {
        const r = await mcpCall(quran, "tools/call", { name: "search_quran", arguments: args });
        return extractResults(r);
      },
    });

    tools.fetch_quran = tool({
      description: "Fetch specific Quran verses by ayah keys (e.g. '2:255' or ['2:255','1:1'])",
      parameters: z.object({ ayahs: z.union([z.string(), z.array(z.string())]) }),
      execute: async (args) => {
        const r = await mcpCall(quran, "tools/call", { name: "fetch_quran", arguments: args });
        return extractResults(r);
      },
    });

    tools.fetch_grounding_rules = tool({
      description: "Fetch grounding rules for Quran citation",
      parameters: z.object({}),
      execute: async () => {
        const r = await mcpCall(quran, "tools/call", { name: "fetch_grounding_rules", arguments: {} });
        return extractResults(r);
      },
    });
  } catch (e: unknown) {
    console.error("Quran MCP:", e instanceof Error ? e.message : e);
  }

  try {
    const hadith = await mcpInit(process.env.HADITH_MCP_URL || "https://hadith-mcp.org");

    tools.search_hadith = tool({
      description: "Search hadith collections for a query",
      parameters: z.object({ query: z.string(), limit: z.number().optional(), collection: z.string().optional(), mode: z.string().optional() }),
      execute: async (args) => {
        const r = await mcpCall(hadith, "tools/call", { name: "search_hadith", arguments: args });
        return extractResults(r);
      },
    });

    tools.fetch_hadith = tool({
      description: "Fetch a specific hadith by ID, collection+number",
      parameters: z.object({ hadith_id: z.number().optional(), collection: z.string().optional(), hadith_number: z.union([z.number(), z.string()]).optional() }),
      execute: async (args) => {
        const r = await mcpCall(hadith, "tools/call", { name: "fetch_hadith", arguments: args });
        return extractResults(r);
      },
    });
  } catch (e: unknown) {
    console.error("Hadith MCP:", e instanceof Error ? e.message : e);
  }

  const result = streamText({
    model: openrouter(DEFAULT_OPENROUTER_MODEL),
    system: "You are a Quran/Hadith writing assistant. For factual religious content, use tools first and cite retrieved evidence. If no tool data, explicitly say source unavailable.",
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
