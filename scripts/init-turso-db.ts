import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error('Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env');
  process.exit(1);
}

const client = createClient({
  url,
  authToken,
});

async function init() {
  console.log('Connecting to Turso database:', url);

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      short_name TEXT,
      badge TEXT NOT NULL,
      image TEXT NOT NULL,
      description TEXT NOT NULL,
      in_stock INTEGER NOT NULL DEFAULT 1,
      stock_status TEXT NOT NULL DEFAULT 'in_stock',
      stock_count INTEGER,
      price_estimate TEXT,
      discount_price TEXT,
      is_visible INTEGER NOT NULL DEFAULT 1,
      fallback_similar_id TEXT,
      fallback_reason TEXT,
      specs TEXT NOT NULL,
      comparison TEXT NOT NULL,
      tags TEXT NOT NULL,
      colors TEXT,
      category TEXT NOT NULL DEFAULT 'radio',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await client.execute(createTableQuery);
    console.log('✅ Table "products" created or verified successfully!');

    // Create index on category and is_visible for fast querying
    await client.execute(`
      CREATE INDEX IF NOT EXISTS idx_products_category_visible 
      ON products (category, is_visible, sort_order);
    `);
    console.log('✅ Index "idx_products_category_visible" created successfully!');

    const res = await client.execute('SELECT COUNT(*) as count FROM products;');
    console.log(`Current product count in Turso: ${res.rows[0].count}`);
  } catch (err) {
    console.error('❌ Failed to initialize table:', err);
    process.exit(1);
  }
}

init();
