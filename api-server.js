import http from 'http';

const PORT = process.env.API_PORT || 3001;
const GOOGLE_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  
  console.log(`${req.method} ${url.pathname}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405);
    res.end('Method not allowed');
    return;
  }

  let body = [];
  req.on('data', chunk => body.push(chunk));
  req.on('end', async () => {
    try {
      const bodyStr = Buffer.concat(body).toString();
      const parsedBody = bodyStr ? JSON.parse(bodyStr) : {};

      if (url.pathname === '/api/chat') {
        const { createGoogleGenerativeAI } = await import('@ai-sdk/google');
        const { convertToModelMessages, streamText } = await import('ai');
        const { createMCPClient } = await import('@ai-sdk/mcp');

        const google = createGoogleGenerativeAI({
          apiKey: GOOGLE_API_KEY,
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

        const [quranResult, hadithResult] = await Promise.all([
          getMCPTools(process.env.QURAN_MCP_URL || 'https://mcp.quran.ai'),
          getMCPTools(process.env.HADITH_MCP_URL || 'https://hadith-mcp.org'),
        ]);

        const tools = { ...quranResult.tools, ...hadithResult.tools };
        const mcpClients = [quranResult.client, hadithResult.client].filter(Boolean);

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
- When you find a verse or hadith the scholar can use, append exactly:
  [INSERT_VERSE: surah=X ayah=Y] or [INSERT_HADITH: collection=X number=Y]
  This marker tells the editor what to insert.`,
          messages: await convertToModelMessages(parsedBody.messages || []),
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
      } else if (url.pathname === '/api/verse') {
        const surah = url.searchParams.get('surah');
        const ayah = url.searchParams.get('ayah');

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(JSON.stringify({ surah, ayah, message: 'Verse endpoint' }));
      } else {
        res.writeHead(404);
        res.end('Not found');
      }
    } catch (err) {
      console.error('API error:', err);
      if (!res.headersSent) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: err.message }));
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Local API server running on http://localhost:${PORT}`);
  console.log(`GOOGLE_API_KEY: ${GOOGLE_API_KEY ? 'set' : 'not set'}`);
});
