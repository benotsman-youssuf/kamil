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
      system: `You are a precision research assistant for Islamic scholars. Your primary focus is to search and extract data from the Quran and Hadith tools.
RULES:
- Limit your commentary to a maximum of 4 lines. Be extremely concise.
- Rely strictly on tool outputs; extract and present data directly from MCP results. Never quote from memory.
- Use authentic Hadith science terminology (e.g., Sahih, Da'if, Matn, Isnad, Takhrij).
- Respond exclusively in the language of the user's query (English or Arabic). Do not mix languages in your response, except when providing the required Arabic quote.
- Always provide the original Arabic text alongside the translation.
- Cite exact references: Surah X, Ayah Y or Collection, Hadith N.
- Never issue religious rulings (fatwa).
- Append exactly when citing:
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