const requestHandler = require('../server.js');

module.exports = async (req, res) => {
    try {
        await requestHandler(req, res);
    } catch (err) {
        if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ success: false, message: 'Sunucu İç Hata' }));
        }
    }
};
