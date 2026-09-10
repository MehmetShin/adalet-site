const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.resolve(__dirname, 'public');
const DATA_FILE = path.resolve(__dirname, 'data.json');

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;
const ADMIN_SALT = process.env.ADMIN_SALT;

if (!ADMIN_USER || !ADMIN_PASS) {
  console.error('[GÜVENLİK UYARISI] ADMIN_USER veya ADMIN_PASS environment variable tanımlanmamış!');
}

const SHOPIER_API_TOKEN = process.env.SHOPIER_API_TOKEN;
const SHOPIER_API_SECRET = process.env.SHOPIER_API_SECRET || SHOPIER_API_TOKEN;

const activeSessions = new Map();
const SESSION_DURATION = 8 * 60 * 60 * 1000;

if (!global._auditLogs) global._auditLogs = [];
if (!global._auditLogsLoaded) {
  try {
    const tmpLogFile = '/tmp/adalet_audit.json';
    if (fs.existsSync(tmpLogFile)) {
      const parsed = JSON.parse(fs.readFileSync(tmpLogFile, 'utf-8'));
      if (Array.isArray(parsed) && parsed.length > 0) {
        global._auditLogs = parsed;
      }
    }
  } catch (e) { }
  global._auditLogsLoaded = true;
}
if (!global._bannedIps) global._bannedIps = new Map();
if (!global._loginAttempts) global._loginAttempts = new Map();
if (!global._requestCounts) global._requestCounts = new Map();

const bannedIps = global._bannedIps;
const BAN_DURATION = 24 * 60 * 60 * 1000;

const TRAP_ROUTES = [
  '/admin', '/wp-admin', '/login', '/dashboard', '/administrator',
  '/admin.php', '/wp-login.php', '/user/login', '/cpanel', '/phpmyadmin'
];

const loginAttempts = global._loginAttempts;
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

const requestCounts = global._requestCounts;
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 120;

const cleanupTimer = setInterval(() => {
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

if (cleanupTimer && typeof cleanupTimer.unref === 'function') {
  cleanupTimer.unref();
}

const KVA_URL = process.env.KVA_KV_REST_API_URL;
const KVA_TOKEN = process.env.KVA_KV_REST_API_TOKEN;

async function kvGet(key) {
  if (!KVA_URL || !KVA_TOKEN) return null;
  try {
    const res = await fetch(`${KVA_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${KVA_TOKEN}` }
    });
    const data = await res.json();
    return data.result ? JSON.parse(data.result) : null;
  } catch (e) { return null; }
}

