import http from 'http';
import { Readable } from 'stream';

const PORT = process.env.API_PORT || 3001;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

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
        const { createOpenRouter } = await import('@openrouter/ai-sdk-provider');
        const { streamText } = await import('ai');
        const { createMCPClient } = await import('@ai-sdk/mcp');
        const { z } = await import('zod');

        const openrouter = createOpenRouter({
          apiKey: OPENROUTER_API_KEY,
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
          messages: parsedBody.messages || [],
          tools,
          maxSteps: 5,
        });

        const response = result.toDataStreamResponse();
        res.writeHead(response.status || 200, {
          ...Object.fromEntries(response.headers.entries()),
          'Access-Control-Allow-Origin': '*',
        });

        const reader = response.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) { res.end(); break; }
          res.write(Buffer.from(value));
        }
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
  console.log(`OPENROUTER_API_KEY: ${OPENROUTER_API_KEY ? 'set' : 'not set'}`);
});
