const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.resolve(__dirname, 'public');
const DATA_FILE = path.resolve(__dirname, 'data.json');

const ADMIN_USER = 'Turkadaletadmin423';
const ADMIN_PASS = 'tIy$C_[{rRIGR-k7Ss!dn6AWx-z4C5uIfrC.{cE3';

const ADMIN_SALT = 'Adalet_Super_Secret_Salt_2026';
const ADMIN_PASS_HASH = crypto.pbkdf2Sync(ADMIN_PASS, ADMIN_SALT, 10000, 64, 'sha512').toString('hex');

const activeSessions = new Map();
const SESSION_DURATION = 8 * 60 * 60 * 1000;

const bannedIps = new Map();
const BAN_DURATION = 24 * 60 * 60 * 1000;

const TRAP_ROUTES = [
  '/admin', '/wp-admin', '/login', '/dashboard', '/administrator',
  '/admin.php', '/wp-login.php', '/user/login', '/cpanel', '/phpmyadmin'
];

const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW = 15 * 60 * 1000;

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
  for (const [ip, until] of bannedIps.entries()) {
    if (now > until) {
      bannedIps.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW);

function loadStoreData() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (!parsed.auditLogs) parsed.auditLogs = [];
      return parsed;
    } catch (e) {
      console.error('Error loading data.json:', e);
    }
  }
  return {
    shopierEarnings: 145800,
    products: null,
    categories: null,
    auditLogs: []
  };
}

function saveStoreData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving data.json:', e);
  }
}

function addAuditLog({ type, ip, userAgent, details, status }) {
  try {
    const data = loadStoreData();
    if (!data.auditLogs) data.auditLogs = [];
    data.auditLogs.unshift({
      id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
      timestamp: new Date().toISOString(),
      type: type || 'SECURITY_EVENT',
      ip: ip || 'unknown',
      userAgent: userAgent ? userAgent.substring(0, 100) : 'unknown',
      details: details || '',
      status: status || 'INFO'
    });
    if (data.auditLogs.length > 100) {
      data.auditLogs = data.auditLogs.slice(0, 100);
    }
    saveStoreData(data);
  } catch (e) {
    console.error('Audit log write error:', e);
  }
}

function sanitizeText(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^>\s]+/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/<\/?(?:script|iframe|object|embed|form|input|button|style)\b[^>]*>/gi, '');
}

function sanitizePayload(obj, clientIp, userAgent) {
  let detectedXss = false;

  function clean(val) {
    if (typeof val === 'string') {
      const sanitized = sanitizeText(val);
      if (sanitized !== val) detectedXss = true;
      return sanitized;
    } else if (Array.isArray(val)) {
      return val.map(clean);
    } else if (val !== null && typeof val === 'object') {
      const res = {};
      for (const k of Object.keys(val)) {
        res[k] = clean(val[k]);
      }
      return res;
    }
    return val;
  }

  const cleaned = clean(obj);
  if (detectedXss) {
    addAuditLog({
      type: 'XSS_ATTEMPT',
      ip: clientIp,
      userAgent: userAgent,
      details: 'Payload içerisinde zararlı betik (XSS) tespit edildi ve dezenfekte edildi.',
      status: 'BLOCKED'
    });
  }
  return cleaned;
}

function getSessionFromReq(req) {
  const cookieHeader = req.headers.cookie || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const parts = c.trim().split('=');
      return [parts[0], parts.slice(1).join('=')];
    })
  );
  const token = cookies['adm_sess'];
  if (!token) return null;

  const session = activeSessions.get(token);
  if (!session || Date.now() > session.expiresAt) {
    if (session) activeSessions.delete(token);
    return null;
  }
  return { token, session };
}

function checkAdminAuth(req) {
  const sessObj = getSessionFromReq(req);
  return !!sessObj;
}

