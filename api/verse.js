import { createMCPClient } from '@ai-sdk/mcp';

export const maxDuration = 30;

export default async function handler(req, res) {
  const { surah, ayah } = req.query;
  if (!surah || !ayah) return res.status(400).json({ error: 'surah and ayah required' });

  let client;
  try {
    client = await createMCPClient({
      transport: { type: 'http', url: process.env.QURAN_MCP_URL || 'https://mcp.quran.ai' },
    });
    const tools = await client.tools();
    const verseKey = `${surah}:${ayah}`;
    const result = await tools.fetch_quran.execute({ ayahs: verseKey }, { messages: [], toolCallId: `verse-${surah}-${ayah}` });

    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    try { await client?.close(); } catch {}
  }
}
