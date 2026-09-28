import crypto from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export function createToken(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not configured');
  
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + 8 * 60 * 60 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function verifyAuth(req: VercelRequest, res: VercelResponse): boolean {
  const secretKeyConfig = process.env.ADMIN_SECRET_KEY;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  
  if (!secretKeyConfig || !sessionSecret) {
    res.status(500).json({ error: 'Server configuration error' });
    return false;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const parts = token.split('.');
  if (parts.length !== 2) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }

  const [payload, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', sessionSecret).update(payload).digest('base64url');
  
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!decoded.exp || Date.now() > decoded.exp) {
      res.status(401).json({ error: 'Token expired' });
      return false;
    }
  } catch (e) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }

  return true;
}
