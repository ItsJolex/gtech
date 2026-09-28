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

function verifyAuth(req: VercelRequest): boolean {
  const authHeader = req.headers.authorization;
  const secretKey = process.env.ADMIN_SECRET_KEY;
  if (!secretKey) return res.status(500).json({ error: 'ADMIN_SECRET_KEY not configured' });

  if (!authHeader) return false;
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  return token === secretKey;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || '';
  if (origin.includes('localhost') || origin.includes('gtech.us') || origin.includes('g-tech.us')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Security check: require admin token
  if (!verifyAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid admin token' });
  }

  let client;
  try {
    client = getTursoClient();
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }

  const { method } = req;

  try {
    // ----------------------------------------------------
    // GET: List all accessories
    // ----------------------------------------------------
    if (method === 'GET') {
      const category = req.query.category as string | undefined;

      let sql = `
        SELECT 
          id, name, name_es, category, badge, badge_es, image, secondary_image,
          description, description_es, connector, connector_es,
          compatibility, specs, in_stock, price_estimate, sort_order,
          is_visible, is_deleted, deleted_at,
          created_at, updated_at
        FROM accessories
      `;
      const args: any[] = [];

      if (category && category !== 'all' && category !== 'accessory') {
        sql += ` WHERE category = ?`;
        args.push(category);
      }

      sql += ` ORDER BY sort_order ASC, updated_at DESC;`;

      const result = await client.execute({ sql, args });

      const accessories = result.rows.map((row) => ({
        id: row.id as string,
        name: row.name as string,
        nameEs: (row.name_es as string) || (row.name as string),
        category: (row.category as string) || 'microphones',
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
        isVisible: Number(row.is_visible ?? 1) === 1,
        isDeleted: Number(row.is_deleted || 0) === 1,
        deletedAt: (row.deleted_at as string) || undefined,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));

      return res.status(200).json(accessories);
    }

    // ----------------------------------------------------
    // POST: Create a new accessory
    // ----------------------------------------------------
    if (method === 'POST') {
      const a = req.body;
      if (!a || !a.id || !a.name || !a.category) {
        return res.status(400).json({ error: 'Missing required fields (id, name, category)' });
      }

      const existing = await client.execute({
        sql: 'SELECT id FROM accessories WHERE id = ?;',
        args: [a.id],
      });

      if (existing.rows.length > 0) {
        return res.status(409).json({ error: `An accessory with ID "${a.id}" already exists.` });
      }

      const maxSortRes = await client.execute('SELECT MAX(sort_order) as max_sort FROM accessories;');
      const nextSort = ((maxSortRes.rows[0]?.max_sort as number) || 0) + 1;

      const query = `
        INSERT INTO accessories (
          id, name, name_es, category, badge, badge_es, image, secondary_image,
          description, description_es, connector, connector_es,
          compatibility, specs, in_stock, price_estimate, sort_order,
          is_visible, is_deleted, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, 0, CURRENT_TIMESTAMP
        );
      `;

      await client.execute({
        sql: query,
        args: [
          a.id,
          a.name,
          a.nameEs || a.name,
          a.category || 'microphones',
          a.badge || '',
          a.badgeEs || a.badge || '',
          a.image || '/images/logo-patch.webp',
          a.secondaryImage || null,
          a.description || '',
          a.descriptionEs || a.description || '',
          a.connector || '',
          a.connectorEs || a.connector || '',
          JSON.stringify(a.compatibility || []),
          JSON.stringify(a.specs || []),
          a.inStock !== false ? 1 : 0,
          a.priceEstimate || null,
          a.sortOrder ?? nextSort,
          a.isVisible !== false ? 1 : 0,
        ],
      });

      return res.status(201).json({ ok: true, id: a.id, message: 'Accessory created successfully' });
    }

    // ----------------------------------------------------
    // PUT: Update an existing accessory
    // ----------------------------------------------------
    if (method === 'PUT') {
      const a = req.body;
      if (!a || !a.id) {
        return res.status(400).json({ error: 'Accessory ID is required for updating' });
      }

      const query = `
        UPDATE accessories SET
          name = ?,
          name_es = ?,
          category = ?,
          badge = ?,
          badge_es = ?,
          image = ?,
          secondary_image = ?,
          description = ?,
          description_es = ?,
          connector = ?,
          connector_es = ?,
          compatibility = ?,
          specs = ?,
          in_stock = ?,
          price_estimate = ?,
          is_visible = ?,
          sort_order = COALESCE(?, sort_order),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?;
      `;

      const result = await client.execute({
        sql: query,
        args: [
          a.name,
          a.nameEs || a.name,
          a.category || 'microphones',
          a.badge || '',
          a.badgeEs || a.badge || '',
          a.image,
          a.secondaryImage || null,
          a.description,
          a.descriptionEs || a.description,
          a.connector,
          a.connectorEs || a.connector,
          JSON.stringify(a.compatibility || []),
          JSON.stringify(a.specs || []),
          a.inStock ? 1 : 0,
          a.priceEstimate || null,
          a.isVisible ? 1 : 0,
          a.sortOrder ?? null,
          a.id,
        ],
      });

      if (result.rowsAffected === 0) {
        return res.status(404).json({ error: `Accessory "${a.id}" not found` });
      }

      return res.status(200).json({ ok: true, id: a.id, message: 'Accessory updated successfully' });
    }

    // ----------------------------------------------------
    // PATCH: Quick toggles (Visibility or Stock)
    // ----------------------------------------------------
    if (method === 'PATCH') {
      const { id, isVisible, inStock, restore } = req.body || {};
      if (!id) {
        return res.status(400).json({ error: 'Accessory ID is required' });
      }

      const updates: string[] = [];
      const args: any[] = [];

      if (restore === true) {
        updates.push('is_deleted = 0, deleted_at = NULL');
      }

      if (typeof isVisible === 'boolean') {
        updates.push('is_visible = ?');
        args.push(isVisible ? 1 : 0);
      }

      if (typeof inStock === 'boolean') {
        updates.push('in_stock = ?');
        args.push(inStock ? 1 : 0);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No patchable fields provided' });
      }

      updates.push('updated_at = CURRENT_TIMESTAMP');
      args.push(id);

      await client.execute({
        sql: `UPDATE accessories SET ${updates.join(', ')} WHERE id = ?;`,
        args,
      });

      return res.status(200).json({ ok: true, id, message: 'Accessory patched successfully' });
    }

    // ----------------------------------------------------
    // DELETE: Soft delete or Permanent delete
    // ----------------------------------------------------
    if (method === 'DELETE') {
      const id = (req.query.id as string) || req.body?.id;
      const permanent = req.query.permanent === 'true';

      if (!id) {
        return res.status(400).json({ error: 'Accessory ID is required for deletion' });
      }

      if (permanent) {
        const result = await client.execute({
          sql: 'DELETE FROM accessories WHERE id = ?;',
          args: [id],
        });

        if (result.rowsAffected === 0) {
          return res.status(404).json({ error: `Accessory "${id}" not found` });
        }

        return res.status(200).json({ ok: true, id, message: 'Accesorio eliminado definitivamente' });
      } else {
        const result = await client.execute({
          sql: 'UPDATE accessories SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP WHERE id = ?;',
          args: [id],
        });

        if (result.rowsAffected === 0) {
          return res.status(404).json({ error: `Accessory "${id}" not found` });
        }

        return res.status(200).json({ ok: true, id, message: 'Accesorio movido a la papelera' });
      }
    }

    return res.status(405).json({ error: `Method ${method} not allowed` });
  } catch (err: any) {
    console.error('API error in /api/admin/accessories:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
