import { streamText, convertToCoreMessages } from "ai";
import { openrouter, DEFAULT_OPENROUTER_MODEL } from "../src/lib/ai/openrouter.js";
import { hadithSearchTool, quranSearchTool } from "../src/lib/ai/tools.js";

export const maxDuration = 60;

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body = await req.json();

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

  return result.toDataStreamResponse();
}
