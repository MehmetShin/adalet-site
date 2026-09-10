const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.resolve(__dirname, 'public');
const DATA_FILE = path.resolve(__dirname, 'data.json');

const ADMIN_USER = 'Turkadaletadmin423';
const ADMIN_PASS = 'tIy$C_[{rRIGR-k7Ss!dn6AWx-z4C5uIfrC.{cE3';

// Salted Hash Generation for Admin Pass
const ADMIN_SALT = 'Adalet_Super_Secret_Salt_2026';
const ADMIN_PASS_HASH = crypto.pbkdf2Sync(ADMIN_PASS, ADMIN_SALT, 10000, 64, 'sha512').toString('hex');

// In-memory active sessions
const activeSessions = new Map();
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours

// Admin Rate Limiting (Brute-force protection)
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW = 15 * 60 * 1000; // 15 mins block

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
  for (const [token, data] of activeSessions.entries()) {
    if (now > data.expiresAt) {
      activeSessions.delete(token);
    }
  }
}, RATE_LIMIT_WINDOW);

// Helper function to read/write persistent data
function loadStoreData() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error loading data.json:', e);
    }
  }
  return {
    shopierEarnings: 145800, // Default baseline shopier total revenue
    products: null,
    categories: null
  };
}

function saveStoreData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving data.json:', e);
  }
}

// Session validation helper
function checkAdminAuth(req) {
  const cookieHeader = req.headers.cookie || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const parts = c.trim().split('=');
      return [parts[0], parts.slice(1).join('=')];
    })
  );
  const token = cookies['adm_sess'];
  if (!token) return false;

  const session = activeSessions.get(token);
  if (!session || Date.now() > session.expiresAt) {
    if (session) activeSessions.delete(token);
    return false;
  }
  return true;
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 5 * 1024 * 1024) { // 5MB limit
        req.destroy();
        reject(new Error('Body too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const clientIp = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown';

  // Rate limiter
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
    res.writeHead(429, { 'Content-Type': 'text/plain; charset=utf-8', 'Retry-After': '60' });
    return res.end('429 Too Many Requests - Lütfen biraz bekleyin.');
  }

  // Security scanner check
  const userAgent = req.headers['user-agent'] || '';
  if (!userAgent || /curl|wget|python|nikto|sqlmap|nmap|dirbuster|gobuster/i.test(userAgent)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('403 Access Denied');
  }

  // Security Headers
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

  // API ROUTING FOR ADMIN & PUBLIC DATA
  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // GET Public Store Data (products, categories, shopier totals if configured)
    if (pathname === '/api/store-data' && req.method === 'GET') {
      const data = loadStoreData();
      return res.end(JSON.stringify({ success: true, data }));
    }

    // POST Login Endpoint
    if (pathname === '/api/admin/login' && req.method === 'POST') {
      const attempts = loginAttempts.get(clientIp) || { count: 0, lockUntil: 0 };
      if (now < attempts.lockUntil) {
        res.writeHead(429);
        return res.end(JSON.stringify({ success: false, message: 'Çok fazla hatalı deneme! Lütfen 15 dakika bekleyin.' }));
      }

      try {
        const { username, password } = await parseJsonBody(req);
        const inputHash = crypto.pbkdf2Sync(password || '', ADMIN_SALT, 10000, 64, 'sha512').toString('hex');

        if (username === ADMIN_USER && inputHash === ADMIN_PASS_HASH) {
          loginAttempts.delete(clientIp);
          const token = crypto.randomBytes(32).toString('hex');
          activeSessions.set(token, {
            ip: clientIp,
            createdAt: now,
            expiresAt: now + SESSION_DURATION
          });

          res.setHeader('Set-Cookie', `adm_sess=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800`);
          return res.end(JSON.stringify({ success: true, message: 'Giriş başarılı' }));
        } else {
          attempts.count++;
          if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
            attempts.lockUntil = now + LOGIN_WINDOW;
          }
          loginAttempts.set(clientIp, attempts);

          res.writeHead(401);
          return res.end(JSON.stringify({ success: false, message: 'Geçersiz kullanıcı adı veya şifre!' }));
        }
      } catch (e) {
        res.writeHead(400);
        return res.end(JSON.stringify({ success: false, message: 'Geçersiz İstek' }));
      }
    }

    // Admin Logout Endpoint
    if (pathname === '/api/admin/logout' && req.method === 'POST') {
      const cookieHeader = req.headers.cookie || '';
      const cookies = Object.fromEntries(cookieHeader.split(';').map(c => c.trim().split('=')));
      if (cookies['adm_sess']) {
        activeSessions.delete(cookies['adm_sess']);
      }
      res.setHeader('Set-Cookie', 'adm_sess=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');
      return res.end(JSON.stringify({ success: true }));
    }

    // Check Session Auth Status
    if (pathname === '/api/admin/check-auth' && req.method === 'GET') {
      const isAuth = checkAdminAuth(req);
      return res.end(JSON.stringify({ authenticated: isAuth }));
    }

    // Protected Admin Data Save Endpoint
    if (pathname === '/api/admin/save-data' && req.method === 'POST') {
      if (!checkAdminAuth(req)) {
        res.writeHead(403);
        return res.end(JSON.stringify({ success: false, message: 'Erişim engellendi.' }));
      }

      try {
        const payload = await parseJsonBody(req);
        const currentData = loadStoreData();

        if (payload.shopierEarnings !== undefined) currentData.shopierEarnings = payload.shopierEarnings;
        if (payload.products !== undefined) currentData.products = payload.products;
        if (payload.categories !== undefined) currentData.categories = payload.categories;

        saveStoreData(currentData);
        return res.end(JSON.stringify({ success: true, message: 'Değişiklikler başarıyla kaydedildi.' }));
      } catch (e) {
        res.writeHead(500);
        return res.end(JSON.stringify({ success: false, message: 'Hata oluştu' }));
      }
    }

    // Unauthorized API request fallback -> 404 Not Found to prevent discovery
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('404 Not Found');
  }

  // ROUTE ACCESS & SECRET DASHBOARD PROTECTION
  if (pathname === '/index.html') {
    res.writeHead(301, { 'Location': '/' });
    return res.end();
  }

  // Handle secret /dashadminx route
  if (pathname === '/dashadminx' || pathname === '/dashadminx.html') {
    pathname = '/dashadminx.html';
  } else {
    // SECURITY REQUIREMENT: Any fake admin attempt or unlisted page must strictly 404
    if (pathname.includes('admin') || pathname.includes('login') || pathname.includes('dashboard')) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end('<!DOCTYPE html><html><head><title>404 Not Found</title></head><body style="background:#090a0f;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;"><h1>404 | Sayfa Bulunamadı</h1></body></html>');
    }

    if (pathname === '/') {
      pathname = '/index.html';
    } else if (!path.extname(pathname)) {
      const htmlFile = path.join(PUBLIC_DIR, pathname + '.html');
      if (fs.existsSync(htmlFile)) {
        pathname = pathname + '.html';
      }
    }
  }

  const safeFilePath = path.normalize(path.join(PUBLIC_DIR, pathname));
  if (!safeFilePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('404 Not Found');
  }

  const ext = path.extname(safeFilePath).toLowerCase();

  fs.readFile(safeFilePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<!DOCTYPE html><html><head><title>404 Not Found</title></head><body style="background:#090a0f;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;"><h1>404 | Sayfa Bulunamadı</h1></body></html>');
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