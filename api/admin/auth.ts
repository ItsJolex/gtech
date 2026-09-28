const rateLimit = new Map<string, {count: number, lastAttempt: number}>();
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || '';
  if (origin.includes('localhost') || origin.includes('gtech.us') || origin.includes('g-tech.us')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const ipStr = Array.isArray(ip) ? ip[0] : ip;
  const now = Date.now();
  const rate = rateLimit.get(ipStr) || { count: 0, lastAttempt: now };
  
  if (now - rate.lastAttempt > 15 * 60 * 1000) {
    rate.count = 0;
  }
  rate.lastAttempt = now;
  rate.count++;
  rateLimit.set(ipStr, rate);

  if (rate.count > 5) {
    return res.status(429).json({ error: 'Too many failed attempts, please try again later' });
  }


  const { password } = req.body || {};
  const secretKey = process.env.ADMIN_SECRET_KEY;
  if (!secretKey) return res.status(500).json({ error: 'ADMIN_SECRET_KEY not configured' });

  if (!password) {
    return res.status(400).json({ ok: false, error: 'Password is required' });
  }

  if (password === secretKey) {
    return res.status(200).json({ ok: true, token: secretKey });
  }

  return res.status(401).json({ ok: false, error: 'Invalid admin password' });
}
