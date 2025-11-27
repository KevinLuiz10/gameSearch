const jwt = require('jsonwebtoken');
const db = require('./db');

// Função que roda ANTES da rota principal, para certificar de que o token que está sendo utilizado, não está na tabela blacklist do banco
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Acesso negado. Nenhum token fornecido.' });
    }

    try {
        const [rows] = await db.execute('SELECT * FROM token_blacklist WHERE token = ?', [token]);

        if (rows.length > 0) {
            return res.status(401).json({ message: 'Token inválido (Usuário fez logout).' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();

    } catch (err) {
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};

module.exports = verifyToken;