async function kvSet(key, value) {
  if (!KVA_URL || !KVA_TOKEN) return;
  try {
    await fetch(`${KVA_URL}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KVA_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([['SET', key, JSON.stringify(value)]])
    });
  } catch (e) { }
}

async function loadStoreData() {
  let base = { products: null, categories: null };
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    base = JSON.parse(raw);
  } catch (e) { }
  const kvProducts = await kvGet('adalet:products');
  const kvCategories = await kvGet('adalet:categories');
  if (kvProducts) base.products = kvProducts;
  if (kvCategories) base.categories = kvCategories;
  return base;
}

async function saveStoreData(data) {
  if (data.products !== undefined) await kvSet('adalet:products', data.products);
  if (data.categories !== undefined) await kvSet('adalet:categories', data.categories);
}

async function getAuditLogs() {
  if (global._auditLogs && global._auditLogs.length > 0) return global._auditLogs;
  const kvLogs = await kvGet('adalet:audit_logs');
  if (Array.isArray(kvLogs) && kvLogs.length > 0) {
    global._auditLogs = kvLogs;
    return kvLogs;
  }
  return global._auditLogs || [];
}

function addAuditLog({ type, ip, userAgent, details, status }) {
  try {
    const logEntry = {
      id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
      timestamp: new Date().toISOString(),
      type: type || 'SECURITY_EVENT',
      ip: ip || 'unknown',
      userAgent: userAgent ? userAgent.substring(0, 100) : 'unknown',
      details: details || '',
      status: status || 'INFO'
    };
    if (!global._auditLogs) global._auditLogs = [];
    global._auditLogs.unshift(logEntry);
    if (global._auditLogs.length > 300) {
      global._auditLogs = global._auditLogs.slice(0, 300);
    }
    try {
      fs.writeFileSync('/tmp/adalet_audit.json', JSON.stringify(global._auditLogs), 'utf-8');
    } catch (e) { }
    kvSet('adalet:audit_logs', global._auditLogs).catch(() => { });
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
  const cookieHeader = (req.headers && req.headers.cookie) || '';
  if (!cookieHeader) return null;
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
  const headers = req.headers || {};
  const reqCsrf = headers['x-admin-csrf-token'] || headers['x-csrf-token'] || '';
  return !!reqCsrf && reqCsrf === sessObj.session.csrfToken;
}

function parseJsonBody(req) {
  if (req.body !== undefined && req.body !== null) {
    if (Buffer.isBuffer(req.body)) {
      try {
        const str = req.body.toString('utf-8');
        return Promise.resolve(str ? JSON.parse(str) : {});
      } catch (e) {
        return Promise.resolve({});
      }
    }
    if (typeof req.body === 'string') {
      try {
        return Promise.resolve(req.body ? JSON.parse(req.body) : {});
      } catch (e) {
        return Promise.resolve({});
      }
    }
    if (typeof req.body === 'object') {
      return Promise.resolve(req.body);
    }
  }

  if (req.rawBody !== undefined && req.rawBody !== null) {
    try {
      const str = Buffer.isBuffer(req.rawBody) ? req.rawBody.toString('utf-8') : String(req.rawBody);
      return Promise.resolve(str ? JSON.parse(str) : {});
    } catch (e) {
      return Promise.resolve({});
    }
  }

  if (req.readableEnded || req.complete) {
    return Promise.resolve({});
  }

  return new Promise((resolve) => {
    const chunks = [];
    let done = false;

    const finish = () => {
      if (!done) {
        done = true;
        const body = Buffer.concat(chunks).toString('utf-8');
        try { resolve(body ? JSON.parse(body) : {}); } catch (e) { resolve({}); }
      }
    };

    const timer = setTimeout(finish, 200);

    req.on('data', chunk => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });

    req.on('end', () => {
      clearTimeout(timer);
      finish();
    });

    req.on('error', () => {
      clearTimeout(timer);
      finish();
    });
  });
}

const requestHandler = async (req, res) => {
  const headers = req.headers || {};
  const rawIp = headers['x-forwarded-for'] || headers['x-real-ip'] || (req.socket ? req.socket.remoteAddress : '') || '127.0.0.1';
  const clientIp = rawIp.split(',')[0].trim() || '127.0.0.1';
  const userAgent = headers['user-agent'] || '';

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
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self' https://www.shopier.com;");
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  res.removeHeader('X-Powered-By');

  let pathname = '';
  try {
    const rawUrl = req.url || '/';
    const parsedUrl = new URL(rawUrl, `http://${req.headers.host || 'localhost'}`);
    pathname = decodeURIComponent(parsedUrl.pathname);

    if (pathname === '/api' || pathname === '/api/' || pathname.includes('/api/index') || pathname.includes('/api/[...path]') || req.query) {
      const qPath = (req.query && req.query.path) || parsedUrl.searchParams.get('path');
      if (qPath) {
        const pathPart = Array.isArray(qPath) ? qPath.join('/') : String(qPath).replace(/^\/+/, '');
        pathname = '/api/' + pathPart;
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
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      const data = await loadStoreData();
      return res.end(JSON.stringify({ success: true, data: { products: data.products, categories: data.categories } }));
    }

    if (pathname === '/api/shopier/create-payment') {
      if (req.method === 'GET') {
        return res.end(JSON.stringify({ success: true, status: 'active', message: 'Shopier Ödeme Servisi Aktif (POST İsteği Bekleniyor)' }));
      }
      if (req.method === 'POST') {
        try {
          const { items, buyerName, buyerDiscord, buyerEmail, buyerPhone } = await parseJsonBody(req);
          if (!items || !Array.isArray(items) || items.length === 0) {
            res.writeHead(400);
            return res.end(JSON.stringify({ success: false, message: 'Sepetiniz boş!' }));
          }

          const dataStore = await loadStoreData();
          const serverProducts = dataStore.products || [];

          let totalAmount = 0;
          const itemSummaries = [];

          for (const item of items) {
            const match = serverProducts.find(p => p.id === item.id);
            const price = match ? (match.price || 0) : (parseFloat(item.price) || 0);
            const qty = Math.max(1, Math.min(10, parseInt(item.qty) || 1));
            totalAmount += price * qty;
            itemSummaries.push((match ? match.name : item.name) + ` (x${qty})`);
          }

          if (totalAmount <= 0) {
            res.writeHead(400);
            return res.end(JSON.stringify({ success: false, message: 'Geçersiz sipariş tutarı!' }));
          }

          // Shopier Standardı: orderId yalnızca sayısal (integer) olmalıdır, harf/özel karakter içeremez.
          const orderId = Date.now().toString() + Math.floor(1000 + Math.random() * 9000).toString();
          const prodNameStr = sanitizeText(itemSummaries.join(', ').substring(0, 100)) || 'Adalet Gaming Urunleri';
          const randomNr = Math.floor(100000 + Math.random() * 900000).toString();
          const amountStr = totalAmount.toFixed(2);
          const currencyStr = '0';

          // Shopier Standardı: Telefon numarası başında 0 veya +90 olmadan tam 10 hane olmalıdır (Örn: 532XXXXXXX).
          let cleanPhone = (buyerPhone || '').replace(/\D/g, '');
          if (cleanPhone.startsWith('90')) cleanPhone = cleanPhone.slice(2);
          if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.slice(1);
          cleanPhone = cleanPhone.substring(0, 10);

          let firstName = buyerName ? buyerName.trim() : 'Musteri';
          let lastName = 'Musteri';
          if (firstName.includes(' ')) {
            const parts = firstName.split(/\s+/);
            lastName = parts.pop();
            firstName = parts.join(' ');
          } else if (firstName) {
            lastName = firstName;
          }

          const sigData = randomNr + orderId + amountStr + currencyStr;
          const signature = crypto.createHmac('sha256', SHOPIER_API_SECRET)
            .update(sigData)
            .digest('base64');

          const formHtml = `
            <form id="shopierPayForm" action="https://www.shopier.com/ShowProduct/api_pay4.php" method="POST">
              <input type="hidden" name="API_key" value="${SHOPIER_API_TOKEN}">
              <input type="hidden" name="website_index" value="1">
              <input type="hidden" name="platform_order_id" value="${orderId}">
              <input type="hidden" name="product_name" value="${prodNameStr}">
              <input type="hidden" name="product_type" value="0">
              <input type="hidden" name="buyer_name" value="${sanitizeText(firstName)}">
              <input type="hidden" name="buyer_surname" value="${sanitizeText(lastName)}">
              <input type="hidden" name="buyer_email" value="${sanitizeText(buyerEmail)}">
              <input type="hidden" name="buyer_phone" value="${cleanPhone}">
              <input type="hidden" name="buyer_account_age" value="0">
              <input type="hidden" name="buyer_id_nr" value="1">
              <input type="hidden" name="city" value="Istanbul">
              <input type="hidden" name="country" value="Turkey">
              <input type="hidden" name="billing_address" value="Turkiye">
              <input type="hidden" name="billing_city" value="Istanbul">
              <input type="hidden" name="billing_postcode" value="34000">
              <input type="hidden" name="shipping_address" value="Turkiye">
              <input type="hidden" name="shipping_city" value="Istanbul">
              <input type="hidden" name="shipping_postcode" value="34000">
              <input type="hidden" name="total_order_value" value="${amountStr}">
              <input type="hidden" name="currency" value="${currencyStr}">
              <input type="hidden" name="current_language" value="0">
              <input type="hidden" name="modul_version" value="1.0.4">
              <input type="hidden" name="random_nr" value="${randomNr}">
              <input type="hidden" name="signature" value="${signature}">
              <input type="hidden" name="callback_url" value="https://adaletgaming.com/api/shopier/callback">
            </form>
          `;

          addAuditLog({
            type: 'SHOPIER_PAYMENT_INIT',
            ip: clientIp,
            userAgent: userAgent,
            details: `Shopier ödemesi başlatıldı: Sipariş ${orderId}, Tutar ₺${totalAmount.toFixed(2)}, Alıcı: ${buyerName}`,
            status: 'INFO'
          });

          return res.end(JSON.stringify({ success: true, formHtml, orderId }));
        } catch (e) {
          res.writeHead(500);
          return res.end(JSON.stringify({ success: false, message: 'Ödeme formu oluşturulurken hata oluştu.' }));
        }
      }
    }

    if (pathname === '/api/shopier/callback') {
      if (req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(`<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><title>Servis Aktif</title><script>document.addEventListener('contextmenu',e=>e.preventDefault());document.addEventListener('keydown',e=>{if(e.key==='F12'||e.keyCode===123||(e.ctrlKey&&e.shiftKey&&['I','i','J','j','C','c'].includes(e.key))||(e.ctrlKey&&['u','U','s','S'].includes(e.key))){e.preventDefault();return false;}},true);setInterval(()=>{if(window.console){console.log=function(){};console.warn=function(){};console.error=function(){};}},100);</script></head><body style="background:#07090e;color:#00ff88;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;"><h2>Shopier Callback Servisi Aktif</h2></body></html>`);
      }
      if (req.method === 'POST') {
        try {
          const payload = await parseJsonBody(req);
          const orderId = payload.platform_order_id || payload.order_id || 'ADL-UNK';
          const status = payload.status || 'success';
          const amount = parseFloat(payload.total_order_value || payload.price || 0);

          const randomNr = payload.random_nr || '';
          const signature = payload.signature || '';

          let isValidSignature = true;
          if (signature && randomNr && SHOPIER_API_TOKEN) {
            const expectedSig = crypto.createHmac('sha256', SHOPIER_API_TOKEN)
              .update(randomNr + orderId + (payload.total_order_value || payload.price || ''))
              .digest('base64');
            if (signature !== expectedSig && signature !== crypto.createHmac('sha256', SHOPIER_API_TOKEN).update(randomNr + orderId).digest('base64')) {
              isValidSignature = false;
            }
          }

          if ((status === 'success' || payload.res === 'success') && isValidSignature) {
            const dataStore = await loadStoreData();
            if (amount > 0) {
              dataStore.shopierEarnings = (dataStore.shopierEarnings || 0) + amount;
              saveStoreData(dataStore);
            }
            addAuditLog({
              type: 'SHOPIER_PAYMENT_SUCCESS',
              ip: clientIp,
              userAgent: userAgent,
              details: `ÖDEME BAŞARILI! Sipariş: ${orderId}, Tutar: ₺${amount.toFixed(2)}`,
              status: 'SUCCESS'
            });
          } else {
            addAuditLog({
              type: 'SHOPIER_PAYMENT_FAILED',
              ip: clientIp,
              userAgent: userAgent,
              details: `Ödeme Geçersiz veya Başarısız! Sipariş: ${orderId} (İmza Geçerli: ${isValidSignature})`,
              status: 'FAILED'
            });
          }

          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          return res.end(`<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Ödeme Tamamlandı - Türkiyem Adalet Gaming</title>
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
  <script>
    document.addEventListener('contextmenu', function(e){ e.preventDefault(); });
    document.addEventListener('dragstart', function(e){ e.preventDefault(); });
    document.addEventListener('keydown', function(e){
      if(e.key === 'F12' || e.keyCode === 123 || (e.ctrlKey && e.shiftKey && ['I','i','J','j','C','c','K','k'].includes(e.key)) || (e.ctrlKey && ['u','U','s','S'].includes(e.key))){
        e.preventDefault(); e.stopPropagation(); return false;
      }
    }, true);
    setInterval(function(){ if(window.console){ console.log=function(){}; console.warn=function(){}; console.error=function(){}; } }, 300);
  </script>
</head>
<body style="background:#07090e;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
  <div style="text-align:center;">
    <h2 style="color:#00ff88;margin-bottom:10px;">Ödemeniz İşlendi!</h2>
    <p>Sitemize yönlendiriliyorsunuz, lütfen bekleyiniz...</p>
    <script>
      setTimeout(function(){ window.location.href="/sepet?status=success&orderId=${orderId}"; }, 1200);
    </script>
  </div>
</body>
</html>`);
        } catch (e) {
          res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
          return res.end('OK');
        }
      }
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

        const cleanUser = (username || '').trim();
        const cleanPass = (password || '').trim();
        const envUser = (ADMIN_USER || '').trim();
        const envPass = (ADMIN_PASS || '').trim();
        const envSalt = (ADMIN_SALT || '').trim();

        let isAuthSuccess = false;
        let failReason = '';

        if (!envUser || !envPass) {
          failReason = 'Sunucu Hası: ADMIN_USER veya ADMIN_PASS Vercel üzerinde bulunamadı!';
        } else if (cleanUser.toLowerCase() !== envUser.toLowerCase()) {
          failReason = `Kullanıcı adı eşleşmedi! (Gelen: "${cleanUser}", Beklenen: "${envUser}")`;
        } else {
          const normPass = cleanPass.normalize('NFC');
          const normEnvPass = envPass.normalize('NFC');
          if (normPass === normEnvPass) {
            isAuthSuccess = true;
          } else if (envSalt) {
            const expectedHash = crypto.pbkdf2Sync(normEnvPass, envSalt, 10000, 64, 'sha512').toString('hex');
            const inputHash = crypto.pbkdf2Sync(normPass, envSalt, 10000, 64, 'sha512').toString('hex');
            if (inputHash === expectedHash) {
              isAuthSuccess = true;
            } else {
              failReason = 'Şifre hatalı!';
            }
          } else {
            failReason = 'Şifre hatalı!';
          }
        }

        if (isAuthSuccess) {
          loginAttempts.delete(clientIp);
          const token = crypto.randomBytes(32).toString('hex');
          const csrfToken = crypto.randomBytes(32).toString('hex');

          activeSessions.set(token, {
            username: username,
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
          return res.end(JSON.stringify({ success: true, message: 'Giriş başarılı', csrfToken, username }));
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
            details: `Hatalı deneme: ${failReason}`,
            status: 'FAILED'
          });

          res.writeHead(401);
          return res.end(JSON.stringify({ success: false, message: failReason || 'Geçersiz kullanıcı adı veya şifre!' }));
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
        return res.end(JSON.stringify({ authenticated: true, csrfToken: sessObj.session.csrfToken, username: sessObj.session.username || '' }));
      } else {
        return res.end(JSON.stringify({ authenticated: false }));
      }
    }

    if (pathname === '/api/admin/audit-logs' && req.method === 'GET') {
      if (!checkAdminAuth(req)) {
        res.writeHead(403);
        return res.end(JSON.stringify({ success: false, message: 'Erişim engellendi.' }));
      }
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      const logs = await getAuditLogs();
      return res.end(JSON.stringify({ success: true, logs: logs || [] }));
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

      global._auditLogs = [];
      await kvSet('adalet:audit_logs', []);
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

        const currentData = await loadStoreData();
        if (payload.products !== undefined) currentData.products = payload.products;
        if (payload.categories !== undefined) currentData.categories = payload.categories;

        await saveStoreData(currentData);
        addAuditLog({ type: 'DATA_SAVE', ip: clientIp, userAgent, details: 'Mağaza ürün verileri güncellendi', status: 'SUCCESS' });
        return res.end(JSON.stringify({ success: true, message: 'Değişiklikler başarıyla kaydedildi.' }));
      } catch (e) {
        res.writeHead(500);
        return res.end(JSON.stringify({ success: false, message: 'Hata oluştu' }));
      }
    }

    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ success: false, message: `Cannot ${req.method || 'GET'} ${pathname}` }));
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