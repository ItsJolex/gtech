import { createClient } from '@libsql/client/web';
import type { VercelRequest, VercelResponse } from '@vercel/node';

function verifyAuth(req: VercelRequest): boolean {
  const authHeader = req.headers.authorization;
  const secretKey = process.env.ADMIN_SECRET_KEY;
  if (!secretKey) return res.status(500).json({ error: 'ADMIN_SECRET_KEY not configured' });
  if (!authHeader) return false;
  return authHeader.replace(/^Bearer\s+/i, '').trim() === secretKey;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || '';
  if (origin.includes('localhost') || origin.includes('gtech.us') || origin.includes('g-tech.us')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!verifyAuth(req)) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { id, type } = req.body || {};
  if (!id) return res.status(400).json({ error: 'ID is required' });

  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  const targetTable = type === 'accessory' ? 'accessories' : 'products';
  let result = await client.execute({
    sql: `UPDATE ${targetTable} SET is_deleted = 0, deleted_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?;`,
    args: [id],
  });

  if (result.rowsAffected === 0 && targetTable === 'products') {
    result = await client.execute({
      sql: 'UPDATE accessories SET is_deleted = 0, deleted_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?;',
      args: [id],
    });
  }

  if (result.rowsAffected === 0) {
    return res.status(404).json({ error: `Elemento "${id}" no encontrado` });
  }

  return res.status(200).json({ ok: true, message: `Elemento ${id} restaurado exitosamente` });
}