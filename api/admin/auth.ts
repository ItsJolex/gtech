import crypto from 'node:crypto';
import { createClient } from '@libsql/client/web';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors } from '../_lib/cors.js';
import { createToken, setAuthCookie, clearAuthCookie } from '../_lib/auth.js';

function getTursoClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) throw new Error('TURSO config missing');
  return createClient({ url, authToken });
}

function constantTimeEquals(a: string, b: string): boolean {
  const ha = crypto.createHash('sha256').update(a, 'utf8').digest();
  const hb = crypto.createHash('sha256').update(b, 'utf8').digest();
  return crypto.timingSafeEqual(ha, hb);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyCors(req, res);
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Logout: limpia la cookie HttpOnly de sesión
  if (req.method === 'DELETE') {
    clearAuthCookie(res);
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const origin = req.headers.origin;
  if (origin) {
    try {
      const originUrl = new URL(origin);
      if (req.headers.host && originUrl.host !== req.headers.host) {
        const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
        if (!allowed.includes(origin)) {
          return res.status(403).json({ error: 'Forbidden origin' });
        }
      }
    } catch {
      return res.status(403).json({ error: 'Forbidden origin' });
    }
  }

  const ipStr = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const rawIp = Array.isArray(ipStr) ? ipStr[0] : ipStr;
  const ip = String(rawIp).split(',')[0].trim();

  const client = getTursoClient();
  const fifteenMinsAgo = Date.now() - 15 * 60 * 1000;

  try {
    // Rate limit: máximo 5 intentos fallidos por IP en los últimos 15 min
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
    if (!password || typeof password !== 'string') {
      await client.execute({
        sql: 'INSERT INTO login_attempts (ip, attempted_at, success) VALUES (?, ?, 0)',
        args: [ip, Date.now()]
      });
      return res.status(400).json({ ok: false, error: 'Password is required' });
    }

    // Comparación en tiempo constante sin filtrar longitud
    const isValid = constantTimeEquals(password, secretKey);

    if (isValid) {
      const token = createToken();
      setAuthCookie(res, token);
      await client.execute({
        sql: 'INSERT INTO login_attempts (ip, attempted_at, success) VALUES (?, ?, 1)',
        args: [ip, Date.now()]
      });
      // El token NUNCA se devuelve en el body: solo vive en la cookie HttpOnly
      return res.status(200).json({ ok: true });
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
