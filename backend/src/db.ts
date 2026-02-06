import { Pool } from "pg";

export const db = new Pool({
  user: "inbox",
  password: "inbox",
  host: "localhost",
  port: 5432,
  database: "inbox",
});

db.query(`
  CREATE TABLE IF NOT EXISTS emails (
    id SERIAL PRIMARY KEY,
    email TEXT,
    subject TEXT,
    body TEXT,
    send_at TIMESTAMP,
    status TEXT DEFAULT 'scheduled'
  )
`);
