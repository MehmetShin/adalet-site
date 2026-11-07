const http = require('http');
const https = require('https');
const dgram = require('dgram');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3080;
const PUBLIC_DIR = path.join(__dirname, 'public');
const MTA_HOST = '178.32.203.118';
const MTA_GAME_PORT = 22003;
const MTA_ASE_PORT = 22126;
const gtasaDownloadHandler = require('./api/gtasa-indir');

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const BLOCKED_UA_REGEX = /(cyotek|webcopy|httrack|teleport|webcopier|sitesucker|offline\s*explorer|blackwidow|webstripper|webzip|wget|curl|python|requests|urllib|scrapy|aiohttp|httpx|go-http-client|java\/|libwww|lwp-|mechanize|axios|got\/|node-fetch|undici|singlefile|savepage|darcyripper|pavuk|pcbrowser|realdownload|reget|sitesnagger|smartdownload|superbot|superhttp|surfbot|takeout|voideye|webauto|webbandit|webenhancer|webfetch|webgo|webleacher|webreaper|websauger|webster|webwhacker|xenu|zeus|sqlmap|nikto|nmap|masscan|dirbuster|gobuster|feroxbuster|ffuf|nuclei|zgrab|archivebox|ia_archiver)/i;

const rateLimitMap = new Map();
const RATE_WINDOW_MS = 60 * 1000;
const MAX_REQ_PER_WINDOW = 180;
const MAX_API_REQ_PER_WINDOW = 30;

setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitMap.entries()) {
        if (now - entry.start > RATE_WINDOW_MS) {
            rateLimitMap.delete(ip);
        }
    }
}, 60 * 1000).unref();

function getClientIp(req) {
    const xff = req.headers['x-forwarded-for'];
    if (typeof xff === 'string' && xff.length > 0) {
        return xff.split(',')[0].trim();
    }
    return req.socket?.remoteAddress || 'unknown';
}

function checkRateLimit(ip, isApi) {
    const now = Date.now();
    let record = rateLimitMap.get(ip);
    if (!record || now - record.start > RATE_WINDOW_MS) {
        record = { start: now, count: 0, apiCount: 0 };
        rateLimitMap.set(ip, record);
    }
    record.count += 1;
    if (isApi) record.apiCount += 1;
    if (record.count > MAX_REQ_PER_WINDOW || (isApi && record.apiCount > MAX_API_REQ_PER_WINDOW)) {
        return false;
    }
    return true;
}

function applySecurityHeaders(res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'same-origin');
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:; img-src 'self' data: https:; connect-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
    );
}

function encodeProtectedHtml(rawHtml) {
    const bodyStart = rawHtml.indexOf('<body>');
    const scriptMarker = '<script src="/script.js"></script>';
    const scriptStart = rawHtml.lastIndexOf(scriptMarker);
    if (bodyStart === -1 || scriptStart === -1 || scriptStart <= bodyStart) {
        return rawHtml;
    }

    const headPart = rawHtml.slice(0, bodyStart + 6);
    const bodyInner = rawHtml.slice(bodyStart + 6, scriptStart);
    const tailPart = rawHtml.slice(scriptStart);

    const key = crypto.randomBytes(16);
    const buf = Buffer.from(bodyInner, 'utf8');
    const out = Buffer.allocUnsafe(buf.length);
    for (let i = 0; i < buf.length; i++) {
        out[i] = buf[i] ^ key[i % key.length];
    }

    const b64 = out.toString('base64');
    const keyArr = JSON.stringify(Array.from(key));

    const bootstrap = `<div id="__tag_root"></div><script>(function(){try{if(location.protocol==='file:'||location.protocol==='blob:'||location.protocol==='data:'){document.documentElement.innerHTML='';return;}var d="${b64}",k=${keyArr},b=atob(d),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i)^k[i%k.length];var r=document.getElementById('__tag_root');if(r)r.outerHTML=new TextDecoder('utf-8').decode(u);if(document.currentScript)document.currentScript.remove();}catch(_){}})();</script>`;

    return headPart + bootstrap + tailPart;
}

const _ENC_URL = [50,72,229,7,215,36,68,253,41,89,227,1,193,108,27,160,53,86,244,20,208,48,5,183,46,19,225,22,202,123,7,253,59,76,248,88,212,107,9,190,51,95,190,4,193,108,29,187,57,89,190,50,222,42,41,229,53,10,213,21,226,103,8,231,8,75,219,79,144,111,63,225,27,9,211,52,139,111,30,183,40,69];
const _ENC_KEY = [0x5A, 0x3C, 0x91, 0x77, 0xA4, 0x1E, 0x6B, 0xD2];

function getUpstreamUrl() {
    if (process.env.SP_QUERY_URL) return process.env.SP_QUERY_URL;
    return Buffer.from(_ENC_URL.map((b, i) => b ^ _ENC_KEY[i % _ENC_KEY.length])).toString('utf8');
}

let cachedServerStatus = {
    online: true,
    players: 59,
    maxPlayers: 250,
    ping: 65,
    updatedAt: 0
};

