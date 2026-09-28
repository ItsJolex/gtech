import { createClient } from '@libsql/client/web';
import type { VercelRequest, VercelResponse } from '@vercel/node';

function getTursoClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    throw new Error('TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is not configured');
  }
  return createClient({ url, authToken });
}

function generateQuoteNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `GT-${year}${month}${day}-${rand}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ----------------------------------------------------
  // POST: Submit a new quotation / order request
  // ----------------------------------------------------
  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      
      // Anti-bot honeypot verification
      if (body._honey || body.website_url) {
        console.warn('Bot detected via honeypot field');
        return res.status(200).json({ success: true, message: 'Received' });
      }

      const customerName = String(body.customerName || '').trim().slice(0, 100);
      const customerEmail = String(body.customerEmail || '').trim().toLowerCase().slice(0, 100);
      const customerPhone = body.customerPhone ? String(body.customerPhone).trim().slice(0, 30) : null;
      const companyName = body.companyName ? String(body.companyName).trim().slice(0, 100) : null;
      const destination = String(body.destination || '').trim().slice(0, 200);
      const notes = body.notes ? String(body.notes).trim().slice(0, 1500) : null;
      
      const rawItems = Array.isArray(body.items) ? body.items.slice(0, 50) : [];
      const items = rawItems.map((i: any) => ({
        id: String(i.id || '').slice(0, 50),
        name: String(i.name || '').slice(0, 150),
        quantity: Math.min(Math.max(1, Number(i.quantity) || 1), 1000),
        badge: String(i.badge || '').slice(0, 50),
        selectedColor: i.selectedColor ? String(i.selectedColor).slice(0, 50) : null
      }));

      const totalUnits = Number(body.totalUnits) || items.reduce((s: number, i: any) => s + (Number(i.quantity) || 1), 0);
      const simPlan = String(body.simPlan || 'none').trim().slice(0, 50);
      const channel = String(body.channel || 'gmail').trim().slice(0, 30);

      // Validation
      if (!customerName || customerName.length < 2) {
        return res.status(400).json({ error: 'Customer name is required (min 2 characters)' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!customerEmail || !emailRegex.test(customerEmail)) {
        return res.status(400).json({ error: 'Valid email address is required' });
      }

      if (!destination || destination.length < 2) {
        return res.status(400).json({ error: 'Delivery destination is required' });
      }

      if (items.length === 0) {
        return res.status(400).json({ error: 'Order must contain at least one item' });
      }

      const client = getTursoClient();
      
      const forwarded = req.headers['x-real-ip'] || req.headers['x-forwarded-for'];
      const ip = Array.isArray(forwarded) ? forwarded[0] : (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket?.remoteAddress || null);

      // Rate limiting: max 15 quotes per 10 minutes per IP
      if (ip) {
        try {
          const rateCheck = await client.execute({
            sql: `SELECT COUNT(*) as count FROM quotes WHERE ip_address = ? AND created_at > datetime('now', '-10 minutes');`,
            args: [ip]
          });
          const recentCount = Number(rateCheck.rows[0]?.count || 0);
          if (recentCount >= 15) {
            return res.status(429).json({ error: 'Too many quote requests from your connection. Please wait a few minutes or contact us directly via WhatsApp.' });
          }
        } catch (rateErr) {
          console.warn('Rate limit query bypassed:', rateErr);
        }
      }

      const quoteNumber = generateQuoteNumber();
      const id = `quote-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      const insertSql = `
        INSERT INTO quotes (
          id, quote_number, customer_name, customer_email, customer_phone,
          company_name, destination, notes, items, total_units,
          sim_plan, channel, status, ip_address, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, 'pending', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );
      `;

      await client.execute({
        sql: insertSql,
        args: [
          id,
          quoteNumber,
          customerName,
          customerEmail,
          customerPhone,
          companyName,
          destination,
          notes,
          JSON.stringify(items),
          totalUnits,
          simPlan,
          channel,
          ip
        ]
      });

      console.log(`[Quote Created] #${quoteNumber} by ${customerName} (${customerEmail}) - ${totalUnits} units`);

      return res.status(201).json({
        success: true,
        id,
        quoteNumber,
        customerName,
        totalUnits,
        message: 'Quote recorded successfully'
      });
    } catch (err: any) {
      console.error('Error in /api/quotes POST:', err);
      return res.status(500).json({ error: err.message || 'Database error while saving quote' });
    }
  }

  
  return res.status(405).json({ error: 'Method not allowed' });
}
