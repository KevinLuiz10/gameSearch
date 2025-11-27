const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const db = require('../config/db');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Por favor, preencha usuário e senha.' });
    }

    try {
        const user = await User.findByUsername(username);

        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
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
        console.error('Erro no login:', error);
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

        res.json({ message: 'Logout realizado com sucesso. Token invalidado.' });
    } catch (error) {
        console.error('Erro no logout:', error);
        res.status(500).json({ message: 'Erro ao realizar logout.' });
    }
});

module.exports = router;