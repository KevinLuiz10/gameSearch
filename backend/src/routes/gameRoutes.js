const express = require('express');
const router = express.Router();
const verifyToken = require('../config/auth');
const redisClient = require('../config/redis');

const CACHE_DURATION = 60; // 60 segundos de cache

// GET /api/games
router.get('/', verifyToken, async (req, res) => {
    try {
        const { category, search } = req.query;

        let categoriesList = [];
        if (category && category !== 'all') {
            categoriesList = category.split(',').map(c => c.trim()).filter(c => c);
        }

        const sortedCats = categoriesList.length > 0 ? categoriesList.sort().join(',') : 'all';
        const cacheKey = `games_${sortedCats}`;

        let gamesData = [];

        //TENTA BUSCAR NO REDIS
        try {
            const cachedData = await redisClient.get(cacheKey);

            if (cachedData) {
                console.log(`⚡ Usando Cache do Redis para: ${cacheKey}`);
                gamesData = JSON.parse(cachedData);
            }
        } catch (redisError) {
            console.error('Erro ao ler do Redis (ignorando e buscando da API):', redisError);
        }

        //SE NÃO ACHOU NO CACHE, BUSCA NA API EXTERNA
        if (!gamesData || gamesData.length === 0) {
            console.log(`🌐 Buscando na API Externa: ${cacheKey}`);

            if (categoriesList.length > 1) {
                console.log(`   ↳ Detectadas múltiplas categorias. Buscando em paralelo...`);

                const promises = categoriesList.map(async (cat) => {
                    try {
                        const response = await fetch(`https://www.freetogame.com/api/games?category=${cat}`);
                        if (!response.ok) return [];
                        return await response.json();
                    } catch (err) {
                        console.error(`Erro ao buscar categoria ${cat}:`, err.message);
                        return [];
                    }
                });

                const results = await Promise.all(promises);

                const allGames = results.flat();

                // LÓGICA DE DEDUPLICAÇÃO
                const uniqueGamesMap = new Map();
                allGames.forEach(game => {
                    uniqueGamesMap.set(game.id, game);
                });

                // Converte o Map de volta para Array
                gamesData = Array.from(uniqueGamesMap.values());

            } else {
                // LÓGICA PADRÃO
                let url = 'https://www.freetogame.com/api/games';

                // Se tiver exatamente 1 categoria na lista
                if (categoriesList.length === 1) {
                    url += `?category=${categoriesList[0]}`;
                }

                const response = await fetch(url);

                if (!response.ok) {
                    if (response.status === 404) return res.json([]);
                    throw new Error(`Erro API externa: ${response.status}`);
                }

                gamesData = await response.json();
            }

            // 5. SALVA O RESULTADO (JÁ FILTRADO E UNIFICADO) NO REDIS
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

        // 6. FILTRO DE TEXTO
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