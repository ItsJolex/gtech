import { createClient } from '@libsql/client/web';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const urlMatch = env.match(/TURSO_DATABASE_URL="?([^\s"\n]+)/);
const tokenMatch = env.match(/TURSO_AUTH_TOKEN="?([^\s"\n]+)/);

if (!urlMatch || !tokenMatch) {
  console.error('No se encontraron credenciales de Turso en .env');
  process.exit(1);
}

const client = createClient({
  url: urlMatch[1],
  authToken: tokenMatch[1]
});

async function migrate() {
  console.log('Agregando columnas de soft-delete (is_deleted, deleted_at) en Turso DB...');
  try {
    await client.execute('ALTER TABLE products ADD COLUMN is_deleted INTEGER NOT NULL DEFAULT 0;');
    console.log('✓ Columna is_deleted agregada.');
  } catch (e) {
    console.log('ℹ️ Columna is_deleted ya existía o:', e.message);
  }

  try {
    await client.execute('ALTER TABLE products ADD COLUMN deleted_at TEXT;');
    console.log('✓ Columna deleted_at agregada.');
  } catch (e) {
    console.log('ℹ️ Columna deleted_at ya existía o:', e.message);
  }
}

migrate().catch(console.error);
