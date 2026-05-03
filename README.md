# Skill Marketplace

Open marketplace for AI Skills. Next.js 14 (App Router) + Supabase + Anthropic API, deployable to Vercel.

## Phase 1 — what works today

- `/` — lists every published Skill (name, description, **Start** button).
- `/skill/:id` — chat window backed by Claude.
- `/upload` — creator form to publish a Skill (name, description, SKILL.md/JSON).
- API: `/api/skills/upload`, `/api/skills/list`, `/api/skills/run`.
- Anthropic key stays server-side. The browser never sees it.

## Setup

```bash
cd skill-marketplace
cp .env.example .env.local        # fill in Supabase + Anthropic keys
npm install
npm run dev
```

Then in Supabase SQL Editor, run [`supabase/schema.sql`](./supabase/schema.sql).

### Required env vars (Phase 1)

| Var | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only — used by API routes |
| `ANTHROPIC_API_KEY` | Server-only — used by `/api/skills/run` |
| `ANTHROPIC_MODEL` | Defaults to `claude-sonnet-4-6` |

## Architecture

```
app/
  page.tsx                  Marketplace home (server component)
  skill/[id]/page.tsx       Skill chat page
  upload/page.tsx           Creator upload form
  develop/page.tsx          Phase 4 stub
  profile/[id]/page.tsx     Phase 3 stub
  team/page.tsx             Phase 5 stub
  api/
    skills/{upload,list,run}/route.ts   Phase 1
    payments/{subscribe,payout}/route.ts Phase 2 stubs
    develop/route.ts                    Phase 4 stub
components/
  ChatWindow.tsx            Client component: chat UI + /api/skills/run
lib/
  supabase.ts               Anon + service-role clients
  anthropic.ts              SDK wrapper + system-prompt builder
  types.ts                  Shared row types
supabase/
  schema.sql                All tables — Phase 1 active, 2-5 scaffolded
```

## Roadmap

| Phase | Adds | Where it plugs in |
| ----- | ---- | ----------------- |
| **1** | Free upload + chat | This release |
| **2** | Stripe subscriptions, share links, 70/30 payouts | `/api/payments/*`, `users.subscription_status`, `skills.price_cents`, `/skill/:id/share` |
| **3** | Ratings, creator profiles, usage analytics | `reviews`, `analytics` tables; `/profile/:id` |
| **4** | `/develop` — Claude generates a SKILL.md from a brief | `/api/develop`, reuses `/api/skills/upload`, `skills.version` |
| **5** | Teams, role-based access | `teams`, `team_members`; `/team` |

## Security notes

- The service-role Supabase key is **only** read inside `app/api/**` route handlers and server components. Never import `supabaseAdmin` from a `"use client"` file.
- The Anthropic key is read inside `lib/anthropic.ts`, which is only ever imported from server code.
- RLS is enabled on `skills` (read where `is_published = true`) and `sessions` (owner-only). Tighten further when Supabase Auth is wired up.
- All API routes validate input with `zod` before touching the database.
"# skill-marketplace." 
"# skillmarket" 
"# skillmarket" 
