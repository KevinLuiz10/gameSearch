const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../config/db');
// CORREÇÃO AQUI: Desestruturação para pegar o 'logger' (que é o generalLogger)
const { logger } = require('../config/logger');
require('dotenv').config();

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // Captura o IP para o log de segurança
    const ip = req.ip || req.connection.remoteAddress;

    if (!username || !password) {
        return res.status(400).json({ message: 'Por favor, preencha usuário e senha.' });
    }

    try {
        // Busca direta no banco
        const [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        const user = users[0];

        if (!user) {
            // LOG DE SEGURANÇA: Usuário não encontrado
            logger.warn(`[SEC-AUTH-FAIL] Tentativa de login c/ usuário inexistente: "${username}" [IP: ${ip}]`);
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            // LOG DE SEGURANÇA: Senha incorreta
            logger.warn(`[SEC-AUTH-FAIL] Senha incorreta p/ usuário: "${username}" [IP: ${ip}]`);
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // LOG DE SUCESSO
        logger.info(`[SEC-AUTH-SUCCESS] Usuário logado: "${username}" [IP: ${ip}]`);

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Login realizado com sucesso!',
            token: token,
            user: {
                id: user.id,
                username: user.username
            }
        });

    } catch (error) {
        // LOG DE ERRO TÉCNICO
        logger.error(`[SEC-ERROR] Erro no login: ${error.message}`);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(400).json({ message: 'Nenhum token para invalidar.' });
    }

    try {
        // Insere o token na tabela de tokens inválidos (Blacklist)
        await db.execute('INSERT INTO token_blacklist (token) VALUES (?)', [token]);

        // Log de Logout
        logger.info(`[SEC-LOGOUT] Token invalidado com sucesso.`);

        res.json({ message: 'Logout realizado com sucesso. Token invalidado.' });
    } catch (error) {
        logger.error(`[SEC-ERROR] Erro no logout: ${error.message}`);
        res.status(500).json({ message: 'Erro ao realizar logout.' });
    }
});

module.exports = router;