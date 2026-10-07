# AI Skilling

Awareness site for the AI Skilling program at [aiskilling.dev](https://aiskilling.dev).
TanStack Start (React 19, file-based TanStack Router) on Cloudflare Workers, Tailwind v4, Motion, D1.

## Develop

```sh
bun install
bun run db:migrate:local   # first time only
bun run dev                # http://localhost:3000
bun run typecheck
bun run test:e2e           # with dev running; writes test rows to local D1 only
```

## Edit content

All copy, activities, audiences, prompts and tools live in `src/content.ts`.
Photos are in `public/images/<name>-800.webp` and `-1600.webp` (Unsplash license).

## Sessions and sign-ups (D1: `aiskilling-db`)

The site shows upcoming rows from the `events` table. Add one:

```sh
bunx wrangler d1 execute aiskilling-db --remote --command \
  "INSERT INTO events (kind, title, starts_at, location, url, summary)
   VALUES ('workshops', 'Prompting for everyday work', '2026-11-14T10:00:00+03:00', 'Venue, City', NULL, 'Bring a laptop.')"
```

`kind` is an activity slug: `workshops`, `meetups`, `bootcamps`, `online`, `team-training`.
`starts_at` is shown exactly as written; past events hide themselves. `url` is an optional external RSVP link.

Read sign-ups from the join form:

```sh
bunx wrangler d1 execute aiskilling-db --remote --command "SELECT * FROM signups ORDER BY created_at DESC"
```

## Deploy

```sh
bun run db:migrate:remote  # when migrations/ changes
bun run deploy             # builds and deploys to aiskilling.dev (www redirects to apex)
```

If `CLOUDFLARE_API_TOKEN` in your shell lacks Workers permissions, prefix wrangler commands with
`env -u CLOUDFLARE_API_TOKEN -u CLOUDFLARE_ACCOUNT_ID` to use your `wrangler login` session instead.

## Layout

- `src/routes/`: pages. `/` and `/activities*` stream D1 sessions via deferred loaders; filters are Zod-validated search params.
- `src/server/functions.ts`: typed server functions (the RPC boundary).
- `src/server/db.server.ts`: server-only D1 + rate limiter access (build fails if imported client-side).
- `src/server.ts`: Worker entry (www redirect + security headers).
- `src/styles.css`: design tokens (adapted from Framer's DESIGN.md) and keyframes.
