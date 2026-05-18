import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { convertToModelMessages, streamText } from 'ai';
import { createMCPClient } from '@ai-sdk/mcp';

export const maxDuration = 60;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

async function getMCPTools(url) {
  try {
    const client = await createMCPClient({
      transport: { type: 'http', url },
    });
    const tools = await client.tools();
    return { tools, client };
  } catch (e) {
    console.error(`MCP failed for ${url}:`, e.message);
    return { tools: {}, client: null };
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { messages } = req.body;

    const [quranResult, hadithResult] = await Promise.all([
      getMCPTools(process.env.QURAN_MCP_URL || 'https://mcp.quran.ai'),
      getMCPTools(process.env.HADITH_MCP_URL || 'https://hadith-mcp.org'),
    ]);

    const tools = { ...quranResult.tools, ...hadithResult.tools };
    const mcpClients = [quranResult.client, hadithResult.client].filter(Boolean);
    console.log('Tools loaded:', Object.keys(tools));

    const result = streamText({
      model: google('gemini-3.1-flash-lite'),
      system: `You are a research assistant for Islamic scholars and writers using the Kamil editor.
Your job: find Quran verses and hadith relevant to what the scholar is writing about.
RULES:
- Always fetch verses and hadith via tools — never quote from memory.
- Always return the Arabic text alongside any translation.
- Always cite exact reference: Surah X, Ayah Y — or Collection, Hadith N.
- Keep responses concise and scholarly.
- Never issue religious rulings or fatwa.
- When you find a verse or hadith append exactly:
  [INSERT_VERSE: surah=X ayah=Y] or [INSERT_HADITH: collection=X number=Y]`,
      messages: await convertToModelMessages(messages),
      tools: Object.keys(tools).length > 0 ? tools : undefined,
      stopWhen: (options) => options.stepCount >= 5,
      providerOptions: {
        google: {
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ],
        },
      },
      onError: (error) => {
        console.error('streamText error:', error.error);
      },
      onFinish: async () => {
        for (const client of mcpClients) {
          try { await client.close(); } catch {}
        }
      },
    });

    result.pipeUIMessageStreamToResponse(res);

  } catch (e) {
    console.error('Handler error:', e);
    if (!res.headersSent) res.status(500).json({ error: e.message });
  }
}