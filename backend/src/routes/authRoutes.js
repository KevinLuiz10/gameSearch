const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); //Checar senha criptografada
const jwt = require('jsonwebtoken'); // Criar o token
const User = require('../models/User');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Validação nullo
    if (!username || !password) {
        return res.status(400).json({ message: 'Por favor, preencha usuário e senha.' });
    }

    try {
        // Busca o usuário no banco
        const user = await User.findByUsername(username);

        // Se usuário não existe
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // Compara a senha enviada com o Hash do banco
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // Gera o Token JWT
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '2h' } // Expiração do token em 2 horas
        );

        // Retorna o token
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

module.exports = router;