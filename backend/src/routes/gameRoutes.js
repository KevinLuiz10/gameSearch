const express = require('express');
const router = express.Router();

// --- ESTRATÉGIA DE CACHE EM MEMÓRIA ---
let gameCache = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos (em milissegundos)

// Rota GET /api/games
router.get('/', async (req, res) => {
    try {
        // Recebe os parâmetros enviados pelo Frontend
        const { category, search } = req.query;

        // Define a chave do cache (ex: 'all' ou 'mmorpg')
        const cacheKey = category || 'all';
        const now = Date.now();

        let gamesData = [];

        if (gameCache[cacheKey] && (now - gameCache[cacheKey].timestamp < CACHE_DURATION)) {
            console.log(`⚡ Usando Cache do Servidor para: ${cacheKey}`);
            gamesData = gameCache[cacheKey].data;
        } else {
            console.log(`Buscando na API Externa (FreeToGame): ${cacheKey}`);

            let url = 'https://www.freetogame.com/api/games';

            if (category && category !== 'all') {
                url += `?category=${category}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                if (response.status === 404) {
                    return res.json([]);
                }
                throw new Error(`Erro na API externa: ${response.status}`);
            }

            gamesData = await response.json();

            // SALVA NO CACHE DO SERVIDOR
            gameCache[cacheKey] = {
                data: gamesData,
                timestamp: now
            };
        }

        // Se o usuário solicitou os dados com alguma filtragem, filtramos os dados antes de retornar
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