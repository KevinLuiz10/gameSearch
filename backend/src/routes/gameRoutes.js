const express = require('express');
const router = express.Router();
const verifyToken = require('../config/auth');

let gameCache = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em milissegundos

// GET /api/games
// Uso do arquivo auth/auth.js, para se certificar de que o token ainda é válido.
router.get('/', verifyToken, async (req, res) => {
    try {
        const { category, search } = req.query;

        // Define a chave do cache (ex: 'all', 'shooter')
        const cacheKey = category || 'all';
        const now = Date.now();

        let gamesData = [];

        // VERIFICAÇÃO DE CACHE
        if (gameCache[cacheKey] && (now - gameCache[cacheKey].timestamp < CACHE_DURATION)) {
            console.log(`⚡ Usando Cache do Servidor para: ${cacheKey}`);
            gamesData = gameCache[cacheKey].data;
        } else {
            // BUSCA NA API EXTERNA
            console.log(`🌐 Buscando na API Externa: ${cacheKey}`);

            let url = 'https://www.freetogame.com/api/games';
            if (category && category !== 'all') {
                url += `?category=${category}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                // Se a categoria não existir (404), retornamos lista vazia sem erro
                if (response.status === 404) return res.json([]);
                throw new Error(`Erro API externa: ${response.status}`);
            }

            gamesData = await response.json();

            // ATUALIZA O CACHE
            gameCache[cacheKey] = {
                data: gamesData,
                timestamp: now
            };
        }

        // FILTRO DE TEXTO (SEARCH) NO BACKEND
        if (search) {
            const termo = search.toLowerCase();
            gamesData = gamesData.filter(game =>
                game.title.toLowerCase().includes(termo)
            );
        }

        res.json(gamesData);

    } catch (error) {
        console.error('Erro na rota de games:', error.message);
        res.status(500).json({ message: 'Erro interno ao buscar jogos.' });
    }
});

module.exports = router;