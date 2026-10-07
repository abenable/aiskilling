-- People who want to hear about activities. One row per email; re-joining updates it.
CREATE TABLE signups (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE COLLATE NOCASE,
  audience   TEXT NOT NULL,
  interests  TEXT NOT NULL,          -- comma-separated activity slugs
  message    TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Dated sessions shown on the site. Add rows with `wrangler d1 execute aiskilling-db --remote`.
CREATE TABLE events (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  kind      TEXT NOT NULL,           -- activity slug, e.g. 'workshops'
  title     TEXT NOT NULL,
  starts_at TEXT NOT NULL,           -- local time + offset, e.g. '2026-11-14T10:00:00+03:00' (shown as written)
  location  TEXT NOT NULL,           -- venue, city, or 'Online'
  url       TEXT,                    -- optional external RSVP link
  summary   TEXT
);

CREATE INDEX events_starts_at ON events (starts_at);
