const express = require('express');
const router = express.Router();
const verifyToken = require('../config/auth');
const redisClient = require('../config/redis');

const CACHE_DURATION = 60;

// GET /api/games
router.get('/', verifyToken, async (req, res) => {
    try {
        const { category, search } = req.query;

        const cacheKey = `games_${category || 'all'}`;

        let gamesData = [];

        // TENTA BUSCAR NO REDIS
        try {
            const cachedData = await redisClient.get(cacheKey);

            if (cachedData) {
                console.log(`⚡ Usando Cache do Redis para: ${cacheKey}`);
                gamesData = JSON.parse(cachedData); // Converte string volta para JSON
            }
        } catch (redisError) {
            console.error('Erro ao ler do Redis (ignorando e buscando da API):', redisError);
            // Se o Redis falhar, o código continua e busca na API
        }

        // SE NÃO ACHOU NO CACHE, BUSCA NA API EXTERNA
        if (!gamesData || gamesData.length === 0) {
            console.log(`🌐 Buscando na API Externa: ${cacheKey}`);

            let url = 'https://www.freetogame.com/api/games';
            if (category && category !== 'all') {
                url += `?category=${category}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                if (response.status === 404) return res.json([]);
                throw new Error(`Erro API externa: ${response.status}`);
            }

            gamesData = await response.json();

            try {
                if (gamesData.length > 0) {
                    await redisClient.set(cacheKey, JSON.stringify(gamesData), {
                        EX: CACHE_DURATION
                    });
                }
            } catch (redisSaveError) {
                console.error('Erro ao salvar no Redis:', redisSaveError);
            }
        }

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