function verifyCsrfToken(req) {
  const sessObj = getSessionFromReq(req);
  if (!sessObj) return false;
  const reqCsrf = req.headers['x-csrf-token'] || '';
  return reqCsrf && reqCsrf === sessObj.session.csrfToken;
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 5 * 1024 * 1024) {
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

const requestHandler = async (req, res) => {
  const clientIp = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || '';

  const now = Date.now();
  const bannedUntil = bannedIps.get(clientIp);
  if (bannedUntil && now < bannedUntil) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('403 Forbidden - IP adresiniz güvenlik ihlali nedeniyle 24 saat engellendi.');
  }

  const clientData = requestCounts.get(clientIp) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };

  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + RATE_LIMIT_WINDOW;
  } else {
    clientData.count++;
  }
  requestCounts.set(clientIp, clientData);

  if (clientData.count > MAX_REQUESTS_PER_WINDOW) {
    addAuditLog({ type: 'RATE_LIMIT_EXCEEDED', ip: clientIp, userAgent, details: 'Dakikalık 120 istek limiti aşıldı', status: 'BLOCKED' });
    res.writeHead(429, { 'Content-Type': 'text/plain; charset=utf-8', 'Retry-After': '60' });
    return res.end('429 Too Many Requests - Lütfen biraz bekleyin.');
  }

  if (!userAgent || /curl|wget|python|nikto|sqlmap|nmap|dirbuster|gobuster/i.test(userAgent)) {
    addAuditLog({ type: 'SCANNER_BLOCKED', ip: clientIp, userAgent, details: `Güvenlik tarayıcısı tespit edildi: ${userAgent}`, status: 'BLOCKED' });
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
    const rawUrl = req.url || '/';
    const parsedUrl = new URL(rawUrl, `http://${req.headers.host || 'localhost'}`);
    pathname = decodeURIComponent(parsedUrl.pathname);

    if ((pathname === '/api' || pathname === '/api/' || pathname.includes('/api/index') || pathname.includes('/api/[...path]'))) {
      const qPath = parsedUrl.searchParams.get('path');
      if (qPath) {
        pathname = '/api/' + Array.isArray(qPath) ? qPath.join('/') : qPath.replace(/^\//, '');
      }
    }
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('400 Bad Request');
  }

  if (TRAP_ROUTES.includes(pathname.toLowerCase())) {
    bannedIps.set(clientIp, now + BAN_DURATION);
    addAuditLog({
      type: 'HONEYPOT_TRAP',
      ip: clientIp,
      userAgent: userAgent,
      details: `Sahte admin tuzak yoluna erişildi: ${pathname}. IP 24 saat engellendi.`,
      status: 'BANNED_24H'
    });
    res.writeHead(403, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end('<!DOCTYPE html><html><head><title>403 Forbidden</title></head><body style="background:#07090e;color:#e53e3e;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;"><h1>403 Forbidden | Güvenlik ihlali tespit edildi. IP adresiniz engellendi.</h1></body></html>');
  }

  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (pathname === '/api/store-data' && req.method === 'GET') {
      const data = loadStoreData();
      return res.end(JSON.stringify({ success: true, data: { shopierEarnings: data.shopierEarnings, products: data.products, categories: data.categories } }));
    }

    if (pathname === '/api/admin/login' && req.method === 'POST') {
      const attempts = loginAttempts.get(clientIp) || { count: 0, lockUntil: 0 };
      if (now < attempts.lockUntil) {
        addAuditLog({ type: 'LOGIN_LOCKED', ip: clientIp, userAgent, details: 'Kilitlenmiş IP adresinden giriş denemesi', status: 'BLOCKED' });
        res.writeHead(429);
        return res.end(JSON.stringify({ success: false, message: 'Çok fazla hatalı deneme! Lütfen 15 dakika bekleyin.' }));
      }

      try {
        const { username, password } = await parseJsonBody(req);
        const inputHash = crypto.pbkdf2Sync(password || '', ADMIN_SALT, 10000, 64, 'sha512').toString('hex');

        if (username === ADMIN_USER && inputHash === ADMIN_PASS_HASH) {
          loginAttempts.delete(clientIp);
          const token = crypto.randomBytes(32).toString('hex');
          const csrfToken = crypto.randomBytes(32).toString('hex');

          activeSessions.set(token, {
            ip: clientIp,
            userAgent: userAgent,
            csrfToken: csrfToken,
            createdAt: now,
            expiresAt: now + SESSION_DURATION
          });

          addAuditLog({
            type: 'LOGIN_SUCCESS',
            ip: clientIp,
            userAgent: userAgent,
            details: `Yönetici girişi başarılı (${username})`,
            status: 'SUCCESS'
          });

          res.setHeader('Set-Cookie', `adm_sess=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800`);
          return res.end(JSON.stringify({ success: true, message: 'Giriş başarılı', csrfToken }));
        } else {
          attempts.count++;
          if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
            attempts.lockUntil = now + LOGIN_WINDOW;
          }
          loginAttempts.set(clientIp, attempts);

          addAuditLog({
            type: 'LOGIN_FAILED',
            ip: clientIp,
            userAgent: userAgent,
            details: `Hatalı kullanıcı adı (${username}) veya şifre denemesi (${attempts.count}/${MAX_LOGIN_ATTEMPTS})`,
            status: 'FAILED'
          });

          res.writeHead(401);
          return res.end(JSON.stringify({ success: false, message: 'Geçersiz kullanıcı adı veya şifre!' }));
        }
      } catch (e) {
        res.writeHead(400);
        return res.end(JSON.stringify({ success: false, message: 'Geçersiz İstek' }));
      }
    }

    if (pathname === '/api/admin/logout' && req.method === 'POST') {
      const cookieHeader = req.headers.cookie || '';
      const cookies = Object.fromEntries(cookieHeader.split(';').map(c => c.trim().split('=')));
      if (cookies['adm_sess']) {
        activeSessions.delete(cookies['adm_sess']);
      }
      addAuditLog({ type: 'LOGOUT', ip: clientIp, userAgent, details: 'Yönetici oturumu kapatıldı', status: 'SUCCESS' });
      res.setHeader('Set-Cookie', 'adm_sess=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');
      return res.end(JSON.stringify({ success: true }));
    }

    if (pathname === '/api/admin/check-auth' && req.method === 'GET') {
      const sessObj = getSessionFromReq(req);
      if (sessObj) {
        return res.end(JSON.stringify({ authenticated: true, csrfToken: sessObj.session.csrfToken }));
      } else {
        return res.end(JSON.stringify({ authenticated: false }));
      }
    }

    if (pathname === '/api/admin/audit-logs' && req.method === 'GET') {
      if (!checkAdminAuth(req)) {
        res.writeHead(403);
        return res.end(JSON.stringify({ success: false, message: 'Erişim engellendi.' }));
      }
      const data = loadStoreData();
      return res.end(JSON.stringify({ success: true, logs: data.auditLogs || [] }));
    }

    if (pathname === '/api/admin/clear-logs' && req.method === 'POST') {
      if (!checkAdminAuth(req)) {
        res.writeHead(403);
        return res.end(JSON.stringify({ success: false, message: 'Erişim engellendi.' }));
      }
      if (!verifyCsrfToken(req)) {
        addAuditLog({ type: 'CSRF_VIOLATION', ip: clientIp, userAgent, details: 'Log temizleme işleminde CSRF token eşleşmedi', status: 'BLOCKED' });
        res.writeHead(403);
        return res.end(JSON.stringify({ success: false, message: 'CSRF Güvenlik İhlali' }));
      }

      const currentData = loadStoreData();
      currentData.auditLogs = [];
      saveStoreData(currentData);

      addAuditLog({ type: 'CLEAR_LOGS', ip: clientIp, userAgent, details: 'Güvenlik günlükleri temizlendi', status: 'SUCCESS' });
      return res.end(JSON.stringify({ success: true, message: 'Güvenlik logları temizlendi.' }));
    }

    if (pathname === '/api/admin/save-data' && req.method === 'POST') {
      if (!checkAdminAuth(req)) {
        res.writeHead(403);
        return res.end(JSON.stringify({ success: false, message: 'Erişim engellendi.' }));
      }
      if (!verifyCsrfToken(req)) {
        addAuditLog({ type: 'CSRF_VIOLATION', ip: clientIp, userAgent, details: 'Veri kaydetmede CSRF token eşleşmedi', status: 'BLOCKED' });
        res.writeHead(403);
        return res.end(JSON.stringify({ success: false, message: 'CSRF Güvenlik İhlali! İstek reddedildi.' }));
      }

      try {
        const rawPayload = await parseJsonBody(req);

        const payload = sanitizePayload(rawPayload, clientIp, userAgent);

        const currentData = loadStoreData();
        if (payload.shopierEarnings !== undefined) currentData.shopierEarnings = payload.shopierEarnings;
        if (payload.products !== undefined) currentData.products = payload.products;
        if (payload.categories !== undefined) currentData.categories = payload.categories;

        saveStoreData(currentData);
        addAuditLog({ type: 'DATA_SAVE', ip: clientIp, userAgent, details: 'Mağaza ürün/kazanç verileri güncellendi', status: 'SUCCESS' });
        return res.end(JSON.stringify({ success: true, message: 'Değişiklikler başarıyla kaydedildi.' }));
      } catch (e) {
        res.writeHead(500);
        return res.end(JSON.stringify({ success: false, message: 'Hata oluştu' }));
      }
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('404 Not Found');
  }

  if (pathname === '/index.html') {
    res.writeHead(301, { 'Location': '/' });
    return res.end();
  }

  if (pathname === '/dashadminx' || pathname === '/dashadminx.html') {
    pathname = '/dashadminx.html';
  } else {

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
};

module.exports = requestHandler;

if (require.main === module) {
  const server = http.createServer(requestHandler);
  server.listen(PORT, () => {
    console.log(`[Güvenli Sunucu Aktif] Port: ${PORT}`);
  });
}

process.on('uncaughtException', (err) => {
  console.error('[Server Error] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Server Error] Unhandled Rejection:', reason);
});