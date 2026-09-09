const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.resolve(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 120;

setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of requestCounts.entries()) {
    if (now > data.resetTime) {
      requestCounts.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW);

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('405 Method Not Allowed');
  }

  const clientIp = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown';

  const now = Date.now();
  const clientData = requestCounts.get(clientIp) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };

  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + RATE_LIMIT_WINDOW;
  } else {
    clientData.count++;
  }
  requestCounts.set(clientIp, clientData);

  if (clientData.count > MAX_REQUESTS_PER_WINDOW) {
    res.writeHead(429, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Retry-After': '60'
    });
    return res.end('429 Too Many Requests - Lütfen biraz bekleyin.');
  }

  const userAgent = req.headers['user-agent'] || '';
  if (!userAgent || /curl|wget|python|nikto|sqlmap|nmap|dirbuster|gobuster/i.test(userAgent)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('403 Access Denied');
  }

  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self';");
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  res.removeHeader('X-Powered-By');

  let pathname = '';
  try {
    pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname);
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('400 Bad Request');
  }

  if (pathname === '/index.html') {
    res.writeHead(301, { 'Location': '/' });
    return res.end();
  }

  if (pathname === '/') {
    pathname = '/index.html';
  } else if (!path.extname(pathname)) {
    const htmlFile = path.join(PUBLIC_DIR, pathname + '.html');
    if (fs.existsSync(htmlFile)) {
      pathname = pathname + '.html';
    }
  }

  const safeFilePath = path.normalize(path.join(PUBLIC_DIR, pathname));
  if (!safeFilePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('403 Forbidden - Erişimsiz Bölge');
  }

  const ext = path.extname(safeFilePath).toLowerCase();

  fs.readFile(safeFilePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found - Sayfa Bulunamadı');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 Internal Server Error');
      }
    } else {
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        'Cache-Control': ext === '.html' ? 'no-cache, no-store, must-revalidate' : 'public, max-age=86400'
      });
      if (req.method === 'HEAD') {
        res.end();
      } else {
        res.end(content);
      }
    }
  });
});

process.on('uncaughtException', (err) => {
  console.error('[Server Error] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Server Error] Unhandled Rejection:', reason);
});

server.listen(PORT, () => {
  console.log(`[Güvenli Sunucu Aktif] Port: ${PORT}`);
});