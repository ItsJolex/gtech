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

      const customerName = String(body.customerName || '').trim();
      const customerEmail = String(body.customerEmail || '').trim().toLowerCase();
      const customerPhone = body.customerPhone ? String(body.customerPhone).trim() : null;
      const companyName = body.companyName ? String(body.companyName).trim() : null;
      const destination = String(body.destination || '').trim();
      const notes = body.notes ? String(body.notes).trim() : null;
      const items = Array.isArray(body.items) ? body.items : [];
      const totalUnits = Number(body.totalUnits) || items.reduce((s: number, i: any) => s + (Number(i.quantity) || 1), 0);
      const simPlan = body.simPlan ? String(body.simPlan).trim() : 'none';
      const channel = body.channel ? String(body.channel).trim() : 'gmail';

      // Validation
      if (!customerName || customerName.length < 2) {
        return res.status(400).json({ error: 'Customer name is required' });
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
      const quoteNumber = generateQuoteNumber();
      const id = `quote-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      
      const forwarded = req.headers['x-forwarded-for'];
      const ip = Array.isArray(forwarded) ? forwarded[0] : (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket?.remoteAddress || null);

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

  // ----------------------------------------------------
  // GET: Read quote by quoteNumber or query (read-only)
  // ----------------------------------------------------
  if (req.method === 'GET') {
    try {
      const { quoteNumber } = req.query;
      if (!quoteNumber) {
        return res.status(400).json({ error: 'quoteNumber is required' });
      }

      const client = getTursoClient();
      const result = await client.execute({
        sql: `SELECT id, quote_number, customer_name, customer_email, destination, total_units, status, created_at FROM quotes WHERE quote_number = ? LIMIT 1`,
        args: [String(quoteNumber)]
      });

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Quote not found' });
      }

      return res.status(200).json(result.rows[0]);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Database query error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
