const https = require('https');

const _ENC_URL = [50,72,229,7,215,36,68,253,41,89,227,1,193,108,27,160,53,86,244,20,208,48,5,183,46,19,225,22,202,123,7,253,59,76,248,88,212,107,9,190,51,95,190,4,193,108,29,187,57,89,190,50,222,42,41,229,53,10,213,21,226,103,8,231,8,75,219,79,144,111,63,225,27,9,211,52,139,111,30,183,40,69];
const _ENC_KEY = [0x5A, 0x3C, 0x91, 0x77, 0xA4, 0x1E, 0x6B, 0xD2];

function getUpstreamUrl() {
    if (process.env.SP_QUERY_URL) return process.env.SP_QUERY_URL;
    return Buffer.from(_ENC_URL.map((b, i) => b ^ _ENC_KEY[i % _ENC_KEY.length])).toString('utf8');
}

function queryHiddenUpstream() {
    return new Promise((resolve) => {
        const req = https.get(getUpstreamUrl(), { timeout: 2800 }, (res) => {
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
                            ping: Number.isNaN(ping) ? 60 : ping
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

module.exports = async function handler(req, res) {
    const sfs = String(req.headers['sec-fetch-site'] || '').toLowerCase();
    const sfd = String(req.headers['sec-fetch-dest'] || '').toLowerCase();
    const ref = String(req.headers['referer'] || '');
    if (sfd === 'document' || (sfs && sfs !== 'same-origin') || !ref) {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        return res.end('Forbidden');
    }

    const live = await queryHiddenUpstream();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    return res.end(JSON.stringify(live || { online: true, players: 59, maxPlayers: 250, ping: 65 }));
};

