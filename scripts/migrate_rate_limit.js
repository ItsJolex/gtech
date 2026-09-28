import { createClient } from '@libsql/client/web';
import dotenv from 'dotenv';
dotenv.config();

async function migrate() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) throw new Error("Missing Turso credentials");

  const client = createClient({ url, authToken });
  
  await client.execute(`
    CREATE TABLE IF NOT EXISTS login_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT NOT NULL,
      attempted_at INTEGER NOT NULL,
      success INTEGER NOT NULL
    )
  `);
  console.log("Migration complete: login_attempts table created.");
}

migrate().catch(console.error);
