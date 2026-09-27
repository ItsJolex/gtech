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
    const category = req.query.category as string | undefined;

    let sql = `
      SELECT 
        id, name, name_es, category, badge, badge_es, image, secondary_image,
        description, description_es, connector, connector_es,
        compatibility, specs, in_stock, price_estimate, sort_order
      FROM accessories
      WHERE is_visible = 1 AND (is_deleted = 0 OR is_deleted IS NULL)
    `;
    const args: any[] = [];

    if (category && category !== 'all') {
      sql += ` AND category = ?`;
      args.push(category);
    }

    sql += ` ORDER BY sort_order ASC, updated_at DESC;`;

    const result = await client.execute({ sql, args });

    const accessories = result.rows.map((row) => ({
      id: row.id as string,
      name: row.name as string,
      nameEs: (row.name_es as string) || (row.name as string),
      category: row.category as string,
      badge: row.badge as string,
      badgeEs: (row.badge_es as string) || (row.badge as string),
      image: row.image as string,
      secondaryImage: (row.secondary_image as string) || undefined,
      description: row.description as string,
      descriptionEs: (row.description_es as string) || (row.description as string),
      connector: row.connector as string,
      connectorEs: (row.connector_es as string) || (row.connector as string),
      compatibility: JSON.parse((row.compatibility as string) || '[]'),
      specs: JSON.parse((row.specs as string) || '[]'),
      inStock: Boolean(row.in_stock),
      priceEstimate: (row.price_estimate as string) || undefined,
      sortOrder: Number(row.sort_order || 0),
    }));

    res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=30');
    return res.status(200).json(accessories);
  } catch (err: any) {
    console.error('Error querying Turso database in /api/accessories:', err);
    return res.status(500).json({ error: err.message || 'Database error' });
  }
}
