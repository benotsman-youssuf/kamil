# AI Chat Integration Plan (OpenRouter + AI SDK + MCP Quran/Hadith)

## 1) External docs analysis

### AI SDK (Vercel)
- AI SDK gives a provider-agnostic interface for chat streaming (`streamText`) and UI helpers (`useChat`).
- It supports multi-step tools, which is essential for MCP-style retrieval workflows.
- It is TypeScript-first and fits the current React/Vite codebase.

### OpenRouter + Vercel AI SDK
- OpenRouter officially supports AI SDK via `@openrouter/ai-sdk-provider`.
- Recommended setup is creating an OpenRouter provider with `createOpenRouter({ apiKey })` and using AI SDK calls with `openrouter(modelName)`.
- This gives model routing flexibility while keeping a stable SDK surface in app code.

### hadith-mcp.org
- Exposes retrieval tools for hadith grounding, including:
  - `search_hadith`
  - `fetch_hadith`
  - `list_collections`
  - `fetch_grounding_rules`
- Includes collection/book/hadith metadata and Arabic/English content.
- Good fit for citation-first retrieval instead of free-form generation.

### mcp.quran.ai
- Provides canonical Quran retrieval (text, translations, tafsir) via MCP.
- Supports semantic search and rich metadata across ayah data.
- Good fit for exact verse insertion and evidence-grounded answers.

## 2) Current codebase analysis

## Stack and architecture
- Frontend app: React + Vite + TypeScript. (`package.json`)
- Rich editor: PlateJS already deeply integrated. (`src/components/editor/*`, `src/components/ui/editor.tsx`)
- Domain integrations already exist:
  - Quran APIs and auth flow in `src/lib/qf/api.ts`.
  - Hadith APIs in `src/lib/hadith/api.ts`.
- UI has side panels and insertion affordances for Quran/Hadith:
  - Verse panel with rich details and `insert-hadith` event emission path. (`src/components/VersePanel.tsx`)
  - Hadith details panel. (`src/components/HadithPanel.tsx`)

## Existing insertion pattern (important for AI feature)
- The app already inserts structured religious content through custom editor flows/events.
- This means AI chat can re-use an existing “insert into editor” interaction model instead of inventing one.

## Gap analysis for requested feature
- No AI chat runtime yet (no dedicated `/api/chat`, no AI SDK hooks currently wired for chat UI).
- No OpenRouter provider wiring yet.
- No MCP client bridge yet for Quran/Hadith retrieval during chat turns.

## 3) Target integration design

## Objectives
1. Add AI chat based on AI SDK components.
2. Use OpenRouter as model provider.
3. Use MCP-backed retrieval for Quran/Hadith instead of ungrounded answers.
4. Allow one-click insertion of verse/hadith into the editor as native nodes.

## Proposed high-level flow
1. User asks in Chat Panel.
2. AI SDK `useChat` sends message to backend chat endpoint.
3. Backend calls `streamText` with OpenRouter model.
4. Model can call two tools:
   - `search_quran_mcp`
   - `search_hadith_mcp`
5. Tool handlers query MCP servers (`https://mcp.quran.ai`, `https://hadith-mcp.org`) and return normalized evidence objects.
6. Assistant answer renders with citations + action chips:
   - Insert verse
   - Insert hadith
7. Clicking insert emits app event that editor consumes to insert structured node.

## Data contracts (normalized)

### VerseEvidence
- `source: "quran_mcp"`
- `verseKey`
- `arabicText`
- `translation?`
- `surahName?`
- `ayahNumber?`
- `citation` (server/tool/ref)

### HadithEvidence
- `source: "hadith_mcp"`
- `collection`
- `bookNumber?`
- `hadithNumber`
- `arabicText`
- `englishText?`
- `grades?`
- `citation`

These contracts should be the only payload used by UI insertion actions.

## 4) Implementation plan (phased)

## Phase 0 — foundation
- Add dependencies:
  - `ai`
  - `@openrouter/ai-sdk-provider`
  - MCP client transport package chosen for browser/server boundary.
- Add env vars:
  - `OPENROUTER_API_KEY`
  - `OPENROUTER_MODEL` (default fallback)
  - `QURAN_MCP_URL=https://mcp.quran.ai`
  - `HADITH_MCP_URL=https://hadith-mcp.org`

## Phase 1 — chat backend service
- Create server endpoint (or edge function) to host AI SDK `streamText`.
- Initialize OpenRouter provider with strict model allowlist.
- Register tool definitions (zod schemas) for Quran/Hadith retrieval.
- Implement tool handlers that call MCP endpoints and map responses to normalized evidence contracts.
- Add safety behavior:
  - if tool unavailable, return explicit “source unavailable” message (no fabricated quote).

## Phase 2 — chat frontend
- Add `ChatPanel` component with AI SDK `useChat`.
- Render markdown-like response plus a compact “Evidence Cards” section.
- Each evidence card has:
  - preview text
  - source metadata
  - Insert button
- Insert button dispatches editor events similar to existing verse/hadith insertion flow.

## Phase 3 — editor insertion integration
- Reuse or extend current insert event handlers for:
  - Verse node insertion
  - Hadith node insertion
- Ensure payload alignment with node schemas used by existing `verse-kit` and `hadith-kit` plugin stack.
- Add duplicate-prevention UX (optional toggle “insert as quote block / inline”).

## Phase 4 — grounding, QA, and observability
- Add “grounding required” system instruction in chat backend:
  - religious factual answers must cite MCP evidence.
- Log tool calls (non-PII) for debugging.
- QA matrix:
  - Arabic query, English query
  - direct reference (`2:255`), thematic query
  - insert verse/hadith success paths
  - MCP timeout fallback

## 5) Suggested file-level changes

## New files
- `src/lib/ai/openrouter.ts` — OpenRouter provider + model config.
- `src/lib/ai/mcp.ts` — MCP client + typed wrappers.
- `src/lib/ai/tools.ts` — AI SDK tool declarations and adapters.
- `src/components/chat/ChatPanel.tsx` — chat UI using `useChat`.
- `src/types/ai-evidence.ts` — normalized contracts.

## Existing files likely to update
- `src/components/editor/EditorLayout.tsx` — mount ChatPanel in layout.
- `src/components/editor/EditorContent.tsx` — wire insert events if needed.
- `src/components/SharedRightPanel.tsx` — optional tab for AI chat.
- `src/components/editor/plugins/hadith-kit.tsx` and `verse-kit.tsx` — ensure insert command compatibility.

## 6) Risks and mitigations
- MCP response shape drift
  - Mitigation: adapter layer + runtime schema validation.
- Latency from tool calls
  - Mitigation: stream partial assistant response and render evidence when ready.
- Hallucinated citations
  - Mitigation: enforce tool-first policy in system prompt and refuse unsupported claims.

## 7) Delivery order (recommended)
1. Backend AI SDK + OpenRouter + mock tool responses.
2. Real MCP tool integration.
3. Chat UI streaming.
4. Insert actions into editor.
5. QA and polishing.

## 8) Acceptance criteria
- User can chat with an OpenRouter model from inside app UI.
- Quran/Hadith factual answers are grounded in MCP tool data.
- User can click Insert on returned verse/hadith and content appears correctly in editor.
- App gracefully handles MCP downtime without fabricating religious text.
