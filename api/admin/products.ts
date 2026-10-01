import { createClient } from '@libsql/client/web';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors } from "../_lib/cors.js";
import { verifyAuth } from "../_lib/auth.js";

function getTursoClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    throw new Error('TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is not configured');
  }
  return createClient({ url, authToken });
}


export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyCors(req, res);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Security check: require admin token
  if (!verifyAuth(req, res)) return;

  let client;
  try {
    client = getTursoClient();
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }

  const { method } = req;

  try {
    // ----------------------------------------------------
    // GET: List all products (including hidden ones)
    // ----------------------------------------------------
    if (method === 'GET') {
      const category = (req.query.category as string) || 'radio';
      const result = await client.execute({
        sql: `
          SELECT 
            id, name, short_name, badge, image, description,
            in_stock, stock_status, stock_count, price_estimate, discount_price,
            is_visible, fallback_similar_id, fallback_reason,
            specs, comparison, tags, colors, category, sort_order,
            is_deleted, deleted_at,
            created_at, updated_at
          FROM products
          WHERE category = ?
          ORDER BY sort_order ASC, updated_at DESC;
        `,
        args: [category],
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
        category: (row.category as string) || 'radio',
        sortOrder: Number(row.sort_order || 0),
        isDeleted: Number(row.is_deleted || 0) === 1,
        deletedAt: (row.deleted_at as string) || undefined,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));

      return res.status(200).json(products);
    }

    // ----------------------------------------------------
    // POST: Create a new product
    // ----------------------------------------------------
    if (method === 'POST') {
      const p = req.body;
      if (!p || !p.id || !p.name || !p.badge) {
        return res.status(400).json({ error: 'Missing required fields (id, name, badge)' });
      }

      if (typeof p.name !== 'string' || p.name.length > 250) return res.status(400).json({error: 'Invalid name'});
      if (p.shortName && (typeof p.shortName !== 'string' || p.shortName.length > 250)) return res.status(400).json({error: 'Invalid short name'});
      if (p.description && (typeof p.description !== 'string' || p.description.length > 5000)) return res.status(400).json({error: 'Description too long'});
      if (p.image && typeof p.image === 'string' && !p.image.startsWith('/') && !p.image.startsWith('https://')) return res.status(400).json({error: 'Invalid image URL'});
      if (p.badge && (typeof p.badge !== 'string' || p.badge.length > 100)) return res.status(400).json({error: 'Invalid badge'});
      if (p.priceEstimate && typeof p.priceEstimate !== 'string') return res.status(400).json({error: 'Invalid price estimate'});
      if (p.discountPrice && typeof p.discountPrice !== 'string') return res.status(400).json({error: 'Invalid discount price'});
      if (p.fallbackSimilarId && typeof p.fallbackSimilarId !== 'string') return res.status(400).json({error: 'Invalid fallback ID'});
      if (p.fallbackReason && (typeof p.fallbackReason !== 'string' || p.fallbackReason.length > 500)) return res.status(400).json({error: 'Invalid fallback reason'});
      if (p.specs && !Array.isArray(p.specs)) return res.status(400).json({error: 'Invalid specs'});
      if (p.comparison && typeof p.comparison !== 'object') return res.status(400).json({error: 'Invalid comparison'});
      if (p.tags && !Array.isArray(p.tags)) return res.status(400).json({error: 'Invalid tags'});
      if (p.colors && !Array.isArray(p.colors)) return res.status(400).json({error: 'Invalid colors'});
      if (p.category && (typeof p.category !== 'string' || p.category.length > 50)) return res.status(400).json({error: 'Invalid category'});
      const validStock = ['in_stock', 'low_stock', 'out_of_stock', 'preorder'];
      if (p.stockStatus && !validStock.includes(p.stockStatus)) return res.status(400).json({error: 'Invalid stock status'});


      // Check if id already exists
      const existing = await client.execute({
        sql: 'SELECT id FROM products WHERE id = ?;',
        args: [p.id],
      });

      if (existing.rows.length > 0) {
        return res.status(409).json({ error: `A product with ID "${p.id}" already exists.` });
      }

      // Determine next sort_order
      const maxSortRes = await client.execute('SELECT MAX(sort_order) as max_sort FROM products;');
      const nextSort = ((maxSortRes.rows[0]?.max_sort as number) || 0) + 1;

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
        );
      `;

      await client.execute({
        sql: query,
        args: [
          p.id,
          p.name,
          p.shortName || null,
          p.badge,
          p.image || '/images/logo-patch.webp',
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
          p.category || 'radio',
          p.sortOrder ?? nextSort,
        ],
      });

      return res.status(201).json({ ok: true, id: p.id, message: 'Product created successfully' });
    }

    // ----------------------------------------------------
    // PUT: Update an existing product
    // ----------------------------------------------------
    if (method === 'PUT') {
      const p = req.body;
      if (!p || !p.id) {
        return res.status(400).json({ error: 'Product ID is required for updating' });
      }

      if (p.name && (typeof p.name !== 'string' || p.name.length > 250)) return res.status(400).json({error: 'Invalid name'});
      if (p.shortName && (typeof p.shortName !== 'string' || p.shortName.length > 250)) return res.status(400).json({error: 'Invalid short name'});
      if (p.description && (typeof p.description !== 'string' || p.description.length > 5000)) return res.status(400).json({error: 'Description too long'});
      if (p.image && typeof p.image === 'string' && !p.image.startsWith('/') && !p.image.startsWith('https://')) return res.status(400).json({error: 'Invalid image URL'});
      if (p.badge && (typeof p.badge !== 'string' || p.badge.length > 100)) return res.status(400).json({error: 'Invalid badge'});
      if (p.priceEstimate && typeof p.priceEstimate !== 'string') return res.status(400).json({error: 'Invalid price estimate'});
      if (p.discountPrice && typeof p.discountPrice !== 'string') return res.status(400).json({error: 'Invalid discount price'});
      if (p.fallbackSimilarId && typeof p.fallbackSimilarId !== 'string') return res.status(400).json({error: 'Invalid fallback ID'});
      if (p.fallbackReason && (typeof p.fallbackReason !== 'string' || p.fallbackReason.length > 500)) return res.status(400).json({error: 'Invalid fallback reason'});
      if (p.specs && !Array.isArray(p.specs)) return res.status(400).json({error: 'Invalid specs'});
      if (p.comparison && typeof p.comparison !== 'object') return res.status(400).json({error: 'Invalid comparison'});
      if (p.tags && !Array.isArray(p.tags)) return res.status(400).json({error: 'Invalid tags'});
      if (p.colors && !Array.isArray(p.colors)) return res.status(400).json({error: 'Invalid colors'});
      if (p.category && (typeof p.category !== 'string' || p.category.length > 50)) return res.status(400).json({error: 'Invalid category'});
      const validStock = ['in_stock', 'low_stock', 'out_of_stock', 'preorder'];
      if (p.stockStatus && !validStock.includes(p.stockStatus)) return res.status(400).json({error: 'Invalid stock status'});


      const query = `
        UPDATE products SET
          name = ?,
          short_name = ?,
          badge = ?,
          image = ?,
          description = ?,
          in_stock = ?,
          stock_status = ?,
          stock_count = ?,
          price_estimate = ?,
          discount_price = ?,
          is_visible = ?,
          fallback_similar_id = ?,
          fallback_reason = ?,
          specs = ?,
          comparison = ?,
          tags = ?,
          colors = ?,
          category = ?,
          sort_order = COALESCE(?, sort_order),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?;
      `;

      const result = await client.execute({
        sql: query,
        args: [
          p.name,
          p.shortName || null,
          p.badge,
          p.image,
          p.description,
          p.inStock ? 1 : 0,
          p.stockStatus || 'in_stock',
          p.stockCount ?? null,
          p.priceEstimate || null,
          p.discountPrice || null,
          p.isVisible ? 1 : 0,
          p.fallbackSimilarId || null,
          p.fallbackReason || null,
          JSON.stringify(p.specs || []),
          JSON.stringify(p.comparison || {}),
          JSON.stringify(p.tags || []),
          p.colors ? JSON.stringify(p.colors) : null,
          p.category || 'radio',
          p.sortOrder ?? null,
          p.id,
        ],
      });

      if (result.rowsAffected === 0) {
        return res.status(404).json({ error: `Product "${p.id}" not found` });
      }

      return res.status(200).json({ ok: true, id: p.id, message: 'Product updated successfully' });
    }

    // ----------------------------------------------------
    // PATCH: Quick toggles (Visibility or Stock Status)
    // ----------------------------------------------------
    if (method === 'PATCH') {
      const { id, isVisible, stockStatus, inStock } = req.body || {};
      if (!id) {
        return res.status(400).json({ error: 'Product ID is required' });
      }

      const updates: string[] = [];
      const args: any[] = [];

      if (typeof isVisible === 'boolean') {
        updates.push('is_visible = ?');
        args.push(isVisible ? 1 : 0);
      }

      if (stockStatus) {
        updates.push('stock_status = ?');
        args.push(stockStatus);
        // Automatically align in_stock boolean
        updates.push('in_stock = ?');
        args.push(stockStatus === 'out_of_stock' ? 0 : 1);
      } else if (typeof inStock === 'boolean') {
        updates.push('in_stock = ?');
        args.push(inStock ? 1 : 0);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No patchable fields provided' });
      }

      updates.push('updated_at = CURRENT_TIMESTAMP');
      args.push(id);

      await client.execute({
        sql: `UPDATE products SET ${updates.join(', ')} WHERE id = ?;`,
        args,
      });

      return res.status(200).json({ ok: true, id, message: 'Product patched successfully' });
    }

    // ----------------------------------------------------
    // DELETE: Remove product (soft delete by default, permanent if requested)
    // ----------------------------------------------------
    if (method === 'DELETE') {
      const id = (req.query.id as string) || req.body?.id;
      const permanent = req.query.permanent === 'true';

      if (!id) {
        return res.status(400).json({ error: 'Product ID is required for deletion' });
      }

      if (permanent) {
        const result = await client.execute({
          sql: 'DELETE FROM products WHERE id = ?;',
          args: [id],
        });

        if (result.rowsAffected === 0) {
          return res.status(404).json({ error: `Product "${id}" not found` });
        }

        return res.status(200).json({ ok: true, id, message: 'Producto eliminado definitivamente' });
      } else {
        const result = await client.execute({
          sql: 'UPDATE products SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP WHERE id = ?;',
          args: [id]
        });

        if (result.rowsAffected === 0) {
          return res.status(404).json({ error: `Producto "${id}" no encontrado` });
        }

        return res.status(200).json({ ok: true, id, message: 'Producto movido a la papelera' });
      }
    }

    return res.status(405).json({ error: `Method ${method} not allowed` });
  } catch {
    console.error('API error in /api/admin/products');
    return res.status(500).json({ error: 'Internal server error' });
  }
}
