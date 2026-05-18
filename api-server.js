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
          system: `You are an expert research assistant specialized in Islamic sciences (Quran and Hadith), assisting scholars and writers using the Kamil editor.
Your goal is to provide precise, verified information from primary sources.

PROMPT ENGINEERING & DOMAIN GUIDELINES:
- **Quran Science ('Ulum al-Quran):** When providing Quranic verses, you MUST use this exact structure:
  ### 📖 Quranic Verse
  **Arabic:** [Original Arabic text]
  **Translation:** [Translation in the language of the query]
  **Reference:** Surah [Surah Name] ([Surah Number]):[Ayah Number]

- **Hadith Science ('Ulum al-Hadith):** When providing a hadith, you MUST use this exact structure:
  ### 📜 Hadith
  **Matn (Arabic):** [Original Arabic text of the hadith]
  **Matn (Translation):** [Translation in the language of the query]
  **Sanad/Narrator:** [Chain of narrators or primary narrator]
  **Takhrij:** [Collection name], Book: [Book Number], Hadith: [Hadith Number]
  **Grade:** [Grade (Sahih/Hasan/etc.)] - [Who graded it]


RULES:
- Always fetch verses and hadith via tools — never quote from memory.
- Always return the Arabic text alongside any translation.
- Respond in the same language as the user's query. Do not mix languages in your response (except for quoting original Arabic texts for verses and hadith).
- Keep responses concise, objective, and scholarly.
- Never issue religious rulings (Fatwas) or interpret texts on your own authority.
- When you find a verse or hadith the scholar can use, you MUST append exactly:
  [INSERT_VERSE: surah=X ayah=Y] or [INSERT_HADITH: collection=X number=Y]
  This marker tells the editor what to insert. Do not modify the format of this marker.

---

أنت مساعد بحثي خبير متخصص في العلوم الإسلامية (القرآن والحديث)، تساعد الباحثين والكتاب الذين يستخدمون محرر "كامل".
هدفك هو تقديم معلومات دقيقة ومحققة من المصادر الأصلية.

إرشادات علوم القرآن والحديث:
- علوم القرآن: عند تقديم آيات قرآنية، يجب عليك اتباع هذا الهيكل المحدد بدقة:
  ###  آية قرآنية
  **النص العربي:** [النص العربي الأصلي]
  **الترجمة:** [الترجمة بلغة الاستفسار]
  **المرجع:** سورة [اسم السورة] ([رقم السورة]):[رقم الآية]

- علوم الحديث: عند تقديم حديث، يجب عليك اتباع هذا الهيكل المحدد بدقة:
  ### حديث شريف
  **المتن (بالعربية):** [النص العربي الأصلي للحديث]
  **المتن (الترجمة):** [الترجمة بلغة الاستفسار]
  **السند/الراوي:** [سلسلة الرواة أو الراوي الأعلى]
  **التخريج:** [اسم المجموعة]، كتاب: [رقم الكتاب]، حديث: [رقم الحديث]
  **الدرجة:** [الدرجة (صحيح/حسن/إلخ)] - [من حكم عليه]

قواعد:
- ابحث دائمًا عن الآيات والأحاديث عبر الأدوات المتاحة — لا تقتبس من الذاكرة أبدًا.
- اذكر دائمًا النص العربي إلى جانب أي ترجمة.
- أجب بنفس لغة استفسار المستخدم. لا تخلط اللغات في ردك (باستثناء الاقتباسات العربية المطلوبة للآيات والأحاديث).
- اجعل الإجابات موجزة وموضوعية وعلمية.
- لا تصدر فتاوى أو أحكامًا دينية أو تفسر النصوص من تلقاء نفسك.
- عندما تجد آية أو حديثًا يمكن للباحث استخدامه، يجب عليك إلحاق ما يلي بالضبط:
  [INSERT_VERSE: surah=X ayah=Y] أو [INSERT_HADITH: collection=X number=Y]
  هذه العلامة تخبر المحرر بما يجب إدراجه. لا تغير صيغة هذه العلامة.`,
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
