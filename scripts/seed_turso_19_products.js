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

const rawProducts = JSON.parse(fs.readFileSync('products.json', 'utf-8'));

async function syncTurso() {
  console.log(`Sincronizando ${rawProducts.length} productos en Turso DB en orden estricto...`);

  for (let i = 0; i < rawProducts.length; i++) {
    const p = rawProducts[i];
    const sortOrder = i + 1;

    await client.execute({
      sql: `
        INSERT INTO products (
          id, name, short_name, badge, image, description,
          in_stock, stock_status, stock_count, price_estimate, discount_price,
          is_visible, fallback_similar_id, fallback_reason,
          specs, comparison, tags, colors, category, sort_order, is_deleted, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP
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
          discount_price = excluded.discount_price,
          is_visible = excluded.is_visible,
          fallback_similar_id = excluded.fallback_similar_id,
          fallback_reason = excluded.fallback_reason,
          specs = excluded.specs,
          comparison = excluded.comparison,
          tags = excluded.tags,
          colors = excluded.colors,
          category = 'radio',
          sort_order = excluded.sort_order,
          is_deleted = 0,
          updated_at = CURRENT_TIMESTAMP;
      `,
      args: [
        p.id,
        p.name,
        p.shortName || null,
        p.badge,
        p.image,
        p.description || '',
        p.inStock !== false ? 1 : 0,
        p.stockStatus || 'in_stock',
        p.stockCount ?? null,
        p.priceEstimate || null,
        p.discountPrice || null,
        p.isVisible !== false ? 1 : 0,
        p.fallbackSimilarId || null,
        p.fallbackReason || null,
        JSON.stringify(p.specs || []),
        JSON.stringify(p.comparison || {}),
        JSON.stringify(p.tags || []),
        p.colors ? JSON.stringify(p.colors) : null,
        'radio',
        sortOrder
      ],
    });

    console.log(`✓ [${sortOrder}/${rawProducts.length}] ${p.id} (${p.name})`);
  }

  // Prune obsolete radio rows that are no longer part of the official 19-model list.
  // They are soft-deleted (not destroyed) so they remain recoverable from the admin trash.
  const officialIds = rawProducts.map((p) => p.id);
  const placeholders = officialIds.map(() => '?').join(', ');
  const existing = await client.execute(
    "SELECT id FROM products WHERE category = 'radio' AND is_deleted = 0;"
  );

  const staleIds = existing.rows
    .map((row) => row.id)
    .filter((id) => !officialIds.includes(id));

  for (const staleId of staleIds) {
    await client.execute({
      sql: 'UPDATE products SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?;',
      args: [staleId],
    });
    console.log(`ℹ️ Obsoleto enviado a la papelera: ${staleId}`);
  }

  if (officialIds.length) {
    const active = await client.execute({
      sql: `SELECT COUNT(*) as total FROM products WHERE category = 'radio' AND is_deleted = 0 AND id IN (${placeholders});`,
      args: officialIds,
    });
    console.log(`✓ Radios activos tras la sincronización: ${active.rows[0]?.total}`);
  }

  console.log('✓ Sincronización con Turso DB completada exitosamente.');
}

syncTurso().catch(console.error);
