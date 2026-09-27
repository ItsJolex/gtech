import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error('Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env');
  process.exit(1);
}

const client = createClient({ url, authToken });

async function main() {
  console.log('Connecting to Turso database:', url);

  // 1. Create accessories table
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS accessories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_es TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'microphones',
      badge TEXT NOT NULL,
      badge_es TEXT NOT NULL,
      image TEXT NOT NULL,
      secondary_image TEXT,
      description TEXT NOT NULL,
      description_es TEXT NOT NULL,
      connector TEXT NOT NULL,
      connector_es TEXT,
      compatibility TEXT NOT NULL DEFAULT '[]',
      specs TEXT NOT NULL DEFAULT '[]',
      in_stock INTEGER NOT NULL DEFAULT 1,
      price_estimate TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_visible INTEGER NOT NULL DEFAULT 1,
      is_deleted INTEGER NOT NULL DEFAULT 0,
      deleted_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await client.execute(createTableQuery);
  console.log('✅ Table "accessories" created or verified successfully!');

  // 2. Create index
  await client.execute(`
    CREATE INDEX IF NOT EXISTS idx_accessories_category_visible 
    ON accessories (category, is_visible, sort_order);
  `);
  console.log('✅ Index "idx_accessories_category_visible" created successfully!');

  // 3. Load initial accessories from src/accessories.json
  const accessoriesPath = path.join(__dirname, '..', 'src', 'accessories.json');
  const rawData = fs.readFileSync(accessoriesPath, 'utf-8');
  const accessories = JSON.parse(rawData);

  console.log(`Seeding ${accessories.length} accessories into Turso...`);

  for (let i = 0; i < accessories.length; i++) {
    const a = accessories[i];
    const upsertSql = `
      INSERT INTO accessories (
        id, name, name_es, category, badge, badge_es, image, secondary_image,
        description, description_es, connector, connector_es,
        compatibility, specs, in_stock, price_estimate, sort_order,
        is_visible, is_deleted, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        1, 0, CURRENT_TIMESTAMP
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        name_es = excluded.name_es,
        category = excluded.category,
        badge = excluded.badge,
        badge_es = excluded.badge_es,
        image = excluded.image,
        secondary_image = excluded.secondary_image,
        description = excluded.description,
        description_es = excluded.description_es,
        connector = excluded.connector,
        connector_es = excluded.connector_es,
        compatibility = excluded.compatibility,
        specs = excluded.specs,
        in_stock = excluded.in_stock,
        price_estimate = excluded.price_estimate,
        sort_order = excluded.sort_order,
        updated_at = CURRENT_TIMESTAMP;
    `;

    await client.execute({
      sql: upsertSql,
      args: [
        a.id,
        a.name,
        a.nameEs || a.name,
        a.category || 'microphones',
        a.badge || '',
        a.badgeEs || a.badge || '',
        a.image || '',
        a.secondaryImage || null,
        a.description || '',
        a.descriptionEs || a.description || '',
        a.connector || '',
        a.connectorEs || a.connector || '',
        JSON.stringify(a.compatibility || []),
        JSON.stringify(a.specs || []),
        a.inStock ? 1 : 0,
        a.priceEstimate || null,
        i + 1
      ]
    });

    console.log(`  ✓ Seeded: [${a.category}] ${a.id} - ${a.name}`);
  }

  const countRes = await client.execute('SELECT COUNT(*) as count FROM accessories WHERE is_deleted = 0;');
  console.log(`\n🎉 Success! Total active accessories in Turso: ${countRes.rows[0].count}`);
}

main().catch(err => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
