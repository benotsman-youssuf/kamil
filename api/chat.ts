import { streamText, convertToCoreMessages } from "ai";
import { createMCPClient } from "@ai-sdk/mcp";
import { openrouter, DEFAULT_OPENROUTER_MODEL } from "../src/lib/ai/openrouter.js";
import type { IncomingMessage, ServerResponse } from "node:http";

export const maxDuration = 60;

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

  let tools: Record<string, unknown> = {};

  try {
    const quranMcp = await createMCPClient({
      transport: {
        type: "http",
        url: process.env.QURAN_MCP_URL || "https://mcp.quran.ai",
      },
    });
    const quranTools = await quranMcp.tools();
    for (const [name, tool] of Object.entries(quranTools)) {
      tools[name] = tool;
    }
    setTimeout(() => { quranMcp.close().catch(() => {}); }, 60_000).unref();
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
    const hadithTools = await hadithMcp.tools();
    for (const [name, tool] of Object.entries(hadithTools)) {
      tools[name] = tool;
    }
    setTimeout(() => { hadithMcp.close().catch(() => {}); }, 60_000).unref();
  } catch (e: unknown) {
    console.error("Hadith MCP error:", e instanceof Error ? e.message : e);
  }

  const result = streamText({
    model: openrouter(DEFAULT_OPENROUTER_MODEL),
    system:
      "You are a Quran/Hadith writing assistant. For factual religious content, use tools first and cite retrieved evidence. If no tool data, explicitly say source unavailable.",
    messages: convertToCoreMessages(body.messages || []),
    tools: Object.keys(tools).length > 0 ? (tools as any) : undefined,
  });

  result.pipeDataStreamToResponse(res, {
    getErrorMessage: (error: unknown) => {
      console.error("Stream error:", error);
      return error instanceof Error ? error.message : String(error);
    },
  });
}
