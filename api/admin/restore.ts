import { createClient } from '@libsql/client/web';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors } from "../_lib/cors.js";
import { verifyAuth } from "../_lib/auth.js";


export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyCors(req, res);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!verifyAuth(req, res)) return;if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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