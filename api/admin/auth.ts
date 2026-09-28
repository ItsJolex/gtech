import crypto from 'node:crypto';
import { createClient } from '@libsql/client/web';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors } from '../_lib/cors.js';
import { createToken } from '../_lib/auth.js';

function getTursoClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) throw new Error('TURSO config missing');
  return createClient({ url, authToken });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyCors(req, res);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ipStr = req.headers['x-vercel-forwarded-for'] || req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
  const ip = Array.isArray(ipStr) ? ipStr[0] : ipStr;
  
  const client = getTursoClient();
  const fifteenMinsAgo = Date.now() - 15 * 60 * 1000;

  try {
    // Check rate limit: Max 5 failed attempts per IP in last 15 mins
    const attempts = await client.execute({
      sql: 'SELECT COUNT(*) as count FROM login_attempts WHERE ip = ? AND success = 0 AND attempted_at > ?',
      args: [ip, fifteenMinsAgo]
    });
    const failedCount = attempts.rows[0].count as number;
    
    if (failedCount >= 5) {
      return res.status(429).json({ error: 'Too many failed attempts, please try again later' });
    }

    const { password } = req.body || {};
    const secretKey = process.env.ADMIN_SECRET_KEY;
    
    if (!secretKey) return res.status(500).json({ error: 'ADMIN_SECRET_KEY not configured' });
    if (!password) {
      await client.execute({
        sql: 'INSERT INTO login_attempts (ip, attempted_at, success) VALUES (?, ?, 0)',
        args: [ip, Date.now()]
      });
      return res.status(400).json({ ok: false, error: 'Password is required' });
    }

    // Time constant comparison
    const passBuf = Buffer.from(password);
    const keyBuf = Buffer.from(secretKey);
    const isValid = passBuf.length === keyBuf.length && crypto.timingSafeEqual(passBuf, keyBuf);

    if (isValid) {
      const token = createToken();
      await client.execute({
        sql: 'INSERT INTO login_attempts (ip, attempted_at, success) VALUES (?, ?, 1)',
        args: [ip, Date.now()]
      });
      return res.status(200).json({ ok: true, token });
    } else {
      await client.execute({
        sql: 'INSERT INTO login_attempts (ip, attempted_at, success) VALUES (?, ?, 0)',
        args: [ip, Date.now()]
      });
      return res.status(401).json({ ok: false, error: 'Invalid admin password' });
    }
  } catch (err: any) {
    console.error('Auth error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
