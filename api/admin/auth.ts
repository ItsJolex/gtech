import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body || {};
  const secretKey = process.env.ADMIN_SECRET_KEY || 'gtech_admin_2026_tactical';

  if (!password) {
    return res.status(400).json({ ok: false, error: 'Password is required' });
  }

  if (password === secretKey) {
    return res.status(200).json({ ok: true, token: secretKey });
  }

  return res.status(401).json({ ok: false, error: 'Invalid admin password' });
}
