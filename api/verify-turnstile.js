module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    try {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch (e) { }
        }
        const token = body ? body.token : null;
        if (!token) {
            return res.status(400).json({ success: false, message: 'Token eksik' });
        }

        const secretKey = process.env.TURNSTILE_SECRET_KEY;
        if (!secretKey) {
            return res.status(500).json({ success: false, message: 'TURNSTILE_SECRET_KEY tanımlanmamış.' });
        }
        const formData = new URLSearchParams();
        formData.append('secret', secretKey);
        formData.append('response', token);
        formData.append('remoteip', (req.headers['x-forwarded-for'] || '').split(',')[0] || req.socket.remoteAddress || '');

        const cfRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: formData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const outcome = await cfRes.json();
        if (outcome.success) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(403).json({ success: false, errorCodes: outcome['error-codes'] });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
};
