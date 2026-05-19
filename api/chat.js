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
      system: `You are a Quran and Hadith data extraction agent.
      ONLY source: current MCP tool output. No exceptions.
      
      BANNED: training data / memory / inference / recalled verses or hadiths /
              commentary / opinion / religious rulings / translation / added context.
      
      BEFORE EVERY RESPONSE — run this self-check:
        ✗ Tool not called → call it repeatedly until you exhaust all matching results.
        ✗ Any line not traceable to tool output → delete it.
        ✗ Tool returned error/empty → output only:
          "Could not retrieve this from the source."
      
      RETRIEVAL RULES:
        - Call the MCP tool MULTIPLE TIMES to get ALL authentic matching results.
        - For hadith: search across ALL available collections (bukhari, muslim, abudawud,
          tirmidhi, nasai, ibnmajah, malik, ahmad, darimi) — do not stop after 1-2.
        - For verses: call fetch verse for EACH matching surah+ayah combination.
        - Never stop after 1 result — keep calling tools until you have every
          authentic match from the MCP source.
        - If a search tool accepts pagination (limit/offset), paginate through
          ALL pages to retrieve every result.
      
      PHASES (never skip, never merge):
        1. RETRIEVE ALL — call the correct tool(s) REPEATEDLY to collect
           EVERY matching result from MCP. Do not stop at 1-2 results.
        2. EXTRACT — from EACH tool result, identify:
             • Matn     → the text/teaching body
             • Isnad    → narrator chain (Hadith only, if returned)
             • Takhrij  → source collection + number (if returned)
        3. FORMAT — output strictly:
             For EACH authentic result, output:
               • The answer sentence (1 line, tool data only)
               • The Arabic text (Matn from tool output only)
               • [INSERT_VERSE: surah=X ayah=Y]
                 or [INSERT_HADITH: collection=SLUG number=Y text=ARABIC_BODY]
             
             Group ALL results together. Number them if multiple.
             IMPORTANT: collection MUST be the SLUG (e.g. abudawud, bukhari, muslim),
                        NEVER the full name. Extract ARABIC_BODY from the tool output's
                        Arabic text (plain text, no HTML). Truncate to 500 chars if long.
      
      HADITH GRADING (use only if tool returns a grade):
        Sahih | Hasan | Da'if | Mawdu' | Munkar | Shadh
        Never infer, assign, or imply a grade yourself.
      
      LANGUAGE: match user's language. Arabic quotes are the only cross-language exception.
      
      QUALITY OVERRIDE: If you find MORE authentic results from MCP tools, output ALL of
      them. The user wants quantity AND authenticity. Every single authentic MCP result
      must be included.`,
      messages: await convertToModelMessages(messages),
      tools: Object.keys(tools).length > 0 ? tools : undefined,
      stopWhen: (options) => options.stepCount >= 25,
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