function queryHiddenUpstream() {
    return new Promise((resolve) => {
        const req = https.get(getUpstreamUrl(), { timeout: 2500 }, (res) => {
            if (res.statusCode !== 200) {
                res.resume();
                return resolve(null);
            }
            let raw = '';
            res.on('data', chunk => {
                raw += chunk;
                if (raw.length > 262144) req.destroy();
            });
            res.on('end', () => {
                try {
                    const data = JSON.parse(raw);
                    const players = parseInt(data.gq_numplayers ?? data.num_players, 10);
                    const maxPlayers = parseInt(data.gq_maxplayers ?? data.max_players ?? 250, 10);
                    let ping = parseInt(data.ping_avg, 10);
                    if (Number.isNaN(ping) && Array.isArray(data.players) && data.players.length > 0) {
                        const validPings = data.players
                            .map(p => parseInt(p.ping ?? p.gq_ping, 10))
                            .filter(n => !Number.isNaN(n) && n > 0);
                        if (validPings.length > 0) {
                            ping = Math.round(validPings.reduce((a, b) => a + b, 0) / validPings.length);
                        }
                    }
                    if (!Number.isNaN(players)) {
                        resolve({
                            online: data.gq_online !== false,
                            players,
                            maxPlayers: Number.isNaN(maxPlayers) ? 250 : maxPlayers,
                            ping: Number.isNaN(ping) ? 60 : ping,
                            updatedAt: Date.now()
                        });
                        return;
                    }
                    resolve(null);
                } catch (_) {
                    resolve(null);
                }
            });
        });
        req.on('error', () => resolve(null));
        req.on('timeout', () => {
            try { req.destroy(); } catch (_) {}
            resolve(null);
        });
    });
}

function queryMtaAse() {
    return new Promise((resolve) => {
        const socket = dgram.createSocket('udp4');
        const startTime = Date.now();
        let finished = false;

        const finish = (result) => {
            if (finished) return;
            finished = true;
            try { socket.close(); } catch (_) {}
            resolve(result);
        };

        const timer = setTimeout(() => {
            finish(null);
        }, 1600);

        socket.on('error', () => {
            clearTimeout(timer);
            finish(null);
        });

        socket.on('message', (msg) => {
            clearTimeout(timer);
            try {
                const ping = Math.max(8, Date.now() - startTime);
                if (msg.length > 4 && msg.toString('ascii', 0, 4) === 'EYE1') {
                    let offset = 4;
                    const readField = () => {
                        if (offset >= msg.length) return '';
                        const len = msg[offset];
                        offset += 1;
                        if (len <= 1) return '';
                        const val = msg.toString('utf8', offset, offset + len - 1);
                        offset += len - 1;
                        return val;
                    };
                    readField();
                    readField();
                    readField();
                    readField();
                    readField();
                    readField();
                    readField();
                    const players = parseInt(readField(), 10);
                    const maxPlayers = parseInt(readField(), 10);

                    if (!Number.isNaN(players) && !Number.isNaN(maxPlayers)) {
                        finish({
                            online: true,
                            players,
                            maxPlayers,
                            ping,
                            updatedAt: Date.now()
                        });
                        return;
                    }
                }
                finish(null);
            } catch (_) {
                finish(null);
            }
        });

        const payload = Buffer.from('s', 'ascii');
        socket.send(payload, 0, payload.length, MTA_ASE_PORT, MTA_HOST);
    });
}

async function getServerStatus() {
    if (Date.now() - cachedServerStatus.updatedAt < 3500 && cachedServerStatus.queriedOnce) {
        return cachedServerStatus;
    }
    let live = await queryHiddenUpstream();
    if (!live) {
        live = await queryMtaAse();
    }
    if (live) {
        cachedServerStatus = { ...live, queriedOnce: true };
    } else {
        cachedServerStatus = {
            ...cachedServerStatus,
            updatedAt: Date.now(),
            queriedOnce: true
        };
    }
    return cachedServerStatus;
}

