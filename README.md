# كامل (Kamil) — Arabic Writing & Quran Study Platform

كامل (Kamil) is a modern Arabic-first writing platform that integrates a rich text editor with Quranic tools, AI-powered research, and a full hadith library. Built for writers, students, and researchers of Islamic knowledge.

## Features

- **Rich Text Editor** (PlateJS) — Full Arabic RTL support, markdown shortcuts, `/` commands, media embedding, code blocks, tables, math, diagrams (Mermaid), and more.
- **Quran Integration** — Look up, display, and insert verses via AI chat or the `/` command panel. Tafsirs, translations, audio, and multi-script rendering (Uthmani, Imlaei, Indopak).
- **Hadith Library** — Browse and insert hadith from 10 major collections (Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah, Malik, Ahmad, Darimi, Riyad al-Salihin) via the Islamic.app API.
- **AI Chat** — Powered by Google Gemini + MCP tools for authenticated Quran/hadith retrieval. Ask about verses, hadith, or topics — the AI fetches exclusively from MCP tool output, not memory.
- **Offline-First** — RxDB v17 with Dexie storage, automatic sync to Supabase via custom HTTP replication push/pull handlers.
- **Discover Feed** — Public pages from the community with like/fork functionality.
- **Statistics** — Personal dashboard with reading streaks, 365-day activity heatmap, writing stats, notes chart, goals, and combined activity feed from Quran Foundation API.
- **User Profile** — Synced from Quran Foundation API (name, avatar, verified badge, joining year).
- **Authentication** — OAuth2 via Quran Foundation with PKCE flow + service-role-backed Supabase API.
- **Responsive RTL** — Full Arabic right-to-left layout with dark mode support.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4 |
| Editor | PlateJS (built on Slate) |
| Offline DB | RxDB 17 + Dexie |
| Server/API | Vercel serverless functions (Node) |
| Database | Supabase (PostgreSQL) |
| Auth | Quran Foundation OAuth2 (PKCE) |
| AI | Google Gemini 3.1 Flash Lite via AI SDK + MCP |
| Charts | Recharts |
| Deployment | Vercel |

## Getting Started

```bash
git clone https://github.com/benotsman-youssuf/kamil.git
cd kamil
npm install
npm run dev        # Frontend dev server
npm run dev:server  # Auth proxy (local development)
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```
VITE_CLIENT_ID=<Quran Foundation OAuth2 client ID>
VITE_API_BASE=<Quran Foundation API base URL>
SUPABASE_URL=<Supabase project URL>
SUPABASE_SERVICE_ROLE_KEY=<Supabase service role key>
GOOGLE_GENERATIVE_AI_API_KEY=<Google AI API key for Gemini>
QURAN_MCP_URL=<MCP server URL for Quran data>
HADITH_MCP_URL=<MCP server URL for hadith data>
```

### Build for Production

```bash
npm run build
```

## Project Structure

```
kamil/
├── api/               # Vercel serverless functions (chat, pages, sync, user, verse, discover)
├── src/
│   ├── components/    # React components (editor, UI, chat, layout)
│   ├── pages/         # Route pages (Home, ReadPage, Discover, Stats, Settings)
│   ├── lib/           # Core libraries (RxDB, QF API, hadith API, auth, utils)
│   ├── hooks/         # Custom React hooks
│   ├── constants/     # Constants (surahs, editor config, collection names)
│   └── layout/        # App layout (sidebar, shared right panel)
├── server/            # Auth proxy (local development)
├── supabase/          # Migrations and config
├── public/            # Static assets
└── vite.config.ts     # Vite build configuration
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run dev:server` | Start auth proxy for local development |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
