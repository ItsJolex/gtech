import type { VercelRequest, VercelResponse } from '@vercel/node';

export function applyCors(req: VercelRequest, res: VercelResponse) {
  const allowedStr = process.env.ALLOWED_ORIGINS || '';
  const allowedOrigins = allowedStr.split(',').map(s => s.trim()).filter(Boolean);
  
  if (process.env.NODE_ENV !== 'production') {
    if (!allowedOrigins.includes('http://localhost:5173')) allowedOrigins.push('http://localhost:5173');
    if (!allowedOrigins.includes('https://localhost:5173')) allowedOrigins.push('https://localhost:5173');
  }

  const origin = req.headers.origin || '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
}