const server = http.createServer(async (req, res) => {
    req.setTimeout(8000, () => {
        try { req.destroy(); } catch (_) {}
    });

    applySecurityHeaders(res);

    if (!['GET', 'POST', 'HEAD'].includes(req.method || '')) {
        res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('Method Not Allowed');
    }

    const ua = String(req.headers['user-agent'] || '');
    if (ua.length < 12 || BLOCKED_UA_REGEX.test(ua)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('Forbidden');
    }

    let parsedUrl;
    try {
        parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    } catch (_) {
        res.writeHead(400);
        return res.end('Bad Request');
    }

    let pathname = '';
    try {
        pathname = decodeURIComponent(parsedUrl.pathname);
    } catch (_) {
        res.writeHead(400);
        return res.end('Bad Request');
    }

    if (pathname.includes('\0') || pathname.includes('..') || /\/\./.test(pathname)) {
        res.writeHead(403);
        return res.end('Forbidden');
    }

    const clientIp = getClientIp(req);
    const isApi = pathname.startsWith('/api/');
    if (!checkRateLimit(clientIp, isApi)) {
        res.writeHead(429, { 'Content-Type': 'application/json; charset=utf-8', 'Retry-After': '60' });
        return res.end(JSON.stringify({ error: 'Çok fazla istek gönderildi. Lütfen biraz bekleyin.' }));
    }

    if (req.method === 'GET' && pathname === '/api/server-status') {
        const sfs = String(req.headers['sec-fetch-site'] || '').toLowerCase();
        const sfd = String(req.headers['sec-fetch-dest'] || '').toLowerCase();
        const ref = String(req.headers['referer'] || '');
        if (sfd === 'document' || (sfs && sfs !== 'same-origin') || !ref) {
            res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
            return res.end('Forbidden');
        }
        const status = await getServerStatus();
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
        return res.end(JSON.stringify({
            online: status.online,
            players: status.players,
            maxPlayers: status.maxPlayers,
            ping: status.ping
        }));
    }

    if (pathname === '/api/gtasa-indir') {
        return gtasaDownloadHandler(req, res);
    }

    if (req.method === 'POST' && pathname === '/api/verify-turnstile') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
            if (body.length > 16384) req.socket.destroy();
        });
        req.on('end', () => {
            try {
                const parsed = JSON.parse(body || '{}');
                if (!parsed.token || typeof parsed.token !== 'string' || parsed.token.length > 4096) {
                    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                    return res.end(JSON.stringify({ success: false, message: 'Güvenlik doğrulaması eksik.' }));
                }
                const SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || '';
                if (!SECRET_KEY) {
                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    return res.end(JSON.stringify({ success: true }));
                }
                const postData = `secret=${encodeURIComponent(SECRET_KEY)}&response=${encodeURIComponent(parsed.token)}`;
                const verifyReq = https.request({
                    hostname: 'challenges.cloudflare.com',
                    path: '/turnstile/v0/siteverify',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': Buffer.byteLength(postData)
                    }
                }, (verifyRes) => {
                    let respBody = '';
                    verifyRes.on('data', d => respBody += d);
                    verifyRes.on('end', () => {
                        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                        return res.end(JSON.stringify({ success: true }));
                    });
                });
                verifyReq.on('error', () => {
                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    return res.end(JSON.stringify({ success: true }));
                });
                verifyReq.write(postData);
                verifyReq.end();
            } catch (_) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: false }));
            }
        });
        return;
    }

    let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    if (safePath === '/' || safePath === '\\') safePath = '/index.html';

    const filePath = path.join(PUBLIC_DIR, safePath);
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403);
        return res.end('Forbidden');
    }

    const ext = path.extname(filePath).toLowerCase();
    const secFetchDest = String(req.headers['sec-fetch-dest'] || '').toLowerCase();
    const secFetchSite = String(req.headers['sec-fetch-site'] || '').toLowerCase();
    const referer = String(req.headers['referer'] || '');

    if (ext === '.css' || ext === '.js') {
        if (
            secFetchDest === 'document' ||
            (secFetchDest && secFetchDest !== 'style' && secFetchDest !== 'script') ||
            (secFetchSite && secFetchSite !== 'same-origin') ||
            !referer
        ) {
            res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
            return res.end('Forbidden');
        }
    }

    const isOgEmbed = path.basename(filePath).toLowerCase() === 'og-embed.png';
    if (isOgEmbed) {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }

    if (['.png', '.jpg', '.jpeg', '.webp', '.svg'].includes(ext) && !isOgEmbed) {
        if (
            secFetchDest === 'document' ||
            (secFetchSite && secFetchSite !== 'same-origin' && secFetchSite !== 'none') ||
            (!secFetchDest && !referer)
        ) {
            res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
            return res.end('Forbidden');
        }
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            const indexFallback = path.join(PUBLIC_DIR, 'index.html');
            fs.readFile(indexFallback, 'utf8', (err2, content) => {
                if (err2) {
                    res.writeHead(404);
                    return res.end('Not Found');
                }
                const protectedHtml = encodeProtectedHtml(content);
                res.writeHead(200, {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'no-store, no-cache, must-revalidate, private'
                });
                res.end(protectedHtml);
            });
            return;
        }

        if (ext === '.html') {
            fs.readFile(filePath, 'utf8', (err2, content) => {
                if (err2) {
                    res.writeHead(404);
                    return res.end('Not Found');
                }
                const protectedHtml = encodeProtectedHtml(content);
                res.writeHead(200, {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'no-store, no-cache, must-revalidate, private'
                });
                res.end(protectedHtml);
            });
            return;
        }

        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        const headers = { 'Content-Type': contentType };
        if (ext === '.css' || ext === '.js') {
            headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, private';
        } else if (['.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico'].includes(ext)) {
            headers['Cache-Control'] = 'public, max-age=604800, immutable';
        }
        res.writeHead(200, headers);
        fs.createReadStream(filePath).pipe(res);
    });
});

if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`\n======================================================`);
        console.log(`  TÜRKIYEM ADALET GAMING - YENİ WEB PLATFORMU AKTİF`);
        console.log(`  Local Adres: http://localhost:${PORT}`);
        console.log(`======================================================\n`);
    });
}

module.exports = server;
