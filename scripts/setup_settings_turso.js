// scripts/setup_settings_turso.js
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

async function initSettings() {
  console.log('Inicializando tabla system_settings en Turso...');
  await client.execute(`
    CREATE TABLE IF NOT EXISTS system_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.execute(`
    INSERT OR IGNORE INTO system_settings (key, value)
    VALUES ('show_prices', 'false');
  `);

  console.log('✓ Tabla system_settings configurada correctamente.');
}

initSettings().catch(console.error);