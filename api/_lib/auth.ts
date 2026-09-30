import crypto from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const TOKEN_COOKIE = 'gtech_admin_token';
const TOKEN_MAX_AGE = 8 * 60 * 60; // 8 horas (segundos)

function getSessionSecret(): string | null {
  if (process.env.ADMIN_SESSION_SECRET) {
    return process.env.ADMIN_SESSION_SECRET;
  }
  if (process.env.ADMIN_SECRET_KEY) {
    return crypto.createHash('sha256').update(process.env.ADMIN_SECRET_KEY + '_gtech_session_salt_2026').digest('hex');
  }
  return null;
}

export function createToken(): string {
  const secret = getSessionSecret();
  if (!secret) throw new Error('ADMIN_SECRET_KEY is not configured');

  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + 8 * 60 * 60 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function cookieFlags(): string {
  const secure = process.env.VERCEL ? '; Secure' : '';
  return `HttpOnly; SameSite=Strict; Path=/; Max-Age=${TOKEN_MAX_AGE}${secure}`;
}

export function setAuthCookie(res: VercelResponse, token: string): void {
  res.setHeader('Set-Cookie', `${TOKEN_COOKIE}=${token}; ${cookieFlags()}`);
}

export function clearAuthCookie(res: VercelResponse): void {
  res.setHeader('Set-Cookie', `${TOKEN_COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${process.env.VERCEL ? '; Secure' : ''}`);
}

function extractToken(req: VercelRequest): string | null {
  // 1) Cookie HttpOnly (preferido: inaccesible para JavaScript)
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    for (const part of cookieHeader.split(';')) {
      const idx = part.indexOf('=');
      if (idx === -1) continue;
      if (part.slice(0, idx).trim() === TOKEN_COOKIE) {
        return decodeURIComponent(part.slice(idx + 1).trim());
      }
    }
  }

  // 2) Authorization: Bearer (compatibilidad durante transición)
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const bearer = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (bearer) return bearer;
  }

  return null;
}

function isOriginAllowed(req: VercelRequest): boolean {
  const origin = req.headers.origin;
  if (!origin) return true; // peticiones same-origin sin Origin (curl) o no-navegador

  try {
    const originUrl = new URL(origin);
    const host = req.headers.host;
    if (host && originUrl.host === host) return true; // same-origin
  } catch {
    return false;
  }

  const allowedStr = process.env.ALLOWED_ORIGINS || '';
  const allowed = allowedStr.split(',').map((s) => s.trim()).filter(Boolean);
  return allowed.includes(origin);
}

function verifyToken(token: string, secret: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [payload, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return false;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!decoded.exp || Date.now() > decoded.exp) return false;
  } catch {
    return false;
  }

  return true;
}

export function verifyAuth(req: VercelRequest, res: VercelResponse): boolean {
  const secretKeyConfig = process.env.ADMIN_SECRET_KEY;
  const sessionSecret = getSessionSecret();

  if (!secretKeyConfig || !sessionSecret) {
    res.status(500).json({ error: 'Server configuration error: ADMIN_SECRET_KEY not set' });
    return false;
  }

  // Protección CSRF: si hay Origin, debe ser del propio dominio o una allowlist explícita
  if (!isOriginAllowed(req)) {
    res.status(403).json({ error: 'Forbidden origin' });
    return false;
  }

  const token = extractToken(req);
  if (!token || !verifyToken(token, sessionSecret)) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }

  return true;
}
