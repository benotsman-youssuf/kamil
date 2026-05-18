import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  console.warn("OPENROUTER_API_KEY is not set. AI chat will fail until configured.");
}

export const openrouter = createOpenRouter({
  apiKey: apiKey ?? "",
});

export const DEFAULT_OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL || "openai/gpt-4.1-mini";
