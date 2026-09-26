import { createClient } from '@libsql/client/web';
import type { VercelRequest, VercelResponse } from '@vercel/node';

function getTursoClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    throw new Error('TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is not configured');
  }
  return createClient({ url, authToken });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const client = getTursoClient();
    const result = await client.execute({
      sql: `
        SELECT 
          id, name, short_name, badge, image, description,
          in_stock, stock_status, stock_count, price_estimate, discount_price,
          is_visible, fallback_similar_id, fallback_reason,
          specs, comparison, tags, colors, category, sort_order
        FROM products 
        WHERE is_visible = 1 AND category = ?
        ORDER BY sort_order ASC, updated_at DESC;
      `,
      args: ['radio'],
    });

    const products = result.rows.map((row) => ({
      id: row.id as string,
      name: row.name as string,
      shortName: (row.short_name as string) || undefined,
      badge: row.badge as string,
      image: row.image as string,
      description: row.description as string,
      inStock: Boolean(row.in_stock),
      stockStatus: (row.stock_status as string) || 'in_stock',
      stockCount: row.stock_count !== null ? Number(row.stock_count) : undefined,
      priceEstimate: (row.price_estimate as string) || undefined,
      discountPrice: (row.discount_price as string) || undefined,
      isVisible: Boolean(row.is_visible),
      fallbackSimilarId: (row.fallback_similar_id as string) || undefined,
      fallbackReason: (row.fallback_reason as string) || undefined,
      specs: JSON.parse((row.specs as string) || '[]'),
      comparison: JSON.parse((row.comparison as string) || '{}'),
      tags: JSON.parse((row.tags as string) || '[]'),
      colors: row.colors ? JSON.parse(row.colors as string) : undefined,
    }));

    res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=30');
    return res.status(200).json(products);
  } catch (err: any) {
    console.error('Error querying Turso database in /api/products:', err);
    return res.status(500).json({ error: err.message || 'Database error' });
  }
}
