import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error('Error: Missing Turso credentials in .env');
  process.exit(1);
}

const client = createClient({ url, authToken });

async function seed() {
  const productsFilePath = path.join(__dirname, '..', 'products.json');
  const rawData = fs.readFileSync(productsFilePath, 'utf-8');
  const products = JSON.parse(rawData);

  console.log(`Migrating ${products.length} products to Turso...`);

  let inserted = 0;
  let updated = 0;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const query = `
      INSERT INTO products (
        id, name, short_name, badge, image, description,
        in_stock, stock_status, stock_count, price_estimate, discount_price,
        is_visible, fallback_similar_id, fallback_reason,
        specs, comparison, tags, colors, category, sort_order, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        short_name = excluded.short_name,
        badge = excluded.badge,
        image = excluded.image,
        description = excluded.description,
        in_stock = excluded.in_stock,
        stock_status = excluded.stock_status,
        stock_count = excluded.stock_count,
        price_estimate = excluded.price_estimate,
        fallback_similar_id = excluded.fallback_similar_id,
        fallback_reason = excluded.fallback_reason,
        specs = excluded.specs,
        comparison = excluded.comparison,
        tags = excluded.tags,
        colors = excluded.colors,
        category = excluded.category,
        sort_order = excluded.sort_order,
        updated_at = CURRENT_TIMESTAMP;
    `;

    const args = [
      p.id,
      p.name,
      p.shortName || null,
      p.badge,
      p.image,
      p.description,
      p.inStock ? 1 : 0,
      p.stockStatus || 'in_stock',
      p.stockCount ?? null,
      p.priceEstimate || null,
      null, // discount_price initially null
      1, // is_visible default 1
      p.fallbackSimilarId || null,
      p.fallbackReason || null,
      JSON.stringify(p.specs || []),
      JSON.stringify(p.comparison || {}),
      JSON.stringify(p.tags || []),
      p.colors ? JSON.stringify(p.colors) : null,
      'radio',
      i + 1, // sort_order preserving current catalog order
    ];

    try {
      await client.execute({ sql: query, args });
      inserted++;
      console.log(`[${i + 1}/${products.length}] Migrated: ${p.name} (${p.id})`);
    } catch (err) {
      console.error(`Error migrating ${p.id}:`, err);
    }
  }

  const countRes = await client.execute('SELECT COUNT(*) as count FROM products;');
  console.log(`\n🎉 Seed finished! Total products in Turso DB: ${countRes.rows[0].count}`);
}

seed();
