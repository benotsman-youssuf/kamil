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

  const quranMcp = await createMCPClient({
    transport: {
      type: "http",
      url: process.env.QURAN_MCP_URL || "https://mcp.quran.ai",
    },
  });

  const hadithMcp = await createMCPClient({
    transport: {
      type: "http",
      url: process.env.HADITH_MCP_URL || "https://hadith-mcp.org",
    },
  });

  const [quranTools, hadithTools] = await Promise.all([
    quranMcp.tools(),
    hadithMcp.tools(),
  ]);

  const result = streamText({
    model: openrouter(DEFAULT_OPENROUTER_MODEL),
    system:
      "You are a Quran/Hadith writing assistant. For factual religious content, use tools first and cite retrieved evidence. If no tool data, explicitly say source unavailable.",
    messages: convertToCoreMessages(body.messages || []),
    tools: { ...quranTools, ...hadithTools },
    onFinish: async () => {
      await Promise.all([quranMcp.close(), hadithMcp.close()]);
    },
  });

  result.pipeDataStreamToResponse(res);
}
