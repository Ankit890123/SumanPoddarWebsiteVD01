import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW_MS = 60000;
const RATE_LIMIT_MAX = 5;

function checkViteRateLimit(ip) {
  const now = Date.now();
  const timestamps = (rateLimitStore.get(ip) || []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT_MAX) {
    rateLimitStore.set(ip, timestamps);
    return false;
  }
  timestamps.push(now);
  rateLimitStore.set(ip, timestamps);
  return true;
}

function contactApiPlugin() {
  return {
    name: 'contact-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';

        if (url === '/api/contact/health' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          return res.end(JSON.stringify({
            status: 'healthy',
            service: 'tecnosra Contact API',
            timestamp: new Date().toISOString()
          }));
        }

        if (url === '/api/contact' && req.method === 'POST') {
          const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
          if (!checkViteRateLimit(clientIp)) {
            res.statusCode = 429;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({
              success: false,
              error: 'Rate limit exceeded. Please wait 60 seconds before submitting another inquiry.'
            }));
          }

          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}');
              const name = (data.name || '').trim();
              const email = (data.email || '').trim();
              const phone = (data.phone || '').trim();
              const notes = (data.notes || data.description || data.message || '').trim();

              if (!name) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ success: false, error: 'Name is required' }));
              }
              if (!email || !email.includes('@')) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ success: false, error: 'Valid email is required' }));
              }
              if (!phone) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ success: false, error: 'Phone number is required' }));
              }
              if (!notes) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ success: false, error: 'Project description is required' }));
              }

              const backupPath = resolve(__dirname, 'contacts.json');
              let inquiries = [];
              try {
                if (fs.existsSync(backupPath)) {
                  inquiries = JSON.parse(fs.readFileSync(backupPath, 'utf8') || '[]');
                }
              } catch (e) {
                inquiries = [];
              }

              const newRecord = {
                id: Date.now(),
                name,
                email,
                phone,
                notes,
                ip_address: req.socket.remoteAddress || '127.0.0.1',
                created_at: new Date().toISOString(),
                status: 'pending'
              };

              inquiries.push(newRecord);
              fs.writeFileSync(backupPath, JSON.stringify(inquiries, null, 2), 'utf8');

              res.statusCode = 201;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({
                success: true,
                message: `Thank you ${name}! Inquiry received successfully. Suman Poddar & tecnosra team will reach out within 24 hours.`,
                inquiry_id: newRecord.id
              }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: false, error: 'Failed to process inquiry' }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [contactApiPlugin()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        contact: resolve(__dirname, 'contact.html'),
        course: resolve(__dirname, 'my-course.html'),
        portfolio: resolve(__dirname, 'portfolio.html'),
      },
    },
  },
});
