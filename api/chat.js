import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';
import { createMCPClient } from '@ai-sdk/mcp';
import { z } from 'zod';

export const maxDuration = 60;

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function createMCPTools(url) {
  try {
    const client = await createMCPClient({
      transport: { type: 'http', url },
    });
    const defs = await client.listTools();
    const schemas = {};
    for (const t of defs.tools) {
      schemas[t.name] = { inputSchema: t.inputSchema };
    }
    const tools = client.toolsFromDefinitions(defs, { schemas });

    // AI SDK v4 expects `parameters` as a Zod schema (not raw JSON schema).
    for (const [, t] of Object.entries(tools)) {
      if (t.inputSchema && !t.parameters) {
        const jsonSchema = t.inputSchema;
        const props = jsonSchema?.properties;
        if (props && Object.keys(props).length > 0) {
          const shape = {};
          for (const key of Object.keys(props)) {
            shape[key] = z.any().optional();
          }
          t.parameters = z.object(shape);
        } else {
          t.parameters = z.object({});
        }
        delete t.inputSchema;
      }
    }
    return tools;
  } catch (e) {
    console.error(`MCP init failed for ${url}:`, e.message);
    return {};
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  let messages;
  if (req.body) {
    messages = req.body.messages;
  } else {
    const body = [];
    for await (const chunk of req) body.push(chunk);
    messages = JSON.parse(Buffer.concat(body).toString()).messages;
  }

  const [quranTools, hadithTools] = await Promise.all([
    createMCPTools(process.env.QURAN_MCP_URL || 'https://mcp.quran.ai'),
    createMCPTools(process.env.HADITH_MCP_URL || 'https://hadith-mcp.org'),
  ]);

  const tools = { ...quranTools, ...hadithTools };

  const result = streamText({
    model: openrouter(process.env.OPENROUTER_MODEL || 'openrouter/owl-alpha'),
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
    tools,
    maxSteps: 5,
    onError: (err) => console.error('Stream error:', err),
  });

  result.pipeDataStreamToResponse(res);
}
