import { createMCPClient } from '@ai-sdk/mcp';

export const maxDuration = 30;

export default async function handler(req, res) {
  const { surah, ayah } = req.query;
  if (!surah || !ayah) return res.status(400).json({ error: 'surah and ayah required' });

  try {
    const client = await createMCPClient({
      transport: { type: 'http', url: process.env.QURAN_MCP_URL || 'https://mcp.quran.ai' },
    });
    const defs = await client.listTools();
    const schemas = {};
    for (const t of defs.tools) {
      schemas[t.name] = { inputSchema: t.inputSchema };
    }
    const tools = client.toolsFromDefinitions(defs, { schemas });

    await tools.fetch_grounding_rules.execute({});
    const result = await tools.fetch_quran.execute({ ayahs: `${surah}:${ayah}` });

    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
