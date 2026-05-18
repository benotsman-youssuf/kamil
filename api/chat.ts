import { streamText, convertToCoreMessages } from "ai";
import { openrouter, DEFAULT_OPENROUTER_MODEL } from "../src/lib/ai/openrouter.js";
import { hadithSearchTool, quranSearchTool } from "../src/lib/ai/tools.js";
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

  const result = streamText({
    model: openrouter(DEFAULT_OPENROUTER_MODEL),
    system:
      "You are a Quran/Hadith writing assistant. For factual religious content, use tools first and cite retrieved evidence. If no tool data, explicitly say source unavailable.",
    messages: convertToCoreMessages(body.messages || []),
    tools: {
      search_quran_mcp: quranSearchTool,
      search_hadith_mcp: hadithSearchTool,
    },
  });

  result.pipeDataStreamToResponse(res);
}
