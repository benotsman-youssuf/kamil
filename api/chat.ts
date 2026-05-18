import { streamText, convertToCoreMessages } from "ai";
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

  try {
    const result = streamText({
      model: openrouter(DEFAULT_OPENROUTER_MODEL),
      system: "You are a helpful assistant.",
      messages: convertToCoreMessages(body.messages || []),
    });

    result.pipeDataStreamToResponse(res, {
      getErrorMessage: (error: unknown) => {
        console.error("Stream error:", error);
        return error instanceof Error ? error.message : String(error);
      },
    });
  } catch (e: unknown) {
    console.error("Init error:", e);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }));
  }
}
