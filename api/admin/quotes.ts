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
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, OPTIONS');
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
    // GET: List all quotes with optional status filter
    // ----------------------------------------------------
    if (method === 'GET') {
      const status = req.query.status as string | undefined;

      let sql = `
        SELECT 
          id, quote_number, customer_name, customer_email, customer_phone,
          company_name, destination, notes, items, total_units,
          sim_plan, channel, status, ip_address, created_at, updated_at
        FROM quotes
      `;
      const args: any[] = [];

      if (status && status !== 'all') {
        sql += ` WHERE status = ?`;
        args.push(status);
      }

      sql += ` ORDER BY created_at DESC;`;

      const result = await client.execute({ sql, args });

      const quotes = result.rows.map((row) => ({
        id: row.id as string,
        quoteNumber: row.quote_number as string,
        customerName: row.customer_name as string,
        customerEmail: row.customer_email as string,
        customerPhone: (row.customer_phone as string) || null,
        companyName: (row.company_name as string) || null,
        destination: row.destination as string,
        notes: (row.notes as string) || null,
        items: JSON.parse((row.items as string) || '[]'),
        totalUnits: Number(row.total_units || 0),
        simPlan: (row.sim_plan as string) || 'none',
        channel: (row.channel as string) || 'gmail',
        status: (row.status as string) || 'pending',
        ipAddress: (row.ip_address as string) || null,
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string
      }));

      return res.status(200).json(quotes);
    }

    // ----------------------------------------------------
    // PATCH: Update quote status or administrative notes
    // ----------------------------------------------------
    if (method === 'PATCH') {
      const { id, status, notes } = req.body || {};

      if (!id) {
        return res.status(400).json({ error: 'Quote id is required' });
      }

      const updates: string[] = [];
      const args: any[] = [];

      if (status) {
        updates.push('status = ?');
        args.push(status);
      }

      if (notes !== undefined) {
        updates.push('notes = ?');
        args.push(notes);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      updates.push('updated_at = CURRENT_TIMESTAMP');
      args.push(id);

      const sql = `UPDATE quotes SET ${updates.join(', ')} WHERE id = ?`;
      await client.execute({ sql, args });

      return res.status(200).json({ success: true, message: 'Quote updated' });
    }

    // ----------------------------------------------------
    // DELETE: Delete quote record
    // ----------------------------------------------------
    if (method === 'DELETE') {
      const { id } = req.body || req.query;

      if (!id) {
        return res.status(400).json({ error: 'Quote id is required' });
      }

      await client.execute({
        sql: `DELETE FROM quotes WHERE id = ?`,
        args: [String(id)]
      });

      return res.status(200).json({ success: true, message: 'Quote deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('Error in /api/admin/quotes:', err);
    return res.status(500).json({ error: err.message || 'Database error in admin quotes' });
  }
}
