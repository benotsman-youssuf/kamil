# Kamil × Quran Foundation Hackathon (Provision Launch)

_Date analyzed: April 27, 2026_

## 1) What the hackathon **requires** (non-negotiable)

From the official hackathon page and terms:

1. Use **at least one Content API** from Quran Foundation (or Quran MCP).
2. Use **at least one User API** from Quran Foundation.
3. Submit by **May 20, 2026** (early Dhu al-Hijjah 1447).
4. Submission package must include:
   - project title,
   - team members,
   - short + detailed description,
   - live demo link,
   - GitHub repo (if available),
   - 2–3 minute demo video,
   - explanation of API usage.

## 2) Judging priorities (where to optimize)

Scoring is out of 100:
- **30** Impact on Quran Engagement
- **20** Product Quality & UX
- **20** Technical Execution
- **15** Innovation & Creativity
- **15** Effective Use of APIs

For Kamil, this means: protect your strong Arabic-first writing UX, then add meaningful Quran engagement loops and deep API usage evidence.

## 3) Your app identity today (what to preserve)

Current Kamil strengths from this codebase:
- Arabic writing/editor-first experience with inline ayah insertion.
- Local persistence via **IndexedDB (Dexie)**.
- Offline-style workflow and export features.

Keep this identity: **"local-first Quran writing studio"**.

## 4) Gap analysis against hackathon requirements

### Already aligned
- Quran-centered use case (writing with ayat).
- Good UX foundation (editor + quick insertion + exports).
- Technical baseline is solid.

### Missing / risky for eligibility
- Current ayah source is loaded from `VITE_DATA_URL`; hackathon requires Quran Foundation Content API (or Quran MCP) usage.
- No explicit Quran Foundation User API integration (bookmarks, collections, streak, goals, etc.).

Without User API usage, project can fail eligibility screening.

## 5) What Kamil needs to add (while staying local-first)

## A. Required integration architecture (recommended)

Implement a **dual-layer model**:
- **Local-first layer (default):** everything works from IndexedDB immediately.
- **Connected sync layer (optional):** if user signs in, sync selected entities with Quran Foundation User APIs.

This keeps Kamil local-first while satisfying technical requirements.

## B. Minimum feature set to be eligible + competitive

### 1) Content API / MCP integration (required)
Pick at least one, but preferably 2+ for stronger API score:
- Verse search/retrieval from Quran Foundation Quran APIs or Quran MCP.
- Optional: tafsir or translation fetch for inserted ayah.

Kamil UX fit:
- `/` command continues to work.
- If online: query Quran Foundation API/MCP for suggestions.
- If offline: fallback to local cached data.

### 2) User API integration (required)
Pick at least one user capability, ideally 2:
- **Bookmarks** for ayat used in notes.
- **Collections** mapped to notebook/page folders.
- Optional: **Streak tracking** for daily writing/reflection habit.

Kamil UX fit:
- "Save to Quran account" toggle per item.
- Local object is created first, then background sync when authenticated.

## C. Product features that maximize judging points

### Impact (30 pts)
Add habit loops:
- Daily reflection prompt from selected surah/goal.
- "Resume where you left" writing workflow.

### UX (20 pts)
- Keep Arabic-first keyboard flow.
- Show clear local/offline/synced badges.
- One-click export/share of reflection notes.

### Technical execution (20 pts)
- Conflict resolution strategy (local vs remote updates).
- Retry queue for failed sync operations.
- Deterministic IDs and timestamps.

### Innovation (15 pts)
- "Local-first spiritual journaling": privacy-first + optional cloud sync.
- Smart context insertion (ayah + quick tafsir + translation card).

### API use (15 pts)
- Demonstrate multiple endpoints and meaningful usage, not just one demo call.
- In demo video, explicitly show where each API powers user value.

## 6) Suggested implementation plan (fast path)

### Phase 1 (Eligibility lock)
1. Integrate one Content API flow for ayah lookup.
2. Integrate one User API flow (bookmark OR collection).
3. Add API usage logging/telemetry panel for demo evidence.

### Phase 2 (Score boost)
4. Add streak/goals or reflections posting.
5. Add offline cache + background sync queue.
6. Add polished "Sync Status" UI.

### Phase 3 (Submission readiness)
7. Record 2–3 min demo video script:
   - local write flow,
   - Quran API-powered insertion,
   - user sync (bookmark/collection),
   - offline fallback.
8. Prepare concise architecture diagram and API mapping table.

## 7) Recommended submission positioning

Use this positioning line in your submission:

> **Kamil is a local-first Arabic Quran writing studio that protects focus and privacy offline, while optionally syncing Quran bookmarks, collections, and engagement data through Quran Foundation APIs.**

This keeps your identity intact while clearly matching eligibility.

## 8) Risks to avoid

- Building only content retrieval and skipping User APIs (disqualification risk).
- Building only "checkbox" API integration with no real UX impact (low API score).
- Making the app cloud-dependent and losing local-first identity.

## 9) Final checklist before submission

- [ ] Uses Quran Foundation Content API or Quran MCP in real feature flow.
- [ ] Uses Quran Foundation User API in real feature flow.
- [ ] Works local-first when offline.
- [ ] Clear explanation of where APIs are used.
- [ ] Demo video shows both user value and technical integration.
- [ ] Submission includes all required artifacts.
