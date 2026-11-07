const https = require('https');

// GitHub Releases direkt indirme linki:
const DEFAULT_GTASA_RELEASE_URL = process.env.GTASA_DIRECT_URL || 'https://github.com/MehmetShin/adalet-site/releases/download/v1.0/Adalet.GTA.rar';

// Eğer repo Private (Gizli) ise GitHub Personal Access Token ile imzalı CDN indirme linki çözücü:
const GITHUB_OWNER = 'MehmetShin';
const GITHUB_REPO = 'adalet-site';
const GITHUB_TAG = 'v1.0';
const GITHUB_ASSET_NAME = 'Adalet.GTA.rar';

// Yedek MediaFire sayfası:
const MEDIAFIRE_PAGE_URL = 'https://www.mediafire.com/file/ouc9h9m7c0ej0ix/GTA-TR-Fullprogramlarindir.net-.rar/file';

function httpsGetJson(url, token) {
    return new Promise((resolve) => {
        const headers = {
            'User-Agent': 'AdaletGaming-Web/1.0',
            'Accept': 'application/vnd.github+json'
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const req = https.get(url, { timeout: 5000, headers }, (res) => {
            if (res.statusCode !== 200) {
                res.resume();
                return resolve(null);
            }
            let raw = '';
            res.on('data', chunk => {
                raw += chunk;
                if (raw.length > 524288) req.destroy();
            });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(raw));
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

function resolvePrivateGitHubAssetUrl(token) {
    return new Promise(async (resolve) => {
        const releaseUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/tags/${GITHUB_TAG}`;
        const releaseData = await httpsGetJson(releaseUrl, token);
        if (!releaseData || !Array.isArray(releaseData.assets) || releaseData.assets.length === 0) {
            return resolve(null);
        }

        const asset = releaseData.assets.find(a => a.name === GITHUB_ASSET_NAME) || releaseData.assets[0];
        if (!asset || !asset.url) return resolve(null);

        const req = https.get(asset.url, {
            timeout: 5000,
            headers: {
                'User-Agent': 'AdaletGaming-Web/1.0',
                'Accept': 'application/octet-stream',
                'Authorization': `Bearer ${token}`
            }
        }, (res) => {
            res.resume();
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return resolve(res.headers.location);
            }
            resolve(null);
        });
        req.on('error', () => resolve(null));
        req.on('timeout', () => {
            try { req.destroy(); } catch (_) {}
            resolve(null);
        });
    });
}

function checkUrlPubliclyAccessible(url) {
    return new Promise((resolve) => {
        const req = https.get(url, {
            timeout: 4000,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        }, (res) => {
            res.resume();
            if (res.statusCode === 200 || (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location)) {
                return resolve(res.headers.location || url);
            }
            resolve(null);
        });
        req.on('error', () => resolve(null));
        req.on('timeout', () => {
            try { req.destroy(); } catch (_) {}
            resolve(null);
        });
    });
}

function resolveMediaFireDirectUrl() {
    return new Promise((resolve) => {
        const req = https.get(MEDIAFIRE_PAGE_URL, {
            timeout: 5000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
        }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                res.resume();
                if (res.headers.location.includes('download') && res.headers.location.includes('mediafire.com')) {
                    return resolve(res.headers.location);
                }
            }
            let html = '';
            res.on('data', chunk => {
                html += chunk;
                if (html.length > 524288) req.destroy();
            });
            res.on('end', () => {
                const match = html.match(/https:\/\/download[0-9]+\.mediafire\.com\/[^\x22\x27<>]+/);
                resolve(match ? match[0] : MEDIAFIRE_PAGE_URL);
            });
        });
        req.on('error', () => resolve(MEDIAFIRE_PAGE_URL));
        req.on('timeout', () => {
            try { req.destroy(); } catch (_) {}
            resolve(MEDIAFIRE_PAGE_URL);
        });
    });
}

module.exports = async function handler(req, res) {
    const githubToken = (process.env.GITHUB_TOKEN || '').trim();
    const configuredUrl = (process.env.GTASA_DIRECT_URL || DEFAULT_GTASA_RELEASE_URL || '').trim();

    let targetUrl = null;

    // 1. Eğer GITHUB_TOKEN varsa (Private repo için imzalı direkt CDN linki üret)
    if (githubToken) {
        targetUrl = await resolvePrivateGitHubAssetUrl(githubToken);
    }

    // 2. Repo Public ise doğrudan GitHub Release CDN linkini kullan
    if (!targetUrl && configuredUrl) {
        targetUrl = await checkUrlPubliclyAccessible(configuredUrl);
    }

    // 3. Yedek: MediaFire taze link çözücü
    if (!targetUrl) {
        targetUrl = await resolveMediaFireDirectUrl();
    }

    res.statusCode = 302;
    res.setHeader('Location', targetUrl);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    return res.end();
};
