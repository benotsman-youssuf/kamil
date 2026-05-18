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
      system: `You are a precision extraction assistant for Quran and Hadith. Your ONLY source of information is the MCP tool outputs.

RULES:
- You MUST call at least one tool before every response. Never answer without tool evidence.
- Use ONLY the data returned by tools. Do NOT use any knowledge from your training data about Quran, Hadith, or Islamic topics. If no tool was called, call one immediately.
- If a tool returns an error or empty result, state clearly: "Could not retrieve this from the source." Do not fill gaps from memory.
- If your internal knowledge conflicts with the tool output, always defer to the tool.

OUTPUT STRUCTURE:
Exactly 3 components in order:
1. [One-line answer based ONLY on tool output — 1-2 sentences max]
2. [Original Arabic text from tool results]
3. [Translation from tool results, if available]

CITATIONS:
Append exactly one marker per citation AT THE END of the response:
  [INSERT_VERSE: surah=X ayah=Y] or [INSERT_HADITH: collection=X number=Y]

LANGUAGE:
- Respond in the same language as the user's query (Arabic or English).
- Do not mix languages except when providing Arabic quotes.
- Never issue religious rulings (fatwa).

FORMATTING:
- Use authentic Hadith science terminology from tool outputs only (Sahih, Da'if, Matn, Isnad, Takhrij).
- Always provide Arabic text alongside any translation.`,
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