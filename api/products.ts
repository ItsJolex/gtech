import { createClient } from '@libsql/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import defaultProducts from '../products.json';

function getTursoClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) return null;
  return createClient({ url, authToken });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const client = getTursoClient();

  if (!client) {
    // Graceful fallback to static products.json if DB credentials missing
    console.warn('TURSO credentials not set in API environment, falling back to products.json');
    return res.status(200).json(defaultProducts);
  }

  try {
    const result = await client.execute(`
      SELECT 
        id, name, short_name, badge, image, description,
        in_stock, stock_status, stock_count, price_estimate, discount_price,
        is_visible, fallback_similar_id, fallback_reason,
        specs, comparison, tags, colors, category, sort_order
      FROM products 
      WHERE is_visible = 1 AND category = 'radio'
      ORDER BY sort_order ASC, updated_at DESC;
    `);

    if (result.rows.length === 0) {
      return res.status(200).json(defaultProducts);
    }

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

    // Cache header: short cache for fresh updates with SWR
    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=59');
    return res.status(200).json(products);
  } catch (err) {
    console.error('Error querying Turso database:', err);
    // Return default static products as reliable fallback
    return res.status(200).json(defaultProducts);
  }
}
