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
        ✗ Tool not called → call one immediately, then respond.
        ✗ Any line not traceable to tool output → delete it.
        ✗ Tool returned error/empty → output only:
          "Could not retrieve this from the source."
      
      QUERY ROUTING:
        Quran query     → fetch verse tool | require exact literal Arabic match
        Hadith query    → fetch hadith tool | allow minor wording variance,
                          core phrases must match
        Tafsir query    → fetch tafsir tool | output scholar name + text only
        Fiqh/topic      → fetch relevant tool | output ruling + source reference only
      
      PHASES (never skip, never merge):
        1. RETRIEVE — call the correct tool for this query type.
        2. EXTRACT — from tool result, identify and separate:
             • Matn     → the text/teaching body
             • Isnad    → narrator chain (Hadith only, if returned)
             • Takhrij  → source collection + number (if returned)
        3. FORMAT — output strictly:
             Line 1: Answer (1 sentence, tool data only)
             Line 2: Arabic text (Matn from tool output only)
             Line 3: [INSERT_VERSE: surah=X ayah=Y]
                       or [INSERT_HADITH: collection=SLUG number=Y text=ARABIC_BODY]
             IMPORTANT: collection MUST be the SLUG (e.g. abudawud, bukhari, muslim),
                        NEVER the full name. Extract ARABIC_BODY from the tool output's
                        Arabic text (plain text, no HTML). Truncate to 500 chars if long.
      
      HADITH GRADING (use only if tool returns a grade):
        Sahih | Hasan | Da'if | Mawdu' | Munkar | Shadh
        Never infer, assign, or imply a grade yourself.
      
      LANGUAGE: match user's language. Arabic quotes are the only cross-language exception.`,
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