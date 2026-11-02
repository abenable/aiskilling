-- Directed emails sent from the admin composer. One row per send, for the record.
CREATE TABLE sent_emails (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  signup_id  INTEGER,                 -- signups.id, when the address is a signup
  to_email   TEXT NOT NULL,
  subject    TEXT NOT NULL,
  body       TEXT NOT NULL,           -- plain-text body exactly as sent
  sent_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX sent_emails_to_email ON sent_emails (to_email);
