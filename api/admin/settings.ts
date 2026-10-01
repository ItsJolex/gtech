import { createClient } from '@libsql/client/web';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors } from "../_lib/cors.js";
import { verifyAuth } from "../_lib/auth.js";


export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyCors(req, res);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!verifyAuth(req, res)) return;const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  if (req.method === 'GET') {
    const result = await client.execute('SELECT key, value FROM system_settings;');
    const settings: Record<string, string> = {};
    result.rows.forEach(r => { settings[r.key as string] = r.value as string; });
    return res.status(200).json(settings);
  }

  if (req.method === 'POST') {
    const { key, value } = req.body || {};
    if (!key || value === undefined) return res.status(400).json({ error: 'Missing key or value' });
    if (typeof key !== 'string' || key.length > 100) return res.status(400).json({error: 'Invalid key (max 100 chars)'});
    const valStr = String(value);
    if (valStr.length > 5000) return res.status(400).json({error: 'Value too long (max 5000 chars)'});

    await client.execute({
      sql: `
        INSERT INTO system_settings (key, value, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP;
      `,
      args: [key, String(value)],
    });

    return res.status(200).json({ ok: true, key, value });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}