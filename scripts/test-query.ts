import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function test() {
  const res = await client.execute('SELECT * FROM products ORDER BY sort_order ASC LIMIT 1;');
  const row = res.rows[0];
  console.log('ID:', row.id);
  console.log('Name:', row.name);
  console.log('Badge:', row.badge);
  console.log('Specs Count:', JSON.parse(row.specs as string).length);
  console.log('Comparison keys:', Object.keys(JSON.parse(row.comparison as string)));
  console.log('Colors:', row.colors ? JSON.parse(row.colors as string).length : 'none');
}

test();
