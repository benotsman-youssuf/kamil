import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';
import { createMCPClient } from '@ai-sdk/mcp';

export const maxDuration = 60;

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function getMCPTools(url) {
  try {
    const client = await createMCPClient({
      transport: { type: 'streamable-http', url },
    });
    return await client.tools();
  } catch (e) {
    console.error(`MCP failed for ${url}:`, e.message);
    return {};
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages } = req.body;

  const [quranTools, hadithTools] = await Promise.all([
    getMCPTools(process.env.QURAN_MCP_URL || 'https://mcp.quran.ai'),
    getMCPTools(process.env.HADITH_MCP_URL || 'https://hadith-mcp.org'),
  ]);

  const result = streamText({
    model: openrouter(process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet'),
    system: `You are a research assistant for Islamic scholars and writers using the Kamil editor.
Your job: find Quran verses and hadith relevant to what the scholar is writing about.

RULES:
- Always fetch verses and hadith via tools — never quote from memory.
- Always return the Arabic text alongside any translation.
- Always cite exact reference: Surah X, Ayah Y — or Collection, Hadith N.
- Keep responses concise and scholarly.
- Never issue religious rulings or fatwa.
- When you find a verse or hadith the scholar can use, append exactly:
  [INSERT_VERSE: surah=X ayah=Y] or [INSERT_HADITH: collection=X number=Y]
  This marker tells the editor what to insert.`,
    messages,
    tools: { ...quranTools, ...hadithTools },
    maxSteps: 5,
    onError: (err) => console.error('Stream error:', err),
  });

  result.toUIMessageStreamResponse(res);
}
