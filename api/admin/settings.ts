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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!verifyAuth(req)) return res.status(401).json({ error: 'Unauthorized' });

  const client = createClient({
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